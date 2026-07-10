"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { type DashboardOverviewData } from "@/lib/api";
import { fetchDashboardData } from "@/lib/dashboard-cache";

const DEFAULT_OVERVIEW: DashboardOverviewData = {
    weekly_progress: [
        { name: "Mon", sessions: 0 }, { name: "Tue", sessions: 0 },
        { name: "Wed", sessions: 0 }, { name: "Thu", sessions: 0 },
        { name: "Fri", sessions: 0 }, { name: "Sat", sessions: 0 },
        { name: "Sun", sessions: 0 },
    ],
    quiz_trend: [
        { month: "Jan", score: 0 }, { month: "Feb", score: 0 },
        { month: "Mar", score: 0 }, { month: "Apr", score: 0 },
        { month: "May", score: 0 }, { month: "Jun", score: 0 },
    ],
    subject_performance: [
        { subject: "Mathematics", A: 0, fullMark: 100 },
        { subject: "Physics", A: 0, fullMark: 100 },
        { subject: "Chemistry", A: 0, fullMark: 100 },
        { subject: "Biology", A: 0, fullMark: 100 },
        { subject: "Economics", A: 0, fullMark: 100 },
        { subject: "History", A: 0, fullMark: 100 },
    ],
    weak_topics: [], strong_topics: [], study_goals: [],
    recent_activities: [], recommendations: [],
};

export function useDashboardOverview() {
    const { data: session, status } = useSession();
    const [overview, setOverview] = useState<DashboardOverviewData>(DEFAULT_OVERVIEW);
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
            setOverview(DEFAULT_OVERVIEW);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        // Reuses the same in-flight / cached promise as useDashboardStats
        fetchDashboardData(token)
            .then(({ overview: o }) => {
                if (mountedRef.current) {
                    setOverview(o);
                    setLoading(false);
                }
            })
            .catch((err) => {
                if (mountedRef.current) {
                    setError(err instanceof Error ? err.message : "Failed to load overview");
                    setOverview(DEFAULT_OVERVIEW);
                    setLoading(false);
                }
            });
    }, [session?.accessToken, status]);

    return { overview, loading, error };
}
