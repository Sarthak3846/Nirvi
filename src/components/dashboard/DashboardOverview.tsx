"use client";
import { useState, useEffect } from 'react';
import StatsCard from './StatsCard';
import { OrderWithItems } from '@/repositories/orders';
import { CartWithItems } from '@/repositories/carts';

interface DashboardOverviewProps {
	userId: string;
}

export default function DashboardOverview({ userId }: DashboardOverviewProps) {
	const [orders, setOrders] = useState<OrderWithItems[]>([]);
	const [cart, setCart] = useState<CartWithItems | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchData() {
			try {
				const [ordersRes, cartRes] = await Promise.all([
					fetch('/api/orders'),
					fetch('/api/cart')
				]);

				if (ordersRes.ok) {
					const ordersData = await ordersRes.json() as OrderWithItems[];
					setOrders(ordersData);
				}

				if (cartRes.ok) {
					const cartData = await cartRes.json() as CartWithItems;
					setCart(cartData);
				}
			} catch (error) {
				console.error('Error fetching dashboard data:', error);
			} finally {
				setLoading(false);
			}
		}

		fetchData();
	}, [userId]);

	if (loading) {
		return (
			<div className="animate-pulse">
				<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
					{[...Array(4)].map((_, i) => (
						<div key={i} className="bg-white p-5 rounded-lg shadow">
							<div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
							<div className="h-8 bg-gray-200 rounded w-1/2"></div>
						</div>
					))}
				</div>
			</div>
		);
	}

	const totalOrders = orders.length;
	const totalSpent = orders.reduce((sum, order) => sum + order.total_amount, 0);
	const cartItems = cart?.items.length || 0;
	const cartTotal = cart?.total_amount || 0;

	return (
		<div>
			{/* Stats Grid */}
			<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
				<StatsCard
					title="Total Orders"
					value={totalOrders}
					icon="📋"
				/>
				<StatsCard
					title="Total Spent"
					value={`${totalSpent.toFixed(2)} INR`}
					icon="💰"
				/>
				<StatsCard
					title="Cart Items"
					value={cartItems}
					icon="🛒"
				/>
				<StatsCard
					title="Cart Total"
					value={`${cartTotal.toFixed(2)} INR`}
					icon="💳"
				/>
			</div>

			{/* Recent Orders */}
			<div className="bg-white shadow rounded-lg">
				<div className="px-4 py-5 sm:p-6">
					<h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
						Recent Orders
					</h3>
					{orders.length === 0 ? (
						<div className="text-center py-8">
							<p className="text-gray-500">No orders yet</p>
							<a
								href="/dashboard/products"
								className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
							>
								Browse Products
							</a>
						</div>
					) : (
						<div className="overflow-hidden">
							<table className="min-w-full divide-y divide-gray-200">
								<thead className="bg-gray-50">
									<tr>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Order ID
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Status
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Total
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Date
										</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200">
									{orders.slice(0, 5).map((order) => (
										<tr key={order.id}>
											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
												{order.id.slice(0, 8)}...
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
													order.status === 'completed' ? 'bg-green-100 text-green-800' :
													order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
													'bg-gray-100 text-gray-800'
												}`}>
													{order.status}
												</span>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
												{order.total_amount.toFixed(2)} INR
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
												{new Date(order.created_at).toLocaleDateString()}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
