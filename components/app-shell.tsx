"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";
import { cn } from "@/lib/utils";

const publicRoutes = ["/", "/login", "/register", "/forgot-password"];
const publicGroupRoutes = ["/auth/login", "/auth/register", "/auth/forgot-password"];

export function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthRoute = publicRoutes.includes(pathname) || publicGroupRoutes.includes(pathname);

    if (isAuthRoute) {
        return <>{children}</>;
    }

    return (
        <div className="relative flex min-h-screen">
            <Sidebar />

            <div className="flex flex-1 flex-col lg:pl-72">
                <Navbar />

                <main className="flex-1 overflow-y-auto px-4 py-8 md:px-8">
                    <div className={cn("mx-auto max-w-7xl")}>{children}</div>
                </main>

                <div className="fixed inset-0 -z-10 h-full w-full bg-background">
                    <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-[0.4] dark:opacity-[0.1]" />
                    <div className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] bg-indigo-500/10 blur-[120px] rounded-full" />
                    <div className="absolute bottom-0 left-0 -z-10 h-[500px] w-[500px] bg-purple-500/10 blur-[120px] rounded-full" />
                </div>
            </div>
        </div>
    );
}
