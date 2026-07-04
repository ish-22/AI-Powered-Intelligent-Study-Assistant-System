"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, BrainCircuit, Loader2, ArrowLeft, MailCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }
        setLoading(true);
        setError("");
        // Simulate API call — wire to Laravel when password reset endpoint is ready
        await new Promise((r) => setTimeout(r, 1200));
        setLoading(false);
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 w-full max-w-md px-4">
                {/* Logo */}
                <div className="flex flex-col items-center mb-8">
                    <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 mb-4">
                        <BrainCircuit className="w-7 h-7 text-white" />
                    </div>
                </div>

                <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
                    {submitted ? (
                        /* Success state */
                        <div className="flex flex-col items-center text-center gap-4 py-4">
                            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                                <MailCheck className="w-8 h-8 text-indigo-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Check your inbox</h2>
                                <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
                                    If an account exists for <span className="text-white font-medium">{email}</span>, we&apos;ve sent password reset instructions.
                                </p>
                            </div>
                            <Link
                                href="/login"
                                className="mt-2 w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm transition-all text-center shadow-lg shadow-indigo-500/25 hover:scale-[1.01]"
                            >
                                Back to Sign In
                            </Link>
                        </div>
                    ) : (
                        /* Form state */
                        <>
                            <div className="mb-6">
                                <h1 className="text-xl font-bold text-white">Forgot your password?</h1>
                                <p className="text-sm text-zinc-400 mt-1.5 leading-relaxed">
                                    No worries. Enter your email and we&apos;ll send you reset instructions.
                                </p>
                            </div>

                            {error && (
                                <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Email address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@example.com"
                                            className={cn(
                                                "w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border text-white placeholder:text-zinc-600 text-sm outline-none transition-all",
                                                "focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20",
                                                error ? "border-red-500/50" : "border-white/10"
                                            )}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {loading ? "Sending..." : "Send Reset Link"}
                                </button>
                            </form>
                        </>
                    )}
                </div>

                <div className="flex justify-center mt-6">
                    <Link href="/login" className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
}
