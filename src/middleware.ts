import { auth } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export default async function middleware(request: NextRequest) {
  // Rutas que requieren autenticación
  const protectedPaths = ['/admin', '/dashboard'];
  const authPaths = ['/auth/login', '/auth/register'];

  const { pathname } = request.nextUrl;

  // Verificar si la ruta actual está protegida
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
  const isAuthPath = authPaths.some(path => pathname.startsWith(path));

  // Obtener la sesión del usuario
  const session = await auth();

  // Si es una ruta protegida y no hay sesión, redirigir al login
  if (isProtectedPath && !session) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Si el usuario está autenticado y trata de acceder a páginas de auth, redirigir al admin
  if (isAuthPath && session) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // Verificar roles para rutas específicas
  if (isProtectedPath && session) {
    const userRoles = session.user.roles || [];

    // Solo admins pueden acceder a /admin
    if (pathname.startsWith('/admin') && !userRoles.includes('ADMIN')) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
