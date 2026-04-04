import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { checkRateLimit } from '@/lib/rate-limit';

function getIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

export async function POST(request: NextRequest) {
  const ip = getIp(request);

  // Rate limit: 5 login attempts per minute per IP
  const rateLimit = await checkRateLimit(`login:${ip}`, 5, 60_000);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many login attempts. Please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((rateLimit.resetAt - Date.now()) / 1000)),
        },
      },
    );
  }

  let email: unknown, password: unknown;
  try {
    const body = await request.json();
    email = body.email;
    password = body.password;
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }

  const cookiesToSet: Array<{ name: string; value: string; options: Record<string, unknown> }> = [];

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          cookiesToSet.push({ name, value, options });
        },
        remove(name: string, options: Record<string, unknown>) {
          cookiesToSet.push({ name, value: '', options: { ...options, maxAge: 0 } });
        },
      },
    },
  );

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    // Generic message — don't reveal whether email exists
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }

  // Fetch role for client-side redirect decision
  const { data: profile } = await supabase
    .from('nursly_profiles')
    .select('role')
    .eq('id', data.user.id)
    .single();

  const role = (profile as { role?: string } | null)?.role ?? 'nurse';

  const response = NextResponse.json({ role });

  for (const { name, value, options } of cookiesToSet) {
    response.cookies.set(name, value, options as any);
  }

  return response;
}
