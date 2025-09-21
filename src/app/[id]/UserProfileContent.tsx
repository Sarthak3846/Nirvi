"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/content/Header';
import Footer from '@/components/content/Footer';
import { Button } from '@/components/ui/button';
import { Package, Heart, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';

interface UserProfileContentProps {
  userId: string;
}

export default function UserProfileContent({ userId }: UserProfileContentProps) {
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/');
        return;
      }
      
      // Redirect admins to admin panel instead of user profile
      if (user.role === 'admin') {
        router.push('/admin');
        return;
      }
      
      // Check if the user ID matches the URL parameter
      if (user.id !== userId) {
        router.push('/');
        return;
      }
    }
  }, [user, authLoading, router, userId]);

  async function handleLogout() {
    try {
      await logout();
      router.push('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const tabs = [
    { id: 'orders', label: 'ORDERS', icon: Package },
    { id: 'wishlist', label: 'WISHLIST', icon: Heart },
    { id: 'settings', label: 'SETTINGS', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="pt-16">
        {/* Profile Header */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 border-b border-gray-200">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <div>
                <h1 className="text-3xl font-light tracking-widest text-black mb-2">
                  WELCOME BACK
                </h1>
                <p className="text-gray-600 text-lg">
                  {user.name || user.email}
                </p>
              </div>
              
              <Button
                onClick={handleLogout}
                variant="outline"
                className="mt-4 sm:mt-0 border-black text-black hover:bg-black hover:text-white"
              >
                <LogOut className="h-4 w-4 mr-2" />
                SIGN OUT
              </Button>
            </div>
          </div>
        </section>

        {/* Navigation Tabs */}
        <section className="px-4 sm:px-6 lg:px-8 border-b border-gray-200">
          <div className="max-w-7xl mx-auto">
            <nav className="flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 text-sm font-medium tracking-widest border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-black text-black'
                        : 'border-transparent text-gray-500 hover:text-black'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </section>

        {/* Content */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'orders' && (
              <div className="text-center py-12">
                <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-light tracking-wide mb-2">NO ORDERS YET</h3>
                <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
                <Button
                  onClick={() => router.push('/')}
                  className="bg-black text-white px-8 py-3 text-sm font-medium tracking-widest hover:bg-gray-800"
                >
                  START SHOPPING
                </Button>
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="text-center py-12">
                <Heart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-light tracking-wide mb-2">NO ITEMS IN WISHLIST</h3>
                <p className="text-gray-600 mb-6">Save your favorite items to see them here</p>
                <Button
                  onClick={() => router.push('/')}
                  className="bg-black text-white px-8 py-3 text-sm font-medium tracking-widest hover:bg-gray-800"
                >
                  EXPLORE PRODUCTS
                </Button>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="max-w-2xl">
                <h3 className="text-xl font-light tracking-wide mb-6">ACCOUNT SETTINGS</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      EMAIL
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full px-4 py-3 border border-gray-300 bg-gray-50 text-gray-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      FULL NAME
                    </label>
                    <input
                      type="text"
                      value={user.name || ''}
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black"
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <Button className="bg-black text-white px-8 py-3 text-sm font-medium tracking-widest hover:bg-gray-800">
                    SAVE CHANGES
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
