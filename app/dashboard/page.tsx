"use client";

import React, { useState, useEffect } from "react";
import {
    FileText,
    Files,
    Trophy,
    Clock,
    Zap,
    BrainCircuit,
    TrendingUp,
    CheckCircle2,
    Calendar,
    ArrowRight,
    Sparkles,
    MessageSquare,
    AlertCircle,
    ThumbsUp,
    Target,
    ChevronRight,
    Play,
    Pause,
    RotateCcw,
    Plus,
    UploadCloud,
    HelpCircle,
    Compass,
    Award
} from "lucide-react";
import Link from "next/link";
import { DashboardCard } from "@/components/dashboard-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    Cell
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { AssignedTeacherCard } from "@/components/AssignedTeacherCard";
import { useCurrentUser } from "@/lib/use-current-user";
import { useDashboardStats } from "@/lib/use-dashboard-stats";
import { useDashboardOverview } from "@/lib/use-dashboard-overview";

export default function DashboardPage() {
    const { displayName, profile } = useCurrentUser();
    const { stats, loading } = useDashboardStats();
    const { overview, loading: overviewLoading } = useDashboardOverview();
    const [isMounted, setIsMounted] = useState(false);

    // Focus Sprint Timer state
    const [timerSeconds, setTimerSeconds] = useState(1500); // 25 mins
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [sprintMode, setSprintMode] = useState<"focus" | "break">("focus");

    // Goals state
    const [goals, setGoals] = useState(overview.study_goals);
    const [newGoalTitle, setNewGoalTitle] = useState("");
    const [showAddGoal, setShowAddGoal] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (overview.study_goals.length > 0 && goals.length === 0) {
            setGoals(overview.study_goals);
        }
    }, [overview.study_goals]);

    // Timer effect
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (isTimerRunning && timerSeconds > 0) {
            interval = setInterval(() => {
                setTimerSeconds((prev) => prev - 1);
            }, 1000);
        } else if (timerSeconds === 0) {
            setIsTimerRunning(false);
            if (sprintMode === "focus") {
                setSprintMode("break");
                setTimerSeconds(300); // 5 min break
            } else {
                setSprintMode("focus");
                setTimerSeconds(1500);
            }
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isTimerRunning, timerSeconds, sprintMode]);

    const formatTimer = (totalSecs: number) => {
        const mins = Math.floor(totalSecs / 60);
        const secs = totalSecs % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const handleAddGoal = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newGoalTitle.trim()) return;
        const newGoal = {
            id: Date.now(),
            title: newGoalTitle,
            progress: 10,
            date: "In Progress",
        };
        setGoals([...goals, newGoal]);
        setNewGoalTitle("");
        setShowAddGoal(false);
    };

    // Calculate Exam Readiness Index
    const readinessScore = Math.min(
        98,
        Math.max(45, Math.round((stats.avg_quiz_score * 0.7) + (stats.learning_streak * 2) + 15))
    );

    return (
        <div className="space-y-10 pb-12 animate-fade-in">
            {/* Header Section */}
            <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-4xl font-extrabold tracking-tight"
                    >
                        {displayName.split(" ")[0]}&apos;s <span className="gradient-text">Dashboard</span>
                    </motion.h1>
                    <p className="text-muted-foreground mt-2 max-w-md">
                        Welcome back, {displayName}. Your AI assistant is ready with study tools, recommendations, and real-time focus tracking.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-2xl h-12 px-6 border-2 hover:bg-muted/50 transition-all">
                        <Calendar className="mr-2 h-4 w-4" />
                        Calendar
                    </Button>
                    <Link href="/chat">
                        <Button className="rounded-2xl h-12 px-6 gradient-bg shadow-xl shadow-indigo-500/25 border-none hover:scale-105 transition-all">
                            <Sparkles className="mr-2 h-5 w-5" />
                            AI Assistant
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Quick Action Shortcuts Bar */}
            <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: "AI Document Chat", desc: "Interact with PDFs & Text", href: "/chat", icon: MessageSquare, color: "from-indigo-500 to-purple-600" },
                    { label: "Quiz Generator", desc: "Test domain knowledge", href: "/quizzes", icon: HelpCircle, color: "from-purple-500 to-pink-600" },
                    { label: "Upload Material", desc: "Add new study resources", href: "/documents", icon: UploadCloud, color: "from-blue-500 to-cyan-600" },
                    { label: "AI Recs Engine", desc: "Personalized weakness fix", href: "/recommendations", icon: Compass, color: "from-emerald-500 to-teal-600" },
                ].map((action, i) => {
                    const Icon = action.icon;
                    return (
                        <Link key={i} href={action.href}>
                            <motion.div
                                whileHover={{ scale: 1.03, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                className="p-4 rounded-2xl bg-card/60 backdrop-blur-xl border border-border/50 hover:border-indigo-500/30 shadow-sm flex items-center gap-3.5 group cursor-pointer transition-all"
                            >
                                <div className={cn("h-11 w-11 rounded-xl bg-gradient-to-br flex items-center justify-center text-white shadow-md shrink-0", action.color)}>
                                    <Icon className="h-5 w-5" />
                                </div>
                                <div className="overflow-hidden">
                                    <h4 className="text-sm font-bold truncate group-hover:text-primary transition-colors">{action.label}</h4>
                                    <p className="text-[11px] text-muted-foreground truncate">{action.desc}</p>
                                </div>
                            </motion.div>
                        </Link>
                    );
                })}
            </section>

            {/* Assigned Teacher Card */}
            {profile?.role === "student" && (
                <section>
                    <AssignedTeacherCard teacher={profile.assigned_teacher || null} />
                </section>
            )}

            {/* Stats Cards Grid */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
                <DashboardCard
                    title="Docs Uploaded"
                    value={loading ? "..." : stats.documents_uploaded.toString()}
                    icon={Files}
                    gradient
                />
                <DashboardCard
                    title="Summaries"
                    value={loading ? "..." : stats.summaries_generated.toString()}
                    icon={FileText}
                />
                <DashboardCard
                    title="Quizzes"
                    value={loading ? "..." : stats.quizzes_completed.toString()}
                    icon={CheckCircle2}
                />
                <DashboardCard
                    title="Avg Score"
                    value={loading ? "..." : `${stats.avg_quiz_score}%`}
                    icon={Trophy}
                    trend={{ value: "4%", isUp: true }}
                />
                <DashboardCard
                    title="Study Hours"
                    value={loading ? "..." : `${stats.study_time_hours}h`}
                    icon={Clock}
                    trend={{ value: "12%", isUp: true }}
                />
                <DashboardCard
                    title="Streak"
                    value={loading ? "..." : `${stats.learning_streak} Days`}
                    icon={Zap}
                    gradient
                />
            </section>

            {/* Top Interactive Widget: AI Focus Sprint & Exam Preparedness */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* AI Focus Sprint (Pomodoro Timer) */}
                <Card className="lg:col-span-7 border-none bg-gradient-to-br from-indigo-900/20 via-purple-900/10 to-card/40 backdrop-blur-xl shadow-md rounded-3xl p-6 relative overflow-hidden border border-indigo-500/15">
                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="space-y-2 text-center sm:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
                                <Sparkles className="w-3.5 h-3.5" />
                                {sprintMode === "focus" ? "AI Focus Sprint" : "Rest & Refresh Break"}
                            </div>
                            <h3 className="text-xl font-bold">Deep Study Session</h3>
                            <p className="text-xs text-muted-foreground max-w-xs">
                                {sprintMode === "focus"
                                    ? "Maintain high cognitive retention with 25-minute focus intervals."
                                    : "Take a 5-minute break to process key concepts and rest your eyes."}
                            </p>
                        </div>

                        {/* Timer Display & Controls */}
                        <div className="flex flex-col items-center gap-3">
                            <div className="relative flex items-center justify-center">
                                <div className="text-4xl sm:text-5xl font-black tracking-tight font-mono text-indigo-400 drop-shadow-sm">
                                    {formatTimer(timerSeconds)}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    size="sm"
                                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                                    className={cn(
                                        "rounded-xl px-5 h-9 font-bold text-xs shadow-md transition-all",
                                        isTimerRunning ? "bg-amber-500 hover:bg-amber-600 text-white" : "gradient-bg text-white"
                                    )}
                                >
                                    {isTimerRunning ? (
                                        <>
                                            <Pause className="w-3.5 h-3.5 mr-1.5" /> Pause
                                        </>
                                    ) : (
                                        <>
                                            <Play className="w-3.5 h-3.5 mr-1.5" /> Start Focus
                                        </>
                                    )}
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                        setIsTimerRunning(false);
                                        setTimerSeconds(sprintMode === "focus" ? 1500 : 300);
                                    }}
                                    className="rounded-xl h-9 px-3 border-border/60 hover:bg-muted"
                                >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Exam Preparedness Score Meter */}
                <Card className="lg:col-span-5 border-none bg-gradient-to-br from-emerald-900/15 via-teal-900/10 to-card/40 backdrop-blur-xl shadow-md rounded-3xl p-6 border border-emerald-500/15 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">AI Assessment</span>
                            <h3 className="text-lg font-bold">Exam Readiness Score</h3>
                        </div>
                        <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                            <Award className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="my-4 flex items-center gap-5">
                        <div className="relative flex items-center justify-center h-20 w-20 rounded-full border-4 border-emerald-500/20 bg-emerald-500/5">
                            <span className="text-2xl font-black text-emerald-400">{readinessScore}%</span>
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-sm font-bold text-emerald-400">
                                {readinessScore >= 80 ? "Excellent Readiness" : readinessScore >= 65 ? "Good Foundation" : "Needs Review"}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                                Calculated from your {stats.quizzes_completed} quiz attempts and {stats.learning_streak}-day study streak.
                            </p>
                        </div>
                    </div>

                    <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Target: 95% Mastery</span>
                        <Link href="/recommendations" className="text-emerald-400 font-bold hover:underline flex items-center gap-1">
                            Optimize Score <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </Card>
            </section>

            {/* Charts Section */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Weekly Study Progress (Main Chart) */}
                <Card className="lg:col-span-8 border-none bg-card/40 backdrop-blur-xl shadow-sm rounded-3xl p-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-xl font-bold">Weekly Study Progress</CardTitle>
                            <CardDescription>Intensity of your study sessions over the last 7 days</CardDescription>
                        </div>
                        <div className="p-2 bg-indigo-500/10 rounded-xl">
                            <TrendingUp className="h-5 w-5 text-indigo-500" />
                        </div>
                    </CardHeader>
                    <CardContent className="h-[350px] mt-4">
                        {isMounted ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={overview.weekly_progress}>
                                    <defs>
                                        <linearGradient id="colorStudy" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888810" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888888' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888888' }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '16px', border: '1px solid hsl(var(--border))' }}
                                        cursor={{ stroke: '#6366f1', strokeWidth: 2 }}
                                    />
                                    <Area type="monotone" dataKey="sessions" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorStudy)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full w-full" />
                        )}
                    </CardContent>
                </Card>

                {/* Quiz Performance Trend */}
                <Card className="lg:col-span-4 border-none bg-card/40 backdrop-blur-xl shadow-sm rounded-3xl p-2">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold">Quiz Performance</CardTitle>
                        <CardDescription>Score improvement monthly</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px] mt-4">
                        {isMounted ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={overview.quiz_trend}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888810" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888888' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888888' }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '16px', border: '1px solid hsl(var(--border))' }}
                                    />
                                    <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                                        {overview.quiz_trend.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index === overview.quiz_trend.length - 1 ? "#4f46e5" : "#4f46e540"} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full w-full" />
                        )}
                    </CardContent>
                </Card>
            </section>

            {/* Middle Interactive Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Subject Performance Radar */}
                <Card className="border-none bg-card/40 backdrop-blur-xl shadow-sm rounded-3xl p-2">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold">Subject Performance</CardTitle>
                        <CardDescription>Academic balance overview</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center">
                        {isMounted ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={overview.subject_performance}>
                                    <PolarGrid stroke="#88888820" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#888888' }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                                    <Radar name="Student" dataKey="A" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.6} />
                                    <Tooltip />
                                </RadarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full w-full" />
                        )}
                    </CardContent>
                </Card>

                {/* Weak & Strong Topics */}
                <div className="space-y-6">
                    {/* Weak Topics */}
                    <Card className="border-none bg-red-500/5 backdrop-blur-xl border border-red-500/10 shadow-sm rounded-3xl">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold flex items-center gap-2">
                                <AlertCircle className="h-4 w-4 text-red-500" />
                                Critical Topics to Review
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {overview.weak_topics.map((topic) => (
                                <div key={topic.name} className="flex items-center justify-between p-3 rounded-2xl bg-background/50 border border-border/50">
                                    <span className="text-sm font-medium">{topic.name}</span>
                                    <span className="text-xs font-bold text-red-500">{topic.score}%</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Strong Topics */}
                    <Card className="border-none bg-emerald-500/5 backdrop-blur-xl border border-emerald-500/10 shadow-sm rounded-3xl">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold flex items-center gap-2">
                                <ThumbsUp className="h-4 w-4 text-emerald-500" />
                                Mastered Topics
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {overview.strong_topics.map((topic) => (
                                <div key={topic.name} className="flex items-center justify-between p-3 rounded-2xl bg-background/50 border border-border/50">
                                    <span className="text-sm font-medium">{topic.name}</span>
                                    <span className="text-xs font-bold text-emerald-500">{topic.score}%</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Upcoming Goals with Interactive Adder */}
                <Card className="border-none bg-card/40 backdrop-blur-xl shadow-sm rounded-3xl p-2 flex flex-col justify-between">
                    <div>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg font-bold">Study Goals</CardTitle>
                            <Target className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent className="space-y-4 pt-2">
                            {goals.map((goal) => (
                                <div key={goal.id} className="space-y-2">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="font-semibold">{goal.title}</span>
                                        <span className="text-muted-foreground">{goal.date}</span>
                                    </div>
                                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${goal.progress}%` }}
                                            className="h-full gradient-bg"
                                        />
                                    </div>
                                    <div className="flex justify-end">
                                        <span className="text-[10px] font-bold text-primary">{goal.progress}%</span>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </div>

                    <CardContent className="pt-0">
                        {showAddGoal ? (
                            <form onSubmit={handleAddGoal} className="space-y-2 mt-2">
                                <input
                                    type="text"
                                    placeholder="Enter goal title..."
                                    value={newGoalTitle}
                                    onChange={(e) => setNewGoalTitle(e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl text-xs bg-background/80 border border-border/60 outline-none focus:border-indigo-500"
                                    autoFocus
                                />
                                <div className="flex items-center gap-2">
                                    <Button type="submit" size="sm" className="w-full rounded-xl gradient-bg text-white h-8 text-xs font-bold">
                                        Save Goal
                                    </Button>
                                    <Button type="button" size="sm" variant="ghost" onClick={() => setShowAddGoal(false)} className="h-8 text-xs">
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <Button
                                onClick={() => setShowAddGoal(true)}
                                className="w-full rounded-xl bg-primary/10 text-primary hover:bg-primary/20 border-none h-10 text-xs flex items-center justify-center gap-1.5"
                            >
                                <Plus className="w-3.5 h-3.5" /> Add New Goal
                            </Button>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Section: Recent Activity & AI Recs */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Recent Activity */}
                <Card className="xl:col-span-8 border-none bg-card/40 backdrop-blur-xl shadow-sm rounded-3xl overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-xl font-bold">Recent Activity</CardTitle>
                            <CardDescription>Your history from the last 48 hours</CardDescription>
                        </div>
                        <Button variant="ghost" className="text-xs hover:bg-muted px-4 rounded-xl">View Archive</Button>
                    </CardHeader>
                    <CardContent className="pt-2">
                        <div className="space-y-1">
                            {overview.recent_activities.map((activity) => (
                                <div key={activity.id} className="group flex items-center justify-between p-4 rounded-2xl hover:bg-muted/30 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "h-12 w-12 flex items-center justify-center rounded-2xl bg-primary/5 text-primary group-hover:scale-110 transition-transform",
                                            activity.type === 'quiz' && "bg-purple-500/10 text-purple-500",
                                            activity.type === 'summary' && "bg-blue-500/10 text-blue-500",
                                            activity.type === 'document' && "bg-amber-500/10 text-amber-500"
                                        )}>
                                            {activity.type === 'quiz' ? <Trophy className="h-5 w-5" /> :
                                                activity.type === 'summary' ? <FileText className="h-5 w-5" /> :
                                                    <Files className="h-5 w-5" />}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold group-hover:text-primary transition-colors">{activity.title}</h4>
                                            <p className="text-[11px] text-muted-foreground flex items-center gap-2 mt-1">
                                                {activity.time} <span className="h-1 w-1 bg-border rounded-full" /> {activity.status}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {activity.score && <span className="text-sm font-bold text-emerald-500">{activity.score}</span>}
                                        <Button size="icon" variant="ghost" className="rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* AI Recommendations */}
                <Card className="xl:col-span-4 border-none bg-indigo-600/5 backdrop-blur-xl border border-indigo-500/10 shadow-sm rounded-3xl overflow-hidden">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                            <BrainCircuit className="h-6 w-6 text-indigo-500" />
                            AI Recs
                        </CardTitle>
                        <CardDescription>Personalized optimization</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-2">
                        {overview.recommendations.map((rec) => (
                            <div key={rec.id} className="relative p-5 rounded-2xl bg-background/40 border border-indigo-500/10 hover:border-indigo-500/30 transition-all cursor-pointer group">
                                <div className={cn(
                                    "absolute top-4 right-4 h-2 w-2 rounded-full",
                                    rec.urgency === 'High' ? "bg-red-500 animate-pulse" : "bg-amber-500"
                                )} />
                                <h4 className="text-sm font-bold pr-6">{rec.title}</h4>
                                <p className="text-xs text-muted-foreground mt-2">{rec.reason}</p>
                                <div className="mt-4 flex items-center justify-between">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-500">Urgency: {rec.urgency}</span>
                                    <Link href="/recommendations">
                                        <Button size="sm" variant="ghost" className="h-8 rounded-lg text-[10px] font-bold group-hover:bg-indigo-500 group-hover:text-white transition-all">START NOW</Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                        <Link href="/recommendations" className="block w-full">
                            <Button className="w-full rounded-2xl bg-white text-black hover:bg-zinc-100 transition-all h-12 font-bold text-xs mt-4">
                                Explore All Insights
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
