import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { UpdateProfileSchema } from '@/app/shared/schemas';

export async function GET() {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Fetch profile from DB
    return NextResponse.json({
        user: {
            fullName: session.user?.name || 'Student Name',
            email: session.user?.email || 'student@example.com',
            avatar: session.user?.image || null,
            joinedAt: '2024-01-01',
            lastLogin: new Date().toISOString()
        }
    });
}

export async function PATCH(req: Request) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const result = UpdateProfileSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
        }

        // TODO: Update profile in DB
        return NextResponse.json({ message: 'Profile updated successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
