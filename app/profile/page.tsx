"use client";

import React from "react";
import {
    User,
    Mail,
    MapPin,
    Calendar,
    Edit3,
    GraduationCap,
    BookOpen,
    FileText,
    Trophy,
    Camera,
    Globe,
    Settings2,
    CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/lib/use-current-user";

export default function ProfilePage() {
    const { profile, displayName, displayEmail, avatarUrl, initials } = useCurrentUser();
    const avatarInitials = displayName
        .split(" ")
        .filter(Boolean)
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <div className="space-y-10 pb-12 animate-fade-in max-w-5xl mx-auto">
            {/* Profile Header */}
            <section className="relative">
                <div className="h-48 w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 rounded-[40px] shadow-2xl overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)]" />
                </div>
                <div className="px-10 -mt-16 relative z-10 flex flex-col md:flex-row items-end gap-6">
                    <div className="relative group">
                        <Avatar className="h-32 w-32 border-8 border-background shadow-2xl rounded-3xl">
                            <AvatarImage src={avatarUrl} alt={displayName} />
                            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-4xl font-black">
                                {initials || avatarInitials || "SU"}
                            </AvatarFallback>
                        </Avatar>
                        <button className="absolute bottom-2 right-2 p-2 bg-white dark:bg-zinc-800 text-indigo-600 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity border border-indigo-500/10">
                            <Camera className="h-4 w-4" />
                        </button>
                    </div>
                    <div className="flex-1 pb-2">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-black tracking-tight">{displayName}</h1>
                            <Badge className="bg-indigo-500 text-white border-none rounded-lg font-bold">Connected</Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground font-medium">
                            <div className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> {displayEmail}</div>
                            <div className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> Joined {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "recently"}</div>
                            <div className="flex items-center gap-1.5 font-bold text-indigo-500"><CheckCircle2 className="h-3.5 w-3.5" /> Last login {profile?.last_login_date ? new Date(profile.last_login_date).toLocaleString() : "not available"}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 pb-2">
                        <Button className="rounded-2xl h-11 px-6 gradient-bg border-none font-bold shadow-xl shadow-indigo-500/20">
                            <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
                        </Button>
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left: About & Stats */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Stats Bar */}
                    <section className="grid grid-cols-3 gap-4">
                        {[
                            { label: "Account", val: "Live", icon: BookOpen, color: "bg-blue-500/10 text-blue-500" },
                            { label: "Backend", val: "Connected", icon: FileText, color: "bg-purple-500/10 text-purple-500" },
                            { label: "Status", val: "Active", icon: Trophy, color: "bg-amber-500/10 text-amber-500" },
                        ].map((stat) => (
                            <Card key={stat.label} className="border-none bg-card/40 backdrop-blur-xl shadow-sm rounded-3xl overflow-hidden p-6 text-center">
                                <div className={cn("mx-auto h-10 w-10 rounded-xl flex items-center justify-center mb-4 shadow-sm", stat.color)}>
                                    <stat.icon className="h-5 w-5" />
                                </div>
                                <h3 className="text-2xl font-black">{stat.val}</h3>
                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-1">{stat.label}</p>
                            </Card>
                        ))}
                    </section>

                    {/* About Section */}
                    <Card className="border-none bg-card/40 backdrop-blur-xl shadow-sm rounded-3xl p-8">
                        <CardHeader className="px-0 pt-0">
                            <CardTitle className="text-xl font-bold">About Me</CardTitle>
                        </CardHeader>
                        <CardContent className="px-0 pb-0 space-y-6">
                            <p className="text-muted-foreground leading-relaxed">
                                Currently pursuing a **Master's in Computer Science** with a focus on Artificial Intelligence and Neural Networks. I use Study.AI to manage complex research papers and automate chapter summaries.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Primary Course</span>
                                        <p className="text-sm font-bold flex items-center gap-2 text-foreground">
                                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                            Theoretical Physics & ML
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Language</span>
                                        <div className="flex items-center gap-2">
                                            <Globe className="h-4 w-4 text-indigo-500" />
                                            <span className="text-sm font-bold text-foreground">English (Native)</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Member Since</span>
                                        <p className="text-sm font-bold flex items-center gap-2 text-foreground">
                                            <Calendar className="h-4 w-4 text-indigo-500" />
                                            September 2023
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right: Quick Links / Insights */}
                <div className="lg:col-span-4 space-y-8">
                    <Card className="border-none bg-indigo-600/5 backdrop-blur-xl border border-indigo-500/10 shadow-sm rounded-3xl p-6">
                        <CardHeader className="p-0 mb-6">
                            <CardTitle className="text-lg font-bold">Learning Persona</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Consistency</span>
                                <Badge className="bg-emerald-500/10 text-emerald-500 border-none">High</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Memory Retention</span>
                                <Badge className="bg-indigo-500/10 text-indigo-500 border-none">Master</Badge>
                            </div>
                            <Separator className="bg-white/5" />
                            <div className="p-4 rounded-2xl bg-white/5 space-y-2">
                                <div className="flex items-center gap-2 text-amber-500">
                                    <Trophy className="h-4 w-4" />
                                    <span className="text-xs font-bold uppercase">Badge of Honor</span>
                                </div>
                                <p className="text-xs text-muted-foreground font-medium">"Chapter Crusher" - Summarized 10+ chapters in one hour.</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Button variant="ghost" className="w-full h-12 rounded-2xl text-muted-foreground hover:bg-muted font-bold text-xs gap-2">
                        <Settings2 className="h-4 w-4" /> Account Settings
                    </Button>
                </div>

            </div>
        </div>
    );
}
