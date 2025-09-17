import { getDb } from './cloudflare';

export type Session = {
	id: string;
	user_id: string;
	token: string;
	expires_at: string;
	created_at: string;
};

export async function createSession(userId: string): Promise<Session> {
	const db = getDb();
	const sessionId = crypto.randomUUID();
	const token = crypto.randomUUID();
	const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

	await db
		.prepare('INSERT INTO sessions (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)')
		.bind(sessionId, userId, token, expiresAt.toISOString())
		.run();

	return {
		id: sessionId,
		user_id: userId,
		token,
		expires_at: expiresAt.toISOString(),
		created_at: new Date().toISOString()
	};
}

export async function getSessionByToken(token: string): Promise<Session | null> {
	const db = getDb();
	const row = await db
		.prepare('SELECT * FROM sessions WHERE token = ? AND expires_at > ?')
		.bind(token, new Date().toISOString())
		.first<Session>();
	return row ?? null;
}

export async function deleteSession(token: string): Promise<void> {
	const db = getDb();
	await db
		.prepare('DELETE FROM sessions WHERE token = ?')
		.bind(token)
		.run();
}

export async function deleteUserSessions(userId: string): Promise<void> {
	const db = getDb();
	await db
		.prepare('DELETE FROM sessions WHERE user_id = ?')
		.bind(userId)
		.run();
}
