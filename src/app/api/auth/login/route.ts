import { NextRequest, NextResponse } from 'next/server';
import { getPasswordAuthByEmail } from '@/repositories/authProviders';
import { parsePasswordHash, verifyPassword } from '@/lib/crypto';
import { createSession } from '@/lib/session';

export async function POST(req: NextRequest) {
	try {
		const body: unknown = await req.json();
		const { email, password } = (body ?? {}) as { email?: string; password?: string };
		if (!email || !password) {
			return Response.json({ error: 'email and password are required' }, { status: 400 });
		}
		const record = await getPasswordAuthByEmail(email);
		if (!record || !record.password_hash) {
			return Response.json({ error: 'invalid_credentials' }, { status: 401 });
		}
		const parsed = parsePasswordHash(record.password_hash);
		if (!parsed) return Response.json({ error: 'invalid_credentials' }, { status: 401 });
		const ok = await verifyPassword(password, parsed);
		if (!ok) return Response.json({ error: 'invalid_credentials' }, { status: 401 });
		
		// Create session
		const session = await createSession(record.user_id);
		
		// Set session cookie
		const response = NextResponse.json({ ok: true, user_id: record.user_id }, { status: 200 });
		response.cookies.set('session_token', session.token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: 7 * 24 * 60 * 60, // 7 days
			path: '/'
		});
		
		return response;
	} catch (err: unknown) {
		const message = typeof err === 'object' && err !== null && 'message' in err ? String((err as { message?: unknown }).message) : String(err);
		return Response.json({ error: 'internal_error', details: message }, { status: 500 });
	}
}


