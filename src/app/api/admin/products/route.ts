import { NextRequest } from 'next/server';
import { getAllProductsForAdmin, updateProduct, deleteProduct, createProduct, getAllCategories } from '../../../../repositories/products';
import { isUserAdmin, createAdminResponse } from '../../../../lib/admin';

interface CreateProductRequest {
	name: string;
	description?: string;
	price: string;
	stock: string;
	category_id?: string;
}

interface UpdateProductRequest {
	productId: string;
	name?: string;
	description?: string;
	price?: number;
	stock?: number;
	category_id?: string;
	active?: boolean;
}

interface DeleteProductRequest {
	productId: string;
}

export async function GET(request: NextRequest) {
	try {
		const userId = request.headers.get('x-user-id');
		if (!userId) {
			return createAdminResponse('Unauthorized', 401);
		}

		const isAdmin = await isUserAdmin(userId);
		if (!isAdmin) {
			return createAdminResponse('Admin access required');
		}

		const products = await getAllProductsForAdmin();
		const categories = await getAllCategories();
		return Response.json({ products, categories });
	} catch (error) {
		console.error('Error fetching products:', error);
		return createAdminResponse('Internal server error', 500);
	}
}

export async function POST(request: NextRequest) {
	try {
		const userId = request.headers.get('x-user-id');
		if (!userId) {
			return createAdminResponse('Unauthorized', 401);
		}

		const isAdmin = await isUserAdmin(userId);
		if (!isAdmin) {
			return createAdminResponse('Admin access required');
		}

		const { name, description, price, stock, category_id } = await request.json() as CreateProductRequest;
		
		if (!name || !price || !stock) {
			return createAdminResponse('Missing required fields: name, price, stock', 400);
		}

		const parsedPrice = parseFloat(price);
		const parsedStock = parseInt(stock);

		if (isNaN(parsedPrice) || isNaN(parsedStock)) {
			return createAdminResponse('Price and stock must be valid numbers', 400);
		}

		if (parsedPrice < 0 || parsedStock < 0) {
			return createAdminResponse('Price and stock must be non-negative', 400);
		}

		const productId = crypto.randomUUID();
		const newProduct = await createProduct({
			id: productId,
			name,
			description: description || null,
			price: parsedPrice,
			stock: parsedStock,
			category_id: category_id || null
		});

		return Response.json({ product: newProduct });
	} catch (error) {
		console.error('Error creating product:', error);
		return createAdminResponse('Internal server error', 500);
	}
}

export async function PATCH(request: NextRequest) {
	try {
		const userId = request.headers.get('x-user-id');
		if (!userId) {
			return createAdminResponse('Unauthorized', 401);
		}

		const isAdmin = await isUserAdmin(userId);
		if (!isAdmin) {
			return createAdminResponse('Admin access required');
		}

		const { productId, ...updates } = await request.json() as UpdateProductRequest;
		
		if (!productId) {
			return createAdminResponse('Missing required field: productId', 400);
		}

		// Validate numeric fields if provided
		if (updates.price !== undefined && (isNaN(updates.price) || updates.price < 0)) {
			return createAdminResponse('Price must be a non-negative number', 400);
		}
		if (updates.stock !== undefined && (isNaN(updates.stock) || updates.stock < 0)) {
			return createAdminResponse('Stock must be a non-negative number', 400);
		}

		const updatedProduct = await updateProduct(productId, updates);
		if (!updatedProduct) {
			return createAdminResponse('Product not found', 404);
		}

		return Response.json({ product: updatedProduct });
	} catch (error) {
		console.error('Error updating product:', error);
		return createAdminResponse('Internal server error', 500);
	}
}

export async function DELETE(request: NextRequest) {
	try {
		const userId = request.headers.get('x-user-id');
		if (!userId) {
			return createAdminResponse('Unauthorized', 401);
		}

		const isAdmin = await isUserAdmin(userId);
		if (!isAdmin) {
			return createAdminResponse('Admin access required');
		}

		const { productId } = await request.json() as DeleteProductRequest;
		
		if (!productId) {
			return createAdminResponse('Missing required field: productId', 400);
		}

		const success = await deleteProduct(productId);
		if (!success) {
			return createAdminResponse('Product not found', 404);
		}

		return Response.json({ success: true });
	} catch (error) {
		console.error('Error deleting product:', error);
		return createAdminResponse('Internal server error', 500);
	}
}
