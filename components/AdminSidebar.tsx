"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { X, ChevronDown, LogOut, User, Moon, Sun, GraduationCap } from "lucide-react";
import { useTheme } from "next-themes";
import clsx from "clsx";

export type AdminNavItem = {
    id: string;
    label: string;
    href?: string;
    icon: React.ReactNode;
    children?: AdminNavItem[];
};

function NavTree({ nav, onNavigate }: { nav: AdminNavItem[]; onNavigate?: () => void }) {
    const pathname = usePathname();
    const [open, setOpen] = useState<Record<string, boolean>>({});

    const isActive = useCallback(
        (href?: string) =>
            Boolean(href) &&
            (pathname === href || (href !== "/admin" && pathname.startsWith(`${href}/`))),
        [pathname],
    );

    return (
        <nav className="px-2 pb-4">
            <ul className="grid gap-0.5">
                {nav.map((item) => {
                    const expanded = Boolean(open[item.id]);
                    const active = isActive(item.href) || (item.children ?? []).some((c) => isActive(c.href));

                    if (item.children?.length) {
                        return (
                            <li key={item.id}>
                                <button
                                    type="button"
                                    onClick={() => setOpen((p) => ({ ...p, [item.id]: !expanded }))}
                                    className={clsx(
                                        "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground",
                                        active ? "bg-primary/10 text-primary" : "text-muted-foreground",
                                    )}
                                >
                                    <span className="grid h-8 w-8 place-items-center rounded-lg border border-border/60 bg-background/50">{item.icon}</span>
                                    <span className="flex-1 text-left">{item.label}</span>
                                    <ChevronDown size={15} className={clsx("transition-transform", expanded ? "rotate-180" : "")} />
                                </button>
                                {expanded && (
                                    <ul className="mt-0.5 grid gap-0.5 pl-6">
                                        {item.children.map((child) => (
                                            <li key={child.id}>
                                                <Link
                                                    href={child.href ?? "#"}
                                                    onClick={onNavigate}
                                                    className={clsx(
                                                        "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground",
                                                        isActive(child.href) ? "bg-primary/10 text-primary" : "text-muted-foreground",
                                                    )}
                                                >
                                                    <span className="grid h-8 w-8 place-items-center rounded-lg border border-border/60 bg-background/50">{child.icon}</span>
                                                    {child.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        );
                    }

                    return (
                        <li key={item.id}>
                            <Link
                                href={item.href ?? "#"}
                                onClick={onNavigate}
                                className={clsx(
                                    "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground",
                                    isActive(item.href) ? "bg-primary/10 text-primary" : "text-muted-foreground",
                                )}
                            >
                                <span className="grid h-8 w-8 place-items-center rounded-lg border border-border/60 bg-background/50">{item.icon}</span>
                                {item.label}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}

function SidebarBrand({ onClose, showClose }: { onClose?: () => void; showClose?: boolean }) {
    const { theme, setTheme } = useTheme();
    const router = useRouter();
    const [profileOpen, setProfileOpen] = useState(false);

    function handleLogout() {
        localStorage.removeItem("adminAuth");
        router.replace("/admin/login");
    }

    return (
        <div className="flex items-center justify-between gap-2 border-b border-border/60 px-4 py-4 mb-2">
            <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 shadow-sm">
                    <GraduationCap size={16} className="text-white" />
                </div>
                <span className="truncate text-sm font-semibold">Study.AI Admin</span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
                <button
                    type="button"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="grid h-8 w-8 place-items-center rounded-lg border border-border/60 bg-background/50 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Toggle theme"
                >
                    {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
                </button>
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setProfileOpen((v) => !v)}
                        className="grid h-8 w-8 place-items-center rounded-lg border border-border/60 bg-background/50 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Profile menu"
                    >
                        <User size={15} />
                    </button>
                    {profileOpen && (
                        <>
                            <div className="fixed inset-0 z-50" onClick={() => setProfileOpen(false)} aria-hidden />
                            <div className="absolute right-0 z-[60] mt-2 w-52 overflow-hidden rounded-xl border border-border bg-card shadow-lg">
                                <div className="px-3 py-3">
                                    <p className="text-sm font-semibold">Administrator</p>
                                    <p className="text-xs text-muted-foreground">admin</p>
                                </div>
                                <div className="h-px bg-border" />
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-muted transition-colors"
                                >
                                    <LogOut size={14} /> Logout
                                </button>
                            </div>
                        </>
                    )}
                </div>
                {showClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        className="grid h-8 w-8 place-items-center rounded-lg border border-border/60 bg-background/50 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Close navigation"
                    >
                        <X size={15} />
                    </button>
                )}
            </div>
        </div>
    );
}

export default function AdminSidebar({
    nav,
    mobileOpen,
    setMobileOpen,
}: {
    nav: AdminNavItem[];
    mobileOpen: boolean;
    setMobileOpen: (v: boolean) => void;
}) {
    return (
        <>
            <div
                className={clsx(
                    "fixed inset-0 z-40 bg-black/40 transition-opacity md:hidden",
                    mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
                )}
                onClick={() => setMobileOpen(false)}
                aria-hidden
            />
            <aside
                className={clsx(
                    "fixed inset-y-0 left-0 z-50 w-[272px] border-r border-border bg-card backdrop-blur transition-transform md:hidden",
                    mobileOpen ? "translate-x-0" : "-translate-x-full",
                )}
            >
                <SidebarBrand onClose={() => setMobileOpen(false)} showClose />
                <NavTree nav={nav} onNavigate={() => setMobileOpen(false)} />
            </aside>
            <aside className="fixed inset-y-0 left-0 z-30 hidden w-[272px] border-r border-border bg-card md:block">
                <SidebarBrand />
                <NavTree nav={nav} />
            </aside>
        </>
    );
}
