"use client";

import React, { useState, useEffect } from "react";
import {
    BookOpen,
    Plus,
    Clock,
    Layers,
    Trash2,
    Sparkles,
    Loader2,
    Calendar,
    CheckCircle2,
    Edit3,
    Eye,
    Send,
    Award,
    AlertCircle,
} from "lucide-react";
import { useCurrentUser } from "@/lib/use-current-user";

interface DocumentItem {
    id: string;
    name: string;
    subject: string;
}

interface QuestionItem {
    id?: string;
    type: string;
    question_text: string;
    options?: string[];
    correct_answer: string;
    explanation?: string;
    marks: number;
}

interface QuizItem {
    id: string;
    title: string;
    description?: string;
    difficulty: string;
    time_limit_mins: number;
    status: string; // DRAFT | PUBLISHED | CLOSED | GRADING | GRADED
    start_at?: string;
    deadline_at?: string;
    total_marks: number;
    document_name: string;
    questions: QuestionItem[];
    submissions_count: number;
    avg_score: number;
}

interface SubmissionItem {
    id: string;
    student_name: string;
    student_email: string;
    status: string;
    score_percentage: number;
    total_marks_obtained: number;
    grade?: string;
    teacher_feedback?: string;
    completed_at?: string;
    answers: Array<{
        id: string;
        question_text: string;
        question_type: string;
        student_answer: string;
        correct_answer: string;
        max_marks: number;
        is_correct: boolean;
        score_awarded: number;
        teacher_feedback?: string;
    }>;
}

export default function EducatorQuizzes() {
    const { session } = useCurrentUser();
    const [documents, setDocuments] = useState<DocumentItem[]>([]);
    const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);

    // AI Generation parameters
    const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [difficulty, setDifficulty] = useState("medium");
    const [questionType, setQuestionType] = useState("mixed");
    const [questionsCount, setQuestionsCount] = useState(5);
    const [timeLimit, setTimeLimit] = useState(15);
    const [toast, setToast] = useState<string | null>(null);

    // Active modals/views
    const [editingQuiz, setEditingQuiz] = useState<QuizItem | null>(null);
    const [selectedSubmissionQuiz, setSelectedSubmissionQuiz] = useState<QuizItem | null>(null);
    const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
    const [gradingSubmission, setGradingSubmission] = useState<SubmissionItem | null>(null);
    const [loadingSubmissions, setLoadingSubmissions] = useState(false);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

    const fetchAllData = async () => {
        if (!session?.accessToken) return;
        try {
            const [docRes, quizRes] = await Promise.all([
                fetch(`${API_URL}/documents`, {
                    headers: { Authorization: `Bearer ${session.accessToken}`, Accept: "application/json" },
                }),
                fetch(`${API_URL}/quizzes`, {
                    headers: { Authorization: `Bearer ${session.accessToken}`, Accept: "application/json" },
                }),
            ]);

            if (docRes.ok) {
                const docData = await docRes.json();
                setDocuments(docData.documents || []);
            }
            if (quizRes.ok) {
                const quizData = await quizRes.json();
                setQuizzes(quizData.quizzes || []);
            }
        } catch (e) {
            console.error("Error loading quiz data:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, [session?.accessToken]);

    const handleDocToggle = (docId: string) => {
        setSelectedDocIds((prev) =>
            prev.includes(docId) ? prev.filter((id) => id !== docId) : [...prev, docId]
        );
    };

    const triggerToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    const handleGenerateQuiz = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedDocIds.length === 0 || !session?.accessToken) {
            alert("Please select at least one class material document.");
            return;
        }

        setGenerating(true);
        try {
            const res = await fetch(`${API_URL}/quizzes/generate`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    document_ids: selectedDocIds,
                    title,
                    description,
                    count: questionsCount,
                    difficulty,
                    question_type: questionType,
                    time_limit_mins: timeLimit,
                }),
            });

            if (res.ok) {
                const data = await res.json();
                setQuizzes((prev) => [data.quiz, ...prev]);
                setTitle("");
                setDescription("");
                setSelectedDocIds([]);
                setEditingQuiz(data.quiz); // Open review modal directly
                triggerToast("AI Quiz generated! Review and edit questions below before publishing.");
            } else {
                const err = await res.json();
                alert(err.error || err.message || "Failed to generate quiz.");
            }
        } catch (e) {
            console.error("AI quiz generation error:", e);
            alert("Server connection failed.");
        } finally {
            setGenerating(false);
        }
    };

    const handleSaveQuizSettings = async (publishNow = false) => {
        if (!editingQuiz || !session?.accessToken) return;

        const updatedStatus = publishNow ? "PUBLISHED" : editingQuiz.status;
        try {
            const res = await fetch(`${API_URL}/quizzes/${editingQuiz.id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    ...editingQuiz,
                    status: updatedStatus,
                }),
            });

            if (res.ok) {
                const data = await res.json();
                setQuizzes((prev) => prev.map((q) => (q.id === editingQuiz.id ? data.quiz : q)));
                setEditingQuiz(null);
                triggerToast(publishNow ? "Quiz published to assigned students!" : "Quiz settings saved.");
            }
        } catch (e) {
            console.error("Update quiz error:", e);
        }
    };

    const handleDeleteQuiz = async (id: string) => {
        if (!confirm("Are you sure you want to delete this assessment?") || !session?.accessToken) return;
        try {
            const res = await fetch(`${API_URL}/quizzes/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${session.accessToken}` },
            });
            if (res.ok) {
                setQuizzes((prev) => prev.filter((q) => q.id !== id));
                triggerToast("Quiz deleted successfully.");
            }
        } catch (e) {
            console.error("Delete quiz error:", e);
        }
    };

    const handleViewSubmissions = async (quiz: QuizItem) => {
        setSelectedSubmissionQuiz(quiz);
        setLoadingSubmissions(true);
        try {
            const res = await fetch(`${API_URL}/quizzes/${quiz.id}/submissions`, {
                headers: { Authorization: `Bearer ${session?.accessToken}`, Accept: "application/json" },
            });
            if (res.ok) {
                const data = await res.json();
                setSubmissions(data.submissions || []);
            }
        } catch (e) {
            console.error("Submissions load error:", e);
        } finally {
            setLoadingSubmissions(false);
        }
    };

    const handleSaveGrading = async (finalize = true) => {
        if (!gradingSubmission || !session?.accessToken) return;

        try {
            const res = await fetch(`${API_URL}/quizzes/attempts/${gradingSubmission.id}/grade`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    teacher_feedback: gradingSubmission.teacher_feedback,
                    finalize,
                    answers: gradingSubmission.answers.map((a) => ({
                        id: a.id,
                        score: a.score_awarded,
                        is_correct: a.is_correct,
                        teacher_feedback: a.teacher_feedback,
                    })),
                }),
            });

            if (res.ok) {
                const data = await res.json();
                setSubmissions((prev) => prev.map((s) => (s.id === gradingSubmission.id ? data.attempt : s)));
                setGradingSubmission(null);
                triggerToast(finalize ? "Student grade finalized!" : "Grading draft saved.");
                fetchAllData();
            }
        } catch (e) {
            console.error("Save grade error:", e);
        }
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
                    Classroom Quiz Suite
                </h1>
                <p className="text-zinc-400 text-sm mt-1">
                    Select class materials, generate AI quizzes, schedule publication, and evaluate student attempts.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* AI Quiz Generator Form */}
                <div className="p-6 rounded-3xl bg-[#0d0d1e] border border-white/5 shadow-xl h-fit space-y-6">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-indigo-400" /> AI Quiz Generator
                    </h3>

                    <form onSubmit={handleGenerateQuiz} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-zinc-400">
                                1. Select Class Material(s)
                            </label>
                            <div className="max-h-40 overflow-y-auto space-y-1.5 p-2 rounded-xl bg-[#070712] border border-white/5">
                                {documents.length === 0 ? (
                                    <p className="text-xs text-zinc-500 p-2">No class materials uploaded yet.</p>
                                ) : (
                                    documents.map((doc) => (
                                        <label
                                            key={doc.id}
                                            className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 cursor-pointer text-xs text-zinc-300"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedDocIds.includes(doc.id)}
                                                onChange={() => handleDocToggle(doc.id)}
                                                className="rounded bg-white/10 border-white/20 text-indigo-600 focus:ring-0"
                                            />
                                            <span className="truncate">{doc.name}</span>
                                        </label>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-zinc-400">Quiz Title</label>
                            <input
                                type="text"
                                placeholder="e.g. Physics Chapter 3 Quiz"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-indigo-500"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase font-bold text-zinc-400">Question Types</label>
                                <select
                                    value={questionType}
                                    onChange={(e) => setQuestionType(e.target.value)}
                                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#090914] border border-white/10 text-white outline-none"
                                >
                                    <option value="mixed">Mixed Types</option>
                                    <option value="mcq">Multiple Choice</option>
                                    <option value="tf">True / False</option>
                                    <option value="short">Short Answer</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase font-bold text-zinc-400">Count</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="20"
                                    value={questionsCount}
                                    onChange={(e) => setQuestionsCount(Number(e.target.value))}
                                    className="w-full px-4 py-2 text-xs rounded-xl bg-white/5 border border-white/10 text-white outline-none"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase font-bold text-zinc-400">Exam Rigor Level</label>
                                <select
                                    value={difficulty}
                                    onChange={(e) => setDifficulty(e.target.value)}
                                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#090914] border border-white/10 text-white outline-none"
                                >
                                    <option value="easy">Foundational Exam</option>
                                    <option value="medium">Standard University Exam</option>
                                    <option value="hard">Honors / Advanced Board Exam</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase font-bold text-zinc-400">Duration (mins)</label>
                                <input
                                    type="number"
                                    min="5"
                                    max="180"
                                    value={timeLimit}
                                    onChange={(e) => setTimeLimit(Number(e.target.value))}
                                    className="w-full px-4 py-2 text-xs rounded-xl bg-white/5 border border-white/10 text-white outline-none"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={generating || selectedDocIds.length === 0}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/30 transition-all"
                        >
                            {generating ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" /> Synthesizing AI Quiz...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4" /> Generate Quiz Draft
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Quizzes List */}
                <div className="lg:col-span-2 p-6 rounded-3xl bg-[#0d0d1e] border border-white/5 shadow-xl space-y-6">
                    <h3 className="text-base font-bold text-white flex items-center justify-between">
                        <span>Classroom Quizzes ({quizzes.length})</span>
                    </h3>

                    {loading ? (
                        <div className="py-12 flex flex-col items-center justify-center gap-3 text-zinc-500">
                            <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
                            <span className="text-xs">Loading quizzes...</span>
                        </div>
                    ) : quizzes.length === 0 ? (
                        <div className="py-12 flex flex-col items-center justify-center gap-2 text-center text-zinc-500">
                            <BookOpen className="w-10 h-10 text-zinc-600" />
                            <p className="text-sm font-semibold text-zinc-300">No quizzes generated yet</p>
                            <p className="text-xs">Select class materials on the left to create a quiz.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {quizzes.map((q) => (
                                <div
                                    key={q.id}
                                    className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all space-y-3"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-sm font-bold text-white">{q.title}</h4>
                                                <span
                                                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${q.status === "PUBLISHED"
                                                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                                        : q.status === "DRAFT"
                                                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                                            : "bg-zinc-500/10 text-zinc-400"
                                                        }`}
                                                >
                                                    {q.status}
                                                </span>
                                            </div>
                                            <p className="text-xs text-zinc-400 mt-1">Material: {q.document_name}</p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setEditingQuiz(q)}
                                                className="px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all text-xs font-semibold flex items-center gap-1 cursor-pointer"
                                            >
                                                <Edit3 className="w-3.5 h-3.5" /> Edit / Schedule
                                            </button>
                                            <button
                                                onClick={() => handleViewSubmissions(q)}
                                                className="px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 hover:bg-purple-600 hover:text-white transition-all text-xs font-semibold flex items-center gap-1 cursor-pointer"
                                            >
                                                <Eye className="w-3.5 h-3.5" /> Submissions ({q.submissions_count})
                                            </button>
                                            <button
                                                onClick={() => handleDeleteQuiz(q.id)}
                                                className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 text-[11px] text-zinc-400 border-t border-white/5 pt-2">
                                        <span>Questions: {q.questions?.length || 0}</span>
                                        <span>Time: {q.time_limit_mins} mins</span>
                                        <span>Total Marks: {q.total_marks}</span>
                                        <span>Avg Score: {q.avg_score}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* EDIT / SCHEDULE MODAL */}
            {editingQuiz && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-[#0d0d1e] border border-white/10 w-full max-w-3xl rounded-3xl p-6 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="flex justify-between items-center border-b border-white/5 pb-4">
                            <h3 className="text-lg font-bold text-white">Edit & Schedule Assessment</h3>
                            <button
                                onClick={() => setEditingQuiz(null)}
                                className="text-zinc-400 hover:text-white text-sm"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs text-zinc-400">Title</label>
                                <input
                                    type="text"
                                    value={editingQuiz.title}
                                    onChange={(e) => setEditingQuiz({ ...editingQuiz, title: e.target.value })}
                                    className="w-full px-3 py-2 text-xs rounded-xl bg-white/5 border border-white/10 text-white outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-zinc-400">Duration (Minutes)</label>
                                <input
                                    type="number"
                                    value={editingQuiz.time_limit_mins}
                                    onChange={(e) =>
                                        setEditingQuiz({ ...editingQuiz, time_limit_mins: Number(e.target.value) })
                                    }
                                    className="w-full px-3 py-2 text-xs rounded-xl bg-white/5 border border-white/10 text-white outline-none"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs text-zinc-400">Start Date / Time</label>
                                <input
                                    type="datetime-local"
                                    value={editingQuiz.start_at ? editingQuiz.start_at.slice(0, 16) : ""}
                                    onChange={(e) => setEditingQuiz({ ...editingQuiz, start_at: e.target.value })}
                                    className="w-full px-3 py-2 text-xs rounded-xl bg-white/5 border border-white/10 text-white outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-zinc-400">Deadline Date / Time</label>
                                <input
                                    type="datetime-local"
                                    value={editingQuiz.deadline_at ? editingQuiz.deadline_at.slice(0, 16) : ""}
                                    onChange={(e) => setEditingQuiz({ ...editingQuiz, deadline_at: e.target.value })}
                                    className="w-full px-3 py-2 text-xs rounded-xl bg-white/5 border border-white/10 text-white outline-none"
                                />
                            </div>
                        </div>

                        {/* Questions Editor */}
                        <div className="space-y-4 border-t border-white/5 pt-4">
                            <h4 className="text-sm font-bold text-white flex justify-between items-center">
                                <span>Quiz Questions ({editingQuiz.questions.length})</span>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setEditingQuiz({
                                            ...editingQuiz,
                                            questions: [
                                                ...editingQuiz.questions,
                                                {
                                                    type: "mcq",
                                                    question_text: "New custom question",
                                                    options: ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
                                                    correct_answer: "A) Option 1",
                                                    marks: 10,
                                                },
                                            ],
                                        })
                                    }
                                    className="px-2.5 py-1 text-[10px] rounded bg-indigo-600 text-white font-semibold flex items-center gap-1"
                                >
                                    <Plus className="w-3 h-3" /> Add Question
                                </button>
                            </h4>

                            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                                {editingQuiz.questions.map((q, idx) => (
                                    <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-2">
                                        <div className="flex justify-between items-center gap-2">
                                            <span className="text-xs font-bold text-indigo-400">Q{idx + 1} ({q.type})</span>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setEditingQuiz({
                                                        ...editingQuiz,
                                                        questions: editingQuiz.questions.filter((_, i) => i !== idx),
                                                    })
                                                }
                                                className="text-red-400 text-xs"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                        <input
                                            type="text"
                                            value={q.question_text}
                                            onChange={(e) => {
                                                const updated = [...editingQuiz.questions];
                                                updated[idx].question_text = e.target.value;
                                                setEditingQuiz({ ...editingQuiz, questions: updated });
                                            }}
                                            className="w-full px-3 py-1.5 text-xs rounded bg-[#070712] border border-white/10 text-white outline-none"
                                        />
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            <div>
                                                <span className="text-[10px] text-zinc-500">Correct Answer</span>
                                                <input
                                                    type="text"
                                                    value={q.correct_answer}
                                                    onChange={(e) => {
                                                        const updated = [...editingQuiz.questions];
                                                        updated[idx].correct_answer = e.target.value;
                                                        setEditingQuiz({ ...editingQuiz, questions: updated });
                                                    }}
                                                    className="w-full px-2 py-1 text-xs rounded bg-[#070712] border border-white/10 text-emerald-400"
                                                />
                                            </div>
                                            <div>
                                                <span className="text-[10px] text-zinc-500">Marks</span>
                                                <input
                                                    type="number"
                                                    value={q.marks}
                                                    onChange={(e) => {
                                                        const updated = [...editingQuiz.questions];
                                                        updated[idx].marks = Number(e.target.value);
                                                        setEditingQuiz({ ...editingQuiz, questions: updated });
                                                    }}
                                                    className="w-full px-2 py-1 text-xs rounded bg-[#070712] border border-white/10 text-white"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 border-t border-white/5 pt-4">
                            <button
                                onClick={() => handleSaveQuizSettings(false)}
                                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold cursor-pointer"
                            >
                                Save Draft
                            </button>
                            <button
                                onClick={() => handleSaveQuizSettings(true)}
                                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-600/30"
                            >
                                <Send className="w-3.5 h-3.5" /> Publish to Class
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* SUBMISSIONS MODAL */}
            {selectedSubmissionQuiz && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-[#0d0d1e] border border-white/10 w-full max-w-4xl rounded-3xl p-6 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="flex justify-between items-center border-b border-white/5 pb-4">
                            <div>
                                <h3 className="text-lg font-bold text-white">
                                    Student Submissions: {selectedSubmissionQuiz.title}
                                </h3>
                                <p className="text-xs text-zinc-400">Review, grade subjective answers, and finalize results.</p>
                            </div>
                            <button onClick={() => setSelectedSubmissionQuiz(null)} className="text-zinc-400 hover:text-white">
                                ✕
                            </button>
                        </div>

                        {loadingSubmissions ? (
                            <div className="py-12 flex justify-center text-zinc-500">
                                <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
                            </div>
                        ) : submissions.length === 0 ? (
                            <p className="text-xs text-zinc-500 text-center py-8">No student submissions recorded yet.</p>
                        ) : (
                            <div className="space-y-3">
                                {submissions.map((sub) => (
                                    <div
                                        key={sub.id}
                                        className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between gap-4"
                                    >
                                        <div>
                                            <h4 className="text-xs font-bold text-white">{sub.student_name}</h4>
                                            <p className="text-[10px] text-zinc-400">{sub.student_email}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 text-[10px]">
                                                    Score: {sub.total_marks_obtained} pts ({sub.score_percentage}%)
                                                </span>
                                                {sub.grade && (
                                                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                                                        Grade: {sub.grade}
                                                    </span>
                                                )}
                                                <span className="text-[10px] text-amber-400 font-medium">Status: {sub.status}</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => setGradingSubmission(sub)}
                                            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                                        >
                                            <Award className="w-3.5 h-3.5" /> Grade Submission
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* GRADING MODAL */}
            {gradingSubmission && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-[#0d0d1e] border border-white/10 w-full max-w-2xl rounded-3xl p-6 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="flex justify-between items-center border-b border-white/5 pb-4">
                            <div>
                                <h3 className="text-base font-bold text-white">
                                    Grade: {gradingSubmission.student_name}
                                </h3>
                                <p className="text-xs text-zinc-400">Evaluate answers and assign marks.</p>
                            </div>
                            <button onClick={() => setGradingSubmission(null)} className="text-zinc-400 hover:text-white">
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4">
                            {gradingSubmission.answers.map((ans, idx) => (
                                <div key={ans.id} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                                    <p className="text-xs font-bold text-white">Q{idx + 1}: {ans.question_text}</p>
                                    <p className="text-xs text-zinc-300 bg-[#070712] p-2 rounded border border-white/5">
                                        Student Answer: <span className="font-semibold text-indigo-300">{ans.student_answer || "(No Answer)"}</span>
                                    </p>
                                    <p className="text-[10px] text-zinc-500">Correct Answer: {ans.correct_answer}</p>

                                    <div className="grid grid-cols-2 gap-3 pt-2">
                                        <div>
                                            <label className="text-[10px] text-zinc-400">Marks (Max {ans.max_marks})</label>
                                            <input
                                                type="number"
                                                max={ans.max_marks}
                                                value={ans.score_awarded}
                                                onChange={(e) => {
                                                    const updated = [...gradingSubmission.answers];
                                                    updated[idx].score_awarded = Number(e.target.value);
                                                    updated[idx].is_correct = Number(e.target.value) >= ans.max_marks / 2;
                                                    setGradingSubmission({ ...gradingSubmission, answers: updated });
                                                }}
                                                className="w-full px-2 py-1 text-xs rounded bg-[#070712] border border-white/10 text-white outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-zinc-400">Answer Feedback</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Well explained!"
                                                value={ans.teacher_feedback || ""}
                                                onChange={(e) => {
                                                    const updated = [...gradingSubmission.answers];
                                                    updated[idx].teacher_feedback = e.target.value;
                                                    setGradingSubmission({ ...gradingSubmission, answers: updated });
                                                }}
                                                className="w-full px-2 py-1 text-xs rounded bg-[#070712] border border-white/10 text-white outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="space-y-1 pt-2">
                                <label className="text-xs text-zinc-400">Overall Teacher Feedback</label>
                                <textarea
                                    rows={2}
                                    value={gradingSubmission.teacher_feedback || ""}
                                    onChange={(e) => setGradingSubmission({ ...gradingSubmission, teacher_feedback: e.target.value })}
                                    className="w-full p-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white outline-none"
                                    placeholder="Good overall effort..."
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 border-t border-white/5 pt-4">
                            <button
                                onClick={() => handleSaveGrading(false)}
                                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold cursor-pointer"
                            >
                                Save Review Draft
                            </button>
                            <button
                                onClick={() => handleSaveGrading(true)}
                                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-600/30"
                            >
                                <CheckCircle2 className="w-3.5 h-3.5" /> Finalize Grade
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
