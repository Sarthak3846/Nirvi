'use client';

import { useState, useEffect } from 'react';

interface Product {
	id: string;
	name: string;
	description: string | null;
	price: number;
	stock: number;
	category_id: string | null;
	is_active: number;
	created_at: string;
	updated_at: string;
	category_name: string | null;
}

interface Category {
	id: string;
	name: string;
	description: string | null;
	created_at: string;
}

export default function ProductsTab() {
	const [products, setProducts] = useState<Product[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [editingProduct, setEditingProduct] = useState<string | null>(null);
	const [showAddForm, setShowAddForm] = useState(false);
	const [formData, setFormData] = useState({
		name: '',
		description: '',
		price: '',
		stock: '',
		category_id: '',
	});

	useEffect(() => {
		fetchProducts();
	}, []);

	const fetchProducts = async () => {
		try {
			setLoading(true);
			const response = await fetch('/api/admin/products');
			if (!response.ok) {
				throw new Error('Failed to fetch products');
			}
			const data = await response.json();
			setProducts(data.products);
			setCategories(data.categories);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An error occurred');
		} finally {
			setLoading(false);
		}
	};

	const handleAddProduct = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await fetch('/api/admin/products', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					...formData,
					price: parseFloat(formData.price),
					stock: parseInt(formData.stock),
					category_id: formData.category_id || null,
				}),
			});

			if (!response.ok) {
				throw new Error('Failed to create product');
			}

			const data = await response.json();
			setProducts([data.product, ...products]);
			setFormData({ name: '', description: '', price: '', stock: '', category_id: '' });
			setShowAddForm(false);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An error occurred');
		}
	};

	const handleUpdateProduct = async (productId: string, updates: Partial<Product>) => {
		try {
			const response = await fetch('/api/admin/products', {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					productId,
					...updates,
				}),
			});

			if (!response.ok) {
				throw new Error('Failed to update product');
			}

			const data = await response.json();
			setProducts(products.map(product => 
				product.id === productId ? { ...product, ...data.product } : product
			));
			setEditingProduct(null);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An error occurred');
		}
	};

	const handleDeleteProduct = async (productId: string) => {
		if (!confirm('Are you sure you want to delete this product?')) {
			return;
		}

		try {
			const response = await fetch('/api/admin/products', {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ productId }),
			});

			if (!response.ok) {
				throw new Error('Failed to delete product');
			}

			setProducts(products.filter(product => product.id !== productId));
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An error occurred');
		}
	};

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
		}).format(amount);
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
						onClick={fetchProducts}
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
				<h2 className="text-xl font-light tracking-wide">PRODUCT MANAGEMENT</h2>
				<div className="flex items-center space-x-4">
					<p className="text-sm text-gray-500">{products.length} total products</p>
					<button
						onClick={() => setShowAddForm(!showAddForm)}
						className="bg-black text-white px-4 py-2 text-sm font-medium tracking-wide hover:bg-gray-800 transition-colors"
					>
						{showAddForm ? 'CANCEL' : 'ADD PRODUCT'}
					</button>
				</div>
			</div>

			{/* Add Product Form */}
			{showAddForm && (
				<div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
					<h3 className="text-lg font-medium mb-4">Add New Product</h3>
					<form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Name *
							</label>
							<input
								type="text"
								required
								value={formData.name}
								onChange={(e) => setFormData({ ...formData, name: e.target.value })}
								className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Category
							</label>
							<select
								value={formData.category_id}
								onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
								className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
							>
								<option value="">No Category</option>
								{categories.map((category) => (
									<option key={category.id} value={category.id}>
										{category.name}
									</option>
								))}
							</select>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Price *
							</label>
							<input
								type="number"
								step="0.01"
								min="0"
								required
								value={formData.price}
								onChange={(e) => setFormData({ ...formData, price: e.target.value })}
								className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Stock *
							</label>
							<input
								type="number"
								min="0"
								required
								value={formData.stock}
								onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
								className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
							/>
						</div>
						<div className="md:col-span-2">
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Description
							</label>
							<textarea
								rows={3}
								value={formData.description}
								onChange={(e) => setFormData({ ...formData, description: e.target.value })}
								className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
							/>
						</div>
						<div className="md:col-span-2">
							<button
								type="submit"
								className="bg-black text-white px-6 py-2 text-sm font-medium tracking-wide hover:bg-gray-800 transition-colors"
							>
								CREATE PRODUCT
							</button>
						</div>
					</form>
				</div>
			)}

			{/* Products Table */}
			<div className="overflow-x-auto">
				<table className="min-w-full divide-y divide-gray-200">
					<thead className="bg-gray-50">
						<tr>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Product
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Category
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Price
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Stock
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Status
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
						{products.map((product) => (
							<tr key={product.id} className="hover:bg-gray-50">
								<td className="px-6 py-4 whitespace-nowrap">
									<div>
										<div className="text-sm font-medium text-gray-900">
											{product.name}
										</div>
										{product.description && (
											<div className="text-sm text-gray-500 truncate max-w-xs">
												{product.description}
											</div>
										)}
									</div>
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
									{product.category_name || 'No Category'}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
									{formatCurrency(product.price)}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
									{product.stock}
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									<span
										className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
											product.is_active
												? 'bg-green-100 text-green-800'
												: 'bg-red-100 text-red-800'
										}`}
									>
										{product.is_active ? 'ACTIVE' : 'INACTIVE'}
									</span>
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
									{formatDate(product.created_at)}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
									<button
										onClick={() => setEditingProduct(product.id)}
										className="text-indigo-600 hover:text-indigo-900"
									>
										Edit
									</button>
									<button
										onClick={() =>
											handleUpdateProduct(product.id, {
												is_active: product.is_active ? 0 : 1,
											})
										}
										className="text-yellow-600 hover:text-yellow-900"
									>
										{product.is_active ? 'Deactivate' : 'Activate'}
									</button>
									<button
										onClick={() => handleDeleteProduct(product.id)}
										className="text-red-600 hover:text-red-900"
									>
										Delete
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{products.length === 0 && (
				<div className="text-center py-12">
					<p className="text-gray-500">No products found.</p>
				</div>
			)}
		</div>
	);
}
