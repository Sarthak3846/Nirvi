import { NextRequest, NextResponse } from 'next/server';
import { updateCartItemQuantity, removeCartItem, getActiveCartByUserId } from '@/repositories/carts';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
	try {
		const userId = req.headers.get('x-user-id');
		if (!userId) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const body = await req.json();
		const { quantity } = body;

		if (quantity === undefined || quantity < 0) {
			return NextResponse.json({ error: 'Invalid quantity' }, { status: 400 });
		}

		const cartItem = await updateCartItemQuantity(params.id, quantity);
		
		// Return updated cart
		const updatedCart = await getActiveCartByUserId(userId);
		return NextResponse.json(updatedCart);
	} catch (error) {
		console.error('Error updating cart item:', error);
		return NextResponse.json({ error: 'Failed to update cart item' }, { status: 500 });
	}
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
	try {
		const userId = req.headers.get('x-user-id');
		if (!userId) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		await removeCartItem(params.id);
		
		// Return updated cart
		const updatedCart = await getActiveCartByUserId(userId);
		return NextResponse.json(updatedCart);
	} catch (error) {
		console.error('Error removing cart item:', error);
		return NextResponse.json({ error: 'Failed to remove cart item' }, { status: 500 });
	}
}
