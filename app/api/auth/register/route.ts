import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { RegisterSchema } from '@/app/shared/schemas';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const result = RegisterSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
        }

        const { fullName, email, password } = result.data;
        const passwordHash = await bcrypt.hash(password, 10);

        // TODO: DB insertion logic here using 'postgres' or Supabase client
        console.log('Registering user:', { fullName, email, passwordHash });

        return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
