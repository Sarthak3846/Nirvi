import { NextRequest, NextResponse } from 'next/server';
import { getAllProducts, createProduct } from '@/repositories/products';

export async function GET() {
	try {
		const products = await getAllProducts();
		return NextResponse.json(products);
	} catch (error) {
		console.error('Error fetching products:', error);
		return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
	}
}

export async function POST(req: NextRequest) {
	try {
		const body = await req.json() as {
			name?: string;
			description?: string;
			price?: number;
			stock?: number;
			category_id?: string;
		};
		const { name, description, price, stock, category_id } = body;

		if (!name || !price || stock === undefined) {
			return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
		}

		const product = await createProduct({
			id: crypto.randomUUID(),
			name,
			description,
			price: Number(price),
			stock: Number(stock),
			category_id
		});

		return NextResponse.json(product, { status: 201 });
	} catch (error) {
		console.error('Error creating product:', error);
		return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
	}
}
