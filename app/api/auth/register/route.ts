import { NextResponse } from 'next/server';
import { RegisterSchema } from '@/app/shared/schemas';
import { api } from '@/lib/api';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const result = RegisterSchema.safeParse(body);

        if (!result.success) {
            const flattened = result.error.flatten();

            return NextResponse.json(
                {
                    message: "Validation failed",
                    errors: flattened.fieldErrors,
                    formErrors: flattened.formErrors,
                },
                { status: 400 }
            );
        }

        const { fullName, email, password, confirmPassword } = result.data;

        const response = await api.auth.register({
            full_name: fullName,
            email,
            password,
            password_confirmation: confirmPassword,
        });

        return NextResponse.json(response, { status: 201 });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json({ message }, { status: 500 });
    }
}
