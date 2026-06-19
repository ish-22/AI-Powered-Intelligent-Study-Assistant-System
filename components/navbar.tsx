"use client";

import React from "react";
import { Search, Bell, Settings, LogOut, User, Sparkles, Menu } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { MobileNav } from "./mobile-nav";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Navbar() {
    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center border-b bg-background/60 backdrop-blur-xl px-4 md:px-8">
            <div className="flex items-center gap-4 lg:hidden">
                <MobileNav />
            </div>

            {/* Breadcrumbs Placeholder */}
            <div className="hidden md:flex ml-4 items-center text-sm font-medium text-muted-foreground">
                <span>App</span>
                <span className="mx-2 text-muted-foreground/40">/</span>
                <span className="text-foreground">Dashboard</span>
            </div>

            <div className="ml-auto flex items-center gap-2 md:gap-4 flex-1 justify-end max-w-2xl px-4 md:px-0">
                {/* Global Search */}
                <div className="relative w-full max-w-sm hidden sm:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search documents, notes, AI..."
                        className="pl-9 bg-muted/50 border-transparent focus:bg-background focus:ring-1 focus:ring-primary h-10 rounded-full w-full transition-all"
                    />
                </div>

                <div className="flex items-center gap-1.5 md:gap-2">
                    {/* Notifications */}
                    <Button variant="ghost" size="icon" className="relative group rounded-full">
                        <Bell className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border-2 border-background" />
                    </Button>

                    {/* Theme Toggle */}
                    <ThemeToggle />

                    <div className="h-6 w-[1px] bg-border mx-1" />

                    {/* User Profile */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 border border-border/50">
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src="/avatar-placeholder.png" alt="User" />
                                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white">JD</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">John Doe</p>
                                    <p className="text-xs leading-none text-muted-foreground">john.doe@example.com</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer">
                                <User className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer text-indigo-600 dark:text-indigo-400">
                                <Sparkles className="mr-2 h-4 w-4" />
                                <span>Premium Plan</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Settings</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                                onClick={() => window.location.href = '/'}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}
