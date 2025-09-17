import { NextRequest, NextResponse } from 'next/server';
import { getActiveCartByUserId, createActiveCart, addItemToCart } from '@/repositories/carts';

export async function POST(req: NextRequest) {
	try {
		const userId = req.headers.get('x-user-id');
		if (!userId) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const body = await req.json();
		const { product_id, quantity } = body;

		if (!product_id || !quantity || quantity <= 0) {
			return NextResponse.json({ error: 'Invalid product_id or quantity' }, { status: 400 });
		}

		// Get or create active cart
		let cart = await getActiveCartByUserId(userId);
		if (!cart) {
			await createActiveCart(userId);
			cart = await getActiveCartByUserId(userId);
		}

		if (!cart) {
			return NextResponse.json({ error: 'Failed to create cart' }, { status: 500 });
		}

		const cartItem = await addItemToCart(cart.id, product_id, quantity);
		
		// Return updated cart
		const updatedCart = await getActiveCartByUserId(userId);
		return NextResponse.json(updatedCart);
	} catch (error) {
		console.error('Error adding item to cart:', error);
		return NextResponse.json({ error: 'Failed to add item to cart' }, { status: 500 });
	}
}
