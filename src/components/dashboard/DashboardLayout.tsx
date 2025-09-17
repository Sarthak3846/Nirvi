"use client";
import { useState } from 'react';
import { User } from '@/repositories/users';

interface DashboardLayoutProps {
	children: React.ReactNode;
	user: User;
	onLogout: () => void;
}

export default function DashboardLayout({ children, user, onLogout }: DashboardLayoutProps) {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	const navigation = [
		{ name: 'Dashboard', href: '/dashboard', icon: '🏠' },
		{ name: 'Products', href: '/dashboard/products', icon: '📦' },
		{ name: 'Orders', href: '/dashboard/orders', icon: '📋' },
		{ name: 'Cart', href: '/dashboard/cart', icon: '🛒' },
		{ name: 'Profile', href: '/dashboard/profile', icon: '👤' },
	];

	return (
		<div className="min-h-screen bg-gray-50 flex">
			{/* Mobile sidebar overlay */}
			{sidebarOpen && (
				<div 
					className="fixed inset-0 z-40 lg:hidden"
					onClick={() => setSidebarOpen(false)}
				>
					<div className="fixed inset-0 bg-black bg-opacity-50" />
				</div>
			)}

			{/* Sidebar */}
			<div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
				sidebarOpen ? 'translate-x-0' : '-translate-x-full'
			} lg:block flex-shrink-0`}>
				<div className="flex flex-col h-full">
					{/* Logo */}
					<div className="flex items-center justify-between h-16 px-4 bg-blue-600">
						<h1 className="text-xl font-bold text-white">Nirvi</h1>
						{/* Close button for mobile */}
						<button
							type="button"
							className="p-2 text-white hover:bg-blue-700 rounded-md lg:hidden"
							onClick={() => setSidebarOpen(false)}
						>
							<span className="sr-only">Close sidebar</span>
							<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>

					{/* Navigation */}
					<nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
						{navigation.map((item) => (
							<a
								key={item.name}
								href={item.href}
								className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
								onClick={() => setSidebarOpen(false)} // Close sidebar on mobile when navigating
							>
								<span className="mr-3 text-lg" role="img" aria-label={item.name}>
									{item.icon}
								</span>
								{item.name}
							</a>
						))}
					</nav>

					{/* User info */}
					<div className="p-4 border-t border-gray-200">
						<div className="flex items-center">
							<div className="flex-shrink-0">
								<div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
									<span className="text-sm font-medium text-white">
										{user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
									</span>
								</div>
							</div>
							<div className="ml-3 flex-1 min-w-0">
								<p className="text-sm font-medium text-gray-900 truncate">
									{user.name || 'User'}
								</p>
								<p className="text-xs text-gray-500 truncate">
									{user.email}
								</p>
							</div>
						</div>
						
						{/* Logout button in sidebar (mobile) */}
						<button
							onClick={() => {
								onLogout();
								setSidebarOpen(false);
							}}
							className="w-full mt-3 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-150 lg:hidden"
						>
							Logout
						</button>
					</div>
				</div>
			</div>

			{/* Main content */}
			<div className="flex-1 flex flex-col min-h-screen">
				{/* Top bar */}
				<div className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200">
					<div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
						<div className="flex items-center">
							<button
								type="button"
								className="p-2 text-gray-400 rounded-md hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 lg:hidden"
								onClick={() => setSidebarOpen(true)}
							>
								<span className="sr-only">Open sidebar</span>
								<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
								</svg>
							</button>
							<h2 className="ml-2 text-lg font-semibold text-gray-900 lg:ml-0">Dashboard</h2>
						</div>

						<div className="flex items-center space-x-2 sm:space-x-4">
							{/* Notifications */}
							<button className="p-2 text-gray-400 rounded-md hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-150">
								<span className="sr-only">View notifications</span>
								<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-3-3.5V7a6 6 0 1 0-12 0v6.5L2 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9" />
								</svg>
							</button>

							{/* User avatar (desktop) */}
							<div className="hidden sm:flex items-center">
								<div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-2">
									<span className="text-xs font-medium text-white">
										{user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
									</span>
								</div>
								<span className="text-sm font-medium text-gray-700 hidden md:inline">
									{user.name || user.email.split('@')[0]}
								</span>
							</div>

							{/* Logout (desktop) */}
							<button
								onClick={onLogout}
								className="hidden lg:inline-flex px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-150"
							>
								Logout
							</button>
						</div>
					</div>
				</div>

				{/* Page content */}
				<main className="flex-1">
					<div className="py-6">
						<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
							{children}
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}