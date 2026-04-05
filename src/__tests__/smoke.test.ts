import { describe, it, expect } from 'vitest';

describe('Smoke tests', () => {
  it('imports types module without errors', async () => {
    const types = await import('@/lib/types');
    expect(types).toBeDefined();
  });

  it('imports avatar-config module without errors', async () => {
    const config = await import('@/lib/avatar-config');
    expect(config.AVATAR_CONFIG).toBeDefined();
    expect(config.AVATAR_CONFIG.avatarId).toBeTruthy();
    expect(config.AVATAR_CONFIG.systemPrompt).toBeTruthy();
    expect(config.AVATAR_CONFIG.greeting).toBeTruthy();
  });

  it('imports utils module without errors', async () => {
    const utils = await import('@/lib/utils');
    expect(utils).toBeDefined();
  });

  it('imports rate-limit module without errors', async () => {
    const rateLimitModule = await import('@/lib/rate-limit');
    expect(rateLimitModule).toBeDefined();
    expect(typeof rateLimitModule.checkRateLimit).toBe('function');
  });
});
