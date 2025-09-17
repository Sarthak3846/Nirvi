export type PasswordHash = {
	algorithm: 'pbkdf2-sha256';
	salt: string; // base64
	iterations: number;
	hash: string; // base64
};

function toBase64(bytes: ArrayBuffer): string {
	return btoa(String.fromCharCode(...new Uint8Array(bytes)));
}

function fromUtf8(input: string): Uint8Array {
	return new TextEncoder().encode(input);
}

function asArrayBuffer(u8: Uint8Array): ArrayBuffer {
	const copy = new Uint8Array(u8.byteLength);
	copy.set(u8);
	return copy.buffer;
}

export async function hashPassword(password: string): Promise<PasswordHash> {
	const iterations = 100000; // Cloudflare Workers PBKDF2 limit
	const saltBytes = crypto.getRandomValues(new Uint8Array(16));
	const passwordBytes = fromUtf8(password);
	const keyMaterial = await crypto.subtle.importKey('raw', asArrayBuffer(passwordBytes), 'PBKDF2', false, ['deriveBits']);
	const derived = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: asArrayBuffer(saltBytes), iterations }, keyMaterial, 256);
	return {
		algorithm: 'pbkdf2-sha256',
		salt: toBase64(saltBytes.buffer),
		iterations,
		hash: toBase64(derived),
	};
}

export async function verifyPassword(password: string, stored: PasswordHash): Promise<boolean> {
	if (stored.algorithm !== 'pbkdf2-sha256') return false;
	const saltBytes = Uint8Array.from(atob(stored.salt), c => c.charCodeAt(0));
	const passwordBytes = fromUtf8(password);
	const keyMaterial = await crypto.subtle.importKey('raw', asArrayBuffer(passwordBytes), 'PBKDF2', false, ['deriveBits']);
	const iterations = stored.iterations;
	const derived = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: asArrayBuffer(saltBytes), iterations }, keyMaterial, 256);
	const derivedB64 = toBase64(derived);
	return constantTimeEqual(derivedB64, stored.hash);
}

function constantTimeEqual(a: string, b: string): boolean {
	if (a.length !== b.length) return false;
	let result = 0;
	for (let i = 0; i < a.length; i++) {
		result |= a.charCodeAt(i) ^ b.charCodeAt(i);
	}
	return result === 0;
}

export function serializePasswordHash(h: PasswordHash): string {
	return `${h.algorithm}:${h.iterations}:${h.salt}:${h.hash}`;
}

export function parsePasswordHash(serialized: string): PasswordHash | null {
	// Try JSON format first (what we store in user_auth_providers)
	try {
		const parsed = JSON.parse(serialized) as Partial<PasswordHash>;
		if (
			parsed &&
			parsed.algorithm === 'pbkdf2-sha256' &&
			typeof parsed.iterations === 'number' &&
			typeof parsed.salt === 'string' &&
			typeof parsed.hash === 'string'
		) {
			return {
				algorithm: 'pbkdf2-sha256',
				iterations: parsed.iterations,
				salt: parsed.salt,
				hash: parsed.hash
			};
		}
		// if JSON structure doesn't match, fall through to legacy format below
	} catch {
		// not JSON, try legacy colon-delimited format
	}

	const parts = serialized.split(':');
	if (parts.length !== 4) return null;
	const [algorithm, iterStr, salt, hash] = parts;
	const iterations = Number(iterStr);
	if (!Number.isFinite(iterations)) return null;
	if (algorithm !== 'pbkdf2-sha256') return null;
	return { algorithm: 'pbkdf2-sha256', iterations, salt, hash };
}


