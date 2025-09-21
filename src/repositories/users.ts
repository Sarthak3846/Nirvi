import { getDb } from '../lib/cloudflare';

export type User = {
	id: string;
	email: string;
	name: string | null;
	role: string;
	created_at: string;
	updated_at: string;
};

export async function findUserByEmail(email: string): Promise<User | null> {
	const db = getDb();
	const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
	const row = await stmt.bind(email).first<User>();
	return row ?? null;
}

export async function createUser(user: { id: string; email: string; name?: string | null; role?: string }): Promise<User> {
	const db = getDb();
	const name = user.name ?? null;
	const role = user.role ?? 'user';
	await db.prepare('INSERT INTO users (id, email, name, role) VALUES (?, ?, ?, ?)').bind(user.id, user.email, name, role).run();
	const created = await db.prepare('SELECT * FROM users WHERE id = ?').bind(user.id).first<User>();
	if (!created) throw new Error('Failed to create user');
	return created;
}

export async function findUserById(id: string): Promise<User | null> {
	const db = getDb();
	const row = await db.prepare('SELECT * FROM users WHERE id = ?').bind(id).first<User>();
	return row ?? null;
}

export async function getAllUsers(): Promise<User[]> {
	const db = getDb();
	const stmt = db.prepare('SELECT * FROM users ORDER BY created_at DESC');
	const rows = await stmt.all<User>();
	return rows.results || [];
}

export async function updateUserRole(id: string, role: string): Promise<User | null> {
	const db = getDb();
	await db.prepare('UPDATE users SET role = ? WHERE id = ?').bind(role, id).run();
	
	const updated = await db.prepare('SELECT * FROM users WHERE id = ?').bind(id).first<User>();
	return updated ?? null;
}
