"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Files,
    MessageSquare,
    Lightbulb,
    BarChart3,
    Sparkles,
    User,
    Settings,
    GraduationCap,
    Shield,
    BookOpen,
    HelpCircle,
    BrainCircuit,
    FolderKanban,
    Award
} from "lucide-react";
import { motion } from "framer-motion";
import { useCurrentUser } from "@/lib/use-current-user";
import { api } from "@/lib/api";

interface SidebarGroup {
    title?: string;
    items: Array<{
        name: string;
        href: string;
        icon: React.ComponentType<{ className?: string }>;
        badge?: string;
        role?: "teacher" | "admin" | "all";
    }>;
}

export function Sidebar() {
    const pathname = usePathname();
    const { session, profile } = useCurrentUser();
    const [progress, setProgress] = React.useState(0);

    const isTeacher = profile?.role === "teacher" || (profile as any)?.role === "teacher";
    const isAdmin = profile?.role === "admin";

    const navigationGroups: SidebarGroup[] = [
        {
            title: "MAIN WORKSPACE",
            items: [
                { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
                { name: "Documents", href: "/documents", icon: Files },
                { name: "AI Chat", href: "/chat", icon: MessageSquare, badge: "AI" },
            ],
        },
        {
            title: "STUDY & EXAMS",
            items: [
                { name: "Quiz Generator", href: "/quiz", icon: Lightbulb },
                { name: "Exams & Quizzes", href: "/quizzes", icon: Award, badge: "New" },
                { name: "Analytics", href: "/analytics", icon: BarChart3 },
                { name: "Recommendations", href: "/recommendations", icon: Sparkles },
            ],
        },
        ...(isTeacher || isAdmin
            ? [
                {
                    title: "TEACHER PANEL",
                    items: [
                        { name: "Classroom Dashboard", href: "/teacher", icon: GraduationCap },
                        { name: "Shared Materials", href: "/teacher/materials", icon: FolderKanban },
                        { name: "AI Co-Pilot Studio", href: "/teacher/ai-assistant", icon: BrainCircuit, badge: "Pro" },
                        { name: "Class Quizzes", href: "/teacher/quizzes", icon: BookOpen },
                    ],
                },
            ]
            : []),
        ...(isAdmin
            ? [
                {
                    title: "ADMINISTRATION",
                    items: [
                        { name: "Admin Panel", href: "/admin", icon: Shield },
                    ],
                },
            ]
            : []),
        {
            title: "ACCOUNT",
            items: [
                { name: "Profile", href: "/profile", icon: User },
                { name: "Settings", href: "/settings", icon: Settings },
            ],
        },
    ];

    React.useEffect(() => {
        if (session?.accessToken) {
            api.dashboard.getStats(session.accessToken).then(res => {
                const goals = res.overview?.study_goals || [];
                if (goals.length > 0) {
                    const avgProgress = Math.round(goals.reduce((acc: number, g: any) => acc + g.progress, 0) / goals.length);
                    setProgress(avgProgress);
                } else {
                    setProgress(65);
                }
            }).catch(() => setProgress(65));
        }
    }, [session?.accessToken]);

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-72 border-r bg-card/50 backdrop-blur-xl hidden lg:block">
            <div className="flex h-full flex-col px-6 py-8">
                {/* Logo */}
                <div className="flex items-center gap-3 px-2 mb-8">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-bg shadow-lg shadow-indigo-500/20">
                        <GraduationCap className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight gradient-text">
                        Study.AI
                    </span>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-6 overflow-y-auto pr-2 scrollbar-hide">
                    {navigationGroups.map((group, groupIdx) => (
                        <div key={groupIdx} className="space-y-1.5">
                            {group.title && (
                                <p className="px-3 text-[10px] font-bold text-muted-foreground/70 uppercase tracking-wider mb-2">
                                    {group.title}
                                </p>
                            )}
                            {group.items.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={cn(
                                            "group relative flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                                            isActive
                                                ? "text-primary bg-primary/10"
                                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                        )}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="sidebar-active"
                                                className="absolute inset-0 rounded-xl bg-primary/10 border border-primary/20"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                        <div className="flex items-center gap-3 relative z-10">
                                            <item.icon
                                                className={cn(
                                                    "h-5 w-5 transition-colors",
                                                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                                                )}
                                            />
                                            <span>{item.name}</span>
                                        </div>

                                        {item.badge && (
                                            <span className={cn(
                                                "relative z-10 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider",
                                                item.badge === "AI" ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" :
                                                    item.badge === "Pro" ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" :
                                                        "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                            )}>
                                                {item.badge}
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    ))}
                </nav>

                {/* Footer Weekly Progress Widget */}
                <div className="mt-auto px-2 pt-6">
                    <div className="rounded-2xl bg-gradient-to-br from-indigo-600/10 to-purple-600/10 p-5 border border-indigo-500/10 relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 h-24 w-24 bg-gradient-to-br from-indigo-500 to-purple-500 opacity-10 blur-2xl group-hover:opacity-20 transition-opacity" />
                        <p className="text-sm font-semibold text-foreground mb-1">Weekly Mastery Goal</p>
                        <p className="text-xs text-muted-foreground mb-4">You&apos;ve completed {progress}% of your study tasks.</p>
                        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                className="h-full gradient-bg"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
