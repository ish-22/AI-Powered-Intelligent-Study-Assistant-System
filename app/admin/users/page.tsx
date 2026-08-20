"use client";

import { useEffect, useState } from "react";
import { Users, Search, UserCheck, UserX, Trash2, GraduationCap } from "lucide-react";
import { mockAdminUsers } from "@/lib/mock-data";

interface TeacherOption {
    id: string;
    full_name: string;
    email: string;
}

interface AdminUser {
    id: string;
    full_name: string;
    email: string;
    created_at: string;
    last_login_date: string | null;
    role: string;
    status?: string;
    quizzes?: number;
    documents?: number;
    assigned_teacher_id?: string | null;
    assigned_teacher?: string | null;
}

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
            <div className="h-6 w-16 rounded-full bg-muted" />
        </div>
    );
}

const FALLBACK: AdminUser[] = mockAdminUsers.map((u) => ({
    id: u.id,
    full_name: u.name,
    email: u.email,
    created_at: u.joinDate,
    last_login_date: u.status === "active" ? u.lastActive : null,
    role: u.role,
    status: u.status,
    quizzes: u.quizzes,
    documents: u.documents,
}));

export default function AdminUsersPage() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [teachers, setTeachers] = useState<TeacherOption[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchUsers = () => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
        const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;
        fetch(`${API_URL}/admin/users`, {
            headers: token ? { Authorization: `Bearer ${token}`, Accept: "application/json" } : {},
        })
            .then((r) => r.json())
            .then((d) => {
                setUsers(d.users?.length ? d.users : FALLBACK);
                if (d.teachers) setTeachers(d.teachers);
            })
            .catch(() => setUsers(FALLBACK))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filtered = users.filter(
        (u) =>
            u.full_name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase()),
    );

    function handleDelete(id: string) {
        if (!confirm("Remove this user from the list?")) return;
        setUsers((prev) => prev.filter((u) => u.id !== id));
    }

    const handleAssignTeacher = async (studentId: string, teacherId: string) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
        const token = localStorage.getItem("adminToken");
        try {
            const res = await fetch(`${API_URL}/admin/users/${studentId}/assign-teacher`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({ teacher_id: teacherId || null }),
            });
            if (res.ok) {
                const data = await res.json();
                setUsers((prev) =>
                    prev.map((u) =>
                        u.id === studentId
                            ? {
                                ...u,
                                assigned_teacher_id: teacherId || null,
                                assigned_teacher: data.assigned_teacher,
                            }
                            : u
                    )
                );
            }
        } catch (e) {
            console.error("Failed to assign teacher:", e);
        }
    };

    return (
        <div className="grid gap-5">
            <header className="overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/8 via-card to-card p-5 md:p-6">
                <div className="flex items-start gap-3">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-sm">
                        <Users size={22} />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">User & Teacher Management</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {loading ? "Loading users…" : `${filtered.length.toLocaleString()} registered account${filtered.length === 1 ? "" : "s"}`}
                        </p>
                    </div>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {[
                        { icon: <Users size={16} />, label: "Total Accounts", value: users.length, tone: "bg-primary/10 text-primary" },
                        { icon: <UserCheck size={16} />, label: "Active", value: users.filter((u) => u.status === "active" || u.last_login_date).length, tone: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
                        { icon: <UserX size={16} />, label: "Teachers", value: users.filter((u) => u.role === "teacher").length, tone: "bg-purple-500/10 text-purple-600 dark:text-purple-400" },
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
                <div className="grid grid-cols-[1fr_120px_180px_60px_60px_auto] gap-4 border-b border-border bg-muted/30 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    <span>User</span>
                    <span className="text-center">Role / Approval</span>
                    <span className="text-left">Assigned Teacher</span>
                    <span className="text-center">Quizzes</span>
                    <span className="text-center">Docs</span>
                    <span className="text-center">Action</span>
                </div>
                <ul role="list" className="divide-y divide-border">
                    {loading ? (
                        Array.from({ length: 5 }).map((_, i) => <li key={i}><RowSkeleton /></li>)
                    ) : filtered.length === 0 ? (
                        <li className="flex flex-col items-center justify-center gap-3 px-4 py-14 text-center">
                            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary"><Users size={26} /></div>
                            <p className="text-sm font-semibold">{search ? "No users match your search" : "No users yet"}</p>
                        </li>
                    ) : (
                        filtered.map((user) => (
                            <li key={user.id} className="grid grid-cols-[1fr_120px_180px_60px_60px_auto] items-center gap-4 px-4 py-3.5 transition hover:bg-primary/[0.02]">
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-xs font-semibold text-primary ring-1 ring-primary/20">
                                        {getInitials(user.full_name)}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold">{user.full_name}</p>
                                        <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                                    </div>
                                </div>

                                {/* Role & Approval column */}
                                <div className="flex flex-col items-center gap-1">
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${user.role === "admin" ? "bg-indigo-500/10 text-indigo-400" :
                                        user.role === "teacher" ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" : "bg-muted text-muted-foreground"
                                        }`}>
                                        {user.role}
                                    </span>
                                    {user.role === "teacher" && (
                                        <button
                                            onClick={async () => {
                                                const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
                                                const token = localStorage.getItem("adminToken");
                                                try {
                                                    const res = await fetch(`${API_URL}/admin/users/${user.id}/approve-teacher`, {
                                                        method: "PATCH",
                                                        headers: {
                                                            Authorization: `Bearer ${token}`,
                                                            Accept: "application/json",
                                                        },
                                                    });
                                                    if (res.ok) {
                                                        const data = await res.json();
                                                        setUsers((prev) =>
                                                            prev.map((u) =>
                                                                u.id === user.id ? { ...u, status: data.is_approved ? "approved" : "pending" } : u
                                                            )
                                                        );
                                                    }
                                                } catch (e) {
                                                    setUsers((prev) =>
                                                        prev.map((u) =>
                                                            u.id === user.id ? { ...u, status: u.status === "approved" ? "pending" : "approved" } : u
                                                        )
                                                    );
                                                }
                                            }}
                                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${user.status === "approved"
                                                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                                                : "bg-amber-500/10 border-amber-500/30 text-amber-400 animate-pulse"
                                                }`}
                                        >
                                            {user.status === "approved" ? "Verified" : "Approve Pending"}
                                        </button>
                                    )}
                                </div>

                                {/* Assigned Teacher Dropdown for Students */}
                                <div>
                                    {user.role === "student" ? (
                                        <div className="relative">
                                            <select
                                                value={user.assigned_teacher_id || ""}
                                                onChange={(e) => handleAssignTeacher(user.id, e.target.value)}
                                                className="w-full text-xs py-1.5 px-2 rounded-lg bg-card border border-border font-medium text-foreground outline-none focus:border-indigo-500 transition-all cursor-pointer"
                                            >
                                                <option value="">Unassigned</option>
                                                {teachers.map((t) => (
                                                    <option key={t.id} value={t.id}>
                                                        {t.full_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    ) : (
                                        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                                            <GraduationCap className="w-3.5 h-3.5 text-purple-400 shrink-0" /> Educator
                                        </span>
                                    )}
                                </div>

                                <span className="text-center text-sm font-semibold text-amber-600 dark:text-amber-400">{user.quizzes ?? "—"}</span>
                                <span className="text-center text-sm font-semibold text-violet-600 dark:text-violet-400">{user.documents ?? "—"}</span>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(user.id)}
                                    className="inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-xs font-medium text-red-600 transition hover:border-red-300 hover:bg-red-50 dark:hover:bg-red-500/10 cursor-pointer"
                                >
                                    <Trash2 size={12} /> Remove
                                </button>
                            </li>
                        ))
                    )}
                </ul>
            </section>
        </div>
    );
}
