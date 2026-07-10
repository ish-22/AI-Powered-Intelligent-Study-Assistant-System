"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
    Sparkles, Target, Brain, BookOpen, Lightbulb, Zap,
    Clock, ChevronRight, PlayCircle, FileText, AlertCircle,
    Calendar, ArrowRight, Trophy, RefreshCw, CheckCircle2,
    TrendingUp, BarChart3, Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { api, type Recommendation, type StudyPlanItem } from "@/lib/api";

const PRIORITY_CONFIG = {
    High:   { color: "red",    bg: "bg-red-500/10",    text: "text-red-500",    border: "border-red-500/20"    },
    Medium: { color: "amber",  bg: "bg-amber-500/10",  text: "text-amber-500",  border: "border-amber-500/20"  },
    Low:    { color: "indigo", bg: "bg-indigo-500/10", text: "text-indigo-500", border: "border-indigo-500/20" },
};

const ACTION_ICON = {
    quiz:    Trophy,
    summary: FileText,
    review:  Brain,
};

const PLAN_TYPE_COLOR = {
    quiz:    "bg-indigo-500",
    summary: "bg-purple-500",
    review:  "bg-emerald-500",
    break:   "bg-muted",
};

export default function RecommendationsPage() {
    const { data: session } = useSession();
    const token = (session as any)?.accessToken as string | undefined;
    const router = useRouter();

    const [loading, setLoading]           = useState(true);
    const [regenerating, setRegenerating] = useState(false);
    const [error, setError]               = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<number | null>(null);
    const [actionDone, setActionDone]     = useState<Set<number>>(new Set());

    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [studyPlan, setStudyPlan]             = useState<StudyPlanItem[]>([]);
    const [focusTip, setFocusTip]               = useState("");
    const [aiInsight, setAiInsight]             = useState("");
    const [summary, setSummary]                 = useState({
        total_docs: 0, with_quiz: 0, with_summary: 0, avg_score: 0, streak: 0,
    });

    const load = useCallback(async (showRegenSpinner = false) => {
        if (!token) return;
        showRegenSpinner ? setRegenerating(true) : setLoading(true);
        setError(null);
        try {
            const data = await api.recommendations.generate(token);
            setRecommendations(data.recommendations);
            setStudyPlan(data.study_plan);
            setFocusTip(data.focus_tip);
            setAiInsight(data.ai_insight);
            setSummary(data.summary);
            setActionDone(new Set());
        } catch (e: any) {
            setError(e.message || "Failed to load recommendations.");
        } finally {
            setLoading(false);
            setRegenerating(false);
        }
    }, [token]);

    useEffect(() => { load(); }, [load]);

    const handleAction = async (rec: Recommendation) => {
        if (!token || !rec.document_id) {
            // No document linked — navigate to documents page
            router.push("/documents");
            return;
        }
        setActionLoading(rec.id);
        try {
            if (rec.action === "quiz") {
                await api.documents.generateQuiz(token, rec.document_id, 10, "medium", "");
                router.push("/quiz");
            } else if (rec.action === "summary") {
                await api.documents.generateSummary(token, rec.document_id);
                router.push("/documents");
            } else {
                router.push("/documents");
            }
            setActionDone(prev => new Set(prev).add(rec.id));
        } catch {
            // still navigate
            router.push(rec.action === "quiz" ? "/quiz" : "/documents");
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                <div className="relative">
                    <div className="h-20 w-20 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                    <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-indigo-500 animate-pulse" />
                </div>
                <div className="text-center space-y-1">
                    <h2 className="text-xl font-bold gradient-text">AI is analyzing your study data...</h2>
                    <p className="text-sm text-muted-foreground">Building your personalized learning path</p>
                </div>
            </div>
        );
    }

    if (summary.total_docs === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center max-w-md mx-auto">
                <div className="h-24 w-24 rounded-3xl bg-indigo-500/10 flex items-center justify-center">
                    <Upload className="h-12 w-12 text-indigo-500" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold">No documents yet</h2>
                    <p className="text-muted-foreground text-sm">{focusTip || "Upload your first document to unlock AI-powered recommendations."}</p>
                </div>
                <Button onClick={() => router.push("/documents")} className="rounded-2xl h-12 px-8 gradient-bg border-none font-bold">
                    Upload a Document
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-12 animate-fade-in max-w-7xl mx-auto">

            {/* Header — AI Coach */}
            <section className="bg-gradient-to-br from-indigo-600/10 via-purple-600/10 to-transparent p-8 rounded-[40px] border border-indigo-500/10 flex flex-col md:flex-row items-center gap-8 shadow-sm">
                <div className="h-24 w-24 rounded-3xl gradient-bg flex items-center justify-center shrink-0 shadow-2xl shadow-indigo-500/20">
                    <Brain className="h-12 w-12 text-white animate-pulse" />
                </div>
                <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                        <Badge className="bg-indigo-500 text-white border-none rounded-full px-4 py-1 text-[10px] font-bold">AI COACH</Badge>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Live analysis</span>
                    </div>
                    <h1 className="text-3xl font-black tracking-tight mb-2">
                        Your <span className="gradient-text">Learning Path</span> is ready.
                    </h1>
                    <p className="text-muted-foreground text-sm max-w-2xl">{aiInsight}</p>
                </div>
                <Button
                    onClick={() => load(true)}
                    disabled={regenerating}
                    className="rounded-2xl h-14 px-8 gradient-bg border-none font-bold shadow-xl shadow-indigo-500/20 shrink-0"
                >
                    {regenerating
                        ? <><RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Regenerating...</>
                        : <><RefreshCw className="mr-2 h-4 w-4" /> Regenerate Plan</>
                    }
                </Button>
            </section>

            {/* Stats Row */}
            <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                    { label: "Documents",  value: summary.total_docs,   icon: BookOpen,   color: "text-indigo-500" },
                    { label: "Quizzed",    value: summary.with_quiz,    icon: Trophy,     color: "text-emerald-500" },
                    { label: "Summarized", value: summary.with_summary, icon: FileText,   color: "text-purple-500" },
                    { label: "Avg Score",  value: `${summary.avg_score}%`, icon: BarChart3, color: "text-amber-500" },
                    { label: "Streak",     value: `${summary.streak}d`, icon: Zap,        color: "text-red-500" },
                ].map(({ label, value, icon: Icon, color }) => (
                    <Card key={label} className="border-none bg-card/40 backdrop-blur-xl rounded-2xl">
                        <CardContent className="p-4 flex items-center gap-3">
                            <Icon className={cn("h-5 w-5 shrink-0", color)} />
                            <div>
                                <p className="text-xs text-muted-foreground font-medium">{label}</p>
                                <p className="text-lg font-bold">{value}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </section>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <span className="text-sm font-semibold">{error}</span>
                    <Button variant="ghost" size="sm" onClick={() => load()} className="ml-auto text-red-500 hover:text-red-400">Retry</Button>
                </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">

                {/* Left: Recommendations */}
                <div className="xl:col-span-8 space-y-10">

                    {/* Weak Topics & Priorities */}
                    <section className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 text-red-500" />
                                AI Recommendations
                            </h2>
                            <span className="text-xs text-muted-foreground">{recommendations.length} items · based on your real data</span>
                        </div>

                        <AnimatePresence>
                            {recommendations.length === 0 ? (
                                <Card className="border-none bg-card/40 rounded-3xl p-8 text-center">
                                    <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
                                    <p className="font-bold text-lg">All caught up!</p>
                                    <p className="text-sm text-muted-foreground mt-1">Upload more documents to get new recommendations.</p>
                                </Card>
                            ) : (
                                <div className="grid grid-cols-1 gap-6">
                                    {recommendations.map((rec) => {
                                        const cfg    = PRIORITY_CONFIG[rec.priority] ?? PRIORITY_CONFIG.Low;
                                        const Icon   = ACTION_ICON[rec.action] ?? Brain;
                                        const isDone = actionDone.has(rec.id);
                                        return (
                                            <motion.div key={rec.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} whileHover={{ x: 4 }}>
                                                <Card className={cn("border-none bg-card/40 backdrop-blur-xl shadow-sm rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-indigo-500/5 transition-all", isDone && "opacity-60")}>
                                                    <CardContent className="p-6">
                                                        <div className="flex flex-col md:flex-row gap-6">
                                                            <div className={cn("h-16 w-16 md:h-20 md:w-20 rounded-3xl flex items-center justify-center shrink-0 shadow-lg", cfg.bg, cfg.text)}>
                                                                <Icon className="h-8 w-8 md:h-10 md:w-10" />
                                                            </div>
                                                            <div className="flex-1 space-y-4">
                                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                                                    <div>
                                                                        <div className="flex items-center gap-2 flex-wrap">
                                                                            <h3 className="text-xl font-bold">{rec.topic}</h3>
                                                                            <Badge variant="outline" className={cn("rounded-lg text-[10px] font-bold border", cfg.text, cfg.border)}>
                                                                                {rec.subject}
                                                                            </Badge>
                                                                        </div>
                                                                        <p className="text-xs text-muted-foreground mt-1">{rec.reason}</p>
                                                                        {rec.document_name && (
                                                                            <p className="text-[10px] text-indigo-400 mt-0.5 flex items-center gap-1">
                                                                                <FileText className="h-3 w-3" /> {rec.document_name}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                    <Badge
                                                                        className={cn("rounded-lg px-3 py-1 self-start font-bold text-xs border-none",
                                                                            rec.priority === "High"   ? "bg-red-500/15 text-red-500" :
                                                                            rec.priority === "Medium" ? "bg-amber-500/15 text-amber-500" :
                                                                                                        "bg-indigo-500/15 text-indigo-500"
                                                                        )}
                                                                    >
                                                                        {rec.priority} Priority
                                                                    </Badge>
                                                                </div>

                                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-2">
                                                                    <div className="space-y-1">
                                                                        <span className="text-[10px] font-bold text-muted-foreground uppercase">Mastery</span>
                                                                        <div className="flex items-center gap-3">
                                                                            <Progress value={rec.confidence} className="h-1.5 flex-1" />
                                                                            <span className="text-xs font-bold">{rec.confidence}%</span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="space-y-1">
                                                                        <span className="text-[10px] font-bold text-muted-foreground uppercase">Est. Time</span>
                                                                        <div className="flex items-center gap-2 text-xs font-bold">
                                                                            <Clock className="h-3 w-3 text-indigo-500" />
                                                                            {rec.estimated_minutes} mins
                                                                        </div>
                                                                    </div>
                                                                    <div className="space-y-1">
                                                                        <span className="text-[10px] font-bold text-muted-foreground uppercase">Action</span>
                                                                        <span className="text-xs font-bold capitalize">{rec.action}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="mt-6 pt-5 border-t border-white/5 flex flex-wrap gap-3">
                                                            <Button
                                                                onClick={() => handleAction(rec)}
                                                                disabled={actionLoading === rec.id || isDone}
                                                                className="rounded-xl h-10 bg-indigo-600 hover:bg-indigo-700 border-none px-6 font-bold text-xs"
                                                            >
                                                                {actionLoading === rec.id ? (
                                                                    <><RefreshCw className="mr-2 h-3 w-3 animate-spin" /> Loading...</>
                                                                ) : isDone ? (
                                                                    <><CheckCircle2 className="mr-2 h-3 w-3" /> Done</>
                                                                ) : rec.action === "quiz" ? (
                                                                    <><PlayCircle className="mr-2 h-4 w-4" /> Generate Quiz</>
                                                                ) : rec.action === "summary" ? (
                                                                    <><Sparkles className="mr-2 h-4 w-4" /> Generate Summary</>
                                                                ) : (
                                                                    <><BookOpen className="mr-2 h-4 w-4" /> Review Document</>
                                                                )}
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                onClick={() => {
                                                                    const params = new URLSearchParams();
                                                                    if (rec.document_id)   params.set("document_id",   rec.document_id);
                                                                    if (rec.document_name) params.set("document_name", rec.document_name);
                                                                    router.push(`/chat?${params.toString()}`);
                                                                }}
                                                                className="rounded-xl h-10 border-2 px-6 font-bold text-xs"
                                                            >
                                                                <Lightbulb className="mr-2 h-4 w-4" /> Ask AI
                                                            </Button>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}
                        </AnimatePresence>
                    </section>

                    {/* Quick Actions Row */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold flex items-center gap-2 px-2 text-muted-foreground">
                                <Target className="h-4 w-4" /> Quick Actions
                            </h3>
                            {[
                                { label: "Take a Quiz",        icon: Trophy,   href: "/quiz",      color: "text-indigo-500",  bg: "bg-indigo-500/10" },
                                { label: "Chat with AI",       icon: Brain,    href: "/chat",      color: "text-purple-500",  bg: "bg-purple-500/10" },
                                { label: "Upload Document",    icon: Upload,   href: "/documents", color: "text-emerald-500", bg: "bg-emerald-500/10" },
                                { label: "View Analytics",     icon: TrendingUp, href: "/analytics", color: "text-amber-500", bg: "bg-amber-500/10" },
                            ].map(({ label, icon: Icon, href, color, bg }) => (
                                <Card
                                    key={label}
                                    onClick={() => router.push(href)}
                                    className="border-none bg-card/40 shadow-sm rounded-2xl overflow-hidden hover:bg-muted/50 transition-all cursor-pointer group"
                                >
                                    <CardContent className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", bg, color)}>
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <span className="text-sm font-bold">{label}</span>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* AI Insight Card */}
                        <Card className="border-none bg-gradient-to-br from-indigo-600/10 via-purple-600/5 to-transparent rounded-3xl overflow-hidden border border-indigo-500/10">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                    <Sparkles className="h-4 w-4 text-indigo-500" /> Neural Insight
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-sm text-muted-foreground leading-relaxed">{aiInsight}</p>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-muted-foreground font-medium">Quiz Coverage</span>
                                        <span className="font-bold">{summary.total_docs > 0 ? Math.round((summary.with_quiz / summary.total_docs) * 100) : 0}%</span>
                                    </div>
                                    <Progress value={summary.total_docs > 0 ? (summary.with_quiz / summary.total_docs) * 100 : 0} className="h-1.5" />
                                    <div className="flex justify-between text-xs">
                                        <span className="text-muted-foreground font-medium">Summary Coverage</span>
                                        <span className="font-bold">{summary.total_docs > 0 ? Math.round((summary.with_summary / summary.total_docs) * 100) : 0}%</span>
                                    </div>
                                    <Progress value={summary.total_docs > 0 ? (summary.with_summary / summary.total_docs) * 100 : 0} className="h-1.5" />
                                </div>
                            </CardContent>
                        </Card>
                    </section>
                </div>

                {/* Right Sidebar: Today's Study Plan */}
                <aside className="xl:col-span-4 space-y-8">
                    <Card className="border-none bg-card/40 backdrop-blur-xl shadow-xl rounded-[40px] p-8">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <Calendar className="h-5 w-5 text-indigo-500" />
                                <h3 className="font-bold text-xl">Today's Plan</h3>
                            </div>
                            <Badge className="bg-indigo-500/10 text-indigo-500 border-none text-[10px] font-bold">AI Optimized</Badge>
                        </div>

                        {studyPlan.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-8">No plan generated yet. Click Regenerate.</p>
                        ) : (
                            <div className="relative space-y-8 pl-4">
                                <div className="absolute left-[23px] top-2 bottom-8 w-[2px] bg-indigo-500/20" />
                                {studyPlan.map((item, idx) => (
                                    <div key={idx} className="relative flex items-start gap-6 group">
                                        <div className={cn(
                                            "h-6 w-6 rounded-full border-4 border-background z-10 flex items-center justify-center shrink-0",
                                            PLAN_TYPE_COLOR[item.type] ?? "bg-muted"
                                        )}>
                                            {idx === 0 && <div className="h-2 w-2 rounded-full bg-white animate-pulse" />}
                                        </div>
                                        <div className="space-y-0.5 flex-1">
                                            <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">{item.time}</span>
                                            <h4 className="font-bold text-sm leading-snug">{item.task}</h4>
                                            <span className="text-[10px] text-muted-foreground">{item.duration_mins} min</span>
                                        </div>
                                        <Button
                                            variant="ghost" size="icon"
                                            className="opacity-0 group-hover:opacity-100 transition-opacity rounded-full shrink-0"
                                            onClick={() => router.push(item.type === "quiz" ? "/quiz" : item.type === "summary" ? "/documents" : "/chat")}
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {focusTip && (
                            <div className="mt-8 p-5 rounded-3xl bg-indigo-600/5 border border-indigo-500/10">
                                <div className="flex items-center gap-2 mb-2">
                                    <Zap className="h-4 w-4 text-amber-500" />
                                    <span className="text-xs font-bold uppercase">AI Focus Tip</span>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">{focusTip}</p>
                            </div>
                        )}

                        <Button
                            onClick={() => router.push("/quiz")}
                            className="w-full mt-8 rounded-2xl h-12 gradient-bg border-none font-bold text-xs shadow-lg"
                        >
                            <PlayCircle className="mr-2 h-4 w-4" /> Start Studying Now
                        </Button>
                    </Card>
                </aside>
            </div>
        </div>
    );
}
