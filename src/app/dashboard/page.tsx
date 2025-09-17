"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/repositories/users';

export default function DashboardPage() {
	const router = useRouter();
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchUser() {
			try {
				const res = await fetch('/api/auth/me');
				if (res.ok) {
					const userData = await res.json() as User;
					setUser(userData);
				} else if (res.status === 401) {
					router.push('/login');
				} else {
					setError('Failed to load user data');
				}
			} catch {
				setError('Network error');
			} finally {
				setLoading(false);
			}
		}
		fetchUser();
	}, [router]);

	async function handleLogout() {
		try {
			await fetch('/api/auth/logout', { method: 'POST' });
			router.push('/login');
		} catch (err) {
			console.error('Logout failed:', err);
		}
	}

	if (loading) {
		return (
			<div style={{ maxWidth: 720, margin: '4rem auto', padding: 16 }}>
				<p>Loading...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div style={{ maxWidth: 720, margin: '4rem auto', padding: 16 }}>
				<p style={{ color: '#ef4444' }}>{error}</p>
			</div>
		);
	}

	return (
		<div style={{ maxWidth: 720, margin: '4rem auto', padding: 16 }}>
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
				<h1>Dashboard</h1>
				<button
					onClick={handleLogout}
					style={{
						background: '#ef4444',
						color: '#ffffff',
						border: 'none',
						borderRadius: 8,
						padding: '8px 16px',
						cursor: 'pointer'
					}}
				>
					Logout
				</button>
			</div>
			
			<div style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
				<h2 style={{ margin: '0 0 12px 0' }}>Welcome back!</h2>
				{user && (
					<div>
						<p><strong>Email:</strong> {user.email}</p>
						<p><strong>Name:</strong> {user.name || 'Not provided'}</p>
						<p><strong>Role:</strong> {user.role}</p>
						<p><strong>User ID:</strong> {user.id}</p>
					</div>
				)}
			</div>
		</div>
	);
}


