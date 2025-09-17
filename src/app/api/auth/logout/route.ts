import { NextRequest, NextResponse } from 'next/server';
import { deleteSession } from '@/lib/session';

export async function POST(req: NextRequest) {
	try {
		const token = req.cookies.get('session_token')?.value;
		
		if (token) {
			await deleteSession(token);
		}
		
		const response = NextResponse.json({ ok: true }, { status: 200 });
		response.cookies.delete('session_token');
		return response;
	} catch (err: unknown) {
		const message = typeof err === 'object' && err !== null && 'message' in err ? String((err as { message?: unknown }).message) : String(err);
		return Response.json({ error: 'internal_error', details: message }, { status: 500 });
	}
}
