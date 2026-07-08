"use client";

import { useEffect, useState } from "react";
import { FileText, Search, User } from "lucide-react";
import { mockAdminUsers, mockDocuments } from "@/lib/mock-data";

interface DocUser {
    id: string;
    full_name: string;
    email: string;
    documents_uploaded: number;
    summaries_generated: number;
    created_at: string;
}

const FALLBACK: DocUser[] = mockAdminUsers.map((u) => ({
    id: u.id,
    full_name: u.name,
    email: u.email,
    documents_uploaded: u.documents,
    summaries_generated: Math.floor(u.documents * 0.75),
    created_at: u.joinDate,
}));

function getInitials(name: string) {
    return name.trim().split(/\s+/).filter(Boolean).map((p) => p[0]?.toUpperCase() ?? "").join("").slice(0, 2) || "?";
}

function RowSkeleton() {
    return (
        <div className="flex animate-pulse items-center gap-3 px-4 py-4">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-muted" />
            <div className="flex-1 space-y-2">
                <div className="h-3 w-1/3 rounded bg-muted" />
                <div className="h-2.5 w-1/2 rounded bg-muted" />
            </div>
            <div className="h-6 w-10 rounded bg-muted" />
            <div className="h-6 w-10 rounded bg-muted" />
        </div>
    );
}

export default function AdminDocumentsPage() {
    const [users, setUsers] = useState<DocUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
        const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;
        fetch(`${API_URL}/admin/documents`, {
            headers: token ? { Authorization: `Bearer ${token}`, Accept: "application/json" } : {},
        })
            .then((r) => r.json())
            .then((d) => setUsers(d.users?.length ? d.users : FALLBACK))
            .catch(() => setUsers(FALLBACK))
            .finally(() => setLoading(false));
    }, []);

    const filtered = users.filter(
        (u) =>
            u.full_name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase()),
    );

    const totalDocs = users.reduce((s, u) => s + u.documents_uploaded, 0);
    const totalSummaries = users.reduce((s, u) => s + u.summaries_generated, 0);

    return (
        <div className="grid gap-5">
            <header className="overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/8 via-card to-card p-5 md:p-6">
                <div className="flex items-start gap-3">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-sm">
                        <FileText size={22} />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">Documents</h1>
                        <p className="mt-1 text-sm text-muted-foreground">All uploaded documents and generated summaries per user.</p>
                    </div>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {[
                        { icon: <User size={16} />, label: "Users with docs", value: users.filter((u) => u.documents_uploaded > 0).length, tone: "bg-primary/10 text-primary" },
                        { icon: <FileText size={16} />, label: "Total Documents", value: totalDocs, tone: "bg-violet-500/10 text-violet-600 dark:text-violet-400" },
                        { icon: <FileText size={16} />, label: "Total Summaries", value: totalSummaries, tone: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" },
                    ].map((s) => (
                        <div key={s.label} className="flex items-center gap-3 rounded-xl border border-border bg-card/80 p-3">
                            <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${s.tone}`}>{s.icon}</div>
                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{s.label}</p>
                                <p className="mt-0.5 text-lg font-semibold">{loading ? "—" : s.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </header>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Search by name or email…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-xl border border-border bg-card py-2.5 pl-9 pr-4 text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition"
                />
            </div>

            <section className="overflow-hidden rounded-2xl border border-border bg-card">
                <div className="grid grid-cols-[1fr_auto_auto] gap-4 border-b border-border bg-muted/30 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    <span>User</span>
                    <span className="text-center">Docs</span>
                    <span className="text-center">Summaries</span>
                </div>
                <ul role="list" className="divide-y divide-border">
                    {loading ? (
                        Array.from({ length: 5 }).map((_, i) => <li key={i}><RowSkeleton /></li>)
                    ) : filtered.length === 0 ? (
                        <li className="flex flex-col items-center justify-center gap-3 px-4 py-14 text-center">
                            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary"><FileText size={26} /></div>
                            <p className="text-sm font-semibold">{search ? "No users match your search" : "No data yet"}</p>
                        </li>
                    ) : (
                        filtered.map((user) => (
                            <li key={user.id} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 px-4 py-3.5 transition hover:bg-primary/[0.02]">
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-xs font-semibold text-primary ring-1 ring-primary/20">
                                        {getInitials(user.full_name)}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold">{user.full_name}</p>
                                        <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                                    </div>
                                </div>
                                <span className="text-center text-sm font-semibold text-violet-600 dark:text-violet-400">{user.documents_uploaded}</span>
                                <span className="text-center text-sm font-semibold text-indigo-600 dark:text-indigo-400">{user.summaries_generated}</span>
                            </li>
                        ))
                    )}
                </ul>
            </section>
        </div>
    );
}
