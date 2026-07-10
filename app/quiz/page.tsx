"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
    BrainCircuit,
    CheckCircle2,
    XCircle,
    ChevronRight,
    ChevronLeft,
    RotateCcw,
    Trophy,
    Timer,
    AlertCircle,
    HelpCircle,
    Sparkles,
    PlayCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

type QuizState = "setup" | "generating" | "active" | "results";

interface Document {
    id: string;
    name: string;
    subject?: string;
}

interface Question {
    id: number;
    question: string;
    options: string[];
    correctAnswer: string;
    explanation?: string;
}

export default function QuizPage() {
    const { data: session } = useSession();
    const token = session?.accessToken;

    const [state, setState] = useState<QuizState>("setup");

    // Data states
    const [documents, setDocuments] = useState<Document[]>([]);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [isLoadingDocs, setIsLoadingDocs] = useState(true);

    // Quiz states
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
    const [timeLeft, setTimeLeft] = useState(300);
    const [score, setScore] = useState(0);
    const [error, setError] = useState<string | null>(null);

    // Setup States
    const [setupData, setSetupData] = useState({
        documentId: "",
        difficulty: "medium",
        count: "5",
        topic: "",
        timeLimit: "60", // seconds per question
    });

    // Fetch documents on initial load
    useEffect(() => {
        if (!token) return;

        setIsLoadingDocs(true);
        api.documents.getAll(token)
            .then(res => setDocuments(res.documents || []))
            .catch(err => console.error("Failed to fetch documents", err))
            .finally(() => setIsLoadingDocs(false));
    }, [token]);

    // Timer effect
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (state === "active" && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (timeLeft === 0 && state === "active") {
            handleSubmitQuiz();
        }
        return () => clearInterval(timer);
    }, [state, timeLeft]);

    const handleGenerateAndStart = async () => {
        if (!token || !setupData.documentId) return;

        setState("generating");
        setError(null);

        try {
            const count = parseInt(setupData.count);
            const response = await api.documents.generateQuiz(
                token,
                setupData.documentId,
                count,
                setupData.difficulty,
                setupData.topic
            );

            if (!response.quiz || response.quiz.length === 0) {
                throw new Error("No quiz questions generated.");
            }

            // Map backend structure to our frontend structure
            const formattedQs: Question[] = response.quiz.map((q, idx) => ({
                id: idx,
                question: q.question,
                options: q.options,
                correctAnswer: q.answer,
                explanation: q.explanation || "No explanation provided.",
            }));

            setQuestions(formattedQs);

            // Start the quiz
            setCurrentQuestionIndex(0);
            setUserAnswers({});
            // Multiply total questions by user's chosen timeLimit per question
            setTimeLeft(count * parseInt(setupData.timeLimit));
            setState("active");

        } catch (err: any) {
            setError(err.message || "Failed to generate quiz. Please try again.");
            setState("setup");
        }
    };

    const handleSelectAnswer = (questionId: number, answer: string) => {
        setUserAnswers(prev => ({ ...prev, [questionId]: answer }));
    };

    const normalise = (s: string) => s.trim().toLowerCase();

    const handleSubmitQuiz = async () => {
        let calculatedScore = 0;
        questions.forEach(q => {
            if (userAnswers[q.id] && normalise(userAnswers[q.id]) === normalise(q.correctAnswer)) {
                calculatedScore += 1;
            }
        });
        setScore(calculatedScore);
        setState("results");

        // Persist quiz score to backend
        if (token && questions.length > 0) {
            const pct = Math.round((calculatedScore / questions.length) * 100);
            try {
                await api.dashboard.updateStats(token, {
                    quizzes_completed: 1,
                    avg_quiz_score: pct,
                });
            } catch { /* non-blocking */ }
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="max-w-4xl mx-auto pb-12 animate-fade-in min-h-[calc(100vh-160px)] flex flex-col">
            <AnimatePresence mode="wait">

                {/* Step 1: Quiz Setup */}
                {state === "setup" && (
                    <motion.div
                        key="setup"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="space-y-8"
                    >
                        <div className="text-center space-y-2">
                            <h1 className="text-4xl font-extrabold tracking-tight">AI Quiz <span className="gradient-text">Generator</span></h1>
                            <p className="text-muted-foreground">Customize your assessment and challenge your knowledge using your uploaded documents.</p>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-center font-semibold flex items-center justify-center gap-2">
                                <AlertCircle className="h-5 w-5" />
                                {error}
                            </div>
                        )}

                        <Card className="border-none bg-card/40 backdrop-blur-xl shadow-xl rounded-3xl overflow-hidden p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Select Document</Label>
                                        <Select onValueChange={(v) => setSetupData({ ...setupData, documentId: v })} disabled={isLoadingDocs}>
                                            <SelectTrigger className="h-12 rounded-2xl bg-background/50 border-white/5">
                                                <SelectValue placeholder={isLoadingDocs ? "Loading documents..." : "Choose a study document"} />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl">
                                                {documents.map(doc => (
                                                    <SelectItem key={doc.id} value={doc.id.toString()}>{doc.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {documents.length === 0 && !isLoadingDocs && (
                                            <p className="text-xs text-red-400 mt-1">You don't have any documents. Upload one first.</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Difficulty Level</Label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {['Easy', 'Medium', 'Hard'].map((diff) => (
                                                <button
                                                    key={diff}
                                                    onClick={() => setSetupData({ ...setupData, difficulty: diff.toLowerCase() })}
                                                    className={cn(
                                                        "py-3 rounded-2xl border transition-all text-sm font-semibold",
                                                        setupData.difficulty === diff.toLowerCase()
                                                            ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                                                            : "border-white/5 bg-background/20 hover:bg-white/5 text-muted-foreground"
                                                    )}
                                                >
                                                    {diff}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Number of Questions</Label>
                                        <Select value={setupData.count} onValueChange={(v) => setSetupData({ ...setupData, count: v })}>
                                            <SelectTrigger className="h-12 rounded-2xl bg-background/50 border-white/5">
                                                <SelectValue placeholder="5 Questions" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl">
                                                {["3", "5", "10", "15", "20"].map(n => (
                                                    <SelectItem key={n} value={n}>{n} Questions</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Topic Focus (Optional)</Label>
                                        <Input
                                            placeholder="e.g. Focus on Newton's Third Law"
                                            value={setupData.topic}
                                            onChange={(e) => setSetupData({ ...setupData, topic: e.target.value })}
                                            className="h-12 rounded-2xl bg-background/50 border-white/5"
                                        />
                                        <p className="text-[10px] text-muted-foreground mt-1 px-1">If left empty, AI will test you on the entire document.</p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Time Per Question</Label>
                                        <Select value={setupData.timeLimit} onValueChange={(v) => setSetupData({ ...setupData, timeLimit: v })}>
                                            <SelectTrigger className="h-12 rounded-2xl bg-background/50 border-white/5">
                                                <SelectValue placeholder="60 seconds" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl">
                                                <SelectItem value="30">30 Seconds</SelectItem>
                                                <SelectItem value="60">1 Minute</SelectItem>
                                                <SelectItem value="120">2 Minutes</SelectItem>
                                                <SelectItem value="300">5 Minutes</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 flex justify-center">
                                <Button
                                    onClick={handleGenerateAndStart}
                                    disabled={!setupData.documentId || isLoadingDocs}
                                    className="rounded-3xl h-16 px-12 gradient-bg shadow-2xl shadow-indigo-500/30 border-none font-bold text-lg hover:scale-105 transition-all group disabled:opacity-50 disabled:hover:scale-100"
                                >
                                    <PlayCircle className="mr-2 h-6 w-6" />
                                    Generate AI Quiz
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                )}

                {/* Step 1.5: Generating State */}
                {state === "generating" && (
                    <motion.div
                        key="generating"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center min-h-[50vh] space-y-6 text-center"
                    >
                        <div className="relative">
                            <div className="h-24 w-24 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-indigo-500 animate-pulse" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold gradient-text">Generating Your Quiz...</h2>
                            <p className="text-muted-foreground text-sm max-w-md">Our AI is reading your document and synthesizing custom questions. This might take a moment.</p>
                        </div>
                    </motion.div>
                )}

                {/* Step 2: Active Quiz */}
                {state === "active" && questions.length > 0 && (
                    <motion.div
                        key="active"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex flex-col flex-1"
                    >
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                            <div className="space-y-1">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <BrainCircuit className="h-6 w-6 text-indigo-500" />
                                    AI Study Quiz
                                </h2>
                                <p className="text-xs text-muted-foreground italic">Powered by Neural Analysis of your documents</p>
                            </div>
                            <div className="flex items-center gap-6 bg-card/40 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/5 shadow-sm">
                                <div className="flex items-center gap-2">
                                    <Timer className={cn("h-5 w-5", timeLeft < 60 ? "text-red-500 animate-pulse" : "text-indigo-500")} />
                                    <span className={cn("font-mono text-lg font-bold", timeLeft < 60 ? "text-red-500" : "text-foreground")}>
                                        {formatTime(timeLeft)}
                                    </span>
                                </div>
                                <div className="h-8 w-[1px] bg-white/10" />
                                <div className="flex items-center gap-2">
                                    <HelpCircle className="h-5 w-5 text-indigo-500" />
                                    <span className="font-bold text-lg">{currentQuestionIndex + 1} / {questions.length}</span>
                                </div>
                            </div>
                        </div>

                        <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} className="h-2 rounded-full mb-10 bg-indigo-500/10" />

                        <div className="flex-1">
                            <Card className="border-none bg-card/40 backdrop-blur-xl shadow-xl rounded-[40px] p-8 md:p-12">
                                <CardContent className="p-0 space-y-10">
                                    <motion.div
                                        key={currentQuestionIndex}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="space-y-8"
                                    >
                                        <div className="space-y-4">
                                            <Badge className="bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20 border-none rounded-lg px-3 py-1">
                                                Question {currentQuestionIndex + 1}
                                            </Badge>
                                            <h3 className="text-2xl font-bold leading-tight">{questions[currentQuestionIndex].question}</h3>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4">
                                            {questions[currentQuestionIndex].options.map((option) => (
                                                <button
                                                    key={option}
                                                    onClick={() => handleSelectAnswer(questions[currentQuestionIndex].id, option)}
                                                    className={cn(
                                                        "flex items-center p-6 rounded-3xl border-2 transition-all text-left group relative overflow-hidden",
                                                        userAnswers[questions[currentQuestionIndex].id] === option
                                                            ? "border-indigo-500 bg-indigo-500/5 shadow-inner"
                                                            : "border-white/5 bg-background/20 hover:border-white/10 hover:bg-white/5"
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "h-7 w-7 rounded-full border-2 flex items-center justify-center mr-4 transition-all shrink-0",
                                                        userAnswers[questions[currentQuestionIndex].id] === option
                                                            ? "bg-indigo-500 border-indigo-500 text-white"
                                                            : "border-muted-foreground/30 group-hover:border-muted-foreground/50"
                                                    )}>
                                                        {userAnswers[questions[currentQuestionIndex].id] === option && <CheckCircle2 className="h-4 w-4" />}
                                                    </div>
                                                    <span className="font-medium text-lg leading-snug">{option}</span>
                                                    {userAnswers[questions[currentQuestionIndex].id] === option && (
                                                        <motion.div layoutId="selection" className="absolute right-6 h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.5)]" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="mt-8 flex justify-between items-center bg-card/10 p-6 rounded-3xl">
                            <Button
                                variant="ghost"
                                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                                disabled={currentQuestionIndex === 0}
                                className="rounded-2xl h-12 px-6 hover:bg-white/5"
                            >
                                <ChevronLeft className="mr-2 h-5 w-5" /> Previous
                            </Button>
                            <div className="flex items-center gap-4">
                                {currentQuestionIndex === questions.length - 1 ? (
                                    <Button
                                        onClick={handleSubmitQuiz}
                                        className="rounded-2xl h-12 px-8 gradient-bg shadow-xl shadow-indigo-500/25 border-none font-bold"
                                    >
                                        Complete Test
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                                        className="rounded-2xl h-12 px-8 bg-indigo-500 hover:bg-indigo-600 border-none font-bold text-white"
                                    >
                                        Next Question <ChevronRight className="ml-2 h-5 w-5" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Step 3: Results Page */}
                {state === "results" && (
                    <motion.div
                        key="results"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="space-y-10"
                    >
                        <Card className="border-none bg-card/40 backdrop-blur-xl shadow-xl rounded-[40px] p-10 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 gradient-bg" />
                            <div className="space-y-6">
                                <div className="mx-auto h-24 w-24 rounded-full bg-indigo-500/10 flex items-center justify-center">
                                    <Trophy className="h-12 w-12 text-indigo-500" />
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-extrabold">Assessment Complete</h2>
                                    <p className="text-muted-foreground">Here is how you performed in this session</p>
                                </div>

                                <div className="flex flex-col md:flex-row items-center justify-center gap-12 py-6">
                                    <div className="flex flex-col items-center">
                                        <span className="text-5xl font-black gradient-text">{questions.length > 0 ? Math.round((score / questions.length) * 100) : 0}%</span>
                                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-2">Overall Score</span>
                                    </div>
                                    <div className="h-12 w-[1px] bg-white/10 hidden md:block" />
                                    <div className="flex gap-8">
                                        <div className="flex flex-col items-center">
                                            <span className="text-3xl font-bold text-emerald-500">{score}</span>
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Correct</span>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <span className="text-3xl font-bold text-red-500">{questions.length - score}</span>
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Incorrect</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4 justify-center pt-6">
                                    <Button onClick={() => setState("setup")} className="rounded-2xl h-12 px-8 gradient-bg shadow-xl shadow-indigo-500/25 border-none font-bold">
                                        <RotateCcw className="mr-2 h-4 w-4" /> Start New Quiz
                                    </Button>
                                </div>
                            </div>
                        </Card>

                        <div className="space-y-6">
                            <h3 className="text-xl font-bold flex items-center gap-2 px-4 text-muted-foreground">
                                <AlertCircle className="h-5 w-5" />
                                Question Breakdown
                            </h3>
                            <div className="space-y-4">
                                {questions.map((q, idx) => {
                                    // Remove any exact prefixing to allow slightly mismatched comparisons, but exact is fine if backend follows structure
                                    const isCorrect = userAnswers[q.id] !== undefined &&
                                        normalise(userAnswers[q.id]) === normalise(q.correctAnswer);
                                    return (
                                        <Card key={q.id} className={cn(
                                            "border-none bg-card/40 backdrop-blur-xl rounded-3xl overflow-hidden",
                                            isCorrect ? "border-l-4 border-l-emerald-500" : "border-l-4 border-l-red-500"
                                        )}>
                                            <CardHeader className="flex flex-row items-start justify-between pb-2">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-bold text-muted-foreground">Question {idx + 1}</span>
                                                        {isCorrect ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                                                    </div>
                                                    <h4 className="font-bold text-lg">{q.question}</h4>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="space-y-4 pt-2 pb-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="p-4 rounded-xl bg-background/30 border border-white/5">
                                                        <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Your Answer</span>
                                                        <span className={cn("text-sm font-semibold", isCorrect ? "text-emerald-500" : "text-red-500")}>
                                                            {userAnswers[q.id] || "No Answer Selected"}
                                                        </span>
                                                    </div>
                                                    {!isCorrect && (
                                                        <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                                                            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase block mb-1">Correct Answer</span>
                                                            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{q.correctAnswer}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 text-xs italic text-muted-foreground">
                                                    <Sparkles className="h-3 w-3 inline mr-2 text-indigo-500" />
                                                    {q.explanation}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
