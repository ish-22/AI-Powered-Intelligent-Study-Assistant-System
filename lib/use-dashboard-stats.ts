"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { api, type DashboardStats } from "@/lib/api";

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

    useEffect(() => {
        const token = session?.accessToken;

        if (!token) {
            setStats(DEFAULT_STATS);
            setLoading(false);
            return;
        }

        let active = true;
        setLoading(true);
        setError(null);

        api.dashboard
            .getStats(token)
            .then(({ stats: fetchedStats }) => {
                if (active) {
                    setStats(fetchedStats);
                    setError(null);
                }
            })
            .catch((err) => {
                if (active) {
                    console.error("Failed to fetch dashboard stats:", err);
                    setError(err instanceof Error ? err.message : "Failed to load dashboard stats");
                    setStats(DEFAULT_STATS);
                }
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, [session?.accessToken]);

    const updateStats = async (newStats: Partial<DashboardStats>) => {
        const token = session?.accessToken;
        if (!token) throw new Error("No authentication token");

        try {
            const response = await api.dashboard.updateStats(token, newStats);
            setStats(response.stats);
            return response.stats;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to update stats";
            setError(errorMessage);
            throw err;
        }
    };

    return {
        stats,
        loading,
        error,
        updateStats,
    };
}
