"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { BrainCircuit, MailCheck, Loader2, ArrowLeft, RefreshCw, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

function VerifyEmailPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "your email";

    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [error, setError] = useState("");
    const [verified, setVerified] = useState(false);
    const [countdown, setCountdown] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (countdown > 0) {
            const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
            return () => clearTimeout(t);
        } else {
            setCanResend(true);
        }
    }, [countdown]);

    const handleChange = (index: number, value: string) => {
        if (!/^\d?$/.test(value)) return;
        const next = [...code];
        next[index] = value;
        setCode(next);
        setError("");
        if (value && index < 5) inputRefs.current[index + 1]?.focus();
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (pasted.length === 6) {
            setCode(pasted.split(""));
            inputRefs.current[5]?.focus();
        }
    };

    const handleVerify = async () => {
        const fullCode = code.join("");
        if (fullCode.length < 6) {
            setError("Please enter the full 6-digit code.");
            return;
        }
        setLoading(true);
        setError("");
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
            const res = await fetch(`${API_URL}/auth/verify-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify({ email, otp: fullCode }),
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || data.errors?.otp?.[0] || "Invalid or expired verification OTP code.");
            }

            setVerified(true);
            setTimeout(() => router.push("/login"), 2500);
        } catch (err: any) {
            setError(err.message || "Failed to verify OTP code.");
        } finally {
            setLoading(false);
        }
    };

    const [successMessage, setSuccessMessage] = useState("");
    const [latestOtp, setLatestOtp] = useState<string | null>(null);

    const handleResend = async () => {
        setResending(true);
        setError("");
        setSuccessMessage("");
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
            const res = await fetch(`${API_URL}/auth/send-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || "Failed to resend code.");
            }
            if (data.debug_otp) {
                setLatestOtp(data.debug_otp);
            }
            setSuccessMessage("A fresh verification code has been generated & sent!");
            setCountdown(60);
            setCanResend(false);
            setCode(["", "", "", "", "", ""]);
            inputRefs.current[0]?.focus();
        } catch (err: any) {
            setError(err.message || "Failed to resend email verification code.");
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 w-full max-w-md px-4">
                <div className="flex flex-col items-center mb-8">
                    <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 mb-4">
                        <BrainCircuit className="w-7 h-7 text-white" />
                    </div>
                </div>

                <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
                    {verified ? (
                        <div className="flex flex-col items-center text-center gap-4 py-4">
                            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Email Verified!</h2>
                                <p className="text-sm text-zinc-400 mt-2">Redirecting you to login...</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-col items-center text-center mb-8">
                                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
                                    <MailCheck className="w-7 h-7 text-indigo-400" />
                                </div>
                                <h1 className="text-xl font-bold text-white">Verify your email</h1>
                                <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
                                    We sent a 6-digit verification code to{" "}
                                    <span className="text-white font-medium">{email}</span>
                                </p>
                                {latestOtp && (
                                    <div className="mt-3 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-[12px] text-indigo-300 font-mono">
                                        🔑 Received OTP Code: <span className="font-bold text-white">{latestOtp}</span>
                                    </div>
                                )}
                            </div>

                            {error && (
                                <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                                    {error}
                                </div>
                            )}

                            {successMessage && (
                                <div className="mb-5 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm text-center">
                                    {successMessage}
                                </div>
                            )}

                            <div className="flex justify-center gap-3 mb-8" onPaste={handlePaste}>
                                {code.map((digit, i) => (
                                    <input
                                        key={i}
                                        ref={(el) => { inputRefs.current[i] = el; }}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleChange(i, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(i, e)}
                                        className={cn(
                                            "w-12 h-14 text-center text-xl font-bold rounded-xl bg-white/5 border text-white outline-none transition-all",
                                            "focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20",
                                            digit ? "border-indigo-500/50" : "border-white/10"
                                        )}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={handleVerify}
                                disabled={loading || code.join("").length < 6}
                                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-500/25 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                                {loading ? "Verifying..." : "Verify Email"}
                            </button>

                            <div className="mt-6 text-center">
                                {canResend ? (
                                    <button
                                        onClick={handleResend}
                                        disabled={resending}
                                        className="inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
                                    >
                                        {resending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                                        {resending ? "Sending..." : "Resend code"}
                                    </button>
                                ) : (
                                    <p className="text-sm text-zinc-500">
                                        Resend code in{" "}
                                        <span className="text-zinc-300 font-medium tabular-nums">{countdown}s</span>
                                    </p>
                                )}
                            </div>
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

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] text-white">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
        }>
            <VerifyEmailPageContent />
        </Suspense>
    );
}
