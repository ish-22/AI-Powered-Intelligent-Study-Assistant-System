"use client";

import { useState } from "react";
import { Shield, Check, Lock } from "lucide-react";

const ROLES = [
    {
        id: "admin",
        name: "Administrator",
        description: "Full access to all platform features and settings.",
        color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
        permissions: ["view_users", "delete_users", "view_documents", "delete_documents", "view_analytics", "manage_roles", "system_settings"],
    },
    {
        id: "moderator",
        name: "Moderator",
        description: "Can view and manage users and content, but cannot change system settings.",
        color: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
        permissions: ["view_users", "view_documents", "delete_documents", "view_analytics"],
    },
    {
        id: "viewer",
        name: "Viewer",
        description: "Read-only access to analytics and user data.",
        color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        permissions: ["view_users", "view_documents", "view_analytics"],
    },
];

const ALL_PERMISSIONS = [
    { id: "view_users", label: "View Users", group: "Users" },
    { id: "delete_users", label: "Delete Users", group: "Users" },
    { id: "view_documents", label: "View Documents", group: "Content" },
    { id: "delete_documents", label: "Delete Documents", group: "Content" },
    { id: "view_analytics", label: "View Analytics", group: "Analytics" },
    { id: "manage_roles", label: "Manage Roles", group: "System" },
    { id: "system_settings", label: "System Settings", group: "System" },
];

export default function AdminRolesPage() {
    const [selected, setSelected] = useState(ROLES[0].id);
    const activeRole = ROLES.find((r) => r.id === selected)!;

    return (
        <div className="grid gap-5">
            <header className="overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/8 via-card to-card p-5 md:p-6">
                <div className="flex items-start gap-3">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-sm">
                        <Shield size={22} />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">Roles & Permissions</h1>
                        <p className="mt-1 text-sm text-muted-foreground">View and manage admin roles and their access levels.</p>
                    </div>
                </div>
            </header>

            <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
                {/* Role list */}
                <div className="space-y-2">
                    {ROLES.map((role) => (
                        <button
                            key={role.id}
                            type="button"
                            onClick={() => setSelected(role.id)}
                            className={`w-full rounded-2xl border p-4 text-left transition ${selected === role.id ? "border-primary/40 bg-primary/5" : "border-border bg-card hover:border-primary/20 hover:bg-primary/[0.02]"}`}
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${role.color}`}>
                                    <Shield size={11} /> {role.name}
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground">{role.description}</p>
                        </button>
                    ))}
                </div>

                {/* Permissions detail */}
                <div className="rounded-2xl border border-border bg-card p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${activeRole.color}`}>
                            <Shield size={13} /> {activeRole.name}
                        </span>
                        <span className="text-xs text-muted-foreground">{activeRole.permissions.length} permissions granted</span>
                    </div>

                    {["Users", "Content", "Analytics", "System"].map((group) => {
                        const perms = ALL_PERMISSIONS.filter((p) => p.group === group);
                        return (
                            <div key={group} className="mb-5">
                                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-2">{group}</p>
                                <ul className="space-y-1.5">
                                    {perms.map((perm) => {
                                        const granted = activeRole.permissions.includes(perm.id);
                                        return (
                                            <li key={perm.id} className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 ${granted ? "border-emerald-200 bg-emerald-50/50 dark:border-emerald-500/20 dark:bg-emerald-500/5" : "border-border bg-muted/20"}`}>
                                                <div className={`grid h-6 w-6 shrink-0 place-items-center rounded-lg ${granted ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : "bg-muted text-muted-foreground"}`}>
                                                    {granted ? <Check size={13} /> : <Lock size={13} />}
                                                </div>
                                                <span className={`text-sm font-medium ${granted ? "text-foreground" : "text-muted-foreground"}`}>{perm.label}</span>
                                                <span className={`ml-auto text-[11px] font-semibold ${granted ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}>
                                                    {granted ? "Granted" : "Denied"}
                                                </span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
