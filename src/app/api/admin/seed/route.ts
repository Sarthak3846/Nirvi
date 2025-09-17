import { NextRequest, NextResponse } from 'next/server';
import { createCategory, createProduct } from '@/repositories/products';

export async function POST(req: NextRequest) {
	try {
		// Create sample categories
		const categories = [
			{ id: crypto.randomUUID(), name: 'Electronics', description: 'Electronic devices and gadgets' },
			{ id: crypto.randomUUID(), name: 'Clothing', description: 'Fashion and apparel' },
			{ id: crypto.randomUUID(), name: 'Books', description: 'Books and literature' },
			{ id: crypto.randomUUID(), name: 'Home & Garden', description: 'Home improvement and gardening' },
		];

		const createdCategories = [];
		for (const category of categories) {
			const created = await createCategory(category);
			createdCategories.push(created);
		}

		// Create sample products
		const products = [
			{
				id: crypto.randomUUID(),
				name: 'Wireless Bluetooth Headphones',
				description: 'High-quality wireless headphones with noise cancellation',
				price: 99.99,
				stock: 50,
				category_id: createdCategories[0].id
			},
			{
				id: crypto.randomUUID(),
				name: 'Smartphone',
				description: 'Latest model smartphone with advanced features',
				price: 699.99,
				stock: 25,
				category_id: createdCategories[0].id
			},
			{
				id: crypto.randomUUID(),
				name: 'Laptop Computer',
				description: 'High-performance laptop for work and gaming',
				price: 1299.99,
				stock: 15,
				category_id: createdCategories[0].id
			},
			{
				id: crypto.randomUUID(),
				name: 'Cotton T-Shirt',
				description: 'Comfortable cotton t-shirt in various colors',
				price: 19.99,
				stock: 100,
				category_id: createdCategories[1].id
			},
			{
				id: crypto.randomUUID(),
				name: 'Denim Jeans',
				description: 'Classic denim jeans with modern fit',
				price: 49.99,
				stock: 75,
				category_id: createdCategories[1].id
			},
			{
				id: crypto.randomUUID(),
				name: 'Programming Book',
				description: 'Comprehensive guide to modern programming',
				price: 39.99,
				stock: 30,
				category_id: createdCategories[2].id
			},
			{
				id: crypto.randomUUID(),
				name: 'Fiction Novel',
				description: 'Bestselling fiction novel',
				price: 14.99,
				stock: 40,
				category_id: createdCategories[2].id
			},
			{
				id: crypto.randomUUID(),
				name: 'Garden Tools Set',
				description: 'Complete set of gardening tools',
				price: 79.99,
				stock: 20,
				category_id: createdCategories[3].id
			},
			{
				id: crypto.randomUUID(),
				name: 'Indoor Plant Pot',
				description: 'Decorative ceramic plant pot',
				price: 24.99,
				stock: 60,
				category_id: createdCategories[3].id
			},
			{
				id: crypto.randomUUID(),
				name: 'Coffee Maker',
				description: 'Automatic coffee maker with timer',
				price: 89.99,
				stock: 35,
				category_id: createdCategories[3].id
			}
		];

		const createdProducts = [];
		for (const product of products) {
			const created = await createProduct(product);
			createdProducts.push(created);
		}

		return NextResponse.json({
			message: 'Sample data created successfully',
			categories: createdCategories.length,
			products: createdProducts.length
		}, { status: 201 });
	} catch (error) {
		console.error('Error creating sample data:', error);
		return NextResponse.json({ error: 'Failed to create sample data' }, { status: 500 });
	}
}
