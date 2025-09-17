import { NextRequest } from 'next/server';
import { getSessionByToken } from '@/lib/session';
import { findUserById } from '@/repositories/users';

export async function GET(req: NextRequest) {
	try {
		const token = req.cookies.get('session_token')?.value;
		
		if (!token) {
			return Response.json({ error: 'not_authenticated' }, { status: 401 });
		}
		
		const session = await getSessionByToken(token);
		if (!session) {
			return Response.json({ error: 'invalid_session' }, { status: 401 });
		}
		
		const user = await findUserById(session.user_id);
		if (!user) {
			return Response.json({ error: 'user_not_found' }, { status: 404 });
		}
		
		return Response.json({
			id: user.id,
			email: user.email,
			name: user.name,
			role: user.role
		}, { status: 200 });
	} catch (err: unknown) {
		const message = typeof err === 'object' && err !== null && 'message' in err ? String((err as { message?: unknown }).message) : String(err);
		return Response.json({ error: 'internal_error', details: message }, { status: 500 });
	}
}
