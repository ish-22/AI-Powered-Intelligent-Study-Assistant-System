const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

async function request<T>(
    path: string,
    options: RequestInit = {},
    token?: string
): Promise<T> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers,
    });

    const data = await res.json();

    if (!res.ok) {
        const errors = (data?.errors ?? {}) as Record<string, string[]>;
        const message =
            data?.message ||
            Object.values(errors)[0]?.[0] ||
            'Request failed';
        throw new Error(message as string);
    }

    return data as T;
}

export interface AuthUser {
    id: string;
    full_name: string;
    email: string;
    profile_picture: string | null;
    created_at: string;
    last_login_date: string | null;
}

export interface AuthResponse {
    user: AuthUser;
    token: string;
}

export const api = {
    auth: {
        register: (body: {
            full_name: string;
            email: string;
            password: string;
            password_confirmation: string;
        }) => request<AuthResponse>('/auth/register', { method: 'POST', body: JSON.stringify(body) }),

        login: (body: { email: string; password: string }) =>
            request<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify(body) }),

        logout: (token: string) =>
            request<{ message: string }>('/auth/logout', { method: 'POST' }, token),

        me: (token: string) => request<{ user: AuthUser }>('/auth/me', {}, token),
    },

    profile: {
        get: (token: string) => request<{ user: AuthUser }>('/profile', {}, token),

        update: (
            token: string,
            body: { full_name?: string; email?: string; profile_picture?: string }
        ) =>
            request<{ message: string; user: AuthUser }>(
                '/profile',
                { method: 'PATCH', body: JSON.stringify(body) },
                token
            ),

        changePassword: (
            token: string,
            body: { current_password: string; password: string; password_confirmation: string }
        ) =>
            request<{ message: string }>(
                '/profile/password',
                { method: 'POST', body: JSON.stringify(body) },
                token
            ),
    },
};
