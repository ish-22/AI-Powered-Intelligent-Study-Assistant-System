"use client";

import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";
import { Menu, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";

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

export function MobileNav() {
    const pathname = usePathname();
    const [open, setOpen] = React.useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-6 w-6" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72">
                <div className="flex h-full flex-col px-6 py-8">
                    <div className="flex items-center gap-3 px-2 mb-10">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-bg shadow-lg shadow-indigo-500/20">
                            <GraduationCap className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight gradient-text">
                            Study.AI
                        </span>
                    </div>

                    <nav className="flex-1 space-y-1.5 overflow-y-auto pr-2">
                        {sidebarItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                                    pathname === item.href
                                        ? "text-primary bg-primary/10"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <item.icon className="h-5 w-5" />
                                <span>{item.name}</span>
                            </Link>
                        ))}
                    </nav>
                </div>
            </SheetContent>
        </Sheet>
    );
}
