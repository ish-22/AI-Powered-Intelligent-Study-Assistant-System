"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, BrainCircuit, Loader2 } from "lucide-react";
import { LoginSchema, LoginInput } from "@/app/shared/schemas";
import { cn } from "@/lib/utils";

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
        resolver: zodResolver(LoginSchema),
    });

    const onSubmit = async (data: LoginInput) => {
        setLoading(true);
        setError("");
        const res = await signIn("credentials", {
            email: data.email,
            password: data.password,
            redirect: false,
        });
        setLoading(false);
        if (res?.error) {
            setError("Invalid email or password. Please try again.");
        } else {
            router.push("/dashboard");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#090914] relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-5%] w-[520px] h-[520px] bg-indigo-600/20 rounded-full blur-[130px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[520px] h-[520px] bg-purple-600/20 rounded-full blur-[130px] pointer-events-none" />

            <div className="relative z-10 w-full max-w-md px-4">
                <div className="flex flex-col items-center mb-8">
                    <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 mb-4">
                        <BrainCircuit className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Welcome back</h1>
                    <p className="text-sm text-zinc-400 mt-1">Sign in to your Study.AI account</p>
                </div>

                <div className="bg-white/15 border border-white/20 backdrop-blur-3xl rounded-[2rem] p-8 shadow-[0_48px_140px_-60px_rgba(15,23,42,0.65)]">
                    {error && (
                        <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                <input
                                    {...register("email")}
                                    type="email"
                                    placeholder="you@example.com"
                                    className={cn(
                                        "w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border text-white placeholder:text-zinc-600 text-sm outline-none transition-all",
                                        "focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20",
                                        errors.email ? "border-red-500/50" : "border-white/10"
                                    )}
                                />
                            </div>
                            {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Password</label>
                                <Link href="/forgot-password" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                <input
                                    {...register("password")}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className={cn(
                                        "w-full pl-10 pr-11 py-3 rounded-xl bg-white/5 border text-white placeholder:text-zinc-600 text-sm outline-none transition-all",
                                        "focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20",
                                        errors.password ? "border-red-500/50" : "border-white/10"
                                    )}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-violet-600 to-purple-700 text-white font-semibold text-sm transition-all shadow-2xl shadow-indigo-700/30 hover:shadow-indigo-600/40 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            {loading ? "Signing in..." : "Sign In"}
                        </button>

                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-px bg-white/10" />
                            <span className="text-xs text-zinc-600">or continue with</span>
                            <div className="flex-1 h-px bg-white/10" />
                        </div>

                        <button
                            type="button"
                            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                            className="w-full py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm font-medium transition-all flex items-center justify-center gap-3 hover:border-white/20"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Continue with Google
                        </button>
                    </form>
                </div>

                <p className="text-center text-sm text-zinc-500 mt-6">
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                        Create one
                    </Link>
                </p>
            </div>
        </div>
    );
}
