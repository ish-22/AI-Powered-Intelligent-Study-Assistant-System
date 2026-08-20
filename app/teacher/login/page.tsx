"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn, signOut } from "next-auth/react";
import { GraduationCap, Lock, Mail, Eye, EyeOff, Sparkles, ArrowLeft, Loader2 } from "lucide-react";

export default function TeacherLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // Sign out any active student session first to prevent session mix-up
            await signOut({ redirect: false });

            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            setLoading(false);

            if (res?.error) {
                setError("Invalid teacher credentials. Please verify your email and password.");
                return;
            }

            // Check session role
            const sessionRes = await fetch("/api/auth/session");
            const sessionData = await sessionRes.json();
            const role = sessionData?.user?.role;
            const isApproved = sessionData?.user?.is_approved !== false;

            if (role !== "teacher" && role !== "admin") {
                setError("Access denied. This portal is strictly for verified Educators & Teachers.");
                return;
            }

            if (role === "teacher" && !isApproved) {
                setError("Your Teacher account is pending Admin approval. Please contact the system administrator.");
                return;
            }

            router.push("/teacher");
        } catch {
            setError("Unable to complete sign-in. Please try again.");
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
                    <ArrowLeft size={13} /> Student Sign In
                </button>

                <div className="flex flex-col items-center mb-8">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 mb-4">
                        <GraduationCap size={28} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Teacher Portal</h1>
                    <p className="text-sm text-zinc-400 mt-1">Educator & Instructor Sign In</p>
                </div>

                <div className="bg-white/[0.06] border border-white/10 backdrop-blur-3xl rounded-[2rem] p-8 shadow-[0_48px_140px_-60px_rgba(15,23,42,0.65)]">
                    <div className="flex items-center gap-2 mb-6">
                        <Sparkles size={17} className="text-indigo-400" />
                        <h2 className="text-sm font-semibold text-white">Teacher Login</h2>
                    </div>

                    {error && (
                        <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs leading-relaxed">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Teacher Email</label>
                            <div className="relative">
                                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="teacher@institution.edu"
                                    required
                                    autoComplete="email"
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
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-violet-600 to-purple-700 text-white font-semibold text-sm transition-all shadow-2xl shadow-indigo-700/30 hover:opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            {loading ? "Signing in..." : "Sign In to Teacher Portal"}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-xs text-zinc-500">
                        Need a Teacher Account?{" "}
                        <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-medium">
                            Register as Educator
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
