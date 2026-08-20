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
import { api } from "@/lib/api";
import { AssignedTeacherCard } from "@/components/AssignedTeacherCard";

export default function ProfilePage() {
    const { session, profile, displayName, displayEmail, avatarUrl, initials } = useCurrentUser();
    const avatarInitials = displayName
        .split(" ")
        .filter(Boolean)
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    const [isEditing, setIsEditing] = React.useState(false);
    const [formData, setFormData] = React.useState({ fullName: "", aboutMe: "", primaryCourse: "", language: "" });
    const [isSaving, setIsSaving] = React.useState(false);
    const [stats, setStats] = React.useState<any>(null);

    const [freshProfile, setFreshProfile] = React.useState<any>(null);

    React.useEffect(() => {
        if (session?.accessToken) {
            api.dashboard.getStats(session.accessToken)
                .then(res => setStats(res.stats))
                .catch(console.error);

            api.profile.get(session.accessToken)
                .then(res => {
                    if (res?.user) setFreshProfile(res.user);
                })
                .catch(console.error);
        }
    }, [session?.accessToken]);

    const activeProfile = freshProfile || profile;

    React.useEffect(() => {
        if (activeProfile) {
            setFormData({
                fullName: activeProfile.full_name || "",
                aboutMe: activeProfile.about_me || "",
                primaryCourse: activeProfile.primary_course || "",
                language: activeProfile.language || ""
            });
        }
    }, [activeProfile]);

    const handleSave = async () => {
        if (!session?.accessToken) return;
        setIsSaving(true);
        try {
            await api.profile.update(session.accessToken, {
                full_name: formData.fullName,
                about_me: formData.aboutMe,
                primary_course: formData.primaryCourse,
                language: formData.language
            });
            setIsEditing(false);
            window.location.reload();
        } catch (error) {
            console.error("Failed to save profile:", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <>
            {isEditing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-background rounded-3xl p-8 max-w-md w-full shadow-2xl relative border border-white/10 space-y-4">
                        <h2 className="text-xl font-bold">Edit Profile</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Full Name</label>
                                <input className="w-full bg-muted/50 border border-white/5 rounded-xl p-3 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} placeholder="Full Name" />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Primary Course</label>
                                <input className="w-full bg-muted/50 border border-white/5 rounded-xl p-3 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500" value={formData.primaryCourse} onChange={e => setFormData({ ...formData, primaryCourse: e.target.value })} placeholder="e.g. Computer Science" />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Language</label>
                                <input className="w-full bg-muted/50 border border-white/5 rounded-xl p-3 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500" value={formData.language} onChange={e => setFormData({ ...formData, language: e.target.value })} placeholder="e.g. English" />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">About Me</label>
                                <textarea className="w-full bg-muted/50 border border-white/5 rounded-xl p-3 text-sm mt-1 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500" value={formData.aboutMe} onChange={e => setFormData({ ...formData, aboutMe: e.target.value })} placeholder="Tell us about yourself..." />
                            </div>
                        </div>
                        <div className="flex gap-3 pt-4">
                            <Button variant="ghost" className="flex-1 rounded-xl" onClick={() => setIsEditing(false)}>Cancel</Button>
                            <Button className="flex-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handleSave} disabled={isSaving}>{isSaving ? "Saving..." : "Save Changes"}</Button>
                        </div>
                    </div>
                </div>
            )}
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
                            <button className="absolute bottom-2 right-2 p-2 bg-white dark:bg-zinc-800 text-indigo-600 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity border border-indigo-500/10 cursor-pointer" onClick={() => {
                                const input = document.createElement('input');
                                input.type = 'file';
                                input.accept = 'image/*';
                                input.onchange = async (e) => {
                                    const file = (e.target as HTMLInputElement).files?.[0];
                                    if (!file) return;
                                    const reader = new FileReader();
                                    reader.onload = async (e) => {
                                        const base64Data = e.target?.result as string;
                                        try {
                                            setIsSaving(true);
                                            await api.profile.update(session?.accessToken as string, {
                                                profile_picture: base64Data
                                            });
                                            window.location.reload();
                                        } catch (err) {
                                            console.error('Failed to upload picture:', err);
                                        } finally {
                                            setIsSaving(false);
                                        }
                                    };
                                    reader.readAsDataURL(file);
                                };
                                input.click();
                            }} disabled={isSaving}>
                                <Camera className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="flex-1 pb-2">
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-black tracking-tight">{displayName}</h1>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground font-medium">
                                <div className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> {displayEmail}</div>
                                <div className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> Joined {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "recently"}</div>
                                <div className="flex items-center gap-1.5 font-bold text-indigo-500"><CheckCircle2 className="h-3.5 w-3.5" /> Last login {profile?.last_login_date ? new Date(profile.last_login_date).toLocaleString() : "not available"}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 pb-2">
                            <Button className="rounded-2xl h-11 px-6 gradient-bg border-none font-bold shadow-xl shadow-indigo-500/20 text-white" onClick={() => setIsEditing(true)}>
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
                                { label: "Docs Uploaded", val: stats?.documents_uploaded || 0, icon: FileText, color: "bg-blue-500/10 text-blue-500" },
                                { label: "Quizzes Taken", val: stats?.quizzes_completed || 0, icon: BookOpen, color: "bg-purple-500/10 text-purple-500" },
                                { label: "Avg Score", val: `${Math.round(stats?.avg_quiz_score || 0)}%`, icon: Trophy, color: "bg-amber-500/10 text-amber-500" },
                            ].map((stat, i) => (
                                <Card key={i} className="border-none bg-card/40 backdrop-blur-xl shadow-sm rounded-3xl overflow-hidden p-6 text-center">
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
                                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                    {profile?.about_me || "No description provided yet. Editing your profile to add your academic background and interests here."}
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Primary Course</span>
                                            <p className="text-sm font-bold flex items-center gap-2 text-foreground">
                                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                                {profile?.primary_course || "Not set"}
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Language</span>
                                            <div className="flex items-center gap-2">
                                                <Globe className="h-4 w-4 text-indigo-500" />
                                                <span className="text-sm font-bold text-foreground">{profile?.language || "Not set"}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Member Since</span>
                                            <p className="text-sm font-bold flex items-center gap-2 text-foreground">
                                                <Calendar className="h-4 w-4 text-indigo-500" />
                                                {profile?.created_at ? new Date(profile.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : "September 2023"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right: Quick Links / Insights */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Assigned Teacher Card */}
                        {(activeProfile?.role === "student" || profile?.role === "student") && (
                            <AssignedTeacherCard teacher={activeProfile?.assigned_teacher || profile?.assigned_teacher || null} />
                        )}

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
        </>
    );
}
