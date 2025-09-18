"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import GoogleAuthButton from '@/components/GoogleAuthButton';

export default function LoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | null>(null);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		const res = await fetch('/api/auth/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password })
		});
		if (res.ok) {
			router.push('/dashboard');
		} else {
			const data = (await res.json().catch(() => ({ error: 'Login failed' }))) as { error?: string };
			setError(data?.error ?? 'Login failed');
		}
	}

	return (
		<div style={{ minHeight: '100vh', background: '#ffffff', color: '#111827' }}>
			<div style={{ display: 'flex', minHeight: '100vh' }}>
				{/* Left content */}
				<div style={{ flex: 1, backgroundColor: '#fde047', padding: '4rem 3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
					<div style={{ maxWidth: 560 }}>
						<div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
							<div style={{ width: 36, height: 36, borderRadius: 8, background: 'linear-gradient(135deg, #06b6d4, #6366f1)' }} />
							<strong style={{ fontSize: 18, color: '#0b1220' }}>Nirvi</strong>
						</div>
						<h1 style={{ fontSize: 42, lineHeight: 1.1, margin: 0, color: '#0b1220' }}>Welcome back</h1>
						<p style={{ marginTop: 12, fontSize: 16, color: '#1f2937' }}>Secure access to your dashboard with a clean, focused experience. Continue where you left off and manage everything in one place.</p>
						<ul style={{ marginTop: 24, paddingLeft: 18, color: '#1f2937' }}>
							<li style={{ marginBottom: 8 }}>Two-factor ready security</li>
							<li style={{ marginBottom: 8 }}>Privacy-first by design</li>
							<li style={{ marginBottom: 8 }}>Fast, global edge performance</li>
						</ul>
					</div>
				</div>

				{/* Right form */}
				<div style={{ flex: 1, backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem' }}>
					<div style={{ width: '100%', maxWidth: 420, backgroundColor: '#ffffff', border: '1px solid #e5e7eb', boxShadow: '0 10px 30px rgba(0,0,0,0.06)', borderRadius: 12, padding: 24 }}>
						<h2 style={{ margin: 0, marginBottom: 8, color: '#0b1220' }}>Sign in</h2>
						<p style={{ marginTop: 0, marginBottom: 24, color: '#4b5563' }}>Use your email and password to continue.</p>
						<form onSubmit={onSubmit}>
							<label style={{ display: 'block', fontSize: 14, color: '#374151', marginBottom: 6 }}>Email</label>
							<input
								value={email}
								onChange={e => setEmail(e.target.value)}
								type="email"
								required
								placeholder="you@example.com"
								style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e5e7eb', backgroundColor: '#ffffff', color: '#111827', outline: 'none', marginBottom: 14 }}
							/>

							<label style={{ display: 'block', fontSize: 14, color: '#374151', marginBottom: 6 }}>Password</label>
							<input
								value={password}
								onChange={e => setPassword(e.target.value)}
								type="password"
								required
								placeholder="••••••••"
								style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e5e7eb', backgroundColor: '#ffffff', color: '#111827', outline: 'none' }}
							/>

							{error && <p style={{ color: '#ef4444', marginTop: 8, marginBottom: 0 }}>{error}</p>}

							<button type="submit" style={{ width: '100%', marginTop: 18, background: 'linear-gradient(135deg, #06b6d4, #6366f1)', color: '#ffffff', fontWeight: 700, border: 'none', borderRadius: 8, padding: '10px 12px', cursor: 'pointer' }}>
								Sign in
							</button>
						</form>

					<div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16, marginBottom: 8 }}>
						<div style={{ flex: 1, height: 1, backgroundColor: '#e5e7eb' }} />
						<span style={{ color: '#9ca3af', fontSize: 12 }}>or</span>
						<div style={{ flex: 1, height: 1, backgroundColor: '#e5e7eb' }} />
					</div>

					<GoogleAuthButton label="Continue with Google" />

						<p style={{ marginTop: 16, color: '#6b7280' }}>
							No account?
							{' '}
							<a href="/signup" style={{ color: '#2563eb', textDecoration: 'underline' }}>Create one</a>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}


