"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
    LayoutDashboard,
    Files,
    BookOpen,
    BarChart3,
    GraduationCap,
    LogOut,
    User as UserIcon,
    Moon,
    Sun,
    Menu,
    X,
    ChevronRight,
} from "lucide-react";
import { useCurrentUser } from "@/lib/use-current-user";
import { useTheme } from "next-themes";
import clsx from "clsx";
import { signOut } from "next-auth/react";

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { session, profile, status } = useCurrentUser();
    const { theme, setTheme } = useTheme();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    useEffect(() => {
        if (status === "loading") return;

        if (!session) {
            router.replace("/login");
            return;
        }

        if (profile) {
            const role = profile.role || (profile as any).role;
            if (role !== "teacher" && role !== "admin") {
                router.replace("/dashboard");
            }
        }
    }, [session, profile, status, router]);

    const navItems = useMemo(() => [
        { id: "dashboard", label: "Dashboard", href: "/teacher", icon: <LayoutDashboard size={16} /> },
        { id: "materials", label: "Class Materials", href: "/teacher/materials", icon: <Files size={16} /> },
        { id: "quizzes", label: "Quiz Assignments", href: "/teacher/quizzes", icon: <BookOpen size={16} /> },
        { id: "analytics", label: "Student Analytics", href: "/teacher/analytics", icon: <BarChart3 size={16} /> },
        { id: "student_view", label: "Student Panel", href: "/dashboard", icon: <GraduationCap size={16} /> },
    ], []);

    if (status === "loading" || (!profile && session)) {
        return (
            <div className="grid min-h-screen place-items-center bg-[#090914] text-white">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
                    <span className="text-zinc-500 text-xs">Securing session...</span>
                </div>
            </div>
        );
    }

    if (!profile) return null;

    return (
        <div className="min-h-screen bg-[#090914] text-zinc-100 flex">
            {/* Desktop Sidebar */}
            <aside className="fixed inset-y-0 left-0 z-30 hidden w-[260px] border-r border-white/5 bg-[#0d0d1e] md:flex flex-col">
                {/* Brand */}
                <div className="flex items-center justify-between gap-2 border-b border-white/5 px-6 py-5 mb-4">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md shadow-indigo-500/20">
                            <GraduationCap size={16} className="text-white" />
                        </div>
                        <span className="text-sm font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                            Teacher Portal
                        </span>
                    </div>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const active = pathname === item.href;
                        return (
                            <Link
                                key={item.id}
                                href={item.href}
                                className={clsx(
                                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 border",
                                    active
                                        ? "bg-indigo-600/10 border-indigo-500/30 text-indigo-400"
                                        : "border-transparent text-zinc-400 hover:bg-white/5 hover:text-white"
                                )}
                            >
                                <span className={clsx(
                                    "grid h-7 w-7 place-items-center rounded-lg border",
                                    active ? "border-indigo-500/20 bg-indigo-500/10 text-indigo-400" : "border-white/5 bg-white/5 text-zinc-500"
                                )}>{item.icon}</span>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Sidebar Footer / Profile */}
                <div className="p-4 border-t border-white/5 bg-white/5 mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600/20 flex items-center justify-center text-xs font-bold text-indigo-400 border border-indigo-500/20">
                            T
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-semibold text-white truncate">{profile.full_name}</p>
                            <p className="text-[10px] text-zinc-500 truncate">Educator</p>
                        </div>
                    </div>
                    <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="p-2 rounded-lg border border-white/5 bg-[#090914] text-zinc-500 hover:text-red-400 transition-colors"
                        title="Sign Out"
                    >
                        <LogOut size={14} />
                    </button>
                </div>
            </aside>

            {/* Mobile Navigation Header */}
            <div className="flex-1 md:pl-[260px] flex flex-col">
                <header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/5 bg-[#0d0d1e]/80 backdrop-blur px-6 py-4 md:hidden">
                    <div className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-indigo-400" />
                        <span className="text-xs font-bold text-white">Teacher Portal</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => setMobileOpen(true)}
                        className="grid h-9 w-9 place-items-center rounded-lg border border-white/5 bg-[#0d0d1e] text-zinc-400 hover:text-white"
                    >
                        <Menu size={18} />
                    </button>
                </header>

                {/* Mobile Drawer menu */}
                {mobileOpen && (
                    <>
                        <div className="fixed inset-0 z-40 bg-black/60 md:hidden" onClick={() => setMobileOpen(false)} />
                        <aside className="fixed inset-y-0 left-0 z-50 w-[260px] bg-[#0d0d1e] border-r border-white/5 flex flex-col md:hidden">
                            <div className="flex items-center justify-between border-b border-white/5 px-6 py-5">
                                <span className="text-sm font-bold text-white">Teacher Portal</span>
                                <button onClick={() => setMobileOpen(false)} className="text-zinc-500 hover:text-white">
                                    <X size={18} />
                                </button>
                            </div>
                            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                                {navItems.map((item) => {
                                    const active = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.id}
                                            href={item.href}
                                            onClick={() => setMobileOpen(false)}
                                            className={clsx(
                                                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 border",
                                                active ? "bg-indigo-600/10 border-indigo-500/20 text-indigo-400" : "border-transparent text-zinc-400"
                                            )}
                                        >
                                            {item.icon}
                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </aside>
                    </>
                )}

                {/* Main Page Area */}
                <main className="flex-1 px-4 py-6 md:p-8 max-w-7xl w-full mx-auto">{children}</main>
            </div>
        </div>
    );
}
