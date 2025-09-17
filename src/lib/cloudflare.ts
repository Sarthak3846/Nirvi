import { getCloudflareContext } from '@opennextjs/cloudflare';

export function getDb(): D1Database {
	const { env } = getCloudflareContext();
	return (env as unknown as { DB: D1Database }).DB;
}

export function getEnv() {
	const { env } = getCloudflareContext();
	return env as unknown as { DB: D1Database };
}


