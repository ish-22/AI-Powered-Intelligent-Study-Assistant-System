"use client";

import React from "react";
import {
    Sparkles,
    Target,
    Brain,
    BookOpen,
    Lightbulb,
    Zap,
    Clock,
    ChevronRight,
    PlayCircle,
    FileText,
    AlertCircle,
    CheckCircle2,
    Calendar,
    MoreVertical,
    ArrowRight,
    Trophy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Mock Data
const recommendations = [
    {
        id: 1,
        topic: "Fluid Dynamics",
        priority: "High",
        confidence: 35,
        time: "45 mins",
        reason: "Low scores in recent quiz on Bernoulli Principle",
        icon: AlertCircle,
        color: "red"
    },
    {
        id: 2,
        topic: "Modernist Literature",
        priority: "Medium",
        confidence: 62,
        time: "30 mins",
        reason: "High document volume, but low active recall history",
        icon: BookOpen,
        color: "amber"
    },
    {
        id: 3,
        topic: "Macroeconomic Policy",
        priority: "Medium",
        confidence: 58,
        time: "25 mins",
        reason: "New document uploaded: 'Fiscal Policy 2024'",
        icon: Sparkles,
        color: "indigo"
    },
];

const mockSummaries = [
    { title: "Neuroplasticity Overview", tags: ["Biology", "Essentials"], readTime: "5 min" },
    { title: "Calculus III Theory", tags: ["Math", "Advanced"], readTime: "12 min" },
];

const mockQuizzes = [
    { title: "Linear Algebra Basic", questions: 10, difficulty: "Easy" },
    { title: "Quantum Physics V2", questions: 15, difficulty: "Hard" },
];

const studyPlan = [
    { time: "09:00 AM", task: "Review Weak Topic: Fluid Dynamics", status: "upcoming" },
    { time: "10:30 AM", task: "Quiz: Modernist Literature", status: "upcoming" },
    { time: "02:00 PM", task: "Summary: Fiscal Policy 2024", status: "pending" },
    { time: "04:00 PM", task: "Group Study Sync", status: "pending" },
];

export default function RecommendationsPage() {
    return (
        <div className="space-y-10 pb-12 animate-fade-in max-w-7xl mx-auto">
            {/* Header / Coach Greeting */}
            <section className="bg-gradient-to-br from-indigo-600/10 via-purple-600/10 to-transparent p-8 rounded-[40px] border border-indigo-500/10 flex flex-col md:flex-row items-center gap-8 shadow-sm">
                <div className="h-24 w-24 rounded-3xl gradient-bg flex items-center justify-center shrink-0 shadow-2xl shadow-indigo-500/20">
                    <Brain className="h-12 w-12 text-white animate-pulse" />
                </div>
                <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                        <Badge className="bg-indigo-500 text-white border-none rounded-full px-4 py-1 text-[10px] font-bold">AI COACH</Badge>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Active analysis</span>
                    </div>
                    <h1 className="text-3xl font-black tracking-tight mb-2">Your <span className="gradient-text">Learning Path</span> is ready.</h1>
                    <p className="text-muted-foreground text-sm max-w-2xl">
                        We've identified 3 critical areas for improvement and optimized your study plan for today's peak focus hours.
                    </p>
                </div>
                <Button className="rounded-2xl h-14 px-8 gradient-bg border-none font-bold shadow-xl shadow-indigo-500/20">
                    Optimize All Tasks
                </Button>
            </section>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">

                {/* Left: Weak Topics & Recommendations */}
                <div className="xl:col-span-8 space-y-10">

                    {/* Weak Topics Section */}
                    <section className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 text-red-500" />
                                Weak Topics & Priorities
                            </h2>
                            <Button variant="ghost" className="text-xs">View Performance History</Button>
                        </div>
                        <div className="grid grid-cols-1 gap-6">
                            {recommendations.map((rec) => (
                                <motion.div
                                    key={rec.id}
                                    whileHover={{ x: 4 }}
                                    className="group"
                                >
                                    <Card className="border-none bg-card/40 backdrop-blur-xl shadow-sm rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-indigo-500/5 transition-all">
                                        <CardContent className="p-6">
                                            <div className="flex flex-col md:flex-row gap-6">
                                                <div className={cn(
                                                    "h-16 w-16 md:h-20 md:w-20 rounded-3xl flex items-center justify-center shrink-0 shadow-lg",
                                                    rec.color === 'red' ? "bg-red-500/10 text-red-500" :
                                                        rec.color === 'amber' ? "bg-amber-500/10 text-amber-500" : "bg-indigo-500/10 text-indigo-500"
                                                )}>
                                                    <rec.icon className="h-8 w-8 md:h-10 md:w-10" />
                                                </div>
                                                <div className="flex-1 space-y-4">
                                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                                        <div>
                                                            <h3 className="text-xl font-bold">{rec.topic}</h3>
                                                            <p className="text-xs text-muted-foreground mt-1">{rec.reason}</p>
                                                        </div>
                                                        <Badge variant={rec.priority === 'High' ? 'destructive' : 'warning'} className="rounded-lg px-3 py-1 self-start">
                                                            {rec.priority} Priority
                                                        </Badge>
                                                    </div>

                                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-2">
                                                        <div className="space-y-1">
                                                            <span className="text-[10px] font-bold text-muted-foreground uppercase">Confidence</span>
                                                            <div className="flex items-center gap-3">
                                                                <Progress value={rec.confidence} className="h-1.5 flex-1" />
                                                                <span className="text-xs font-bold">{rec.confidence}%</span>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <span className="text-[10px] font-bold text-muted-foreground uppercase">Est. Time</span>
                                                            <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                                                                <Clock className="h-3 w-3 text-indigo-500" />
                                                                {rec.time}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-8 pt-6 border-t border-white/5 flex flex-wrap gap-3">
                                                <Button className="rounded-xl h-10 bg-indigo-600 hover:bg-indigo-700 border-none px-6 font-bold text-xs">
                                                    <PlayCircle className="mr-2 h-4 w-4" /> Start Revision
                                                </Button>
                                                <Button variant="outline" className="rounded-xl h-10 border-2 px-6 font-bold text-xs">
                                                    <Lightbulb className="mr-2 h-4 w-4" /> Generate Quiz
                                                </Button>
                                                <Button variant="ghost" className="rounded-xl h-10 px-6 font-bold text-xs ml-auto">
                                                    <FileText className="mr-2 h-4 w-4" /> View Summary
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* Additional Mixed Sections */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                        {/* Suggested Quizzes */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold flex items-center gap-2 px-2 text-muted-foreground">
                                <Target className="h-4 w-4" />
                                Suggested Quizzes
                            </h3>
                            {mockQuizzes.map((quiz) => (
                                <Card key={quiz.title} className="border-none bg-card/40 shadow-sm rounded-2xl overflow-hidden hover:bg-muted/50 transition-all cursor-pointer group">
                                    <CardContent className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                                                <Trophy className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold">{quiz.title}</h4>
                                                <p className="text-[10px] text-muted-foreground">{quiz.questions} Questions • {quiz.difficulty}</p>
                                            </div>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Recommended Summaries */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold flex items-center gap-2 px-2 text-muted-foreground">
                                <Sparkles className="h-4 w-4" />
                                Recommended Summaries
                            </h3>
                            {mockSummaries.map((sum) => (
                                <Card key={sum.title} className="border-none bg-card/40 shadow-sm rounded-2xl overflow-hidden hover:bg-muted/50 transition-all cursor-pointer group">
                                    <CardContent className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                                                <FileText className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold">{sum.title}</h4>
                                                <div className="flex gap-2 mt-1">
                                                    {sum.tags.map(t => <span key={t} className="text-[9px] font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded uppercase">{t}</span>)}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-bold text-muted-foreground">{sum.readTime}</span>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>

                </div>

                {/* Right Sidebar: Optimized Study Plan */}
                <aside className="xl:col-span-4 space-y-8">
                    <Card className="border-none bg-card/40 backdrop-blur-xl shadow-xl rounded-[40px] p-8 h-full">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <Calendar className="h-5 w-5 text-indigo-500" />
                                <h3 className="font-bold text-xl">Today's Plan</h3>
                            </div>
                            <Badge variant="success">Optimized</Badge>
                        </div>

                        <div className="relative space-y-10 pl-4">
                            <div className="absolute left-[23px] top-2 bottom-8 w-[2px] bg-indigo-500/20" />

                            {studyPlan.map((item, idx) => (
                                <div key={idx} className="relative flex items-start gap-8 group">
                                    <div className={cn(
                                        "h-6 w-6 rounded-full border-4 border-background z-10 flex items-center justify-center",
                                        item.status === 'upcoming' ? "bg-indigo-500" : "bg-muted"
                                    )}>
                                        {item.status === 'upcoming' && <div className="h-2 w-2 rounded-full bg-white animate-pulse" />}
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">{item.time}</span>
                                        <h4 className={cn(
                                            "font-bold text-sm",
                                            item.status === 'upcoming' ? "text-foreground" : "text-muted-foreground"
                                        )}>{item.task}</h4>
                                    </div>
                                    <Button variant="ghost" size="icon" className="absolute right-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 p-6 rounded-3xl bg-indigo-600/5 border border-indigo-500/10">
                            <div className="flex items-center gap-2 mb-2">
                                <Zap className="h-4 w-4 text-amber-500" />
                                <span className="text-xs font-bold uppercase">Focus Tip</span>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Studies show you focus best between **09:00 AM - 11:30 AM**. We've scheduled your hardest topic (**Fluid Dynamics**) during this window.
                            </p>
                        </div>

                        <Button className="w-full mt-10 rounded-2xl h-12 bg-white text-black hover:bg-zinc-100 font-bold text-xs shadow-lg">
                            View Weekly Schedule
                        </Button>
                    </Card>
                </aside>

            </div>
        </div>
    );
}
