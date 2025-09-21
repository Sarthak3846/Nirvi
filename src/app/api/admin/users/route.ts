import { NextRequest } from 'next/server';
import { getAllUsers, updateUserRole } from '../../../../repositories/users';
import { isUserAdmin, createAdminResponse } from '../../../../lib/admin';

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

		const users = await getAllUsers();
		return Response.json({ users });
	} catch (error) {
		console.error('Error fetching users:', error);
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

		const { targetUserId, role } = await request.json();
		
		if (!targetUserId || !role) {
			return createAdminResponse('Missing required fields: targetUserId, role', 400);
		}

		if (!['user', 'admin'].includes(role)) {
			return createAdminResponse('Invalid role. Must be "user" or "admin"', 400);
		}

		const updatedUser = await updateUserRole(targetUserId, role);
		if (!updatedUser) {
			return createAdminResponse('User not found', 404);
		}

		return Response.json({ user: updatedUser });
	} catch (error) {
		console.error('Error updating user role:', error);
		return createAdminResponse('Internal server error', 500);
	}
}
