import { NextRequest, NextResponse } from 'next/server';
import { getOrdersByUserId, createOrder } from '@/repositories/orders';
import { getActiveCartByUserId, clearCart } from '@/repositories/carts';

export async function GET(req: NextRequest) {
	try {
		const userId = req.headers.get('x-user-id');
		if (!userId) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const orders = await getOrdersByUserId(userId);
		return NextResponse.json(orders);
	} catch (error) {
		console.error('Error fetching orders:', error);
		return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
	}
}

export async function POST(req: NextRequest) {
	try {
		const userId = req.headers.get('x-user-id');
		if (!userId) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const body = await req.json() as { shipping_address_id?: string };
		const { shipping_address_id } = body;

		// Get active cart
		const cart = await getActiveCartByUserId(userId);
		if (!cart || cart.items.length === 0) {
			return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
		}

		// Create order
		const orderId = crypto.randomUUID();
		const order = await createOrder({
			id: orderId,
			user_id: userId,
			status: 'pending',
			total_amount: cart.total_amount,
			shipping_address_id,
			items: cart.items.map(item => ({
				product_id: item.product_id,
				quantity: item.quantity,
				price: item.price_at_addition
			}))
		});

		// Clear cart after successful order creation
		await clearCart(cart.id);

		return NextResponse.json(order, { status: 201 });
	} catch (error) {
		console.error('Error creating order:', error);
		return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
	}
}
