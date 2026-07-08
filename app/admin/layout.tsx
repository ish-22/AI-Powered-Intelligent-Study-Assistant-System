"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Users, FileText, BarChart3, Settings, Shield } from "lucide-react";
import AdminShell from "@/components/AdminShell";
import type { AdminNavItem } from "@/components/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const isLoginPage = pathname === "/admin/login";
    const [checked, setChecked] = useState(false);
    const [authed, setAuthed] = useState(false);

    useEffect(() => {
        if (isLoginPage) {
            setChecked(true);
            return;
        }
        const ok = localStorage.getItem("adminAuth") === "true";
        if (!ok) {
            router.replace("/admin/login");
        } else {
            setAuthed(true);
            setChecked(true);
        }
    }, [isLoginPage, router]);

    const nav = useMemo<AdminNavItem[]>(
        () => [
            { id: "dashboard", label: "Dashboard", href: "/admin", icon: <LayoutDashboard size={16} /> },
            { id: "users", label: "Users", href: "/admin/users", icon: <Users size={16} /> },
            { id: "documents", label: "Documents", href: "/admin/documents", icon: <FileText size={16} /> },
            { id: "analytics", label: "Analytics", href: "/admin/analytics", icon: <BarChart3 size={16} /> },
            { id: "roles", label: "Roles & Permissions", href: "/admin/roles", icon: <Shield size={16} /> },
            { id: "settings", label: "Settings", href: "/admin/settings", icon: <Settings size={16} /> },
        ],
        [],
    );

    // Login page — render standalone with no shell
    if (isLoginPage) return <>{children}</>;

    // Still checking auth
    if (!checked) {
        return (
            <div className="grid min-h-screen place-items-center bg-background">
                <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            </div>
        );
    }

    // Authed — render with AdminShell
    if (authed) return <AdminShell nav={nav}>{children}</AdminShell>;

    // Not authed — blank while redirecting
    return null;
}
