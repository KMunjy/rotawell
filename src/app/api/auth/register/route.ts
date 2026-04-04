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

// Only these two roles can be self-registered.
// 'platform_admin' and any other privileged roles must be assigned by an admin
// manually in the database — never through this endpoint.
const ALLOWED_SELF_REGISTER_ROLES = ['nurse', 'agency_admin'] as const;
type SelfRegisterRole = (typeof ALLOWED_SELF_REGISTER_ROLES)[number];

export async function POST(request: NextRequest) {
  const ip = getIp(request);

  // Rate limit: 3 registrations per hour per IP
  const rateLimit = await checkRateLimit(`register:${ip}`, 3, 60 * 60_000);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many registration attempts. Please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((rateLimit.resetAt - Date.now()) / 1000)),
        },
      },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const { email, password, firstName, lastName, role, organizationName } = body;

  if (
    !email || typeof email !== 'string' ||
    !password || typeof password !== 'string' ||
    !firstName || typeof firstName !== 'string' ||
    !lastName || typeof lastName !== 'string'
  ) {
    return NextResponse.json({ error: 'Required fields missing' }, { status: 400 });
  }

  // Server-side role sanitization — regardless of what the client sends,
  // only nurse and agency_admin are valid for self-registration.
  const sanitizedRole: SelfRegisterRole =
    ALLOWED_SELF_REGISTER_ROLES.includes(role as SelfRegisterRole)
      ? (role as SelfRegisterRole)
      : 'nurse';

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

  const { data, error: signUpError } = await supabase.auth.signUp({ email, password });

  if (signUpError || !data.user) {
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 400 },
    );
  }

  const fullName = `${firstName.trim()} ${lastName.trim()}`;

  const { error: profileError } = await supabase.from('nursly_profiles').insert({
    id: data.user.id,
    // Role is sanitized above; the DB trigger also enforces this as a second layer
    role: sanitizedRole,
    status: 'pending_verification',
    full_name: fullName,
  });

  if (profileError) {
    return NextResponse.json(
      { error: 'Failed to create profile. Please try again.' },
      { status: 500 },
    );
  }

  if (sanitizedRole === 'nurse') {
    await supabase.from('nursly_nurse_profiles').insert({
      id: data.user.id,
      specialties: [],
      preferred_radius_km: 25,
      onboarding_complete: false,
    });
  } else if (sanitizedRole === 'agency_admin' && organizationName && typeof organizationName === 'string') {
    const { data: orgData } = await supabase
      .from('nursly_organisations')
      .insert({
        name: organizationName.trim(),
        type: 'other',
        status: 'pending_verification',
        billing_email: email,
      })
      .select();

    if (orgData && (orgData as any[]).length > 0) {
      await supabase.from('nursly_org_members').insert({
        org_id: (orgData as any[])[0].id,
        user_id: data.user.id,
        org_role: 'admin',
      });
    }
  }

  const response = NextResponse.json({ success: true, role: sanitizedRole });

  for (const { name, value, options } of cookiesToSet) {
    response.cookies.set(name, value, options as any);
  }

  return response;
}
