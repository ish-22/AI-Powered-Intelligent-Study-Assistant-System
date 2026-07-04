"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] px-4">
            <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-white backdrop-blur-xl">
                <p className="text-sm uppercase tracking-[0.3em] text-red-400">Something went wrong</p>
                <h1 className="mt-3 text-2xl font-bold">We hit an unexpected error</h1>
                <p className="mt-3 text-sm text-zinc-400">
                    Refreshing the route usually clears it. If it keeps happening, go back to the dashboard or try again after a restart.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <button
                        onClick={reset}
                        className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
                    >
                        Try again
                    </button>
                    <Link
                        href="/"
                        className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                    >
                        Go home
                    </Link>
                </div>
            </div>
        </div>
    );
}
