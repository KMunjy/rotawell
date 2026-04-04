import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { createServerClient } from '@supabase/ssr';
import { checkRateLimit } from '@/lib/rate-limit';

const protectedRoutes = ['/worker', '/provider', '/admin'];
const authRoutes = ['/login', '/register', '/forgot-password'];

function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      // 'unsafe-inline' required by Next.js inline scripts; 'unsafe-eval' for dev HMR
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://*.supabase.co",
      "font-src 'self'",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
      "frame-ancestors 'none'",
    ].join('; '),
  );
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains',
    );
  }
  return response;
}

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = getClientIp(request);

  // Rate limit all API routes: 100 requests per minute per IP
  if (pathname.startsWith('/api/')) {
    const rateLimit = await checkRateLimit(`api:${ip}`, 100, 60_000);
    if (!rateLimit.allowed) {
      return new NextResponse(JSON.stringify({ error: 'Too Many Requests' }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(Math.ceil((rateLimit.resetAt - Date.now()) / 1000)),
        },
      });
    }
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  response = await updateSession(request, response);

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(
            ({
              name,
              value,
              options,
            }: {
              name: string;
              value: string;
              options?: Record<string, unknown>;
            }) => {
              response.cookies.set(name, value, options as any);
            },
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdminRoute = pathname.startsWith('/admin');

  // Redirect unauthenticated users away from protected routes
  if (isProtectedRoute && !user) {
    const redirectResponse = NextResponse.redirect(new URL('/login', request.url));
    return addSecurityHeaders(redirectResponse);
  }

  // For admin routes and auth/landing redirects, check role once
  if (user && (isAdminRoute || isAuthRoute || pathname === '/')) {
    try {
      const { data: profile } = await supabase
        .from('nursly_profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      const role = profile?.role;

      // Block non-admins from all /admin/* routes
      if (isAdminRoute && role !== 'platform_admin') {
        const redirectUrl =
          role === 'agency_admin' || role === 'agency_staff'
            ? '/provider/shifts'
            : '/worker/shifts';
        const redirectResponse = NextResponse.redirect(new URL(redirectUrl, request.url));
        return addSecurityHeaders(redirectResponse);
      }

      // Redirect authenticated users from auth/landing pages to their dashboard
      if (isAuthRoute || pathname === '/') {
        let redirectUrl = '/worker/shifts';
        if (role === 'agency_admin' || role === 'agency_staff') {
          redirectUrl = '/provider/shifts';
        } else if (role === 'platform_admin') {
          redirectUrl = '/admin/users';
        }
        const redirectResponse = NextResponse.redirect(new URL(redirectUrl, request.url));
        return addSecurityHeaders(redirectResponse);
      }
    } catch {
      // If role check fails on admin route, deny access
      if (isAdminRoute) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }
  }

  return addSecurityHeaders(response);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.svg).*)',
  ],
};
