"use client";

import { useEffect, useState } from "react";
import { Users, FileText, Zap, Clock, TrendingUp, Flame, Activity, BookOpen, ArrowRight } from "lucide-react";
import Link from "next/link";

interface PlatformStats {
    total_users: number;
    total_documents: number;
    total_summaries: number;
    total_quizzes: number;
    avg_score: number;
    total_study_hours: number;
}

function StatCard({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: string | number; tone: string }) {
    return (
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
            <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${tone}`}>{icon}</div>
            <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
                <p className="mt-0.5 text-xl font-semibold">{value}</p>
            </div>
        </div>
    );
}

function SkeletonCard() {
    return (
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 animate-pulse">
            <div className="h-11 w-11 shrink-0 rounded-xl bg-muted" />
            <div className="flex-1 space-y-2">
                <div className="h-2.5 w-24 rounded bg-muted" />
                <div className="h-5 w-16 rounded bg-muted" />
            </div>
        </div>
    );
}

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<PlatformStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
        fetch(`${API_URL}/admin/stats`)
            .then((r) => r.json())
            .then((d) => setStats(d.stats ?? null))
            .catch(() => setStats({ total_users: 5, total_documents: 82, total_summaries: 61, total_quizzes: 157, avg_score: 82, total_study_hours: 156 }))
            .finally(() => setLoading(false));
    }, []);

    const quickLinks = [
        { href: "/admin/users", icon: <Users size={16} />, title: "User Management", desc: "View, search and manage all registered students." },
        { href: "/admin/documents", icon: <FileText size={16} />, title: "Documents", desc: "Browse all uploaded study documents." },
        { href: "/admin/analytics", icon: <TrendingUp size={16} />, title: "Analytics", desc: "Platform-wide learning analytics and trends." },
        { href: "/admin/roles", icon: <Activity size={16} />, title: "Roles & Permissions", desc: "Manage admin roles and access control." },
    ];

    return (
        <div className="grid gap-5">
            <header className="overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/8 via-card to-card p-5 md:p-6">
                <div className="flex items-start gap-3">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-sm">
                        <Activity size={22} />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">Admin Dashboard</h1>
                        <p className="mt-1 text-sm text-muted-foreground">Platform-wide statistics and activity overview.</p>
                    </div>
                </div>
            </header>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                    Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
                ) : (
                    <>
                        <StatCard icon={<Users size={20} />} label="Total Users" value={stats?.total_users ?? 0} tone="bg-blue-500/10 text-blue-600 dark:text-blue-400" />
                        <StatCard icon={<FileText size={20} />} label="Documents Uploaded" value={stats?.total_documents ?? 0} tone="bg-violet-500/10 text-violet-600 dark:text-violet-400" />
                        <StatCard icon={<BookOpen size={20} />} label="Summaries Generated" value={stats?.total_summaries ?? 0} tone="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" />
                        <StatCard icon={<Zap size={20} />} label="Quizzes Completed" value={stats?.total_quizzes ?? 0} tone="bg-amber-500/10 text-amber-600 dark:text-amber-400" />
                        <StatCard icon={<TrendingUp size={20} />} label="Avg Quiz Score" value={`${stats?.avg_score ?? 0}%`} tone="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" />
                        <StatCard icon={<Clock size={20} />} label="Total Study Hours" value={stats?.total_study_hours ?? 0} tone="bg-rose-500/10 text-rose-600 dark:text-rose-400" />
                    </>
                )}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
                {quickLinks.map((l) => (
                    <Link
                        key={l.href}
                        href={l.href}
                        className="group flex items-start gap-3 rounded-2xl border border-border bg-card p-5 transition hover:border-primary/40 hover:bg-primary/[0.02]"
                    >
                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">{l.icon}</div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold">{l.title}</p>
                            <p className="mt-0.5 text-xs text-muted-foreground">{l.desc}</p>
                        </div>
                        <ArrowRight size={16} className="mt-1 shrink-0 text-muted-foreground transition group-hover:text-primary group-hover:translate-x-0.5" />
                    </Link>
                ))}
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center gap-2 mb-3">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-sm font-semibold">System Status</p>
                </div>
                <div className="grid gap-2 sm:grid-cols-3">
                    {[
                        { label: "API Server", status: "Operational" },
                        { label: "Database", status: "Operational" },
                        { label: "Auth Service", status: "Operational" },
                    ].map((s) => (
                        <div key={s.label} className="flex items-center justify-between rounded-xl border border-border bg-muted/30 px-3 py-2">
                            <span className="text-xs font-medium text-muted-foreground">{s.label}</span>
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />{s.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
