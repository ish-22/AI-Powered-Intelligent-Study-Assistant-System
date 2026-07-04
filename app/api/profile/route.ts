import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { UpdateProfileSchema } from '@/app/shared/schemas';
import { api } from '@/lib/api';

export async function GET() {
    const session = await auth();
    const token = session?.accessToken;

    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const response = await api.profile.get(token);
    return NextResponse.json(response);
}

export async function PATCH(req: Request) {
    const session = await auth();
    const token = session?.accessToken;

    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const result = UpdateProfileSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
        }

        const response = await api.profile.update(token, {
            full_name: result.data.fullName,
            email: result.data.email,
            profile_picture: result.data.profilePicture || undefined,
        });

        return NextResponse.json(response);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json({ message }, { status: 500 });
    }
}
