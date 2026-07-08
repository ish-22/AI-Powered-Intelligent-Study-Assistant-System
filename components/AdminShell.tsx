"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import AdminSidebar, { type AdminNavItem } from "@/components/AdminSidebar";

export default function AdminShell({
    nav,
    children,
}: {
    nav: AdminNavItem[];
    children: React.ReactNode;
}) {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background">
            <AdminSidebar nav={nav} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

            <div className="md:pl-[272px]">
                {/* mobile topbar */}
                <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/80 backdrop-blur px-4 py-3 md:hidden">
                    <span className="text-sm font-semibold">Study.AI Admin</span>
                    <button
                        type="button"
                        onClick={() => setMobileOpen(true)}
                        className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Open navigation"
                    >
                        <Menu size={18} />
                    </button>
                </header>

                <main className="px-4 pb-10 pt-5 md:px-6">{children}</main>
            </div>
        </div>
    );
}
