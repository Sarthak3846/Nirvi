import { createRemoteJWKSet, jwtVerify, JWTPayload } from 'jose';

const googleJwks = createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'));

export type GoogleIdTokenPayload = JWTPayload & {
	sub?: string;
	email?: string;
	email_verified?: boolean;
	name?: string;
	picture?: string;
};

export async function verifyGoogleIdToken(idToken: string, audience: string | string[]): Promise<GoogleIdTokenPayload> {
	const { payload } = await jwtVerify(idToken, googleJwks, {
		audience,
		issuer: ['https://accounts.google.com', 'accounts.google.com']
	});
	return payload as GoogleIdTokenPayload;
}


