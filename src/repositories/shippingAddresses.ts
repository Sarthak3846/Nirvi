import { getDb } from '../lib/cloudflare';

export type ShippingAddress = {
	id: string;
	user_id: string;
	full_name: string;
	address_line1: string;
	address_line2: string | null;
	city: string;
	state: string | null;
	postal_code: string;
	country: string;
	phone: string | null;
	is_default: number;
	created_at: string;
};

export async function getShippingAddressesByUserId(userId: string): Promise<ShippingAddress[]> {
	const db = getDb();
	const stmt = db.prepare(`
		SELECT * FROM shipping_addresses
		WHERE user_id = ?
		ORDER BY is_default DESC, created_at DESC
	`);
	const rows = await stmt.bind(userId).all<ShippingAddress>();
	return rows.results || [];
}

export async function getDefaultShippingAddress(userId: string): Promise<ShippingAddress | null> {
	const db = getDb();
	const stmt = db.prepare(`
		SELECT * FROM shipping_addresses
		WHERE user_id = ? AND is_default = 1
	`);
	const row = await stmt.bind(userId).first<ShippingAddress>();
	return row ?? null;
}

export async function createShippingAddress(address: {
	id: string;
	user_id: string;
	full_name: string;
	address_line1: string;
	address_line2?: string | null;
	city: string;
	state?: string | null;
	postal_code: string;
	country: string;
	phone?: string | null;
	is_default?: boolean;
}): Promise<ShippingAddress> {
	const db = getDb();
	
	// If this is set as default, unset other defaults
	if (address.is_default) {
		await db.prepare('UPDATE shipping_addresses SET is_default = 0 WHERE user_id = ?').bind(address.user_id).run();
	}
	
	await db.prepare(`
		INSERT INTO shipping_addresses (
			id, user_id, full_name, address_line1, address_line2,
			city, state, postal_code, country, phone, is_default
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`).bind(
		address.id,
		address.user_id,
		address.full_name,
		address.address_line1,
		address.address_line2 ?? null,
		address.city,
		address.state ?? null,
		address.postal_code,
		address.country,
		address.phone ?? null,
		address.is_default ? 1 : 0
	).run();

	const created = await db.prepare('SELECT * FROM shipping_addresses WHERE id = ?').bind(address.id).first<ShippingAddress>();
	if (!created) throw new Error('Failed to create shipping address');
	return created;
}

export async function updateShippingAddress(id: string, updates: {
	full_name?: string;
	address_line1?: string;
	address_line2?: string | null;
	city?: string;
	state?: string | null;
	postal_code?: string;
	country?: string;
	phone?: string | null;
	is_default?: boolean;
}): Promise<ShippingAddress | null> {
	const db = getDb();
	
	// If setting as default, unset other defaults
	if (updates.is_default) {
		const currentAddress = await db.prepare('SELECT user_id FROM shipping_addresses WHERE id = ?').bind(id).first<{ user_id: string }>();
		if (currentAddress) {
			await db.prepare('UPDATE shipping_addresses SET is_default = 0 WHERE user_id = ?').bind(currentAddress.user_id).run();
		}
	}
	
	// Build dynamic update query
	const fields = [];
	const values = [];
	
	if (updates.full_name !== undefined) {
		fields.push('full_name = ?');
		values.push(updates.full_name);
	}
	if (updates.address_line1 !== undefined) {
		fields.push('address_line1 = ?');
		values.push(updates.address_line1);
	}
	if (updates.address_line2 !== undefined) {
		fields.push('address_line2 = ?');
		values.push(updates.address_line2);
	}
	if (updates.city !== undefined) {
		fields.push('city = ?');
		values.push(updates.city);
	}
	if (updates.state !== undefined) {
		fields.push('state = ?');
		values.push(updates.state);
	}
	if (updates.postal_code !== undefined) {
		fields.push('postal_code = ?');
		values.push(updates.postal_code);
	}
	if (updates.country !== undefined) {
		fields.push('country = ?');
		values.push(updates.country);
	}
	if (updates.phone !== undefined) {
		fields.push('phone = ?');
		values.push(updates.phone);
	}
	if (updates.is_default !== undefined) {
		fields.push('is_default = ?');
		values.push(updates.is_default ? 1 : 0);
	}
	
	if (fields.length === 0) {
		return await getShippingAddressById(id);
	}
	
	values.push(id);
	await db.prepare(`UPDATE shipping_addresses SET ${fields.join(', ')} WHERE id = ?`).bind(...values).run();
	
	return await getShippingAddressById(id);
}

export async function getShippingAddressById(id: string): Promise<ShippingAddress | null> {
	const db = getDb();
	const stmt = db.prepare('SELECT * FROM shipping_addresses WHERE id = ?');
	const row = await stmt.bind(id).first<ShippingAddress>();
	return row ?? null;
}

export async function deleteShippingAddress(id: string): Promise<void> {
	const db = getDb();
	await db.prepare('DELETE FROM shipping_addresses WHERE id = ?').bind(id).run();
}
