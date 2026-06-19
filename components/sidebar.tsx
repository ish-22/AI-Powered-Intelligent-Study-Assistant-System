"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Files,
    FileText,
    MessageSquare,
    Lightbulb,
    BarChart3,
    Sparkles,
    User,
    Settings,
    GraduationCap,
} from "lucide-react";
import { motion } from "framer-motion";

const sidebarItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Documents", href: "/documents", icon: Files },
    { name: "Summaries", href: "/summaries", icon: FileText },
    { name: "AI Chat", href: "/chat", icon: MessageSquare },
    { name: "Quiz Generator", href: "/quiz", icon: Lightbulb },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Recommendations", href: "/recommendations", icon: Sparkles },
    { name: "Profile", href: "/profile", icon: User },
    { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-72 border-r bg-card/50 backdrop-blur-xl hidden lg:block">
            <div className="flex h-full flex-col px-6 py-8">
                {/* Logo */}
                <div className="flex items-center gap-3 px-2 mb-10">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-bg shadow-lg shadow-indigo-500/20">
                        <GraduationCap className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight gradient-text">
                        Study.AI
                    </span>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1.5 overflow-y-auto pr-2 scrollbar-hide">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
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
                                <item.icon
                                    className={cn(
                                        "h-5 w-5 transition-colors",
                                        isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                                    )}
                                />
                                <span className="relative z-10">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Upgrade Card / Footer */}
                <div className="mt-auto px-2 pt-6">
                    <div className="rounded-2xl bg-gradient-to-br from-indigo-600/10 to-purple-600/10 p-5 border border-indigo-500/10 relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 h-24 w-24 bg-gradient-to-br from-indigo-500 to-purple-500 opacity-10 blur-2xl group-hover:opacity-20 transition-opacity" />
                        <p className="text-sm font-semibold text-foreground mb-1">Weekly Goal</p>
                        <p className="text-xs text-muted-foreground mb-4">You've completed 75% of your study tasks.</p>
                        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "75%" }}
                                className="h-full gradient-bg"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
