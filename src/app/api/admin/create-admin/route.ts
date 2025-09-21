import { NextRequest, NextResponse } from 'next/server';
import { createUser, findUserByEmail } from '../../../../repositories/users';
import { createPasswordAuth } from '../../../../repositories/authProviders';
import { hashPassword } from '../../../../lib/crypto';

export async function POST(request: NextRequest) {
	try {
		const { email, password, name } = await request.json();
		
		if (!email || !password) {
			return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
		}

		// Check if user already exists
		const existingUser = await findUserByEmail(email);
		if (existingUser) {
			return NextResponse.json({ error: 'User already exists' }, { status: 400 });
		}

		// Create admin user
		const userId = crypto.randomUUID();
		const user = await createUser({
			id: userId,
			email,
			name: name || null,
			role: 'admin'
		});

		// Hash password and create auth provider
		const passwordHash = await hashPassword(password);
		await createPasswordAuth(userId, passwordHash);

		return NextResponse.json({
			message: 'Admin user created successfully',
			user: {
				id: user.id,
				email: user.email,
				name: user.name,
				role: user.role
			}
		}, { status: 201 });
	} catch (error) {
		console.error('Error creating admin user:', error);
		return NextResponse.json({ error: 'Failed to create admin user' }, { status: 500 });
	}
}
