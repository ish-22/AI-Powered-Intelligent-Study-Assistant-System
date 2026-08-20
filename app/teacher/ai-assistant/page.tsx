"use client";

import React, { useState } from "react";
import {
    Sparkles,
    BookOpen,
    Bot,
    FileText,
    ListChecks,
    Copy,
    Check,
    Loader2,
    Lightbulb,
    Zap,
} from "lucide-react";
import { useCurrentUser } from "@/lib/use-current-user";

export default function EducatorAIAssistant() {
    const { session } = useCurrentUser();
    const [selectedTool, setSelectedTool] = useState<"quiz" | "lesson" | "rubric" | "nudges">("quiz");
    const [topic, setTopic] = useState("");
    const [gradeLevel, setGradeLevel] = useState("University / Higher Ed");
    const [difficulty, setDifficulty] = useState("Medium");
    const [numQuestions, setNumQuestions] = useState(5);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedOutput, setGeneratedOutput] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic.trim() || !session?.accessToken) return;

        setIsGenerating(true);
        setGeneratedOutput(null);

        let endpoint = `${API_URL}/ai/quiz`;
        let body: any = {
            subject: topic,
            num_questions: numQuestions,
            difficulty,
            grade_level: gradeLevel,
        };

        if (selectedTool === "lesson") {
            endpoint = `${API_URL}/ai/generate-study-plan`;
            body = {
                goal: `Create a ${gradeLevel} lesson plan for ${topic}`,
                subject: topic,
                timeframe_days: 1,
                daily_hours: 1,
            };
        } else if (selectedTool === "rubric") {
            endpoint = `${API_URL}/ai/explain-concept`;
            body = {
                concept: `Grading rubric matrix for ${topic} (${gradeLevel})`,
                depth: "detailed",
            };
        } else if (selectedTool === "nudges") {
            endpoint = `${API_URL}/ai/explain-concept`;
            body = {
                concept: `Student intervention strategy and automated nudges for weak mastery in ${topic}`,
                depth: "simple",
            };
        }

        try {
            const res = await fetch(endpoint, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                const data = await res.json();
                if (selectedTool === "quiz") {
                    const quizItems = data.quiz || data.questions || [];
                    if (Array.isArray(quizItems) && quizItems.length > 0) {
                        const formatted = quizItems
                            .map(
                                (q: any, i: number) =>
                                    `**Question ${i + 1}:** ${q.question}\nOptions:\n${(q.options || []).join("\n")}\n*Correct Answer:* ${q.answer}\n*Explanation:* ${q.explanation || "N/A"}`
                            )
                            .join("\n\n---\n\n");
                        setGeneratedOutput(`### 🤖 AI Quiz: ${topic}\n**Grade Level:** ${gradeLevel} | **Difficulty:** ${difficulty}\n\n${formatted}`);
                    } else {
                        setGeneratedOutput(typeof data === "string" ? data : JSON.stringify(data, null, 2));
                    }
                } else if (selectedTool === "lesson") {
                    const plan = data.plan || data;
                    if (typeof plan === "object" && plan.days) {
                        const formattedDays = plan.days
                            .map((d: any) => `#### Day ${d.day}: ${d.title}\n*Tasks:* ${d.tasks?.join(", ")}`)
                            .join("\n\n");
                        setGeneratedOutput(`### 📚 AI Lesson Plan: ${topic}\n**Target Audience:** ${gradeLevel}\n\n${formattedDays}`);
                    } else {
                        setGeneratedOutput(data.explanation || JSON.stringify(data, null, 2));
                    }
                } else {
                    setGeneratedOutput(data.explanation || data.result || JSON.stringify(data, null, 2));
                }
            } else {
                const err = await res.json();
                alert(err.message || "Failed to generate AI response");
            }
        } catch (e) {
            console.error("AI Generation error:", e);
            alert("Error connecting to AI service.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCopy = () => {
        if (!generatedOutput) return;
        navigator.clipboard.writeText(generatedOutput);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-8 relative">
            <div>
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
                    <Sparkles className="w-4 h-4" /> AI Educator Co-Pilot
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                    AI Pedagogical Suite
                </h1>
                <p className="text-zinc-400 text-sm mt-1">
                    Generate AI quizzes, lesson plans, rubric matrices, and student intervention nudges in seconds powered by live AI.
                </p>
            </div>

            {/* Tool Selector Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                    { id: "quiz", label: "AI Quiz Generator", icon: <BookOpen className="w-4 h-4 text-indigo-400" /> },
                    { id: "lesson", label: "Lesson Plan Creator", icon: <FileText className="w-4 h-4 text-emerald-400" /> },
                    { id: "rubric", label: "Grading Rubric Matrix", icon: <ListChecks className="w-4 h-4 text-amber-400" /> },
                    { id: "nudges", label: "Intervention Directives", icon: <Zap className="w-4 h-4 text-pink-400" /> },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => {
                            setSelectedTool(tab.id as any);
                            setGeneratedOutput(null);
                        }}
                        className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${selectedTool === tab.id
                                ? "bg-indigo-600/10 border-indigo-500/40 text-white shadow-xl shadow-indigo-500/10"
                                : "bg-[#0d0d1e] border-white/5 text-zinc-400 hover:border-white/10 hover:text-white"
                            }`}
                    >
                        <div className="p-2 rounded-xl bg-white/5 w-fit border border-white/5">{tab.icon}</div>
                        <span className="text-xs font-bold">{tab.label}</span>
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Form Parameters */}
                <div className="lg:col-span-5 p-6 rounded-3xl bg-[#0d0d1e] border border-white/5 shadow-xl space-y-6">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Bot className="w-4 h-4 text-indigo-400" /> Parameter Configuration
                    </h3>

                    <form onSubmit={handleGenerate} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-zinc-500">Topic / Key Subject</label>
                            <input
                                type="text"
                                placeholder="e.g. Quantum Mechanics, Calculus Limits..."
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                className="w-full px-4 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-indigo-500 placeholder:text-zinc-600"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-zinc-500">Target Grade Level</label>
                            <select
                                value={gradeLevel}
                                onChange={(e) => setGradeLevel(e.target.value)}
                                className="w-full px-4 py-2.5 text-xs rounded-xl bg-[#090914] border border-white/10 text-white outline-none focus:border-indigo-500"
                            >
                                <option value="High School">High School (Grades 9-12)</option>
                                <option value="Undergraduate">Undergraduate / College</option>
                                <option value="University / Higher Ed">University / Postgraduate</option>
                            </select>
                        </div>

                        {selectedTool === "quiz" && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] uppercase font-bold text-zinc-500">Questions Count</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="20"
                                        value={numQuestions}
                                        onChange={(e) => setNumQuestions(Number(e.target.value))}
                                        className="w-full px-4 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-indigo-500"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] uppercase font-bold text-zinc-500">Difficulty</label>
                                    <select
                                        value={difficulty}
                                        onChange={(e) => setDifficulty(e.target.value)}
                                        className="w-full px-4 py-2.5 text-xs rounded-xl bg-[#090914] border border-white/10 text-white outline-none focus:border-indigo-500"
                                    >
                                        <option value="Easy">Easy</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Hard">Hard / Advanced</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isGenerating}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-60 transition-all text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/25"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" /> Synthesizing Pedagogy...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4" /> Run AI Generation
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Generated Output Preview */}
                <div className="lg:col-span-7 p-6 rounded-3xl bg-[#0d0d1e] border border-white/5 shadow-xl space-y-4 flex flex-col justify-between min-h-[420px]">
                    <div>
                        <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                <Lightbulb className="w-4 h-4 text-amber-400" /> AI Synthesized Output
                            </h3>
                            {generatedOutput && (
                                <button
                                    onClick={handleCopy}
                                    className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                                >
                                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
                                    {copied ? "Copied!" : "Copy Text"}
                                </button>
                            )}
                        </div>

                        {generatedOutput ? (
                            <div className="bg-[#070712] p-5 rounded-2xl border border-white/5 text-xs text-zinc-300 font-mono whitespace-pre-wrap leading-relaxed max-h-[380px] overflow-y-auto">
                                {generatedOutput}
                            </div>
                        ) : (
                            <div className="h-64 rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center p-6 text-zinc-500 space-y-2">
                                <Bot className="w-8 h-8 text-zinc-600 animate-bounce" />
                                <p className="text-xs font-medium text-zinc-400">No output generated yet</p>
                                <p className="text-[11px] text-zinc-600 max-w-xs">
                                    Fill in your desired subject topic on the left and click "Run AI Generation".
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
