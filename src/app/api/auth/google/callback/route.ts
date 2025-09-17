import { NextRequest, NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import { createSession } from '@/lib/session';
import { createUser, findUserByEmail } from '@/repositories/users';
import { createOAuthProvider, getAuthProviderByProviderId } from '@/repositories/authProviders';

function getClient(): OAuth2Client {
    const clientId = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET || '';
    if (!clientId || !clientSecret) throw new Error('Missing GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET');
    return new OAuth2Client(clientId, clientSecret);
}

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const code = url.searchParams.get('code');
        const state = url.searchParams.get('state');
        const stateCookie = req.cookies.get('oauth_state')?.value;
        if (!code) return NextResponse.json({ error: 'missing_code' }, { status: 400 });
        if (!state || !stateCookie || state !== stateCookie) return NextResponse.json({ error: 'invalid_state' }, { status: 400 });

        const redirectUri = `${url.origin}/api/auth/google/callback`;
        const client = getClient();

        const tokenParams = new URLSearchParams({
            code,
            client_id: process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
            client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
            redirect_uri: redirectUri,
            grant_type: 'authorization_code'
        });
        const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: tokenParams.toString()
        });
        if (!tokenRes.ok) {
            const details = await tokenRes.text();
            return NextResponse.json({ error: 'token_exchange_failed', details }, { status: 400 });
        }
        const tokenJson = (await tokenRes.json()) as { id_token?: string };
        const idToken = tokenJson.id_token;
        if (!idToken) return NextResponse.json({ error: 'missing_id_token' }, { status: 400 });

        const ticket = await client.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID });
        const payload = (ticket.getPayload() ?? {}) as { sub?: string; email?: string; name?: string };
        const sub = payload.sub;
        const email = payload.email;
        const name = payload.name;
        if (!sub) return NextResponse.json({ error: 'invalid_token' }, { status: 401 });

        const existingProvider = await getAuthProviderByProviderId('google', sub);
        if (existingProvider) {
            const session = await createSession(existingProvider.user_id);
            const resp = NextResponse.redirect(new URL('/dashboard', url.origin));
            resp.cookies.set('session_token', session.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60,
                path: '/'
            });
            resp.cookies.set('oauth_state', '', { path: '/', maxAge: 0 });
            return resp;
        }

        let userId: string | null = null;
        if (email) {
            const existingUser = await findUserByEmail(email);
            if (existingUser) userId = existingUser.id;
        }
        if (!userId) {
            userId = crypto.randomUUID();
            await createUser({ id: userId, email: email ?? `${sub}@users.google.local`, name: name ?? null });
        }
        await createOAuthProvider(userId, 'google', sub);

        const session = await createSession(userId);
        const resp = NextResponse.redirect(new URL('/dashboard', url.origin));
        resp.cookies.set('session_token', session.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60,
            path: '/'
        });
        resp.cookies.set('oauth_state', '', { path: '/', maxAge: 0 });
        return resp;
    } catch (err: unknown) {
        const message = typeof err === 'object' && err !== null && 'message' in err ? String((err as { message?: unknown }).message) : String(err);
        return NextResponse.json({ error: 'internal_error', details: message }, { status: 500 });
    }
}


