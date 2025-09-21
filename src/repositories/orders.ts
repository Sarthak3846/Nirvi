import { getDb } from '../lib/cloudflare';

export type Order = {
	id: string;
	user_id: string;
	status: string;
	total_amount: number;
	shipping_address_id: string | null;
	created_at: string;
	updated_at: string;
};

export type OrderItem = {
	id: string;
	order_id: string;
	product_id: string;
	quantity: number;
	price: number;
};

export type OrderWithItems = Order & {
	items: (OrderItem & {
		product_name: string;
	})[];
	shipping_address: {
		full_name: string;
		address_line1: string;
		address_line2: string | null;
		city: string;
		state: string | null;
		postal_code: string;
		country: string;
		phone: string | null;
	} | null;
};

export async function createOrder(order: {
	id: string;
	user_id: string;
	status: string;
	total_amount: number;
	shipping_address_id?: string | null;
	items: {
		product_id: string;
		quantity: number;
		price: number;
	}[];
}): Promise<Order> {
	const db = getDb();
	
	// Create the order
	await db.prepare(`
		INSERT INTO orders (id, user_id, status, total_amount, shipping_address_id)
		VALUES (?, ?, ?, ?, ?)
	`).bind(
		order.id,
		order.user_id,
		order.status,
		order.total_amount,
		order.shipping_address_id ?? null
	).run();
	
	// Create order items
	for (const item of order.items) {
		const itemId = crypto.randomUUID();
		await db.prepare(`
			INSERT INTO order_items (id, order_id, product_id, quantity, price)
			VALUES (?, ?, ?, ?, ?)
		`).bind(itemId, order.id, item.product_id, item.quantity, item.price).run();
	}
	
	const created = await db.prepare('SELECT * FROM orders WHERE id = ?').bind(order.id).first<Order>();
	if (!created) throw new Error('Failed to create order');
	return created;
}

export async function getOrdersByUserId(userId: string): Promise<OrderWithItems[]> {
	const db = getDb();
	
	// Get orders
	const ordersStmt = db.prepare(`
		SELECT o.*
		FROM orders o
		WHERE o.user_id = ?
		ORDER BY o.created_at DESC
	`);
	const ordersRows = await ordersStmt.bind(userId).all<Order>();
	const orders = ordersRows.results || [];
	
	// Get order items and shipping addresses for each order
	const ordersWithItems: OrderWithItems[] = [];
	
	for (const order of orders) {
		// Get order items
		const itemsStmt = db.prepare(`
			SELECT oi.*, p.name as product_name
			FROM order_items oi
			JOIN products p ON oi.product_id = p.id
			WHERE oi.order_id = ?
			ORDER BY oi.id
		`);
		const itemsRows = await itemsStmt.bind(order.id).all<OrderItem & { product_name: string }>();
		const items = itemsRows.results || [];
		
		// Get shipping address if exists
		let shipping_address = null;
		if (order.shipping_address_id) {
			const addressStmt = db.prepare('SELECT * FROM shipping_addresses WHERE id = ?');
			shipping_address = await addressStmt.bind(order.shipping_address_id).first<{
				full_name: string;
				address_line1: string;
				address_line2: string | null;
				city: string;
				state: string | null;
				postal_code: string;
				country: string;
				phone: string | null;
			}>();
		}
		
		ordersWithItems.push({
			...order,
			items,
			shipping_address
		});
	}
	
	return ordersWithItems;
}

export async function getOrderById(orderId: string): Promise<OrderWithItems | null> {
	const db = getDb();
	
	// Get order
	const orderStmt = db.prepare('SELECT * FROM orders WHERE id = ?');
	const order = await orderStmt.bind(orderId).first<Order>();
	
	if (!order) {
		return null;
	}
	
	// Get order items
	const itemsStmt = db.prepare(`
		SELECT oi.*, p.name as product_name
		FROM order_items oi
		JOIN products p ON oi.product_id = p.id
		WHERE oi.order_id = ?
		ORDER BY oi.id
	`);
	const itemsRows = await itemsStmt.bind(order.id).all<OrderItem & { product_name: string }>();
	const items = itemsRows.results || [];
	
	// Get shipping address if exists
	let shipping_address = null;
	if (order.shipping_address_id) {
		const addressStmt = db.prepare('SELECT * FROM shipping_addresses WHERE id = ?');
		shipping_address = await addressStmt.bind(order.shipping_address_id).first<{
			full_name: string;
			address_line1: string;
			address_line2: string | null;
			city: string;
			state: string | null;
			postal_code: string;
			country: string;
			phone: string | null;
		}>();
	}
	
	return {
		...order,
		items,
		shipping_address
	};
}

export async function updateOrderStatus(orderId: string, status: string): Promise<Order | null> {
	const db = getDb();
	await db.prepare('UPDATE orders SET status = ? WHERE id = ?').bind(status, orderId).run();
	
	const updated = await db.prepare('SELECT * FROM orders WHERE id = ?').bind(orderId).first<Order>();
	return updated ?? null;
}

export type OrderWithUserInfo = OrderWithItems & {
	user_name: string | null;
	user_email: string;
};

export async function getAllOrdersWithUserInfo(): Promise<OrderWithUserInfo[]> {
	const db = getDb();
	
	// Get all orders with user info
	const ordersStmt = db.prepare(`
		SELECT o.*, u.name as user_name, u.email as user_email
		FROM orders o
		JOIN users u ON o.user_id = u.id
		ORDER BY o.created_at DESC
	`);
	const ordersRows = await ordersStmt.all<Order & { user_name: string | null; user_email: string }>();
	const orders = ordersRows.results || [];
	
	// Get order items and shipping addresses for each order
	const ordersWithItems: OrderWithUserInfo[] = [];
	
	for (const order of orders) {
		// Get order items
		const itemsStmt = db.prepare(`
			SELECT oi.*, p.name as product_name
			FROM order_items oi
			JOIN products p ON oi.product_id = p.id
			WHERE oi.order_id = ?
			ORDER BY oi.id
		`);
		const itemsRows = await itemsStmt.bind(order.id).all<OrderItem & { product_name: string }>();
		const items = itemsRows.results || [];
		
		// Get shipping address if exists
		let shipping_address = null;
		if (order.shipping_address_id) {
			const addressStmt = db.prepare('SELECT * FROM shipping_addresses WHERE id = ?');
			shipping_address = await addressStmt.bind(order.shipping_address_id).first<{
				full_name: string;
				address_line1: string;
				address_line2: string | null;
				city: string;
				state: string | null;
				postal_code: string;
				country: string;
				phone: string | null;
			}>();
		}
		
		ordersWithItems.push({
			...order,
			items,
			shipping_address
		});
	}
	
	return ordersWithItems;
}
