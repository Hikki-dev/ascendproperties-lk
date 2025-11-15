import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, { ...options, expires: options.expires ? options.expires.getTime() : undefined })
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  // --- UPDATED LOGIC ---

  // 1. Define your admin-only URL paths
  const adminPaths = ['/dashboard', '/add-property']

  // 2. Protect Admin Routes
  if (adminPaths.some(path => pathname.startsWith(path))) {
    if (!user) {
      // Not logged in, redirect to /login
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // User is logged in, check their role from the 'agents' table
    const { data: agent, error } = await supabase
      .from('agents')
      .select('role')
      .eq('email', user.email) // Match agent by the logged-in user's email
      .single();

    // If not an admin, redirect to homepage
    if (error || !agent || agent.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url))
    }
    // User is an admin, allow access.
  }

  // 3. Redirect logged-in users away from login/signup pages
  if (user && (pathname === '/login' || pathname === '/signup')) {
     // Check if they are admin
     const { data: agent } = await supabase
       .from('agents')
       .select('role')
       .eq('email', user.email)
       .single();
     
     if (agent && agent.role === 'admin') {
       // Send admins to the dashboard
       return NextResponse.redirect(new URL('/dashboard', request.url))
     }
     // Send non-admins to the homepage
     return NextResponse.redirect(new URL('/', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}