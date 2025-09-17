import { NextRequest } from 'next/server';
import { hashPassword } from '@/lib/crypto';
import { createUser, findUserByEmail } from '@/repositories/users';
import { createPasswordAuth } from '@/repositories/authProviders';

export async function POST(req: NextRequest) {
	try {
		const body: unknown = await req.json();
		const { email, password, name } = (body ?? {}) as { email?: string; password?: string; name?: string };
		if (!email || !password) {
			return Response.json({ error: 'email and password are required' }, { status: 400 });
		}
		const existing = await findUserByEmail(email);
		if (existing) {
			return Response.json({ error: 'email already registered' }, { status: 409 });
		}
		const userId = crypto.randomUUID();
		const user = await createUser({ id: userId, email, name: name ?? null });
		const pwd = await hashPassword(password);
		await createPasswordAuth(user.id, pwd);
		return Response.json({ id: user.id, email: user.email, name: user.name, role: user.role }, { status: 201 });
	} catch (err: unknown) {
		const message = typeof err === 'object' && err !== null && 'message' in err ? String((err as { message?: unknown }).message) : String(err);
		return Response.json({ error: 'internal_error', details: message }, { status: 500 });
	}
}


