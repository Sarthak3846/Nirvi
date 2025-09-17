"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/repositories/users';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

export default function ProfilePage() {
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

	if (error || !user) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="bg-red-50 border border-red-200 rounded-md p-4">
						<p className="text-red-600">{error || 'User not found'}</p>
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

	return (
		<DashboardLayout user={user} onLogout={handleLogout}>
			<div>
				<div className="mb-8">
					<h1 className="text-2xl font-bold text-gray-900">Profile</h1>
					<p className="mt-1 text-sm text-gray-500">
						Manage your account information and preferences.
					</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					{/* Profile Information */}
					<div className="bg-white shadow rounded-lg">
						<div className="px-4 py-5 sm:p-6">
							<h3 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h3>
							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-gray-700">Name</label>
									<div className="mt-1 text-sm text-gray-900">
										{user.name || 'Not provided'}
									</div>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700">Email</label>
									<div className="mt-1 text-sm text-gray-900">
										{user.email}
									</div>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700">Role</label>
									<div className="mt-1">
										<span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
											{user.role}
										</span>
									</div>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700">Member Since</label>
									<div className="mt-1 text-sm text-gray-900">
										{new Date(user.created_at).toLocaleDateString()}
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Account Actions */}
					<div className="bg-white shadow rounded-lg">
						<div className="px-4 py-5 sm:p-6">
							<h3 className="text-lg font-medium text-gray-900 mb-4">Account Actions</h3>
							<div className="space-y-4">
								<button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
									Update Profile
								</button>
								<button className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors">
									Change Password
								</button>
								<button className="w-full bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition-colors">
									Download Data
								</button>
								<button className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors">
									Delete Account
								</button>
							</div>
						</div>
					</div>
				</div>

				{/* Account Statistics */}
				<div className="mt-8 bg-white shadow rounded-lg">
					<div className="px-4 py-5 sm:p-6">
						<h3 className="text-lg font-medium text-gray-900 mb-4">Account Statistics</h3>
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
							<div className="text-center">
								<div className="text-2xl font-bold text-gray-900">0</div>
								<div className="text-sm text-gray-500">Total Orders</div>
							</div>
							<div className="text-center">
								<div className="text-2xl font-bold text-gray-900">$0.00</div>
								<div className="text-sm text-gray-500">Total Spent</div>
							</div>
							<div className="text-center">
								<div className="text-2xl font-bold text-gray-900">0</div>
								<div className="text-sm text-gray-500">Cart Items</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</DashboardLayout>
	);
}
