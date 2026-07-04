import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] px-4">
            <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-white backdrop-blur-xl">
                <p className="text-sm uppercase tracking-[0.3em] text-indigo-400">404</p>
                <h1 className="mt-3 text-2xl font-bold">Page not found</h1>
                <p className="mt-3 text-sm text-zinc-400">
                    The page you&apos;re looking for doesn&apos;t exist or was moved.
                </p>
                <Link
                    href="/"
                    className="mt-6 inline-flex rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
                >
                    Go home
                </Link>
            </div>
        </div>
    );
}
