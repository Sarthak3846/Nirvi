import { NextRequest, NextResponse } from 'next/server';
import { getSessionByToken } from './lib/session';

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Skip middleware for public routes
	if (
		pathname.startsWith('/api/auth/') ||
		pathname.startsWith('/login') ||
		pathname.startsWith('/signup') ||
		pathname.startsWith('/_next/') ||
		pathname.startsWith('/favicon.ico')
	) {
		return NextResponse.next();
	}

	// Check for session token in cookies
	const token = request.cookies.get('session_token')?.value;

	if (!token) {
		// Redirect to login if no token
		if (pathname.startsWith('/dashboard') || pathname.startsWith('/api/')) {
			return NextResponse.redirect(new URL('/login', request.url));
		}
		return NextResponse.next();
	}

	// Verify session
	const session = await getSessionByToken(token);
	if (!session) {
		// Invalid or expired session
		const response = NextResponse.redirect(new URL('/login', request.url));
		response.cookies.delete('session_token');
		return response;
	}

	// Add user info to headers for API routes
	if (pathname.startsWith('/api/')) {
		const requestHeaders = new Headers(request.headers);
		requestHeaders.set('x-user-id', session.user_id);
		return NextResponse.next({
			request: {
				headers: requestHeaders,
			},
		});
	}

	return NextResponse.next();
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
};
