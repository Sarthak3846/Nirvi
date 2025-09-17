"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/repositories/users';
import { OrderWithItems } from '@/repositories/orders';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

export default function OrdersPage() {
	const router = useRouter();
	const [user, setUser] = useState<User | null>(null);
	const [orders, setOrders] = useState<OrderWithItems[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchData() {
			try {
				const [userRes, ordersRes] = await Promise.all([
					fetch('/api/auth/me'),
					fetch('/api/orders')
				]);

				if (userRes.ok) {
					const userData = await userRes.json() as User;
					setUser(userData);
				} else if (userRes.status === 401) {
					router.push('/login');
					return;
				} else {
					setError('Failed to load user data');
					return;
				}

				if (ordersRes.ok) {
					const ordersData = await ordersRes.json() as OrderWithItems[];
					setOrders(ordersData);
				} else {
					setError('Failed to load orders');
				}
			} catch {
				setError('Network error');
			} finally {
				setLoading(false);
			}
		}
		fetchData();
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
					<h1 className="text-2xl font-bold text-gray-900">Orders</h1>
					<p className="mt-1 text-sm text-gray-500">
						View your order history and track current orders.
					</p>
				</div>

				{orders.length === 0 ? (
					<div className="text-center py-12">
						<div className="mx-auto h-12 w-12 text-gray-400">
							<svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
							</svg>
						</div>
						<h3 className="mt-2 text-sm font-medium text-gray-900">No orders</h3>
						<p className="mt-1 text-sm text-gray-500">You haven't placed any orders yet.</p>
						<div className="mt-6">
							<a
								href="/dashboard/products"
								className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
							>
								Browse Products
							</a>
						</div>
					</div>
				) : (
					<div className="space-y-6">
						{orders.map((order) => (
							<div key={order.id} className="bg-white shadow rounded-lg">
								<div className="px-4 py-5 sm:p-6">
									<div className="flex items-center justify-between mb-4">
										<div>
											<h3 className="text-lg font-medium text-gray-900">
												Order #{order.id.slice(0, 8)}
											</h3>
											<p className="text-sm text-gray-500">
												Placed on {new Date(order.created_at).toLocaleDateString()}
											</p>
										</div>
										<div className="text-right">
											<div className="text-lg font-semibold text-gray-900">
												${order.total_amount.toFixed(2)}
											</div>
											<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
												order.status === 'completed' ? 'bg-green-100 text-green-800' :
												order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
												order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
												'bg-gray-100 text-gray-800'
											}`}>
												{order.status}
											</span>
										</div>
									</div>

									<div className="border-t border-gray-200 pt-4">
										<h4 className="text-sm font-medium text-gray-900 mb-2">Items:</h4>
										<div className="space-y-2">
											{order.items.map((item) => (
												<div key={item.id} className="flex justify-between text-sm">
													<span className="text-gray-600">
														{item.product_name} × {item.quantity}
													</span>
													<span className="text-gray-900">
														${(item.price * item.quantity).toFixed(2)}
													</span>
												</div>
											))}
										</div>
									</div>

									{order.shipping_address && (
										<div className="border-t border-gray-200 pt-4 mt-4">
											<h4 className="text-sm font-medium text-gray-900 mb-2">Shipping Address:</h4>
											<div className="text-sm text-gray-600">
												<p>{order.shipping_address.full_name}</p>
												<p>{order.shipping_address.address_line1}</p>
												{order.shipping_address.address_line2 && (
													<p>{order.shipping_address.address_line2}</p>
												)}
												<p>
													{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
												</p>
												<p>{order.shipping_address.country}</p>
											</div>
										</div>
									)}
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</DashboardLayout>
	);
}
