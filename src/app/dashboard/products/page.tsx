"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/repositories/users';
import { ProductWithCategory } from '@/repositories/products';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

export default function ProductsPage() {
	const router = useRouter();
	const [user, setUser] = useState<User | null>(null);
	const [products, setProducts] = useState<ProductWithCategory[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchData() {
			try {
				const [userRes, productsRes] = await Promise.all([
					fetch('/api/auth/me'),
					fetch('/api/products')
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

				if (productsRes.ok) {
					const productsData = await productsRes.json() as ProductWithCategory[];
					setProducts(productsData);
				} else {
					setError('Failed to load products');
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
					<h1 className="text-2xl font-bold text-gray-900">Products</h1>
					<p className="mt-1 text-sm text-gray-500">
						Browse and manage our product catalog.
					</p>
				</div>

				{products.length === 0 ? (
					<div className="text-center py-12">
						<div className="mx-auto h-12 w-12 text-gray-400">
							<svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
							</svg>
						</div>
						<h3 className="mt-2 text-sm font-medium text-gray-900">No products</h3>
						<p className="mt-1 text-sm text-gray-500">No products are available at the moment.</p>
					</div>
				) : (
					<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{products.map((product) => (
							<div key={product.id} className="bg-white overflow-hidden shadow rounded-lg">
								<div className="p-5">
									<div className="flex items-center">
										<div className="flex-shrink-0">
											<div className="w-10 h-10 bg-blue-500 rounded-md flex items-center justify-center">
												<span className="text-white text-lg">📦</span>
											</div>
										</div>
										<div className="ml-5 w-0 flex-1">
											<dl>
												<dt className="text-sm font-medium text-gray-500 truncate">
													{product.category_name || 'Uncategorized'}
												</dt>
												<dd className="text-lg font-medium text-gray-900 truncate">
													{product.name}
												</dd>
											</dl>
										</div>
									</div>
									<div className="mt-4">
										<p className="text-sm text-gray-600 line-clamp-2">
											{product.description || 'No description available'}
										</p>
									</div>
									<div className="mt-4 flex items-center justify-between">
										<div className="text-lg font-semibold text-gray-900">
											${product.price.toFixed(2)}
										</div>
										<div className="text-sm text-gray-500">
											Stock: {product.stock}
										</div>
									</div>
									<div className="mt-4">
										<button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
											Add to Cart
										</button>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</DashboardLayout>
	);
}
