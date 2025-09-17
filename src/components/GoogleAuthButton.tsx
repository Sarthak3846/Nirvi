"use client";
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

type GoogleIdCredential = { credential?: string };

function resolveClientId(): string | undefined {
    const fromEnv = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const fromWindow: string | undefined = (typeof window !== 'undefined' && window.GOOGLE_CLIENT_ID) || undefined;
    const fromMeta = typeof document !== 'undefined' ? document.querySelector('meta[name="google-client-id"]')?.getAttribute('content') ?? undefined : undefined;
    return fromEnv || fromWindow || fromMeta;
}

export function GoogleAuthButton({ label = 'Continue with Google' }: { label?: string }) {
    const router = useRouter();
    const initializedRef = useRef(false);
    const initPromiseRef = useRef<Promise<void> | null>(null);

    useEffect(() => {
        function ensureGisScript(): Promise<void> {
            return new Promise(resolve => {
                if (window.google?.accounts?.id) return resolve();
                const s = document.createElement('script');
                s.src = 'https://accounts.google.com/gsi/client';
                s.async = true;
                s.defer = true;
                s.onload = () => resolve();
                document.head.appendChild(s);
            });
        }

        async function init(): Promise<void> {
            if (initializedRef.current) return;
            await ensureGisScript();
            const clientId = resolveClientId();
            if (!clientId) return;
            if (!window.google?.accounts?.id) return;
            window.google.accounts.id.initialize({
                client_id: clientId,
                callback: async (response: GoogleIdCredential) => {
                    const idToken = response?.credential;
                    if (!idToken) return;
                    const res = await fetch('/api/auth/google', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify({ id_token: idToken })
                    });
                    if (res.ok) {
                        router.push('/dashboard');
                    }
                }
            });
            initializedRef.current = true;
        }

        // Eagerly kick off initialization
        initPromiseRef.current = init();
    }, [router]);

    return (
        <button
            onClick={() => {
                // Prefer full OAuth code flow to avoid strict origin checks
                window.location.href = '/api/auth/google/start';
            }}
            style={{ width: '100%', marginTop: 12, backgroundColor: '#ffffff', color: '#111827', fontWeight: 600, border: '1px solid #e5e7eb', borderRadius: 8, padding: '10px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12 s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C33.614,6.053,29.048,4,24,4C16.318,4,9.656,8.063,6.306,14.691z"/><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,16.082,18.961,13,24,13c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657 C33.614,6.053,29.048,4,24,4C16.318,4,9.656,8.063,6.306,14.691z"/><path fill="#4CAF50" d="M24,44c4.946,0,9.449-1.896,12.866-4.993l-5.938-5.017C29.911,35.091,27.104,36,24,36 c-5.202,0-9.619-3.317-11.276-7.953l-6.522,5.025C9.569,39.83,16.227,44,24,44z"/><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12 s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C33.614,6.053,29.048,4,24,4C12.955,4,4,12.955,4,24 s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/></svg>
            {label}
        </button>
    );
}

export default GoogleAuthButton;


