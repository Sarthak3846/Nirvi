'use client';

import { useState, useEffect } from 'react';

interface OrderItem {
	id: string;
	product_id: string;
	quantity: number;
	price: number;
	product_name: string;
}

interface ShippingAddress {
	full_name: string;
	address_line1: string;
	address_line2: string | null;
	city: string;
	state: string | null;
	postal_code: string;
	country: string;
	phone: string | null;
}

interface Order {
	id: string;
	user_id: string;
	status: string;
	total_amount: number;
	shipping_address_id: string | null;
	created_at: string;
	updated_at: string;
	user_name: string | null;
	user_email: string;
	items: OrderItem[];
	shipping_address: ShippingAddress | null;
}

export default function OrdersTab() {
	const [orders, setOrders] = useState<Order[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);
	const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

	useEffect(() => {
		fetchOrders();
	}, []);

	const fetchOrders = async () => {
		try {
			setLoading(true);
			const response = await fetch('/api/admin/orders');
			if (!response.ok) {
				throw new Error('Failed to fetch orders');
			}
			const data = await response.json();
			setOrders(data.orders);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An error occurred');
		} finally {
			setLoading(false);
		}
	};

	const updateOrderStatus = async (orderId: string, newStatus: string) => {
		try {
			setUpdatingOrder(orderId);
			const response = await fetch('/api/admin/orders', {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					orderId,
					status: newStatus,
				}),
			});

			if (!response.ok) {
				throw new Error('Failed to update order status');
			}

			const data = await response.json();
			setOrders(orders.map(order => 
				order.id === orderId ? { ...order, status: data.order.status } : order
			));
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An error occurred');
		} finally {
			setUpdatingOrder(null);
		}
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
		}).format(amount);
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'pending':
				return 'bg-yellow-100 text-yellow-800';
			case 'processing':
				return 'bg-blue-100 text-blue-800';
			case 'shipped':
				return 'bg-purple-100 text-purple-800';
			case 'delivered':
				return 'bg-green-100 text-green-800';
			case 'cancelled':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
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
						onClick={fetchOrders}
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
				<h2 className="text-xl font-light tracking-wide">ORDER MANAGEMENT</h2>
				<p className="text-sm text-gray-500">{orders.length} total orders</p>
			</div>

			<div className="space-y-4">
				{orders.map((order) => (
					<div key={order.id} className="border border-gray-200 rounded-lg">
						<div className="p-4 bg-gray-50 border-b border-gray-200">
							<div className="flex justify-between items-center">
								<div className="flex items-center space-x-4">
									<div>
										<p className="text-sm font-medium text-gray-900">
											Order #{order.id.slice(0, 8)}
										</p>
										<p className="text-sm text-gray-500">
											{order.user_name || order.user_email}
										</p>
									</div>
									<span
										className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
											order.status
										)}`}
									>
										{order.status.toUpperCase()}
									</span>
								</div>
								<div className="flex items-center space-x-4">
									<div className="text-right">
										<p className="text-sm font-medium text-gray-900">
											{formatCurrency(order.total_amount)}
										</p>
										<p className="text-sm text-gray-500">
											{formatDate(order.created_at)}
										</p>
									</div>
									<button
										onClick={() =>
											setExpandedOrder(
												expandedOrder === order.id ? null : order.id
											)
										}
										className="text-sm text-gray-500 hover:text-gray-700"
									>
										{expandedOrder === order.id ? 'Hide' : 'Details'}
									</button>
								</div>
							</div>
						</div>

						{expandedOrder === order.id && (
							<div className="p-4 space-y-4">
								{/* Order Items */}
								<div>
									<h4 className="text-sm font-medium text-gray-900 mb-2">
										Items ({order.items.length})
									</h4>
									<div className="space-y-2">
										{order.items.map((item) => (
											<div
												key={item.id}
												className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
											>
												<div>
													<p className="text-sm font-medium text-gray-900">
														{item.product_name}
													</p>
													<p className="text-sm text-gray-500">
														Quantity: {item.quantity}
													</p>
												</div>
												<p className="text-sm font-medium text-gray-900">
													{formatCurrency(item.price * item.quantity)}
												</p>
											</div>
										))}
									</div>
								</div>

								{/* Shipping Address */}
								{order.shipping_address && (
									<div>
										<h4 className="text-sm font-medium text-gray-900 mb-2">
											Shipping Address
										</h4>
										<div className="text-sm text-gray-600">
											<p>{order.shipping_address.full_name}</p>
											<p>{order.shipping_address.address_line1}</p>
											{order.shipping_address.address_line2 && (
												<p>{order.shipping_address.address_line2}</p>
											)}
											<p>
												{order.shipping_address.city}
												{order.shipping_address.state && `, ${order.shipping_address.state}`}{' '}
												{order.shipping_address.postal_code}
											</p>
											<p>{order.shipping_address.country}</p>
											{order.shipping_address.phone && (
												<p>Phone: {order.shipping_address.phone}</p>
											)}
										</div>
									</div>
								)}

								{/* Status Update */}
								<div className="flex items-center space-x-4 pt-4 border-t border-gray-200">
									<label className="text-sm font-medium text-gray-700">
										Update Status:
									</label>
									<select
										value={order.status}
										onChange={(e) => updateOrderStatus(order.id, e.target.value)}
										disabled={updatingOrder === order.id}
										className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black disabled:opacity-50"
									>
										<option value="pending">Pending</option>
										<option value="processing">Processing</option>
										<option value="shipped">Shipped</option>
										<option value="delivered">Delivered</option>
										<option value="cancelled">Cancelled</option>
									</select>
									{updatingOrder === order.id && (
										<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
									)}
								</div>
							</div>
						)}
					</div>
				))}
			</div>

			{orders.length === 0 && (
				<div className="text-center py-12">
					<p className="text-gray-500">No orders found.</p>
				</div>
			)}
		</div>
	);
}
