import { NextRequest, NextResponse } from 'next/server';
import { getShippingAddressesByUserId, createShippingAddress } from '@/repositories/shippingAddresses';

export async function GET(req: NextRequest) {
	try {
		const userId = req.headers.get('x-user-id');
		if (!userId) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const addresses = await getShippingAddressesByUserId(userId);
		return NextResponse.json(addresses);
	} catch (error) {
		console.error('Error fetching shipping addresses:', error);
		return NextResponse.json({ error: 'Failed to fetch shipping addresses' }, { status: 500 });
	}
}

export async function POST(req: NextRequest) {
	try {
		const userId = req.headers.get('x-user-id');
		if (!userId) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const body = await req.json();
		const { full_name, address_line1, address_line2, city, state, postal_code, country, phone, is_default } = body;

		if (!full_name || !address_line1 || !city || !postal_code || !country) {
			return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
		}

		const address = await createShippingAddress({
			id: crypto.randomUUID(),
			user_id: userId,
			full_name,
			address_line1,
			address_line2,
			city,
			state,
			postal_code,
			country,
			phone,
			is_default: Boolean(is_default)
		});

		return NextResponse.json(address, { status: 201 });
	} catch (error) {
		console.error('Error creating shipping address:', error);
		return NextResponse.json({ error: 'Failed to create shipping address' }, { status: 500 });
	}
}
