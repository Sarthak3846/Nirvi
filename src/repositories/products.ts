import { getDb } from '../lib/cloudflare';

export type Product = {
	id: string;
	name: string;
	description: string | null;
	price: number;
	stock: number;
	category_id: string | null;
	is_active: number;
	created_at: string;
	updated_at: string;
};

export type ProductCategory = {
	id: string;
	name: string;
	description: string | null;
	created_at: string;
};

export type ProductWithCategory = Product & {
	category_name: string | null;
};

export async function getAllProducts(): Promise<ProductWithCategory[]> {
	const db = getDb();
	const stmt = db.prepare(`
		SELECT p.*, pc.name as category_name
		FROM products p
		LEFT JOIN product_categories pc ON p.category_id = pc.id
		WHERE p.is_active = 1
		ORDER BY p.created_at DESC
	`);
	const rows = await stmt.all<ProductWithCategory>();
	return rows.results || [];
}

export async function getProductById(id: string): Promise<ProductWithCategory | null> {
	const db = getDb();
	const stmt = db.prepare(`
		SELECT p.*, pc.name as category_name
		FROM products p
		LEFT JOIN product_categories pc ON p.category_id = pc.id
		WHERE p.id = ? AND p.is_active = 1
	`);
	const row = await stmt.bind(id).first<ProductWithCategory>();
	return row ?? null;
}

export async function getProductsByCategory(categoryId: string): Promise<ProductWithCategory[]> {
	const db = getDb();
	const stmt = db.prepare(`
		SELECT p.*, pc.name as category_name
		FROM products p
		LEFT JOIN product_categories pc ON p.category_id = pc.id
		WHERE p.category_id = ? AND p.is_active = 1
		ORDER BY p.created_at DESC
	`);
	const rows = await stmt.bind(categoryId).all<ProductWithCategory>();
	return rows.results || [];
}

export async function createProduct(product: {
	id: string;
	name: string;
	description?: string | null;
	price: number;
	stock: number;
	category_id?: string | null;
}): Promise<Product> {
	const db = getDb();
	await db.prepare(`
		INSERT INTO products (id, name, description, price, stock, category_id)
		VALUES (?, ?, ?, ?, ?, ?)
	`).bind(
		product.id,
		product.name,
		product.description ?? null,
		product.price,
		product.stock,
		product.category_id ?? null
	).run();

	const created = await db.prepare('SELECT * FROM products WHERE id = ?').bind(product.id).first<Product>();
	if (!created) throw new Error('Failed to create product');
	return created;
}

export async function updateProduct(id: string, updates: {
	name?: string;
	description?: string | null;
	price?: number;
	stock?: number;
	category_id?: string | null;
	is_active?: number;
}): Promise<Product | null> {
	const db = getDb();
	
	// Build dynamic update query
	const fields = [];
	const values = [];
	
	if (updates.name !== undefined) {
		fields.push('name = ?');
		values.push(updates.name);
	}
	if (updates.description !== undefined) {
		fields.push('description = ?');
		values.push(updates.description);
	}
	if (updates.price !== undefined) {
		fields.push('price = ?');
		values.push(updates.price);
	}
	if (updates.stock !== undefined) {
		fields.push('stock = ?');
		values.push(updates.stock);
	}
	if (updates.category_id !== undefined) {
		fields.push('category_id = ?');
		values.push(updates.category_id);
	}
	if (updates.is_active !== undefined) {
		fields.push('is_active = ?');
		values.push(updates.is_active);
	}
	
	if (fields.length === 0) {
		return await getProductById(id);
	}
	
	values.push(id);
	await db.prepare(`UPDATE products SET ${fields.join(', ')} WHERE id = ?`).bind(...values).run();
	
	return await getProductById(id);
}

export async function getAllCategories(): Promise<ProductCategory[]> {
	const db = getDb();
	const stmt = db.prepare('SELECT * FROM product_categories ORDER BY name');
	const rows = await stmt.all<ProductCategory>();
	return rows.results || [];
}

export async function createCategory(category: {
	id: string;
	name: string;
	description?: string | null;
}): Promise<ProductCategory> {
	const db = getDb();
	await db.prepare(`
		INSERT INTO product_categories (id, name, description)
		VALUES (?, ?, ?)
	`).bind(category.id, category.name, category.description ?? null).run();

	const created = await db.prepare('SELECT * FROM product_categories WHERE id = ?').bind(category.id).first<ProductCategory>();
	if (!created) throw new Error('Failed to create category');
	return created;
}

export async function getAllProductsForAdmin(): Promise<ProductWithCategory[]> {
	const db = getDb();
	const stmt = db.prepare(`
		SELECT p.*, pc.name as category_name
		FROM products p
		LEFT JOIN product_categories pc ON p.category_id = pc.id
		ORDER BY p.created_at DESC
	`);
	const rows = await stmt.all<ProductWithCategory>();
	return rows.results || [];
}

export async function deleteProduct(id: string): Promise<boolean> {
	const db = getDb();
	const result = await db.prepare('UPDATE products SET is_active = 0 WHERE id = ?').bind(id).run();
	return result.success;
}
