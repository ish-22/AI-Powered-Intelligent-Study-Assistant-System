"use client";

import React from "react";
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
    ChevronRight
} from "lucide-react";
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
    Legend,
    Cell,
    PieChart,
    Pie
} from "recharts";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/lib/use-current-user";
import { useDashboardStats } from "@/lib/use-dashboard-stats";
import { useDashboardOverview } from "@/lib/use-dashboard-overview";

export default function DashboardPage() {
    const { displayName } = useCurrentUser();
    const { stats, loading } = useDashboardStats();
    const { overview, loading: overviewLoading } = useDashboardOverview();
    const [isMounted, setIsMounted] = React.useState(false);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

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
                        {displayName.split(" ")[0]}'s <span className="gradient-text">Dashboard</span>
                    </motion.h1>
                    <p className="text-muted-foreground mt-2 max-w-md">
                        Welcome back, {displayName}. Your AI assistant is ready with study tools, recommendations, and account insights.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-2xl h-12 px-6 border-2 hover:bg-muted/50 transition-all">
                        <Calendar className="mr-2 h-4 w-4" />
                        Calendar
                    </Button>
                    <Button className="rounded-2xl h-12 px-6 gradient-bg shadow-xl shadow-indigo-500/25 border-none hover:scale-105 transition-all">
                        <Sparkles className="mr-2 h-5 w-5" />
                        AI Assistant
                    </Button>
                </div>
            </section>

            {/* Stats Cards Grid - Now using real backend data */}
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

                {/* Upcoming Goals */}
                <Card className="border-none bg-card/40 backdrop-blur-xl shadow-sm rounded-3xl p-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg font-bold">Study Goals</CardTitle>
                        <Target className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent className="space-y-6 pt-2">
                        {overview.study_goals.map((goal) => (
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
                        <Button className="w-full rounded-xl bg-primary/10 text-primary hover:bg-primary/20 border-none h-10 text-xs">
                            Add New Goal
                        </Button>
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
                                    <Button size="sm" variant="ghost" className="h-8 rounded-lg text-[10px] font-bold group-hover:bg-indigo-500 group-hover:text-white transition-all">START NOW</Button>
                                </div>
                            </div>
                        ))}
                        <Button className="w-full rounded-2xl bg-white text-black hover:bg-zinc-100 transition-all h-12 font-bold text-xs mt-4">
                            Explore All Insights
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
