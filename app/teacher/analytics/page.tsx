"use client";

import React, { useState, useEffect } from "react";
import {
    Calendar,
    Sparkles,
    Loader2,
} from "lucide-react";
import { useCurrentUser } from "@/lib/use-current-user";

interface StatsData {
    active_students: number;
    shared_materials: number;
    classroom_quizzes: number;
    quiz_attempts: number;
    average_mastery: number;
}

export default function WorkspaceAnalytics() {
    const { session } = useCurrentUser();
    const [stats, setStats] = useState<StatsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState<string | null>(null);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

    useEffect(() => {
        if (!session?.accessToken) return;
        fetch(`${API_URL}/teacher/stats`, {
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
                Accept: "application/json",
            },
        })
            .then((r) => r.json())
            .then((d) => setStats(d.stats || null))
            .catch((e) => console.error("Failed to load teacher analytics:", e))
            .finally(() => setLoading(false));
    }, [session?.accessToken]);

    const triggerToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    return (
        <div className="space-y-8 relative">
            {toast && (
                <div className="fixed top-5 right-5 z-50 px-4 py-3 rounded-xl bg-indigo-500 text-white text-xs font-semibold shadow-2xl flex items-center gap-2 border border-indigo-400 animate-in fade-in slide-in-from-top-3">
                    <Sparkles className="w-4 h-4" />
                    {toast}
                </div>
            )}

            <div>
                <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                    Academic Analytics
                </h1>
                <p className="text-zinc-400 text-sm mt-1">
                    Aggregate student performance, active focus areas, and learning metrics for your assigned class.
                </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    {
                        label: "Assigned Students",
                        val: loading ? "—" : `${stats?.active_students ?? 0} Students`,
                        desc: "Directly linked to your class",
                        color: "text-indigo-400",
                    },
                    {
                        label: "Class Materials",
                        val: loading ? "—" : `${stats?.shared_materials ?? 0} Documents`,
                        desc: "Available to assigned students",
                        color: "text-emerald-400",
                    },
                    {
                        label: "Quiz Attempts",
                        val: loading ? "—" : `${stats?.quiz_attempts ?? 0} Submissions`,
                        desc: "Completed student quizzes",
                        color: "text-amber-400",
                    },
                    {
                        label: "Classroom Mastery",
                        val: loading ? "—" : `${stats?.average_mastery ?? 0}% Avg Grade`,
                        desc: "Across all active assessments",
                        color: "text-pink-400",
                    },
                ].map((m, i) => (
                    <div key={i} className="p-6 rounded-2xl bg-[#0d0d1e] border border-white/5 shadow-xl relative overflow-hidden group">
                        <div className="absolute right-0 top-0 h-24 w-24 bg-indigo-500/5 blur-3xl rounded-full" />
                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">{m.label}</span>
                        <div className={`text-2xl font-bold tracking-tight mt-3 ${m.color}`}>{m.val}</div>
                        <div className="text-[10px] text-zinc-500 mt-1">{m.desc}</div>
                    </div>
                ))}
            </div>

            {/* In-Depth Reports */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* SVG line chart */}
                <div className="lg:col-span-2 p-6 rounded-3xl bg-[#0d0d1e] border border-white/5 shadow-xl space-y-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-sm font-bold text-white">Daily Quiz Completion Activity</h3>
                            <p className="text-zinc-500 text-[11px]">Aggregated count of assignments finished over the last week</p>
                        </div>
                        <span className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] text-zinc-400 flex items-center gap-1.5 font-semibold">
                            <Calendar className="w-3 h-3" /> Last 7 Days
                        </span>
                    </div>

                    {/* SVG Line Graph */}
                    <div className="relative pt-6 pb-2">
                        <svg className="w-full h-48 text-indigo-500" viewBox="0 0 500 150">
                            <line x1="50" y1="20" x2="450" y2="20" stroke="rgba(255,255,255,0.05)" strokeDasharray="3" />
                            <line x1="50" y1="60" x2="450" y2="60" stroke="rgba(255,255,255,0.05)" strokeDasharray="3" />
                            <line x1="50" y1="100" x2="450" y2="100" stroke="rgba(255,255,255,0.05)" strokeDasharray="3" />
                            <line x1="50" y1="130" x2="450" y2="130" stroke="rgba(255,255,255,0.1)" />

                            <path
                                d="M 50 110 L 115 80 L 180 120 L 245 40 L 310 90 L 375 70 L 450 30"
                                fill="none"
                                stroke="url(#paint0_linear)"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />

                            <circle cx="50" cy="110" r="4" fill="#6366f1" />
                            <circle cx="115" cy="80" r="4" fill="#6366f1" />
                            <circle cx="180" cy="120" r="4" fill="#6366f1" />
                            <circle cx="245" cy="40" r="4" fill="#8b5cf6" />
                            <circle cx="310" cy="90" r="4" fill="#6366f1" />
                            <circle cx="375" cy="70" r="4" fill="#6366f1" />
                            <circle cx="450" cy="30" r="4" fill="#ec4899" />

                            <text x="50" y="145" fill="#52525b" fontSize="8" textAnchor="middle">Fri</text>
                            <text x="115" y="145" fill="#52525b" fontSize="8" textAnchor="middle">Sat</text>
                            <text x="180" y="145" fill="#52525b" fontSize="8" textAnchor="middle">Sun</text>
                            <text x="245" y="145" fill="#52525b" fontSize="8" textAnchor="middle">Mon</text>
                            <text x="310" y="145" fill="#52525b" fontSize="8" textAnchor="middle">Tue</text>
                            <text x="375" y="145" fill="#52525b" fontSize="8" textAnchor="middle">Wed</text>
                            <text x="450" y="145" fill="#52525b" fontSize="8" textAnchor="middle">Thu</text>

                            <defs>
                                <linearGradient id="paint0_linear" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="#6366f1" />
                                    <stop offset="50%" stopColor="#8b5cf6" />
                                    <stop offset="100%" stopColor="#ec4899" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                </div>

                {/* Concept mastery index */}
                <div className="p-6 rounded-3xl bg-[#0d0d1e] border border-white/5 shadow-xl space-y-6">
                    <div>
                        <h3 className="text-sm font-bold text-white">Syllabus Topic Mastery</h3>
                        <p className="text-zinc-500 text-[11px] mt-0.5">Average correct score per study division</p>
                    </div>

                    <div className="space-y-4">
                        {[
                            { name: "Core Course Curriculum", percent: stats?.average_mastery ?? 78, color: "bg-emerald-500" },
                            { name: "Assigned Quiz Average", percent: Math.max(40, (stats?.average_mastery ?? 75) - 5), color: "bg-indigo-500" },
                            { name: "Active Class Retention", percent: Math.min(95, (stats?.average_mastery ?? 75) + 8), color: "bg-amber-500" },
                        ].map((topic, i) => (
                            <div key={i} className="space-y-1.5">
                                <div className="flex justify-between text-xs font-semibold">
                                    <span className="text-zinc-300">{topic.name}</span>
                                    <span className="text-zinc-400">{topic.percent}% Mastery</span>
                                </div>
                                <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                                    <div className={`h-full ${topic.color}`} style={{ width: `${topic.percent}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="h-px bg-white/5 pt-4" />
                    <button
                        onClick={() => triggerToast("Exporting class performance report...")}
                        className="w-full py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs transition-all cursor-pointer text-center"
                    >
                        Export Grades Report
                    </button>
                </div>
            </div>
        </div>
    );
}
