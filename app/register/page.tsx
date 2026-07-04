"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, User, BrainCircuit, Loader2, CheckCircle2 } from "lucide-react";
import { RegisterSchema, RegisterInput } from "@/app/shared/schemas";
import { cn } from "@/lib/utils";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterInput>({
        resolver: zodResolver(RegisterSchema),
        mode: "onChange",
    });

    const password = watch("password", "");
    const passwordChecks = {
        length: password.length >= 8,
        upper: /[A-Z]/.test(password),
        lower: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
    };

    const onSubmit = async (data: RegisterInput) => {
        setLoading(true);
        setError("");
        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    fullName: data.fullName,
                    email: data.email,
                    password: data.password,
                    confirmPassword: data.confirmPassword,
                    terms: data.terms,
                }),
            });

            const payload = await response.json();

            if (!response.ok) {
                const firstError =
                    payload?.errors &&
                    typeof payload.errors === "object" &&
                    !Array.isArray(payload.errors)
                        ? Object.values(payload.errors as Record<string, string[] | undefined>)
                            .flat()
                            .find(Boolean)
                        : undefined;

                throw new Error(
                    payload?.message ||
                        firstError ||
                        "Registration failed. Please try again."
                );
            }

            setSuccess(true);
            setTimeout(() => router.push("/login"), 2000);
        } catch (err: any) {
            setError(err.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
                <div className="flex flex-col items-center gap-4 text-center px-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                        <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Account created!</h2>
                    <p className="text-zinc-400 text-sm">Redirecting you to login...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] relative overflow-hidden py-10">
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 w-full max-w-md px-4">
                <div className="flex flex-col items-center mb-8">
                    <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 mb-4">
                        <BrainCircuit className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Create your account</h1>
                    <p className="text-sm text-zinc-400 mt-1">Start your AI-powered study journey</p>
                </div>

                <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
                    {error && (
                        <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Full Name */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                <input
                                    {...register("fullName")}
                                    type="text"
                                    placeholder="Your full name"
                                    className={cn(
                                        "w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border text-white placeholder:text-zinc-600 text-sm outline-none transition-all",
                                        "focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20",
                                        errors.fullName ? "border-red-500/50" : "border-white/10"
                                    )}
                                />
                            </div>
                            {errors.fullName && <p className="text-xs text-red-400">{errors.fullName.message}</p>}
                        </div>

                        {/* Email */}
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

                        {/* Password */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Password</label>
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
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors">
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {/* Password strength indicators */}
                            {password.length > 0 && (
                                <div className="grid grid-cols-2 gap-1.5 pt-1">
                                    {[
                                        { label: "8+ characters", ok: passwordChecks.length },
                                        { label: "Uppercase letter", ok: passwordChecks.upper },
                                        { label: "Lowercase letter", ok: passwordChecks.lower },
                                        { label: "Number", ok: passwordChecks.number },
                                    ].map(({ label, ok }) => (
                                        <div key={label} className={cn("flex items-center gap-1.5 text-xs", ok ? "text-emerald-400" : "text-zinc-600")}>
                                            <div className={cn("w-1.5 h-1.5 rounded-full", ok ? "bg-emerald-400" : "bg-zinc-700")} />
                                            {label}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                <input
                                    {...register("confirmPassword")}
                                    type={showConfirm ? "text" : "password"}
                                    placeholder="••••••••"
                                    className={cn(
                                        "w-full pl-10 pr-11 py-3 rounded-xl bg-white/5 border text-white placeholder:text-zinc-600 text-sm outline-none transition-all",
                                        "focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20",
                                        errors.confirmPassword ? "border-red-500/50" : "border-white/10"
                                    )}
                                />
                                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors">
                                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.confirmPassword && <p className="text-xs text-red-400">{errors.confirmPassword.message}</p>}
                        </div>

                        {/* Terms */}
                        <div className="flex items-start gap-3">
                            <input
                                {...register("terms")}
                                type="checkbox"
                                id="terms"
                                className="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/5 accent-indigo-500 cursor-pointer"
                            />
                            <label htmlFor="terms" className="text-xs text-zinc-400 leading-relaxed cursor-pointer">
                                I agree to the{" "}
                                <Link href="/terms" className="text-indigo-400 hover:text-indigo-300 transition-colors">Terms of Service</Link>
                                {" "}and{" "}
                                <Link href="/privacy" className="text-indigo-400 hover:text-indigo-300 transition-colors">Privacy Policy</Link>
                            </label>
                        </div>
                        {errors.terms && <p className="text-xs text-red-400 -mt-3">{errors.terms.message}</p>}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            {loading ? "Creating account..." : "Create Account"}
                        </button>

                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-px bg-white/10" />
                            <span className="text-xs text-zinc-600">or sign up with</span>
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
                    Already have an account?{" "}
                    <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
