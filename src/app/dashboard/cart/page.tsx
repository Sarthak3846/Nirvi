"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/repositories/users';
import { CartWithItems } from '@/repositories/carts';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

export default function CartPage() {
	const router = useRouter();
	const [user, setUser] = useState<User | null>(null);
	const [cart, setCart] = useState<CartWithItems | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [updating, setUpdating] = useState<string | null>(null);

	useEffect(() => {
		async function fetchData() {
			try {
				const [userRes, cartRes] = await Promise.all([
					fetch('/api/auth/me'),
					fetch('/api/cart')
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

				if (cartRes.ok) {
					const cartData = await cartRes.json() as CartWithItems;
					setCart(cartData);
				} else {
					setError('Failed to load cart');
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

	async function updateQuantity(itemId: string, quantity: number) {
		setUpdating(itemId);
		try {
			const res = await fetch(`/api/cart/items/${itemId}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ quantity })
			});

			if (res.ok) {
				const updatedCart = await res.json();
				setCart(updatedCart);
			} else {
				console.error('Failed to update quantity');
			}
		} catch (error) {
			console.error('Error updating quantity:', error);
		} finally {
			setUpdating(null);
		}
	}

	async function removeItem(itemId: string) {
		setUpdating(itemId);
		try {
			const res = await fetch(`/api/cart/items/${itemId}`, {
				method: 'DELETE'
			});

			if (res.ok) {
				const updatedCart = await res.json();
				setCart(updatedCart);
			} else {
				console.error('Failed to remove item');
			}
		} catch (error) {
			console.error('Error removing item:', error);
		} finally {
			setUpdating(null);
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
					<h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
					<p className="mt-1 text-sm text-gray-500">
						Review your items before checkout.
					</p>
				</div>

				{!cart || cart.items.length === 0 ? (
					<div className="text-center py-12">
						<div className="mx-auto h-12 w-12 text-gray-400">
							<svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 11-4 0v-6m4 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
							</svg>
						</div>
						<h3 className="mt-2 text-sm font-medium text-gray-900">Your cart is empty</h3>
						<p className="mt-1 text-sm text-gray-500">Start shopping to add items to your cart.</p>
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
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						{/* Cart Items */}
						<div className="lg:col-span-2">
							<div className="bg-white shadow rounded-lg">
								<div className="px-4 py-5 sm:p-6">
									<h3 className="text-lg font-medium text-gray-900 mb-4">Cart Items</h3>
									<div className="space-y-4">
										{cart.items.map((item) => (
											<div key={item.id} className="flex items-center space-x-4 py-4 border-b border-gray-200 last:border-b-0">
												<div className="flex-shrink-0">
													<div className="w-12 h-12 bg-blue-500 rounded-md flex items-center justify-center">
														<span className="text-white text-lg">📦</span>
													</div>
												</div>
												<div className="flex-1 min-w-0">
													<h4 className="text-sm font-medium text-gray-900 truncate">
														{item.product_name}
													</h4>
													<p className="text-sm text-gray-500">
														${item.price_at_addition.toFixed(2)} each
													</p>
												</div>
												<div className="flex items-center space-x-2">
													<button
														onClick={() => updateQuantity(item.id, item.quantity - 1)}
														disabled={updating === item.id}
														className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
													>
														<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
														</svg>
													</button>
													<span className="text-sm font-medium text-gray-900 min-w-[2rem] text-center">
														{item.quantity}
													</span>
													<button
														onClick={() => updateQuantity(item.id, item.quantity + 1)}
														disabled={updating === item.id}
														className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
													>
														<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
														</svg>
													</button>
												</div>
												<div className="text-sm font-medium text-gray-900">
													${(item.price_at_addition * item.quantity).toFixed(2)}
												</div>
												<button
													onClick={() => removeItem(item.id)}
													disabled={updating === item.id}
													className="p-1 text-red-400 hover:text-red-600 disabled:opacity-50"
												>
													<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
													</svg>
												</button>
											</div>
										))}
									</div>
								</div>
							</div>
						</div>

						{/* Order Summary */}
						<div className="lg:col-span-1">
							<div className="bg-white shadow rounded-lg">
								<div className="px-4 py-5 sm:p-6">
									<h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
									<div className="space-y-3">
										<div className="flex justify-between text-sm">
											<span className="text-gray-600">Subtotal</span>
											<span className="text-gray-900">${cart.total_amount.toFixed(2)}</span>
										</div>
										<div className="flex justify-between text-sm">
											<span className="text-gray-600">Shipping</span>
											<span className="text-gray-900">$0.00</span>
										</div>
										<div className="flex justify-between text-sm">
											<span className="text-gray-600">Tax</span>
											<span className="text-gray-900">$0.00</span>
										</div>
										<div className="border-t border-gray-200 pt-3">
											<div className="flex justify-between text-base font-medium">
												<span className="text-gray-900">Total</span>
												<span className="text-gray-900">${cart.total_amount.toFixed(2)}</span>
											</div>
										</div>
									</div>
									<div className="mt-6">
										<button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
											Proceed to Checkout
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</DashboardLayout>
	);
}
