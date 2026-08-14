"use client";

import React, { useState } from "react";
import {
    BookOpen,
    Plus,
    Clock,
    Award,
    Layers,
    ListFilter,
    Users,
    Trash2,
    Calendar,
    Sparkles,
} from "lucide-react";

interface QuizAssignment {
    id: string;
    title: string;
    documentName: string;
    questionsCount: number;
    difficulty: string;
    timeLimit: number;
    totalAttempts: number;
    avgScore: number;
}

const initialQuizzes: QuizAssignment[] = [
    { id: "1", title: "Chapter 3: Forces & Inertia MCQ", documentName: "Ch3_Forces_Notes.pdf", questionsCount: 10, difficulty: "Medium", timeLimit: 15, totalAttempts: 18, avgScore: 74 },
    { id: "2", title: "Linear Transformations Assessment", documentName: "Linear_Algebra_Basis.docx", questionsCount: 5, difficulty: "Hard", timeLimit: 10, totalAttempts: 12, avgScore: 61 },
    { id: "3", title: "Intro to Wave Vectors & Energy", documentName: "Intro_to_Quantum_Mechanics.pdf", questionsCount: 15, difficulty: "Easy", timeLimit: 20, totalAttempts: 22, avgScore: 88 },
];

export default function EducatorQuizzes() {
    const [quizzes, setQuizzes] = useState<QuizAssignment[]>(initialQuizzes);
    const [title, setTitle] = useState("");
    const [document, setDocument] = useState("Ch3_Forces_Notes.pdf");
    const [difficulty, setDifficulty] = useState("Medium");
    const [questionsCount, setQuestionsCount] = useState(10);
    const [timeLimit, setTimeLimit] = useState(15);
    const [toast, setToast] = useState<string | null>(null);

    const handleCreateQuiz = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        const newQuiz: QuizAssignment = {
            id: Math.random().toString(),
            title,
            documentName: document,
            questionsCount,
            difficulty,
            timeLimit,
            totalAttempts: 0,
            avgScore: 0,
        };

        setQuizzes((prev) => [newQuiz, ...prev]);
        setTitle("");
        triggerToast("AI successfully structured and generated a new study quiz.");
    };

    const triggerToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    const handleDeleteQuiz = (id: string) => {
        setQuizzes((prev) => prev.filter((q) => q.id !== id));
    };

    return (
        <div className="space-y-8 relative">
            {toast && (
                <div className="fixed top-5 right-5 z-50 px-4 py-3 rounded-xl bg-indigo-500 text-white text-xs font-semibold shadow-2xl flex items-center gap-2 border border-indigo-400 animate-in fade-in slide-in-from-top-3">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                    {toast}
                </div>
            )}

            <div>
                <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                    Quiz Manager
                </h1>
                <p className="text-zinc-400 text-sm mt-1">
                    Design custom quizzes directly linked with uploaded syllabus files to test student understanding.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Quiz Creator Form */}
                <div className="p-6 rounded-3xl bg-[#0d0d1e] border border-white/5 shadow-xl h-fit space-y-6">
                    <h3 className="text-sm font-bold text-white">Create New Assessment</h3>

                    <form onSubmit={handleCreateQuiz} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-zinc-500">Quiz Title</label>
                            <input
                                type="text"
                                placeholder="e.g. Chapter 4 Quiz"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-indigo-500 placeholder:text-zinc-650"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-zinc-500">Reference Lecture</label>
                            <select
                                value={document}
                                onChange={(e) => setDocument(e.target.value)}
                                className="w-full px-4 py-2.5 text-xs rounded-xl bg-[#090914] border border-white/10 text-white outline-none focus:border-indigo-500"
                            >
                                <option value="Ch3_Forces_Notes.pdf">Ch3_Forces_Notes.pdf</option>
                                <option value="Linear_Algebra_Basis.docx">Linear_Algebra_Basis.docx</option>
                                <option value="Intro_to_Quantum_Mechanics.pdf">Intro_to_Quantum_Mechanics.pdf</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase font-bold text-zinc-500">Questions count</label>
                                <input
                                    type="number"
                                    min="3"
                                    max="50"
                                    value={questionsCount}
                                    onChange={(e) => setQuestionsCount(Number(e.target.value))}
                                    className="w-full px-4 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-indigo-500"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase font-bold text-zinc-500">Time Limit (mins)</label>
                                <input
                                    type="number"
                                    min="5"
                                    max="120"
                                    value={timeLimit}
                                    onChange={(e) => setTimeLimit(Number(e.target.value))}
                                    className="w-full px-4 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-indigo-500"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-zinc-500">Complexity Level</label>
                            <div className="grid grid-cols-3 gap-2">
                                {["Easy", "Medium", "Hard"].map((d) => (
                                    <button
                                        key={d}
                                        type="button"
                                        onClick={() => setDifficulty(d)}
                                        className={`py-2 text-[10px] font-bold rounded-xl border transition-all ${difficulty === d
                                                ? "bg-indigo-600 border-indigo-500 text-white shadow-xl shadow-indigo-600/20"
                                                : "bg-[#090914] border-white/10 text-zinc-400 hover:text-white"
                                            }`}
                                    >
                                        {d}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition-all text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/35"
                        >
                            <Plus className="w-4 h-4" /> Create & Assign
                        </button>
                    </form>
                </div>

                {/* Quizzes List */}
                <div className="lg:col-span-2 p-6 rounded-3xl bg-[#0d0d1e] border border-white/5 shadow-xl space-y-6">
                    <h3 className="text-base font-bold text-white">Active Assignments ({quizzes.length})</h3>

                    <div className="space-y-3">
                        {quizzes.map((q) => (
                            <div key={q.id} className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <BookOpen className="w-4 h-4 text-indigo-400" />
                                        <h4 className="text-xs font-bold text-white leading-tight">{q.title}</h4>
                                    </div>
                                    <p className="text-[10px] text-zinc-400 flex items-center gap-2 shrink-0">
                                        <span>Source: {q.documentName}</span>
                                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-650" />
                                        <span>{q.questionsCount} questions</span>
                                    </p>
                                    <div className="flex items-center gap-3 pt-1 text-[10px]">
                                        <span className="text-amber-400 flex items-center gap-1">
                                            <Layers className="w-3 h-3" /> {q.difficulty}
                                        </span>
                                        <span className="text-indigo-400 flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> {q.timeLimit} mins
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 border-t border-white/5 sm:border-transparent pt-3 sm:pt-0">
                                    <div className="text-right">
                                        <div className="text-white text-xs font-semibold">{q.totalAttempts} Submissions</div>
                                        <div className="text-[10px] text-zinc-400 mt-0.5">
                                            Avg Grade:{" "}
                                            <span className={`font-bold ${q.avgScore >= 80 ? "text-emerald-400" :
                                                    q.avgScore >= 60 ? "text-amber-400" : "text-zinc-500"
                                                }`}>
                                                {q.totalAttempts === 0 ? "N/A" : `${q.avgScore}%`}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteQuiz(q.id)}
                                        className="p-2 rounded-lg bg-red-400/10 border border-red-500/20 text-red-400 hover:bg-[#e11d48] hover:text-white transition-all cursor-pointer"
                                        title="Delete Quiz"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
