'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { useAuth } from '../providers/AuthProvider';

interface AdminLayoutProps {
	children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
	const { user, logout } = useAuth();

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Admin Header */}
			<header className="bg-white shadow-sm border-b">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						<div className="flex items-center space-x-8">
							<Link href="/" className="text-xl font-light tracking-widest text-black">
								NIRVI
							</Link>
							<span className="text-sm text-gray-500 font-medium tracking-wide">
								ADMIN PANEL
							</span>
						</div>

						<div className="flex items-center space-x-4">
							<span className="text-sm text-gray-700">
								Welcome, {user?.name || user?.email}
							</span>
							<button
								onClick={logout}
								className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
							>
								Logout
							</button>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main>{children}</main>
		</div>
	);
}
