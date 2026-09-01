"use client";

import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    Award,
    FolderKanban,
    BrainCircuit,
    BookOpen,
    Shield
} from "lucide-react";
import { useCurrentUser } from "@/lib/use-current-user";

export function MobileNav() {
    const pathname = usePathname();
    const [open, setOpen] = React.useState(false);
    const { profile } = useCurrentUser();

    const isTeacher = profile?.role === "teacher" || (profile as any)?.role === "teacher";
    const isAdmin = profile?.role === "admin";

    const navigationGroups = [
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

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-6 w-6" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72">
                <div className="flex h-full flex-col px-6 py-8">
                    <div className="flex items-center gap-3 px-2 mb-8">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-bg shadow-lg shadow-indigo-500/20">
                            <GraduationCap className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight gradient-text">
                            Study.AI
                        </span>
                    </div>

                    <nav className="flex-1 space-y-6 overflow-y-auto pr-2">
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
                                            onClick={() => setOpen(false)}
                                            className={cn(
                                                "flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                                                isActive
                                                    ? "text-primary bg-primary/10"
                                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <item.icon className="h-5 w-5" />
                                                <span>{item.name}</span>
                                            </div>
                                            {item.badge && (
                                                <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                                    {item.badge}
                                                </span>
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        ))}
                    </nav>
                </div>
            </SheetContent>
        </Sheet>
    );
}
