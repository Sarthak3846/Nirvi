import { NextRequest, NextResponse } from 'next/server';
import { getProductById, updateProduct } from '@/repositories/products';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;
		const product = await getProductById(id);
		
		if (!product) {
			return NextResponse.json({ error: 'Product not found' }, { status: 404 });
		}
		
		return NextResponse.json(product);
	} catch (error) {
		console.error('Error fetching product:', error);
		return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
	}
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const body = await req.json() as {
			name?: string;
			description?: string;
			price?: number;
			stock?: number;
			category_id?: string;
			is_active?: number;
		};
		const { name, description, price, stock, category_id, is_active } = body;

		const updates: Record<string, unknown> = {};
		if (name !== undefined) updates.name = name;
		if (description !== undefined) updates.description = description;
		if (price !== undefined) updates.price = Number(price);
		if (stock !== undefined) updates.stock = Number(stock);
		if (category_id !== undefined) updates.category_id = category_id;
		if (is_active !== undefined) updates.is_active = Number(is_active);

		const { id } = await params;
		const product = await updateProduct(id, updates);
		
		if (!product) {
			return NextResponse.json({ error: 'Product not found' }, { status: 404 });
		}
		
		return NextResponse.json(product);
	} catch (error) {
		console.error('Error updating product:', error);
		return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
	}
}
