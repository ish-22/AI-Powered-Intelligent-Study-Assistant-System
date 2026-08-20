"use client";

import React, { useState, useEffect } from "react";
import {
    BookOpen,
    Clock,
    Play,
    CheckCircle2,
    AlertCircle,
    Award,
    Sparkles,
    Loader2,
    ArrowRight,
    ArrowLeft,
    FileText,
} from "lucide-react";
import { useCurrentUser } from "@/lib/use-current-user";

interface StudentQuiz {
    id: string;
    title: string;
    description?: string;
    difficulty: string;
    time_limit_mins: number;
    total_marks: number;
    start_at?: string;
    deadline_at?: string;
    document_name: string;
    status: string; // Upcoming | Available | In Progress | Submitted | Under Review | Graded | Closed
    attempt_id?: string;
    score_percentage?: number;
    grade?: string;
}

interface QuestionItem {
    id: string;
    type: string;
    question_text: string;
    options?: string[];
    marks: number;
}

interface AttemptResult {
    id: string;
    quiz_title: string;
    status: string;
    score_percentage?: number;
    total_marks_obtained?: number;
    total_possible_marks: number;
    grade?: string;
    teacher_feedback?: string;
    answers: Array<{
        id: string;
        question_text: string;
        options?: string[];
        student_answer: string;
        correct_answer: string;
        is_correct: boolean;
        score_awarded: number;
        max_marks: number;
        teacher_feedback?: string;
    }>;
}

export default function StudentQuizzesPage() {
    const { session } = useCurrentUser();
    const [quizzes, setQuizzes] = useState<StudentQuiz[]>([]);
    const [loading, setLoading] = useState(true);

    // Active Quiz Exam State
    const [activeQuiz, setActiveQuiz] = useState<StudentQuiz | null>(null);
    const [attemptId, setAttemptId] = useState<string | null>(null);
    const [questions, setQuestions] = useState<QuestionItem[]>([]);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [timeLeftSeconds, setTimeLeftSeconds] = useState(0);
    const [starting, setStarting] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Result view state
    const [viewResult, setViewResult] = useState<AttemptResult | null>(null);
    const [loadingResult, setLoadingResult] = useState(false);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

    const fetchQuizzes = async () => {
        if (!session?.accessToken) return;
        try {
            const res = await fetch(`${API_URL}/quizzes`, {
                headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                    Accept: "application/json",
                },
            });
            if (res.ok) {
                const data = await res.json();
                setQuizzes(data.quizzes || []);
            }
        } catch (e) {
            console.error("Failed to load student quizzes:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuizzes();
    }, [session?.accessToken]);

    // Exam countdown timer
    useEffect(() => {
        if (!activeQuiz || timeLeftSeconds <= 0) return;

        const timer = setInterval(() => {
            setTimeLeftSeconds((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmitQuiz(); // Auto submit on expiration
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [activeQuiz, timeLeftSeconds]);

    const handleStartQuiz = async (quiz: StudentQuiz) => {
        if (!session?.accessToken) return;
        setStarting(true);
        try {
            const res = await fetch(`${API_URL}/quizzes/${quiz.id}/start`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                    Accept: "application/json",
                },
            });

            if (res.ok) {
                const data = await res.json();
                setActiveQuiz(quiz);
                setAttemptId(data.attempt_id);
                setQuestions(data.questions || []);
                setTimeLeftSeconds((quiz.time_limit_mins || 15) * 60);
                setCurrentQIndex(0);
                setAnswers({});
            } else {
                const err = await res.json();
                alert(err.error || "Unable to start quiz.");
            }
        } catch (e) {
            console.error("Start quiz error:", e);
        } finally {
            setStarting(false);
        }
    };

    const handleAnswerSelect = (qId: string, val: string) => {
        setAnswers((prev) => ({ ...prev, [qId]: val }));
    };

    const handleSubmitQuiz = async () => {
        if (!attemptId || !session?.accessToken || submitting) return;
        setSubmitting(true);

        const payloadAnswers = questions.map((q) => ({
            quiz_question_id: q.id,
            student_answer: answers[q.id] || "",
        }));

        try {
            const res = await fetch(`${API_URL}/quizzes/attempts/${attemptId}/submit`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    answers: payloadAnswers,
                    time_spent_seconds: (activeQuiz?.time_limit_mins || 15) * 60 - timeLeftSeconds,
                }),
            });

            if (res.ok) {
                const data = await res.json();
                alert(
                    data.status === "GRADED"
                        ? `Quiz completed! Score: ${data.attempt.score_percentage}%`
                        : "Quiz submitted! Status: Under Review by teacher."
                );
                setActiveQuiz(null);
                fetchQuizzes();
                if (data.attempt) setViewResult(data.attempt);
            } else {
                const err = await res.json();
                alert(err.error || "Submission failed.");
            }
        } catch (e) {
            console.error("Submit quiz error:", e);
        } finally {
            setSubmitting(false);
        }
    };

    const handleViewResult = async (attemptId: string) => {
        if (!session?.accessToken) return;
        setLoadingResult(true);
        try {
            const res = await fetch(`${API_URL}/quizzes/attempts/${attemptId}/result`, {
                headers: { Authorization: `Bearer ${session.accessToken}`, Accept: "application/json" },
            });
            if (res.ok) {
                const data = await res.json();
                setViewResult(data.result);
            }
        } catch (e) {
            console.error("Result fetch error:", e);
        } finally {
            setLoadingResult(false);
        }
    };

    const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };

    return (
        <div className="space-y-8 relative">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                    My Class Quizzes
                </h1>
                <p className="text-zinc-400 text-sm mt-1">
                    Complete assigned quizzes, test knowledge on lecture materials, and track grade feedback.
                </p>
            </div>

            {loading ? (
                <div className="py-16 flex justify-center text-zinc-500">
                    <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
                </div>
            ) : quizzes.length === 0 ? (
                <div className="p-8 rounded-3xl bg-[#0d0d1e] border border-white/5 text-center text-zinc-500 space-y-2">
                    <BookOpen className="w-10 h-10 mx-auto text-zinc-600" />
                    <p className="text-sm font-semibold text-zinc-300">No quizzes assigned</p>
                    <p className="text-xs">Quizzes published by your assigned teacher will appear here.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {quizzes.map((q) => (
                        <div
                            key={q.id}
                            className="p-6 rounded-3xl bg-[#0d0d1e] border border-white/5 hover:border-white/10 transition-all flex flex-col justify-between space-y-4 shadow-xl"
                        >
                            <div className="space-y-2">
                                <div className="flex items-center justify-between gap-2">
                                    <span
                                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${q.status === "Available"
                                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                                : q.status === "Graded"
                                                    ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                                                    : q.status === "Under Review" || q.status === "Submitted"
                                                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                                        : "bg-zinc-500/10 text-zinc-400"
                                            }`}
                                    >
                                        {q.status}
                                    </span>
                                    <span className="text-xs text-zinc-400 font-medium">{q.total_marks} Marks</span>
                                </div>

                                <h3 className="text-base font-bold text-white">{q.title}</h3>
                                <p className="text-xs text-zinc-400 flex items-center gap-1">
                                    <FileText className="w-3.5 h-3.5 text-indigo-400" /> Source: {q.document_name}
                                </p>
                            </div>

                            <div className="flex items-center justify-between text-xs text-zinc-400 border-t border-white/5 pt-3">
                                <div className="flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5 text-indigo-400" /> {q.time_limit_mins} mins
                                </div>

                                {q.status === "Available" || q.status === "In Progress" ? (
                                    <button
                                        onClick={() => handleStartQuiz(q)}
                                        disabled={starting}
                                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-600/30 transition-all"
                                    >
                                        <Play className="w-3.5 h-3.5" /> Start Assessment
                                    </button>
                                ) : q.attempt_id ? (
                                    <button
                                        onClick={() => handleViewResult(q.attempt_id!)}
                                        className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer border border-white/10"
                                    >
                                        <Award className="w-3.5 h-3.5 text-emerald-400" /> View Grade / Feedback
                                    </button>
                                ) : (
                                    <span className="text-[11px] text-zinc-500">
                                        {q.status === "Upcoming" ? "Opens soon" : "Quiz closed"}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* EXAM / QUIZ RUNNER MODAL */}
            {activeQuiz && questions.length > 0 && (
                <div className="fixed inset-0 z-50 bg-[#070712] flex flex-col p-6 overflow-y-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center border-b border-white/10 pb-4 max-w-4xl mx-auto w-full">
                        <div>
                            <h2 className="text-lg font-bold text-white">{activeQuiz.title}</h2>
                            <p className="text-xs text-zinc-400">
                                Question {currentQIndex + 1} of {questions.length}
                            </p>
                        </div>
                        <div className="px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-bold flex items-center gap-2">
                            <Clock className="w-4 h-4 animate-pulse" /> {formatTime(timeLeftSeconds)}
                        </div>
                    </div>

                    {/* Question Content */}
                    <div className="max-w-4xl mx-auto w-full flex-1 py-8 space-y-6">
                        <div className="p-6 rounded-3xl bg-[#0d0d1e] border border-white/5 space-y-4">
                            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                                Question {currentQIndex + 1} ({questions[currentQIndex].marks} pts)
                            </span>
                            <h3 className="text-base font-semibold text-white">
                                {questions[currentQIndex].question_text}
                            </h3>

                            {/* Options for MCQ / TF */}
                            {questions[currentQIndex].options ? (
                                <div className="space-y-2 pt-2">
                                    {questions[currentQIndex].options!.map((opt, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleAnswerSelect(questions[currentQIndex].id, opt)}
                                            className={`w-full p-4 rounded-xl text-xs text-left font-medium border transition-all flex items-center justify-between cursor-pointer ${answers[questions[currentQIndex].id] === opt
                                                    ? "bg-indigo-600/20 border-indigo-500 text-white"
                                                    : "bg-white/5 border-white/5 text-zinc-300 hover:bg-white/10"
                                                }`}
                                        >
                                            <span>{opt}</span>
                                            {answers[questions[currentQIndex].id] === opt && (
                                                <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                /* Short Answer Input */
                                <div className="pt-2">
                                    <textarea
                                        rows={4}
                                        placeholder="Type your answer here..."
                                        value={answers[questions[currentQIndex].id] || ""}
                                        onChange={(e) =>
                                            handleAnswerSelect(questions[currentQIndex].id, e.target.value)
                                        }
                                        className="w-full p-4 text-xs rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-indigo-500"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer Navigation */}
                    <div className="border-t border-white/10 pt-4 max-w-4xl mx-auto w-full flex justify-between items-center">
                        <button
                            disabled={currentQIndex === 0}
                            onClick={() => setCurrentQIndex((prev) => prev - 1)}
                            className="px-4 py-2 rounded-xl bg-white/5 text-white disabled:opacity-30 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                        >
                            <ArrowLeft className="w-4 h-4" /> Previous
                        </button>

                        {currentQIndex < questions.length - 1 ? (
                            <button
                                onClick={() => setCurrentQIndex((prev) => prev + 1)}
                                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                            >
                                Next <ArrowRight className="w-4 h-4" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmitQuiz}
                                disabled={submitting}
                                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-600/30"
                            >
                                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Assessment"}
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* STUDENT RESULT VIEW MODAL */}
            {viewResult && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-[#0d0d1e] border border-white/10 w-full max-w-2xl rounded-3xl p-6 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="flex justify-between items-center border-b border-white/5 pb-4">
                            <div>
                                <h3 className="text-lg font-bold text-white">{viewResult.quiz_title}</h3>
                                <p className="text-xs text-zinc-400">Status: {viewResult.status}</p>
                            </div>
                            <button onClick={() => setViewResult(null)} className="text-zinc-400 hover:text-white">
                                ✕
                            </button>
                        </div>

                        {viewResult.score_percentage !== null ? (
                            <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between">
                                <div>
                                    <span className="text-xs text-zinc-400">Final Grade Score</span>
                                    <h4 className="text-2xl font-extrabold text-white">
                                        {viewResult.total_marks_obtained} / {viewResult.total_possible_marks} pts ({viewResult.score_percentage}%)
                                    </h4>
                                </div>
                                {viewResult.grade && (
                                    <span className="text-3xl font-black text-emerald-400 px-4 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                        {viewResult.grade}
                                    </span>
                                )}
                            </div>
                        ) : (
                            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
                                <AlertCircle className="w-4 h-4 inline mr-2" /> Your quiz is currently Under Review by the teacher. Detailed answers will be visible once grading is finalized.
                            </div>
                        )}

                        {viewResult.teacher_feedback && (
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                                <span className="text-xs font-bold text-indigo-400">Teacher Feedback</span>
                                <p className="text-xs text-zinc-300">{viewResult.teacher_feedback}</p>
                            </div>
                        )}

                        {viewResult.answers.length > 0 && (
                            <div className="space-y-3 pt-2">
                                <h4 className="text-xs font-bold text-white">Answer Breakdown</h4>
                                {viewResult.answers.map((ans, idx) => (
                                    <div key={idx} className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1 text-xs">
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-zinc-300">Q{idx + 1}: {ans.question_text}</span>
                                            <span className={`font-bold ${ans.is_correct ? "text-emerald-400" : "text-red-400"}`}>
                                                {ans.score_awarded} / {ans.max_marks} pts
                                            </span>
                                        </div>
                                        <p className="text-zinc-400">Your Answer: <span className="text-white">{ans.student_answer || "(No Answer)"}</span></p>
                                        <p className="text-emerald-400">Correct Answer: {ans.correct_answer}</p>
                                        {ans.teacher_feedback && (
                                            <p className="text-indigo-300 text-[11px]">Teacher Comment: {ans.teacher_feedback}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
