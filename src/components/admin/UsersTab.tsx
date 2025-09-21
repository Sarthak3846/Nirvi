'use client';

import { useState, useEffect } from 'react';

interface User {
	id: string;
	email: string;
	name: string | null;
	role: string;
	created_at: string;
	updated_at: string;
}

export default function UsersTab() {
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [updatingUser, setUpdatingUser] = useState<string | null>(null);

	useEffect(() => {
		fetchUsers();
	}, []);

	const fetchUsers = async () => {
		try {
			setLoading(true);
			const response = await fetch('/api/admin/users');
			if (!response.ok) {
				throw new Error('Failed to fetch users');
			}
			const data = await response.json();
			setUsers(data.users);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An error occurred');
		} finally {
			setLoading(false);
		}
	};

	const updateUserRole = async (userId: string, newRole: string) => {
		try {
			setUpdatingUser(userId);
			const response = await fetch('/api/admin/users', {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					targetUserId: userId,
					role: newRole,
				}),
			});

			if (!response.ok) {
				throw new Error('Failed to update user role');
			}

			const data = await response.json();
			setUsers(users.map(user => 
				user.id === userId ? data.user : user
			));
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An error occurred');
		} finally {
			setUpdatingUser(null);
		}
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
	};

	if (loading) {
		return (
			<div className="p-6">
				<div className="flex justify-center items-center h-64">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="p-6">
				<div className="bg-red-50 border border-red-200 rounded-md p-4">
					<p className="text-red-800">Error: {error}</p>
					<button
						onClick={fetchUsers}
						className="mt-2 text-red-600 hover:text-red-800 underline"
					>
						Try again
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="p-6">
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-xl font-light tracking-wide">USER MANAGEMENT</h2>
				<p className="text-sm text-gray-500">{users.length} total users</p>
			</div>

			<div className="overflow-x-auto">
				<table className="min-w-full divide-y divide-gray-200">
					<thead className="bg-gray-50">
						<tr>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								User
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Role
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Created
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Actions
							</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{users.map((user) => (
							<tr key={user.id} className="hover:bg-gray-50">
								<td className="px-6 py-4 whitespace-nowrap">
									<div>
										<div className="text-sm font-medium text-gray-900">
											{user.name || 'No name'}
										</div>
										<div className="text-sm text-gray-500">{user.email}</div>
									</div>
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									<span
										className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
											user.role === 'admin'
												? 'bg-purple-100 text-purple-800'
												: 'bg-gray-100 text-gray-800'
										}`}
									>
										{user.role.toUpperCase()}
									</span>
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
									{formatDate(user.created_at)}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
									<select
										value={user.role}
										onChange={(e) => updateUserRole(user.id, e.target.value)}
										disabled={updatingUser === user.id}
										className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black disabled:opacity-50"
									>
										<option value="user">User</option>
										<option value="admin">Admin</option>
									</select>
									{updatingUser === user.id && (
										<div className="ml-2 inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{users.length === 0 && (
				<div className="text-center py-12">
					<p className="text-gray-500">No users found.</p>
				</div>
			)}
		</div>
	);
}
