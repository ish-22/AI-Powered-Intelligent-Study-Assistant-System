"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { type DashboardStats } from "@/lib/api";
import { fetchDashboardData, invalidateDashboardCache } from "@/lib/dashboard-cache";

const DEFAULT_STATS: DashboardStats = {
    documents_uploaded: 0,
    summaries_generated: 0,
    quizzes_completed: 0,
    avg_quiz_score: 0,
    study_time_hours: 0,
    learning_streak: 0,
};

export function useDashboardStats() {
    const { data: session, status } = useSession();
    const [stats, setStats] = useState<DashboardStats>(DEFAULT_STATS);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const mountedRef = useRef(true);

    useEffect(() => {
        mountedRef.current = true;
        return () => { mountedRef.current = false; };
    }, []);

    useEffect(() => {
        const token = session?.accessToken;

        if (status === "loading") return;

        if (!token) {
            setStats(DEFAULT_STATS);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        fetchDashboardData(token)
            .then(({ stats: s }) => {
                if (mountedRef.current) {
                    setStats(s);
                    setLoading(false);
                }
            })
            .catch((err) => {
                if (mountedRef.current) {
                    setError(err instanceof Error ? err.message : "Failed to load stats");
                    setStats(DEFAULT_STATS);
                    setLoading(false);
                }
            });
    }, [session?.accessToken, status]);

    const updateStats = async (newStats: Partial<DashboardStats>) => {
        const token = session?.accessToken;
        if (!token) throw new Error("No authentication token");

        const { api } = await import("@/lib/api");
        const response = await api.dashboard.updateStats(token, newStats);
        invalidateDashboardCache();
        setStats(response.stats);
        return response.stats;
    };

    return { stats, loading, error, updateStats };
}

export { invalidateDashboardCache };
