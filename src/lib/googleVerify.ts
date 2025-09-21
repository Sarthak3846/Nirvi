import { importJWK, jwtVerify, JWTPayload } from 'jose';

export type GoogleIdTokenPayload = JWTPayload & {
	sub?: string;
	email?: string;
	email_verified?: boolean;
	name?: string;
	picture?: string;
};

// JWKS response type
interface GoogleJWKS {
  keys: Array<{
    kid: string;
    kty: string;
    use: string;
    n: string;
    e: string;
    alg: string;
  }>;
}

// Cache for Google's JWKS to avoid repeated fetches
let cachedJwks: GoogleJWKS | null = null;
let cacheExpiry = 0;

async function getGoogleJWKS() {
	const now = Date.now();
	
	// Use cached JWKS if still valid (cache for 1 hour)
	if (cachedJwks && now < cacheExpiry) {
		return cachedJwks;
	}
	
	// Fetch fresh JWKS from Google
	const response = await fetch('https://www.googleapis.com/oauth2/v3/certs');
	if (!response.ok) {
		throw new Error(`Failed to fetch Google JWKS: ${response.status}`);
	}
	
	const jwks = await response.json() as GoogleJWKS;
	cachedJwks = jwks;
	cacheExpiry = now + (60 * 60 * 1000); // Cache for 1 hour
	
	return jwks;
}

async function getKeyFromJWKS(kid: string) {
	const jwks = await getGoogleJWKS();
	const key = jwks.keys.find((k) => k.kid === kid);
	if (!key) {
		throw new Error(`Unable to find key with kid: ${kid}`);
	}
	return await importJWK(key);
}

export async function verifyGoogleIdToken(idToken: string, audience: string | string[]): Promise<GoogleIdTokenPayload> {
	// Parse the JWT header to get the key ID
	const [headerB64] = idToken.split('.');
	const header = JSON.parse(atob(headerB64));
	const kid = header.kid;
	
	if (!kid) {
		throw new Error('JWT header missing kid');
	}
	
	// Get the appropriate key from Google's JWKS
	const key = await getKeyFromJWKS(kid);
	
	// Verify the JWT
	const { payload } = await jwtVerify(idToken, key, {
		audience,
		issuer: ['https://accounts.google.com', 'accounts.google.com']
	});
	
	return payload as GoogleIdTokenPayload;
}


