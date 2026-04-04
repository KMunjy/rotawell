/**
 * Rate limiter with Upstash Redis backend and in-memory fallback.
 *
 * When UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are set, rate
 * limits are enforced via Upstash Redis — persistent across Vercel cold starts
 * and shared across all serverless instances.
 *
 * When those env vars are absent (local dev), an in-memory Map is used as a
 * fallback so the app works without a Redis instance.
 */

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  /** Unix timestamp (ms) when the window resets */
  resetAt: number;
}

// ─── In-memory fallback ───────────────────────────────────────────────────────

interface Entry {
  count: number;
  resetAt: number;
}

const store = new Map<string, Entry>();

if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
      if (entry.resetAt <= now) store.delete(key);
    }
  }, 60_000);
}

function checkInMemory(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count += 1;
  return { allowed: true, remaining: limit - entry.count, resetAt: entry.resetAt };
}

// ─── Upstash Redis ────────────────────────────────────────────────────────────

const hasUpstash =
  !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;

let redis: Redis | null = null;

// Cache one Ratelimit instance per (limit, windowMs) combination
const limiters = new Map<string, Ratelimit>();

function getLimiter(limit: number, windowMs: number): Ratelimit {
  const cacheKey = `${limit}:${windowMs}`;
  if (!limiters.has(cacheKey)) {
    if (!redis) redis = Redis.fromEnv();
    const windowSecs = Math.ceil(windowMs / 1000);
    limiters.set(
      cacheKey,
      new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(limit, `${windowSecs} s`),
        prefix: 'rl',
      }),
    );
  }
  return limiters.get(cacheKey)!;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Check whether `key` is within `limit` requests per `windowMs`.
 * Increments the counter when allowed.
 *
 * Uses Upstash Redis when configured, otherwise falls back to in-memory.
 */
export async function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): Promise<RateLimitResult> {
  if (!hasUpstash) {
    return checkInMemory(key, limit, windowMs);
  }

  try {
    const limiter = getLimiter(limit, windowMs);
    const { success, remaining, reset } = await limiter.limit(key);
    return { allowed: success, remaining, resetAt: reset };
  } catch (err) {
    // Redis unavailable — degrade gracefully to in-memory
    console.error('[rate-limit] Upstash error, falling back to in-memory:', err);
    return checkInMemory(key, limit, windowMs);
  }
}
