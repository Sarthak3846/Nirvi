import { NextRequest, NextResponse } from 'next/server';
import { getActiveCartByUserId, createActiveCart } from '@/repositories/carts';

export async function GET(req: NextRequest) {
	try {
		const userId = req.headers.get('x-user-id');
		if (!userId) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		let cart = await getActiveCartByUserId(userId);
		
		// Create cart if it doesn't exist
		if (!cart) {
			await createActiveCart(userId);
			cart = await getActiveCartByUserId(userId);
		}
		
		return NextResponse.json(cart);
	} catch (error) {
		console.error('Error fetching cart:', error);
		return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
	}
}
