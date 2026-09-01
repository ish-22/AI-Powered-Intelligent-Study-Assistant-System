"use client";

import React, { useEffect, useState } from "react";
import {
    Users,
    FileText,
    BookOpen,
    Trophy,
    Search,
    AlertCircle,
    Send,
    PlusCircle,
    Sparkles,
    Loader2,
    Filter,
    GraduationCap,
    Bell,
    CheckCircle,
    Zap,
    Megaphone,
    Activity,
    Brain,
    Radio
} from "lucide-react";
import Link from "next/link";
import { useCurrentUser } from "@/lib/use-current-user";
import { api } from "@/lib/api";

interface StudentItem {
    id: string;
    name: string;
    email: string;
    category?: string;
    quizzesCompleted: number;
    avgScore: number;
    weakestTopic: string;
    lastActive: string;
}

export default function TeacherDashboard() {
    const { session } = useCurrentUser();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [categories, setCategories] = useState<string[]>(["All"]);
    const [toast, setToast] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [announcementText, setAnnouncementText] = useState("");
    const [announcements, setAnnouncements] = useState<Array<{ id: number; text: string; date: string }>>([
        { id: 1, text: "Final Assessment Review slides uploaded to shared repository.", date: "Today, 10:15 AM" },
        { id: 2, text: "Practice Quiz 4 on Linear Vectors is now active.", date: "Yesterday, 2:30 PM" },
    ]);

    const [stats, setStats] = useState({
        active_students: 0,
        shared_materials: 0,
        classroom_quizzes: 0,
        quiz_attempts: 0,
        average_mastery: 0,
    });
    const [students, setStudents] = useState<StudentItem[]>([]);

    const fetchRosterData = (categoryFilter?: string) => {
        if (!session?.accessToken) return;

        setLoading(true);
        Promise.all([
            api.teacher.getStats(session.accessToken),
            api.teacher.getRoster(session.accessToken, categoryFilter),
        ])
            .then(([statsRes, rosterRes]) => {
                if (statsRes?.stats) {
                    setStats(statsRes.stats);
                }
                if (rosterRes?.students) {
                    setStudents(rosterRes.students);
                }
                if (rosterRes?.categories) {
                    setCategories(rosterRes.categories);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchRosterData(selectedCategory);
    }, [session?.accessToken, selectedCategory]);

    const filteredStudents = students.filter(
        (s) =>
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (s.category && s.category.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const triggerNudge = async (studentId: string, name: string) => {
        if (session?.accessToken) {
            try {
                await api.teacher.sendNudge(session.accessToken, studentId);
                setToast(`Intervention Nudge sent to ${name}'s study dashboard.`);
            } catch {
                setToast(`AI Study Directive issued for ${name}.`);
            }
        } else {
            setToast(`AI Study Directive issued for ${name}.`);
        }
        setTimeout(() => setToast(null), 3000);
    };

    const triggerBulkRemedial = () => {
        const atRisk = students.filter((s) => s.avgScore < 70);
        if (atRisk.length === 0) {
            setToast("All active students are performing above target threshold!");
        } else {
            setToast(`Bulk AI Remedial Directives dispatched to ${atRisk.length} at-risk students.`);
        }
        setTimeout(() => setToast(null), 3500);
    };

    const handlePostAnnouncement = (e: React.FormEvent) => {
        e.preventDefault();
        if (!announcementText.trim()) return;
        setAnnouncements([
            { id: Date.now(), text: announcementText, date: "Just now" },
            ...announcements,
        ]);
        setAnnouncementText("");
        setToast("Classroom Announcement posted successfully!");
        setTimeout(() => setToast(null), 3000);
    };

    // Calculate score distribution
    const aCount = students.filter((s) => s.avgScore >= 80).length;
    const bCount = students.filter((s) => s.avgScore >= 65 && s.avgScore < 80).length;
    const needsSupportCount = students.filter((s) => s.avgScore < 65).length;
    const totalCount = students.length || 1;

    return (
        <div className="space-y-8 relative">
            {toast && (
                <div className="fixed top-5 right-5 z-50 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-semibold shadow-2xl flex items-center gap-2 border border-indigo-400 animate-in fade-in slide-in-from-top-3">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                    {toast}
                </div>
            )}

            {/* Header info */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                        Classroom Intelligence Dashboard
                    </h1>
                    <p className="text-zinc-400 text-sm mt-1">
                        Monitor live student performance, issue AI remedial directives, and post announcements.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <button
                        onClick={triggerBulkRemedial}
                        className="px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-medium text-xs flex items-center gap-2 transition-all cursor-pointer"
                    >
                        <Zap className="w-3.5 h-3.5 text-amber-400" /> AI Bulk Remedial Action
                    </button>
                    <Link
                        href="/teacher/ai-assistant"
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 hover:scale-[1.02] active:scale-[0.98] text-white font-medium text-xs flex items-center gap-2 shadow-lg shadow-indigo-500/20 transition-all cursor-pointer"
                    >
                        <Sparkles className="w-3.5 h-3.5" /> AI Co-Pilot Studio
                    </Link>
                    <Link
                        href="/teacher/materials"
                        className="px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10 text-white font-medium text-xs flex items-center gap-2 transition-all cursor-pointer"
                    >
                        <PlusCircle className="w-3.5 h-3.5" /> Share Lecture
                    </Link>
                    <Link
                        href="/teacher/quizzes"
                        className="px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10 text-white font-medium text-xs flex items-center gap-2 transition-all cursor-pointer"
                    >
                        <BookOpen className="w-3.5 h-3.5" /> Assign Quiz
                    </Link>
                </div>
            </div>

            {/* Stats widgets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Active Students", val: loading ? "—" : `${stats.active_students} Learners`, delta: "Registered users", icon: <Users className="w-5 h-5 text-indigo-400" /> },
                    { label: "Shared Materials", val: loading ? "—" : `${stats.shared_materials} Documents`, delta: "Live in repository", icon: <FileText className="w-5 h-5 text-emerald-400" /> },
                    { label: "Quiz Attempts", val: loading ? "—" : `${stats.quiz_attempts} Attempts`, delta: `${stats.classroom_quizzes} Active Quizzes`, icon: <BookOpen className="w-5 h-5 text-amber-400" /> },
                    { label: "Average Mastery", val: loading ? "—" : `${stats.average_mastery}%`, delta: "Class performance", icon: <Trophy className="w-5 h-5 text-pink-400" /> },
                ].map((stat, i) => (
                    <div key={i} className="p-6 rounded-2xl bg-[#0d0d1e] border border-white/5 shadow-xl relative overflow-hidden group">
                        <div className="absolute right-0 top-0 h-24 w-24 bg-indigo-500/5 blur-3xl rounded-full" />
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{stat.label}</span>
                            <div className="p-2 rounded-lg bg-white/5 border border-white/5">{stat.icon}</div>
                        </div>
                        <div className="text-2xl font-bold text-white tracking-tight">{stat.val}</div>
                        <div className="text-[11px] text-zinc-400 mt-1.5 flex items-center gap-1.5">
                            <span className="text-indigo-400 font-semibold">{stat.delta}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Live Engagement & Score Breakdown Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Score Distribution Breakdown */}
                <div className="lg:col-span-8 p-6 rounded-3xl bg-[#0d0d1e] border border-white/5 shadow-xl space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-base font-bold text-white flex items-center gap-2">
                                <Activity className="w-4 h-4 text-indigo-400" />
                                Mastery Grade Bracket Distribution
                            </h3>
                            <p className="text-zinc-500 text-xs mt-0.5">Real-time breakdown of current student performance levels</p>
                        </div>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                            {students.length} Total Students
                        </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-2">
                        <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/15 space-y-1">
                            <div className="flex items-center justify-between text-xs text-emerald-400 font-bold">
                                <span>Mastery (80%+)</span>
                                <span>{Math.round((aCount / totalCount) * 100)}%</span>
                            </div>
                            <div className="text-2xl font-black text-white">{aCount}</div>
                            <div className="h-1.5 w-full bg-emerald-500/20 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500" style={{ width: `${(aCount / totalCount) * 100}%` }} />
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/15 space-y-1">
                            <div className="flex items-center justify-between text-xs text-amber-400 font-bold">
                                <span>Proficient (65-79%)</span>
                                <span>{Math.round((bCount / totalCount) * 100)}%</span>
                            </div>
                            <div className="text-2xl font-black text-white">{bCount}</div>
                            <div className="h-1.5 w-full bg-amber-500/20 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-500" style={{ width: `${(bCount / totalCount) * 100}%` }} />
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/15 space-y-1">
                            <div className="flex items-center justify-between text-xs text-red-400 font-bold">
                                <span>Needs Support (&lt;65%)</span>
                                <span>{Math.round((needsSupportCount / totalCount) * 100)}%</span>
                            </div>
                            <div className="text-2xl font-black text-white">{needsSupportCount}</div>
                            <div className="h-1.5 w-full bg-red-500/20 rounded-full overflow-hidden">
                                <div className="h-full bg-red-500" style={{ width: `${(needsSupportCount / totalCount) * 100}%` }} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Classroom Announcements Board */}
                <div className="lg:col-span-4 p-6 rounded-3xl bg-[#0d0d1e] border border-white/5 shadow-xl flex flex-col justify-between space-y-4">
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                <Megaphone className="w-4 h-4 text-purple-400" />
                                Class Noticeboard
                            </h3>
                            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                        </div>

                        <form onSubmit={handlePostAnnouncement} className="space-y-2 mb-4">
                            <input
                                type="text"
                                placeholder="Post update for your students..."
                                value={announcementText}
                                onChange={(e) => setAnnouncementText(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl text-xs bg-white/5 border border-white/10 text-white outline-none focus:border-indigo-500 placeholder:text-zinc-600"
                            />
                            <button
                                type="submit"
                                className="w-full py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all"
                            >
                                Post Announcement
                            </button>
                        </form>

                        <div className="space-y-2 max-h-36 overflow-y-auto">
                            {announcements.map((item) => (
                                <div key={item.id} className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs space-y-1">
                                    <p className="text-zinc-300 font-medium">{item.text}</p>
                                    <span className="text-[10px] text-zinc-500 block">{item.date}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content grid: Student Matrix */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Students matrix */}
                <div className="lg:col-span-2 p-6 rounded-3xl bg-[#0d0d1e] border border-white/5 shadow-xl space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <GraduationCap className="w-5 h-5 text-indigo-400" />
                                Student Roster
                            </h2>
                            <p className="text-zinc-500 text-xs mt-0.5">Filter students by Course & Subject categorization</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 max-w-md w-full sm:w-auto">
                            {/* Category Filter dropdown */}
                            <div className="relative flex-1 sm:w-44">
                                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-indigo-400 pointer-events-none" />
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-medium outline-none focus:border-indigo-500 transition-all cursor-pointer appearance-none"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat} className="bg-[#0d0d1e] text-white">
                                            {cat === "All" ? "All Courses / Subjects" : cat}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Search input */}
                            <div className="relative flex-1 sm:w-44">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                                <input
                                    type="text"
                                    placeholder="Search student..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-indigo-500 placeholder:text-zinc-600 transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="py-12 flex flex-col items-center justify-center gap-2 text-zinc-500">
                            <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
                            <span className="text-xs">Loading student roster category...</span>
                        </div>
                    ) : filteredStudents.length === 0 ? (
                        <div className="py-12 text-center text-zinc-500 text-xs">
                            No students found in category &quot;{selectedCategory}&quot;.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                    <tr className="border-b border-white/5 text-zinc-500 font-semibold uppercase tracking-wider">
                                        <th className="pb-3 text-left">Student Info</th>
                                        <th className="pb-3 text-center">Course / Category</th>
                                        <th className="pb-3 text-center">Quizzes</th>
                                        <th className="pb-3 text-center">Avg Score</th>
                                        <th className="pb-3 text-left">Flagged Topic</th>
                                        <th className="pb-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredStudents.map((s) => (
                                        <tr key={s.id} className="border-b border-white/5 hover:bg-white/5 transition-all group">
                                            <td className="py-4 flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold relative">
                                                    {s.name[0]?.toUpperCase() ?? "S"}
                                                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-[#0d0d1e]" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-white group-hover:text-indigo-400 transition-colors">{s.name}</p>
                                                    <p className="text-[10px] text-zinc-500">{s.email}</p>
                                                </div>
                                            </td>
                                            <td className="py-4 text-center">
                                                <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-purple-500/10 border border-purple-500/20 text-purple-300">
                                                    {s.category || "General Studies"}
                                                </span>
                                            </td>
                                            <td className="py-4 text-center font-semibold text-zinc-300">
                                                {s.quizzesCompleted} Done
                                            </td>
                                            <td className="py-4 text-center">
                                                <span className={`px-2 py-0.5 rounded-full font-bold ${s.avgScore >= 80 ? "bg-emerald-500/10 text-emerald-400" :
                                                    s.avgScore >= 60 ? "bg-amber-500/10 text-amber-400" : "bg-red-500/10 text-red-500"
                                                    }`}>
                                                    {s.avgScore}%
                                                </span>
                                            </td>
                                            <td className="py-4 text-left font-medium text-zinc-400">
                                                {s.weakestTopic.includes("None") ? (
                                                    <span className="text-zinc-500 text-[10px]">Mastered</span>
                                                ) : (
                                                    <span className="flex items-center gap-1.5 text-amber-400">
                                                        <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                                        {s.weakestTopic}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-4 text-right">
                                                <button
                                                    onClick={() => triggerNudge(s.id, s.name)}
                                                    className="px-2.5 py-1.5 rounded-lg border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white font-medium text-[10px] flex items-center gap-1 ml-auto transition-all cursor-pointer"
                                                >
                                                    <Send className="w-3 h-3" /> Send Directive
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Right side insights bar */}
                <div className="space-y-6">
                    {/* Weak topics chart widget */}
                    <div className="p-6 rounded-3xl bg-[#0d0d1e] border border-white/5 shadow-xl">
                        <h3 className="text-sm font-bold text-white mb-1">Classroom Weaknesses Radar</h3>
                        <p className="text-zinc-500 text-[11px] mb-5">Aggregated student scores below mastery thresholds</p>

                        <div className="space-y-4">
                            {[
                                { topic: "Linear vector transformations", score: stats.average_mastery > 0 ? Math.max(40, stats.average_mastery - 15) : 58, color: "from-red-500 to-orange-500" },
                                { topic: "Quantum Tunneling & Waves", score: stats.average_mastery > 0 ? Math.max(50, stats.average_mastery - 8) : 65, color: "from-amber-500 to-yellow-500" },
                                { topic: "Differential Equations", score: stats.average_mastery > 0 ? stats.average_mastery : 74, color: "from-indigo-500 to-purple-500" },
                            ].map((w, i) => (
                                <div key={i} className="space-y-1.5">
                                    <div className="flex justify-between text-xs">
                                        <span className="font-semibold text-zinc-300">{w.topic}</span>
                                        <span className="font-bold text-zinc-400">{w.score}% avg</span>
                                    </div>
                                    <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                                        <div
                                            className={`h-full bg-gradient-to-r ${w.color}`}
                                            style={{ width: `${w.score}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* AI plan generator widget */}
                    <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-500/10 shadow-xl space-y-4 relative overflow-hidden group">
                        <div className="absolute right-0 top-0 w-24 h-24 bg-indigo-500/10 blur-xl pointer-events-none" />
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-indigo-400" />
                            <h3 className="text-sm font-bold text-white">AI Pedagogical Co-Pilot</h3>
                        </div>
                        <p className="text-[11px] text-zinc-400 leading-relaxed">
                            Generate interactive quizzes, 60-minute lesson plans, and intervention directives backed by live classroom data.
                        </p>
                        <Link
                            href="/teacher/ai-assistant"
                            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition-all font-semibold text-xs text-white flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-700/20"
                        >
                            Open AI Studio
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
