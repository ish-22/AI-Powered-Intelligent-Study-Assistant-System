"use client";

import React, { useState } from "react";
import {
    Users,
    Files,
    BarChart4,
    Settings,
    Activity,
    Search,
    MoreHorizontal,
    ArrowUpRight,
    ArrowDownRight,
    Filter,
    Download,
    AlertTriangle,
    CheckCircle2,
    Lock,
    Mail,
    Zap,
    LayoutDashboard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/lib/use-current-user";

const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "users", label: "Users", icon: Users },
    { id: "content", label: "Content", icon: Files },
    { id: "analytics", label: "Analytics", icon: Activity },
    { id: "settings", label: "System", icon: Settings },
];

const mockUsers = [
    { id: 1, name: "Student 01", email: "student01@demo.edu", status: "Active", plan: "Pro", joined: "2 mins ago" },
    { id: 2, name: "Student 02", email: "student02@demo.edu", status: "Inactive", plan: "Free", joined: "1 hour ago" },
    { id: 3, name: "Student 03", email: "student03@demo.edu", status: "Active", plan: "Pro", joined: "3 hours ago" },
    { id: 4, name: "Student 04", email: "student04@demo.edu", status: "Pending", plan: "Enterprise", joined: "Yesterday" },
    { id: 5, name: "Student 05", email: "student05@demo.edu", status: "Active", plan: "Pro", joined: "2 days ago" },
];

const mockLogs = [
    { id: 1, event: "New User Registered", user: "Demo Student", time: "10:45 AM", severity: "info" },
    { id: 2, event: "Quiz Generation Failed", user: "System", time: "10:30 AM", severity: "warning" },
    { id: 3, event: "Large Document Uploaded", user: "Demo Student", time: "09:12 AM", severity: "success" },
    { id: 4, event: "Subscription Upgraded", user: "Demo Student", time: "Yesterday", severity: "success" },
];

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("overview");
    const { displayName } = useCurrentUser();

    return (
        <div className="space-y-8 pb-12 animate-fade-in max-w-[1600px] mx-auto">
            {/* Admin Header */}
            <section className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                        <Lock className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">Admin <span className="text-muted-foreground font-normal">Control Center</span></h1>
                        <p className="text-sm text-muted-foreground mt-1 font-medium italic">Welcome back, {displayName}. Manage users, content, analytics, and system settings from here.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-xl h-11 px-6 border-white/10 bg-background/50 backdrop-blur-md">
                        <Download className="mr-2 h-4 w-4" /> Export Data
                    </Button>
                    <Button className="rounded-xl h-11 px-6 gradient-bg border-none font-bold shadow-xl shadow-indigo-500/10">
                        Force System Update
                    </Button>
                </div>
            </section>

            {/* Admin Sub-Navigation */}
            <div className="flex items-center gap-1 p-1 bg-muted/40 rounded-2xl w-fit border border-white/5 backdrop-blur-md">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all font-bold text-sm",
                            activeTab === tab.id
                                ? "bg-white dark:bg-zinc-800 text-indigo-600 shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <tab.icon className="h-4 w-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {activeTab === "overview" && (
                    <motion.div
                        key="overview"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="space-y-8"
                    >
                        {/* Top Row Metrics */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                            {[
                                { label: "Total Users", val: "12,482", trend: "+12%", up: true, icon: Users, color: "text-blue-500" },
                                { label: "Active Now", val: "842", trend: "-2%", up: false, icon: Activity, color: "text-emerald-500" },
                                { label: "Docs Uploaded", val: "45,210", trend: "+24%", up: true, icon: Files, color: "text-purple-500" },
                                { label: "Quizzes", val: "8,290", trend: "+8%", up: true, icon: Zap, color: "text-amber-500" },
                                { label: "AI Requests", val: "152K", trend: "+42%", up: true, icon: AlertTriangle, color: "text-indigo-500" },
                            ].map((m) => (
                                <Card key={m.label} className="border-none bg-card/40 backdrop-blur-xl shadow-sm rounded-3xl overflow-hidden p-6 hover:shadow-lg transition-all">
                                    <div className="flex items-center justify-between mb-4">
                                        <m.icon className={cn("h-5 w-5", m.color)} />
                                        <Badge className={cn("rounded-lg px-2 py-0.5 text-[10px] bg-transparent border", m.up ? "text-emerald-500 border-emerald-500/20" : "text-red-500 border-red-500/20")}>
                                            {m.up ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                                            {m.trend}
                                        </Badge>
                                    </div>
                                    <h3 className="text-2xl font-black">{m.val}</h3>
                                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-1">{m.label}</p>
                                </Card>
                            ))}
                        </div>

                        {/* Tables Area */}
                        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

                            {/* User List Table */}
                            <Card className="xl:col-span-8 border-none bg-card/40 backdrop-blur-xl shadow-sm rounded-[40px] overflow-hidden">
                                <CardHeader className="flex flex-row items-center justify-between p-8">
                                    <div>
                                        <CardTitle className="text-xl font-bold">User Management</CardTitle>
                                        <CardDescription>Recent registrations and status updates</CardDescription>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                                            <Input placeholder="Search users..." className="pl-9 h-10 w-64 bg-background/50 border-white/5 rounded-xl focus-visible:ring-1" />
                                        </div>
                                        <Button variant="outline" className="rounded-xl h-10 px-4 border-white/5"><Filter className="h-4 w-4" /></Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <Table>
                                        <TableHeader className="bg-muted/30">
                                            <TableRow className="border-white/5 hover:bg-transparent">
                                                <TableHead className="pl-8 font-bold text-xs uppercase text-muted-foreground">User</TableHead>
                                                <TableHead className="font-bold text-xs uppercase text-muted-foreground">Status</TableHead>
                                                <TableHead className="font-bold text-xs uppercase text-muted-foreground">Plan</TableHead>
                                                <TableHead className="font-bold text-xs uppercase text-muted-foreground">Joined</TableHead>
                                                <TableHead className="text-right pr-8 font-bold text-xs uppercase text-muted-foreground">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {mockUsers.map((user) => (
                                                <TableRow key={user.id} className="border-white/5 hover:bg-muted/20 transition-colors">
                                                    <TableCell className="pl-8 py-4">
                                                        <div className="flex items-center gap-4">
                                                            <Avatar className="h-10 w-10">
                                                                <AvatarFallback className="bg-indigo-500/10 text-indigo-500 font-bold">{user.name[0]}</AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <p className="text-sm font-bold">{user.name}</p>
                                                                <p className="text-[10px] text-muted-foreground">{user.email}</p>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge className={cn(
                                                            "rounded-full px-4 py-0.5 font-bold text-[10px] border-none shadow-sm",
                                                            user.status === 'Active' ? "bg-emerald-500/10 text-emerald-500" :
                                                                user.status === 'Inactive' ? "bg-red-500/10 text-red-500" : "bg-amber-500/10 text-amber-500"
                                                        )}>
                                                            {user.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-sm font-medium">{user.plan}</TableCell>
                                                    <TableCell className="text-sm text-muted-foreground">{user.joined}</TableCell>
                                                    <TableCell className="text-right pr-8">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full"><MoreHorizontal className="h-4 w-4" /></Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="rounded-xl">
                                                                <DropdownMenuItem className="font-medium">View Profile</DropdownMenuItem>
                                                                <DropdownMenuItem className="font-medium">Suspend Access</DropdownMenuItem>
                                                                <DropdownMenuItem className="text-red-500 font-bold">Delete User</DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                                <CardFooter className="p-8 justify-center border-t border-white/5">
                                    <Button variant="ghost" className="text-xs font-bold uppercase tracking-widest text-indigo-600">Load More Users</Button>
                                </CardFooter>
                            </Card>

                            {/* Activity Logs Sidebar */}
                            <div className="xl:col-span-4 space-y-8">
                                <Card className="border-none bg-card/40 backdrop-blur-xl shadow-sm rounded-[40px] overflow-hidden">
                                    <CardHeader className="p-8 pb-4">
                                        <CardTitle className="text-xl font-bold flex items-center justify-between">
                                            System Logs
                                            <Badge className="bg-red-500/10 text-red-500 border-none">Live</Badge>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-8 pt-0 space-y-6">
                                        {mockLogs.map((log) => (
                                            <div key={log.id} className="relative pl-6 before:absolute before:left-0 before:top-1.5 before:h-2 before:w-2 before:rounded-full before:bg-indigo-500 group">
                                                <span className="text-[10px] font-bold text-muted-foreground block mb-1">{log.time}</span>
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm font-bold group-hover:text-indigo-600 transition-colors">{log.event}</p>
                                                    <span className={cn(
                                                        "text-[9px] font-black uppercase px-2 py-0.5 rounded",
                                                        log.severity === 'warning' ? "bg-amber-500/10 text-amber-500" :
                                                            log.severity === 'success' ? "bg-emerald-500/10 text-emerald-500" : "bg-indigo-500/10 text-indigo-500"
                                                    )}>{log.severity}</span>
                                                </div>
                                                <p className="text-[10px] text-muted-foreground mt-1 italic">Initiated by {log.user}</p>
                                            </div>
                                        ))}
                                        <Button variant="outline" className="w-full mt-6 rounded-2xl h-11 font-bold text-xs border-white/5">
                                            View Full Audit Trail
                                        </Button>
                                    </CardContent>
                                </Card>

                                {/* System Health Check */}
                                <Card className="border-none bg-emerald-600/5 backdrop-blur-xl border border-emerald-500/10 rounded-[40px] p-8">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                                            <CheckCircle2 className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg text-emerald-600">All Systems Operational</h4>
                                            <p className="text-[10px] text-emerald-600/60 font-bold uppercase tracking-wider">Ping: 24ms • Uptime: 99.98%</p>
                                        </div>
                                    </div>
                                </Card>
                            </div>

                        </div>
                    </motion.div>
                )}

                {/* Placeholder for other tabs */}
                {activeTab !== "overview" && (
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="h-[600px] flex flex-col items-center justify-center text-center space-y-4 bg-muted/20 rounded-[40px] border-2 border-dashed border-white/5"
                    >
                        <div className="h-20 w-20 rounded-3xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-4">
                            <Zap className="h-10 w-10 animate-pulse" />
                        </div>
                        <h2 className="text-2xl font-black capitalize">{activeTab} Interface</h2>
                        <p className="text-muted-foreground font-medium italic">Advanced enterprise controls for {activeTab} coming soon...</p>
                        <Button onClick={() => setActiveTab("overview")} variant="link" className="text-indigo-600 font-bold">Back to Dashboard</Button>
                    </motion.div>
                )}

            </AnimatePresence>
        </div>
    );
}
