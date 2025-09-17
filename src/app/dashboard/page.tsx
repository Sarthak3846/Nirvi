"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/repositories/users';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardOverview from '@/components/dashboard/DashboardOverview';

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
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
					<p className="mt-4 text-gray-600">Loading...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="bg-red-50 border border-red-200 rounded-md p-4">
						<p className="text-red-600">{error}</p>
						<button
							onClick={() => window.location.reload()}
							className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
						>
							Retry
						</button>
					</div>
				</div>
			</div>
		);
	}

	if (!user) {
		return null;
	}

	return (
		<DashboardLayout user={user} onLogout={handleLogout}>
			<div>
				<div className="mb-8">
					<h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name || 'User'}!</h1>
					<p className="mt-1 text-sm text-gray-500">
						Here&apos;s what&apos;s happening with your account today.
					</p>
				</div>

				<DashboardOverview userId={user.id} />
			</div>
		</DashboardLayout>
	);
}


