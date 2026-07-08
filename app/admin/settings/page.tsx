"use client";

import { useState } from "react";
import { Settings, Bell, Shield, Database, Globe, Save, RotateCcw, AlertTriangle } from "lucide-react";

interface Toggle {
    id: string;
    label: string;
    description: string;
    value: boolean;
}

export default function AdminSettingsPage() {
    const [saved, setSaved] = useState(false);

    const [platform, setPlatform] = useState({ name: "Study.AI", maxUploadMB: "50", sessionHours: "24" });
    const [toggles, setToggles] = useState<Toggle[]>([
        { id: "registration", label: "Open Registration", description: "Allow new students to register.", value: true },
        { id: "google_auth", label: "Google OAuth", description: "Enable sign-in with Google.", value: true },
        { id: "ai_chat", label: "AI Chat", description: "Enable the AI study assistant chat.", value: true },
        { id: "quiz_gen", label: "Quiz Generation", description: "Allow AI-generated quizzes.", value: true },
        { id: "maintenance", label: "Maintenance Mode", description: "Take the platform offline for maintenance.", value: false },
        { id: "email_verify", label: "Email Verification", description: "Require email verification on signup.", value: false },
    ]);

    function flip(id: string) {
        setToggles((prev) => prev.map((t) => (t.id === id ? { ...t, value: !t.value } : t)));
    }

    function handleSave() {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    }

    const maintenance = toggles.find((t) => t.id === "maintenance")?.value;

    return (
        <div className="grid gap-5 max-w-3xl">
            <header className="overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/8 via-card to-card p-5 md:p-6">
                <div className="flex items-start gap-3">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-sm">
                        <Settings size={22} />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">Settings</h1>
                        <p className="mt-1 text-sm text-muted-foreground">Configure platform behaviour and admin preferences.</p>
                    </div>
                </div>
            </header>

            {maintenance && (
                <div className="flex items-center gap-3 rounded-2xl border border-amber-300/60 bg-amber-50/60 px-4 py-3 dark:border-amber-500/30 dark:bg-amber-500/10">
                    <AlertTriangle size={16} className="shrink-0 text-amber-600 dark:text-amber-400" />
                    <p className="text-sm font-medium text-amber-700 dark:text-amber-400">Maintenance mode is <strong>ON</strong> — the platform is currently offline for students.</p>
                </div>
            )}

            {/* Platform config */}
            <section className="rounded-2xl border border-border bg-card p-5 space-y-4">
                <div className="flex items-center gap-2 mb-1">
                    <Globe size={15} className="text-primary" />
                    <h2 className="text-sm font-semibold">Platform</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                    {[
                        { key: "name", label: "Platform Name", type: "text" },
                        { key: "maxUploadMB", label: "Max Upload (MB)", type: "number" },
                        { key: "sessionHours", label: "Session Timeout (hrs)", type: "number" },
                    ].map(({ key, label, type }) => (
                        <div key={key} className="space-y-1.5">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</label>
                            <input
                                type={type}
                                value={platform[key as keyof typeof platform]}
                                onChange={(e) => setPlatform((p) => ({ ...p, [key]: e.target.value }))}
                                className="w-full rounded-xl border border-border bg-background py-2 px-3 text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition"
                            />
                        </div>
                    ))}
                </div>
            </section>

            {/* Feature toggles */}
            <section className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center gap-2 mb-4">
                    <Bell size={15} className="text-primary" />
                    <h2 className="text-sm font-semibold">Feature Toggles</h2>
                </div>
                <ul className="space-y-2">
                    {toggles.map((t) => (
                        <li key={t.id} className="flex items-center justify-between rounded-xl border border-border bg-muted/20 px-4 py-3">
                            <div>
                                <p className="text-sm font-medium">{t.label}</p>
                                <p className="text-xs text-muted-foreground">{t.description}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => flip(t.id)}
                                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none ${t.value ? "bg-primary" : "bg-muted"}`}
                                role="switch"
                                aria-checked={t.value}
                            >
                                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform ${t.value ? "translate-x-5" : "translate-x-0"}`} />
                            </button>
                        </li>
                    ))}
                </ul>
            </section>

            {/* Admin account */}
            <section className="rounded-2xl border border-border bg-card p-5 space-y-4">
                <div className="flex items-center gap-2 mb-1">
                    <Shield size={15} className="text-primary" />
                    <h2 className="text-sm font-semibold">Admin Account</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Username</label>
                        <input disabled value="admin" className="w-full rounded-xl border border-border bg-muted/40 py-2 px-3 text-sm text-muted-foreground cursor-not-allowed" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">New Password</label>
                        <input type="password" placeholder="Leave blank to keep current" className="w-full rounded-xl border border-border bg-background py-2 px-3 text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition" />
                    </div>
                </div>
            </section>

            {/* Database info */}
            <section className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center gap-2 mb-4">
                    <Database size={15} className="text-primary" />
                    <h2 className="text-sm font-semibold">System Info</h2>
                </div>
                <ul className="space-y-2">
                    {[
                        { label: "Framework", value: "Next.js 15 (App Router)" },
                        { label: "Auth", value: "Auth.js v5 (JWT)" },
                        { label: "Database", value: "PostgreSQL (Supabase)" },
                        { label: "AI Backend", value: "FastAPI / Python" },
                        { label: "Version", value: "1.0.0" },
                    ].map((row) => (
                        <li key={row.label} className="flex items-center justify-between rounded-xl border border-border bg-muted/20 px-3 py-2">
                            <span className="text-xs text-muted-foreground">{row.label}</span>
                            <span className="text-xs font-semibold font-mono">{row.value}</span>
                        </li>
                    ))}
                </ul>
            </section>

            {/* Actions */}
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={handleSave}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
                >
                    <Save size={15} />
                    {saved ? "Saved!" : "Save Changes"}
                </button>
                <button
                    type="button"
                    onClick={() => setPlatform({ name: "Study.AI", maxUploadMB: "50", sessionHours: "24" })}
                    className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-medium text-muted-foreground transition hover:text-foreground hover:border-primary/30"
                >
                    <RotateCcw size={15} /> Reset
                </button>
            </div>
        </div>
    );
}
