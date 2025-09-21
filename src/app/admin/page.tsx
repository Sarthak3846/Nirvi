'use client';

import { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import UsersTab from '../../components/admin/UsersTab';
import OrdersTab from '../../components/admin/OrdersTab';
import ProductsTab from '../../components/admin/ProductsTab';

type TabType = 'users' | 'orders' | 'products';

export default function AdminDashboard() {
	const [activeTab, setActiveTab] = useState<TabType>('users');

	const renderActiveTab = () => {
		switch (activeTab) {
			case 'users':
				return <UsersTab />;
			case 'orders':
				return <OrdersTab />;
			case 'products':
				return <ProductsTab />;
			default:
				return <UsersTab />;
		}
	};

	return (
		<AdminLayout>
			<div className="min-h-screen bg-gray-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<div className="mb-8">
						<h1 className="text-3xl font-light text-gray-900 tracking-wide">
							ADMIN DASHBOARD
						</h1>
						<p className="mt-2 text-gray-600">
							Manage users, orders, and products
						</p>
					</div>

					{/* Tab Navigation */}
					<div className="border-b border-gray-200 mb-8">
						<nav className="-mb-px flex space-x-8">
							<button
								onClick={() => setActiveTab('users')}
								className={`py-4 px-1 border-b-2 font-medium text-sm tracking-wide transition-colors ${
									activeTab === 'users'
										? 'border-black text-black'
										: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
								}`}
							>
								USERS
							</button>
							<button
								onClick={() => setActiveTab('orders')}
								className={`py-4 px-1 border-b-2 font-medium text-sm tracking-wide transition-colors ${
									activeTab === 'orders'
										? 'border-black text-black'
										: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
								}`}
							>
								ORDERS
							</button>
							<button
								onClick={() => setActiveTab('products')}
								className={`py-4 px-1 border-b-2 font-medium text-sm tracking-wide transition-colors ${
									activeTab === 'products'
										? 'border-black text-black'
										: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
								}`}
							>
								PRODUCTS
							</button>
						</nav>
					</div>

					{/* Tab Content */}
					<div className="bg-white rounded-lg shadow-sm">
						{renderActiveTab()}
					</div>
				</div>
			</div>
		</AdminLayout>
	);
}
