import { findUserById } from '../repositories/users';

export async function isUserAdmin(userId: string): Promise<boolean> {
	const user = await findUserById(userId);
	return user?.role === 'admin';
}

export function createAdminResponse(message: string, status: number = 403) {
	return new Response(JSON.stringify({ error: message }), {
		status,
		headers: { 'Content-Type': 'application/json' }
	});
}
