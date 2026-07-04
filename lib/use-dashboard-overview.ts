"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { api, type DashboardOverviewData } from "@/lib/api";

const DEFAULT_OVERVIEW: DashboardOverviewData = {
    weekly_progress: [
        { name: "Mon", sessions: 0 },
        { name: "Tue", sessions: 0 },
        { name: "Wed", sessions: 0 },
        { name: "Thu", sessions: 0 },
        { name: "Fri", sessions: 0 },
        { name: "Sat", sessions: 0 },
        { name: "Sun", sessions: 0 },
    ],
    quiz_trend: [
        { month: "Jan", score: 0 },
        { month: "Feb", score: 0 },
        { month: "Mar", score: 0 },
        { month: "Apr", score: 0 },
        { month: "May", score: 0 },
        { month: "Jun", score: 0 },
    ],
    subject_performance: [
        { subject: "Mathematics", A: 0, fullMark: 100 },
        { subject: "Physics", A: 0, fullMark: 100 },
        { subject: "Chemistry", A: 0, fullMark: 100 },
        { subject: "Biology", A: 0, fullMark: 100 },
        { subject: "Economics", A: 0, fullMark: 100 },
        { subject: "History", A: 0, fullMark: 100 },
    ],
    weak_topics: [],
    strong_topics: [],
    study_goals: [],
    recent_activities: [],
    recommendations: [],
};

export function useDashboardOverview() {
    const { data: session } = useSession();
    const [overview, setOverview] = useState<DashboardOverviewData>(DEFAULT_OVERVIEW);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = session?.accessToken;
        if (!token) {
            setOverview(DEFAULT_OVERVIEW);
            setLoading(false);
            return;
        }

        let active = true;
        setLoading(true);
        setError(null);

        api.dashboard
            .getStats(token)
            .then(({ overview: fetchedOverview }) => {
                if (active) setOverview(fetchedOverview);
            })
            .catch((err) => {
                if (active) {
                    setError(err instanceof Error ? err.message : "Failed to load dashboard overview");
                    setOverview(DEFAULT_OVERVIEW);
                }
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, [session?.accessToken]);

    return { overview, loading, error };
}
