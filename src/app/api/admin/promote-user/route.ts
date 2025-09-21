import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail, updateUserRole } from '../../../../repositories/users';

interface PromoteUserRequest {
	email: string;
}

export async function POST(request: NextRequest) {
	try {
		const { email } = await request.json() as PromoteUserRequest;
		
		if (!email) {
			return NextResponse.json({ error: 'Email is required' }, { status: 400 });
		}

		// Find the user
		const user = await findUserByEmail(email);
		if (!user) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 });
		}

		// Update user role to admin
		const updatedUser = await updateUserRole(user.id, 'admin');
		if (!updatedUser) {
			return NextResponse.json({ error: 'Failed to update user role' }, { status: 500 });
		}

		return NextResponse.json({
			message: 'User promoted to admin successfully',
			user: {
				id: updatedUser.id,
				email: updatedUser.email,
				name: updatedUser.name,
				role: updatedUser.role
			}
		}, { status: 200 });
	} catch (error) {
		console.error('Error promoting user to admin:', error);
		return NextResponse.json({ error: 'Failed to promote user to admin' }, { status: 500 });
	}
}
