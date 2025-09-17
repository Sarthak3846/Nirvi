import { NextRequest, NextResponse } from 'next/server';

function getGoogleClientId(): string {
    const clientId = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) throw new Error('Missing GOOGLE_CLIENT_ID');
    return clientId;
}

function buildRedirectUri(req: NextRequest): string {
    const origin = req.nextUrl.origin;
    return `${origin}/api/auth/google/callback`;
}

export async function GET(req: NextRequest) {
    const clientId = getGoogleClientId();
    const redirectUri = buildRedirectUri(req);
    const state = crypto.randomUUID();

    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: 'openid email profile',
        prompt: 'select_account',
        state
    });

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    const res = NextResponse.redirect(authUrl);
    res.cookies.set('oauth_state', state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 10 * 60
    });
    return res;
}


