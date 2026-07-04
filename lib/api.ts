const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

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
        credentials: 'include',
    });

    const text = await res.text();
    let data: any = null;

    try {
        data = text ? JSON.parse(text) : null;
    } catch {
        data = { message: text || 'Request failed' };
    }

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

export interface DashboardStats {
    documents_uploaded: number;
    summaries_generated: number;
    quizzes_completed: number;
    avg_quiz_score: number;
    study_time_hours: number;
    learning_streak: number;
}

export interface DashboardOverviewData {
    weekly_progress: Array<{ name: string; sessions: number }>;
    quiz_trend: Array<{ month: string; score: number }>;
    subject_performance: Array<{ subject: string; A: number; fullMark: number }>;
    weak_topics: Array<{ name: string; score: number }>;
    strong_topics: Array<{ name: string; score: number }>;
    study_goals: Array<{ id: number; title: string; progress: number; date: string }>;
    recent_activities: Array<{ id: number; type: string; title: string; status: string; score?: string; time: string }>;
    recommendations: Array<{ id: number; title: string; reason: string; urgency: string }>;
}

export interface DashboardStatsResponse {
    stats: DashboardStats;
    overview: DashboardOverviewData;
    user: {
        id: string;
        full_name: string;
        email: string;
    };
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

    dashboard: {
        getStats: (token: string) =>
            request<DashboardStatsResponse>('/dashboard/stats', {}, token),

        updateStats: (
            token: string,
            body: Partial<DashboardStats>
        ) =>
            request<{ message: string; stats: DashboardStats }>(
                '/dashboard/stats',
                { method: 'PATCH', body: JSON.stringify(body) },
                token
            ),
    },
};
