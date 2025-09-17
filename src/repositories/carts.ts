import { getDb } from '../lib/cloudflare';

export type Cart = {
	id: string;
	user_id: string;
	is_active: number;
	created_at: string;
	updated_at: string;
};

export type CartItem = {
	id: string;
	cart_id: string;
	product_id: string;
	quantity: number;
	price_at_addition: number;
	created_at: string;
};

export type CartWithItems = Cart & {
	items: (CartItem & {
		product_name: string;
		product_price: number;
		product_stock: number;
	})[];
	total_amount: number;
};

export async function getActiveCartByUserId(userId: string): Promise<CartWithItems | null> {
	const db = getDb();
	
	// Get the active cart
	const cartStmt = db.prepare('SELECT * FROM carts WHERE user_id = ? AND is_active = 1');
	const cart = await cartStmt.bind(userId).first<Cart>();
	
	if (!cart) {
		return null;
	}
	
	// Get cart items with product details
	const itemsStmt = db.prepare(`
		SELECT ci.*, p.name as product_name, p.price as product_price, p.stock as product_stock
		FROM cart_items ci
		JOIN products p ON ci.product_id = p.id
		WHERE ci.cart_id = ?
		ORDER BY ci.created_at DESC
	`);
	const itemsRows = await itemsStmt.bind(cart.id).all<CartItem & {
		product_name: string;
		product_price: number;
		product_stock: number;
	}>();
	
	const items = itemsRows.results || [];
	
	// Calculate total amount
	const total_amount = items.reduce((sum, item) => sum + (item.price_at_addition * item.quantity), 0);
	
	return {
		...cart,
		items,
		total_amount
	};
}

export async function createActiveCart(userId: string): Promise<Cart> {
	const db = getDb();
	
	// Deactivate any existing active cart
	await db.prepare('UPDATE carts SET is_active = 0 WHERE user_id = ? AND is_active = 1').bind(userId).run();
	
	// Create new active cart
	const cartId = crypto.randomUUID();
	await db.prepare('INSERT INTO carts (id, user_id, is_active) VALUES (?, ?, 1)').bind(cartId, userId).run();
	
	const created = await db.prepare('SELECT * FROM carts WHERE id = ?').bind(cartId).first<Cart>();
	if (!created) throw new Error('Failed to create cart');
	return created;
}

export async function addItemToCart(cartId: string, productId: string, quantity: number): Promise<CartItem> {
	const db = getDb();
	
	// Get current product price
	const productStmt = db.prepare('SELECT price FROM products WHERE id = ? AND is_active = 1');
	const product = await productStmt.bind(productId).first<{ price: number }>();
	
	if (!product) {
		throw new Error('Product not found or inactive');
	}
	
	// Check if item already exists in cart
	const existingItemStmt = db.prepare('SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?');
	const existingItem = await existingItemStmt.bind(cartId, productId).first<CartItem>();
	
	if (existingItem) {
		// Update quantity
		const newQuantity = existingItem.quantity + quantity;
		await db.prepare('UPDATE cart_items SET quantity = ? WHERE id = ?')
			.bind(newQuantity, existingItem.id).run();
		
		const updated = await db.prepare('SELECT * FROM cart_items WHERE id = ?').bind(existingItem.id).first<CartItem>();
		if (!updated) throw new Error('Failed to update cart item');
		return updated;
	} else {
		// Add new item
		const itemId = crypto.randomUUID();
		await db.prepare(`
			INSERT INTO cart_items (id, cart_id, product_id, quantity, price_at_addition)
			VALUES (?, ?, ?, ?, ?)
		`).bind(itemId, cartId, productId, quantity, product.price).run();
		
		const created = await db.prepare('SELECT * FROM cart_items WHERE id = ?').bind(itemId).first<CartItem>();
		if (!created) throw new Error('Failed to create cart item');
		return created;
	}
}

export async function updateCartItemQuantity(itemId: string, quantity: number): Promise<CartItem | null> {
	const db = getDb();
	
	if (quantity <= 0) {
		// Remove item if quantity is 0 or negative
		await db.prepare('DELETE FROM cart_items WHERE id = ?').bind(itemId).run();
		return null;
	}
	
	await db.prepare('UPDATE cart_items SET quantity = ? WHERE id = ?').bind(quantity, itemId).run();
	
	const updated = await db.prepare('SELECT * FROM cart_items WHERE id = ?').bind(itemId).first<CartItem>();
	return updated ?? null;
}

export async function removeCartItem(itemId: string): Promise<void> {
	const db = getDb();
	await db.prepare('DELETE FROM cart_items WHERE id = ?').bind(itemId).run();
}

export async function clearCart(cartId: string): Promise<void> {
	const db = getDb();
	await db.prepare('DELETE FROM cart_items WHERE cart_id = ?').bind(cartId).run();
}
