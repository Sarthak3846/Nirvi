import { NextRequest } from 'next/server';
import { getAllOrdersWithUserInfo, updateOrderStatus } from '../../../../repositories/orders';
import { isUserAdmin, createAdminResponse } from '../../../../lib/admin';

interface UpdateOrderStatusRequest {
	orderId: string;
	status: string;
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

		const orders = await getAllOrdersWithUserInfo();
		return Response.json({ orders });
	} catch (error) {
		console.error('Error fetching orders:', error);
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

		const { orderId, status } = await request.json() as UpdateOrderStatusRequest;
		
		if (!orderId || !status) {
			return createAdminResponse('Missing required fields: orderId, status', 400);
		}

		const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
		if (!validStatuses.includes(status)) {
			return createAdminResponse(`Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400);
		}

		const updatedOrder = await updateOrderStatus(orderId, status);
		if (!updatedOrder) {
			return createAdminResponse('Order not found', 404);
		}

		return Response.json({ order: updatedOrder });
	} catch (error) {
		console.error('Error updating order status:', error);
		return createAdminResponse('Internal server error', 500);
	}
}
