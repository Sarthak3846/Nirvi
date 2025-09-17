import { NextRequest, NextResponse } from 'next/server';
import { verifyGoogleIdToken } from '@/lib/googleVerify';
import { createSession } from '@/lib/session';
import { createUser, findUserByEmail } from '@/repositories/users';
import { createOAuthProvider, getAuthProviderByProviderId } from '@/repositories/authProviders';

// Removed legacy GoogleTokenPayload; use payload from verifyGoogleIdToken instead

function getGoogleClientId(): string {
    const fromProcess = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const fromGlobal = (globalThis as unknown as { GOOGLE_CLIENT_ID?: string } | undefined)?.GOOGLE_CLIENT_ID;
    const clientId = fromProcess ?? fromGlobal;
    if (!clientId) throw new Error('Missing GOOGLE_CLIENT_ID');
    return clientId;
}

export async function POST(req: NextRequest) {
    try {
        const body: unknown = await req.json();
        const { id_token } = (body ?? {}) as { id_token?: string };
        if (!id_token) {
            return Response.json({ error: 'id_token required' }, { status: 400 });
        }

        const payload = await verifyGoogleIdToken(id_token, getGoogleClientId());

        const googleSub = payload.sub;
        const email = payload.email;
        const name = payload.name;
        if (!googleSub) {
            return Response.json({ error: 'invalid_token' }, { status: 401 });
        }

        // 1) If provider record exists, log that user in
        const existingProvider = await getAuthProviderByProviderId('google', googleSub);
        if (existingProvider) {
            const session = await createSession(existingProvider.user_id);
            const response = NextResponse.json({ ok: true, user_id: existingProvider.user_id }, { status: 200 });
            response.cookies.set('session_token', session.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60,
                path: '/'
            });
            return response;
        }

        // 2) If no provider, try linking by email
        let userId: string | null = null;
        if (email) {
            const existingUser = await findUserByEmail(email);
            if (existingUser) {
                userId = existingUser.id;
            }
        }

        // 3) If no user, create one
        if (!userId) {
            userId = crypto.randomUUID();
            await createUser({ id: userId, email: email ?? `${googleSub}@users.google.local`, name: name ?? null });
        }

        // 4) Create provider record
        await createOAuthProvider(userId, 'google', googleSub);

        // 5) Start session
        const session = await createSession(userId);
        const response = NextResponse.json({ ok: true, user_id: userId }, { status: 200 });
        response.cookies.set('session_token', session.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60,
            path: '/'
        });
        return response;
    } catch (err: unknown) {
        const message = typeof err === 'object' && err !== null && 'message' in err ? String((err as { message?: unknown }).message) : String(err);
        return Response.json({ error: 'internal_error', details: message }, { status: 500 });
    }
}
