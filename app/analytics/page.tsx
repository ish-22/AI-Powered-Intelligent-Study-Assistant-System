"use client";

import React from "react";
import {
    BarChart3,
    TrendingUp,
    Clock,
    Trophy,
    Zap,
    Download,
    Calendar,
    ArrowUpRight,
    Target,
    Brain,
    Sparkles
} from "lucide-react";
import { DashboardCard } from "@/components/dashboard-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    AreaChart, Area,
    BarChart, Bar,
    XAxis, YAxis,
    CartesianGrid, Tooltip,
    ResponsiveContainer,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useDashboardStats } from "@/lib/use-dashboard-stats";
import { useDashboardOverview } from "@/lib/use-dashboard-overview";

export default function AnalyticsPage() {
    const { stats, loading: statsLoading } = useDashboardStats();
    const { overview, loading: overviewLoading } = useDashboardOverview();

    // Safety check for Recharts hydration
    const [isMounted, setIsMounted] = React.useState(false);
    React.useEffect(() => setIsMounted(true), []);

    const isLoading = statsLoading || overviewLoading;

    // Transform backend shapes into graph shapes if needed
    const focusAreas = [
        {
            name: "Weak Areas",
            data: overview.weak_topics?.length ? overview.weak_topics.map(t => ({ name: t.name, value: t.score })) : [{ name: "Need more data", value: 0 }],
            color: "#ef4444"
        },
        {
            name: "Strong Areas",
            data: overview.strong_topics?.length ? overview.strong_topics.map(t => ({ name: t.name, value: t.score })) : [{ name: "Need more data", value: 0 }],
            color: "#10b981"
        }
    ];

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-6">
                <div className="relative">
                    <div className="h-16 w-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                </div>
                <h2 className="text-xl font-bold text-muted-foreground animate-pulse">Loading Analytics Data...</h2>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-12 animate-fade-in">
            {/* Header */}
            <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Progress <span className="gradient-text">Analytics</span></h1>
                    <p className="text-muted-foreground mt-1">Deep insights into your learning journey and academic performance.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-2xl h-11">
                        <Calendar className="mr-2 h-4 w-4" />
                        Last 30 Days
                    </Button>
                    <Button className="rounded-2xl h-11 px-6 gradient-bg shadow-lg shadow-indigo-500/20 border-none font-bold group">
                        <Download className="mr-2 h-4 w-4" />
                        Export Report
                    </Button>
                </div>
            </section>

            {/* Summary Metrics */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <DashboardCard
                    title="Average Score"
                    value={`${stats.avg_quiz_score}%`}
                    icon={Trophy}
                    trend={{ value: "4.2%", isUp: true }}
                    gradient
                />
                <DashboardCard
                    title="Total Quizzes"
                    value={stats.quizzes_completed.toString()}
                    icon={BarChart3}
                    trend={{ value: "12 This Month", isUp: true }}
                />
                <DashboardCard
                    title="Study Hours"
                    value={stats.study_time_hours.toString()}
                    icon={Clock}
                    trend={{ value: "+2.5h", isUp: true }}
                />
                <DashboardCard
                    title="Learning Streak"
                    value={`${stats.learning_streak} Days`}
                    icon={Zap}
                    trend={{ value: "Keep it up!", isUp: true }}
                    gradient
                />
            </section>

            {/* Main Charts Row */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Monthly Performance Trend */}
                <Card className="xl:col-span-8 border-none bg-card/40 backdrop-blur-xl shadow-sm rounded-3xl overflow-hidden p-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-xl font-bold">Monthly Progress</CardTitle>
                            <CardDescription>Average Quiz Score Trend over the last 6 months</CardDescription>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-indigo-500" />
                                <span className="text-[10px] font-bold text-muted-foreground uppercase">Score</span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="h-[400px] mt-4">
                        {isMounted ? (
                            <ResponsiveContainer width="100%" height={320}>
                                <AreaChart data={overview.quiz_trend}>
                                    <defs>
                                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888810" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888888' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888888' }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '16px', border: '1px solid hsl(var(--border))' }}
                                    />
                                    <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorScore)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full w-full" />
                        )}
                    </CardContent>
                </Card>

                {/* Subject Radar */}
                <Card className="xl:col-span-4 border-none bg-card/40 backdrop-blur-xl shadow-sm rounded-3xl overflow-hidden p-2">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold">Academic Balance</CardTitle>
                        <CardDescription>Performance across main domains</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[400px]">
                        {isMounted ? (
                            <ResponsiveContainer width="100%" height={320}>
                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={overview.subject_performance}>
                                    <PolarGrid stroke="#88888820" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#888888' }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                    <Radar name="Score" dataKey="A" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.6} />
                                    <Tooltip />
                                </RadarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full w-full" />
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Secondary Charts Row */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Weekly Progress Bar */}
                <Card className="border-none bg-card/40 backdrop-blur-xl shadow-sm rounded-3xl overflow-hidden p-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-xl font-bold">Weekly Activity</CardTitle>
                        <TrendingUp className="h-5 w-5 text-emerald-500" />
                    </CardHeader>
                    <CardContent className="h-[300px] mt-2">
                        {isMounted ? (
                            <ResponsiveContainer width="100%" height={260}>
                                <BarChart data={overview.weekly_progress}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888810" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888888' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888888' }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '16px', border: '1px solid hsl(var(--border))' }}
                                        cursor={{ fill: '#88888810' }}
                                    />
                                    <Bar dataKey="sessions" radius={[6, 6, 0, 0]} fill="#6366f1" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full w-full" />
                        )}
                    </CardContent>
                </Card>

                {/* Focus Analysis */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {focusAreas.map((area) => (
                        <Card key={area.name} className={cn(
                            "border-none backdrop-blur-xl shadow-sm rounded-3xl overflow-hidden p-2",
                            area.name === "Strong Areas" ? "bg-emerald-500/5 border border-emerald-500/10" : "bg-red-500/5 border border-red-500/10"
                        )}>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                    {area.name === "Strong Areas" ? <Target className="h-4 w-4 text-emerald-500" /> : <Brain className="h-4 w-4 text-red-500" />}
                                    {area.name}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-4 px-6 pb-6">
                                {area.data.map((item) => (
                                    <div key={item.name} className="space-y-2">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="font-semibold">{item.name}</span>
                                            <span className="font-bold" style={{ color: area.color }}>{item.value}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${item.value}%` }}
                                                className="h-full"
                                                style={{ backgroundColor: area.color }}
                                            />
                                        </div>
                                    </div>
                                ))}
                                <Button variant="ghost" className="w-full h-8 text-[10px] font-bold uppercase tracking-widest mt-2 hover:bg-black/5 dark:hover:bg-white/5">Analyze Full List</Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* AI Performance Insight Section - Driven by Real Stats! */}
            <section className="mt-8">
                <Card className="border-none bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white rounded-[40px] p-10 overflow-hidden relative group">
                    <div className="absolute top-0 right-0 h-64 w-64 bg-white/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-white/20 transition-all" />
                    <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10">
                        <div className="h-28 w-28 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center shrink-0 shadow-2xl">
                            <Sparkles className="h-14 w-14 text-white animate-pulse" />
                        </div>
                        <div className="flex-1 text-center lg:text-left">
                            <h2 className="text-3xl font-black tracking-tight mb-4">Neural Learning Insight</h2>

                            {/* Dynamic AI message based on real user stats */}
                            {overview.strong_topics?.length > 0 && overview.weak_topics?.length > 0 ? (
                                <p className="text-indigo-100 leading-relaxed text-lg max-w-2xl">
                                    Based on your recent performance, you have shown incredible strength in <strong>{overview.strong_topics[0].name}</strong> ({overview.strong_topics[0].score}%).
                                    However, your focus on <strong>{overview.weak_topics[0].name}</strong> could use some improvement.
                                    We recommend generating a focused Quiz on <strong>{overview.weak_topics[0].name}</strong> to boost your score to parity!
                                </p>
                            ) : (
                                <p className="text-indigo-100 leading-relaxed text-lg max-w-2xl">
                                    You are doing a fantastic job studying! Your massive <strong>{stats.learning_streak} day learning streak</strong> shows high dedication. Create more documents and quizzes so our AI can generate deeper analysis of your academic blind spots.
                                </p>
                            )}

                            <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-4">
                                <Button className="bg-white text-indigo-600 hover:bg-indigo-50 rounded-2xl h-12 px-8 font-bold text-sm shadow-xl">
                                    Optimize My Studies
                                </Button>
                            </div>
                        </div>
                        <div className="hidden lg:block">
                            <div className="flex items-center gap-2 bg-emerald-500/20 px-6 py-3 rounded-2xl border border-emerald-500/30">
                                <ArrowUpRight className="h-6 w-6 text-emerald-400" />
                                <span className="text-xl font-bold">{stats.learning_streak > 3 ? "Highly Consistent" : "Warming Up"}</span>
                            </div>
                        </div>
                    </div>
                </Card>
            </section>
        </div>
    );
}
