import { getDb } from '../lib/cloudflare';
import { PasswordHash } from '../lib/crypto';

export type AuthProvider = {
	id: string;
	user_id: string;
	provider: string;
	provider_id: string | null;
	password_hash: string | null;
	created_at: string;
};

export async function createPasswordAuth(userId: string, hash: PasswordHash): Promise<void> {
	const db = getDb();
	await db
		.prepare('INSERT INTO user_auth_providers (id, user_id, provider, provider_id, password_hash) VALUES (?, ?, ?, ?, ?)')
		.bind(crypto.randomUUID(), userId, 'password', null, JSON.stringify(hash))
		.run();
}

export async function getPasswordAuthByEmail(email: string): Promise<{ user_id: string; password_hash: string } | null> {
	const db = getDb();
	const row = await db
		.prepare(
			`SELECT u.id as user_id, uap.password_hash as password_hash
			 FROM user_auth_providers uap
			 JOIN users u ON uap.user_id = u.id
			 WHERE uap.provider = 'password' AND u.email = ?`
		)
		.bind(email)
		.first<{ user_id: string; password_hash: string }>();
	return row ?? null;
}

export async function getAuthProviderByProviderId(provider: string, providerId: string): Promise<AuthProvider | null> {
    const db = getDb();
    const row = await db
        .prepare(
            `SELECT * FROM user_auth_providers WHERE provider = ? AND provider_id = ?`
        )
        .bind(provider, providerId)
        .first<AuthProvider>();
    return row ?? null;
}

export async function createOAuthProvider(userId: string, provider: string, providerId: string): Promise<void> {
    const db = getDb();
    await db
        .prepare('INSERT INTO user_auth_providers (id, user_id, provider, provider_id, password_hash) VALUES (?, ?, ?, ?, NULL)')
        .bind(crypto.randomUUID(), userId, provider, providerId)
        .run();
}
