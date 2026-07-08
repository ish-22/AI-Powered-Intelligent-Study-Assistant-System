"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, Lock, User, Eye, EyeOff, ShieldCheck, ArrowLeft } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

export default function AdminLoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch(`${API}/admin/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                const msg = data?.errors?.username?.[0] || data?.message || "Invalid credentials.";
                setError(msg);
                return;
            }

            // Store token and user info
            localStorage.setItem("adminAuth", "true");
            localStorage.setItem("adminToken", data.token);
            localStorage.setItem("adminUser", JSON.stringify(data.user));
            router.replace("/admin");
        } catch {
            setError("Cannot connect to server. Make sure the API is running.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#090914] relative overflow-hidden px-4">
            <div className="absolute top-[-10%] left-[-5%] w-[520px] h-[520px] bg-indigo-600/20 rounded-full blur-[130px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[520px] h-[520px] bg-purple-600/20 rounded-full blur-[130px] pointer-events-none" />

            <div className="relative z-10 w-full max-w-sm">
                <button
                    type="button"
                    onClick={() => router.push("/login")}
                    className="mb-6 inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                    <ArrowLeft size={13} /> Back to Student Login
                </button>

                <div className="flex flex-col items-center mb-8">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 mb-4">
                        <GraduationCap size={28} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Study.AI</h1>
                    <p className="text-sm text-zinc-400 mt-1">Admin Control Panel</p>
                </div>

                <div className="bg-white/[0.06] border border-white/10 backdrop-blur-3xl rounded-[2rem] p-8 shadow-[0_48px_140px_-60px_rgba(15,23,42,0.65)]">
                    <div className="flex items-center gap-2 mb-6">
                        <ShieldCheck size={17} className="text-indigo-400" />
                        <h2 className="text-sm font-semibold text-white">Admin Sign In</h2>
                    </div>

                    {error && (
                        <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Username or Email</label>
                            <div className="relative">
                                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="admin"
                                    required
                                    autoComplete="username"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-600 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Password</label>
                            <div className="relative">
                                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    autoComplete="current-password"
                                    className="w-full pl-10 pr-11 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-600 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-violet-600 to-purple-700 text-white font-semibold text-sm transition-all shadow-2xl shadow-indigo-700/30 hover:opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? "Signing in…" : "Sign In to Admin Panel"}
                        </button>
                    </form>

                    <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 space-y-0.5">
                        <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wide mb-1">Credentials</p>
                        <p className="text-xs text-zinc-400">Username: <span className="font-mono font-semibold text-zinc-200">admin</span></p>
                        <p className="text-xs text-zinc-400">Password: <span className="font-mono font-semibold text-zinc-200">admin123</span></p>
                    </div>
                </div>
            </div>
        </div>
    );
}
