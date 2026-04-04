import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  let email: unknown;
  try {
    const body = await request.json();
    email = body.email;
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  // Rate limit by email address: 3 requests per hour.
  // Always return a generic success response to prevent email enumeration.
  const rateLimit = await checkRateLimit(
    `forgot-password:${email.toLowerCase().trim()}`,
    3,
    60 * 60_000,
  );

  if (!rateLimit.allowed) {
    // Return 200 (not 429) to avoid revealing that this email is being targeted
    return NextResponse.json({ success: true });
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set() {},
        remove() {},
      },
    },
  );

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000');

  // Fire-and-forget — don't reveal whether the email exists in our system
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/reset-password`,
  });

  return NextResponse.json({ success: true });
}
