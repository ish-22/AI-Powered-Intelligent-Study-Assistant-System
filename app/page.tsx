"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, type Variants } from "framer-motion";
import { BookOpen, BrainCircuit, Sparkles, ArrowRight } from "lucide-react";

// Defined at module scope so TypeScript resolves the literal types correctly
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }, // cubic-bezier ~ easeOut, avoids string type issue
    },
};

export default function Home() {
    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-slate-950 text-slate-50 selection:bg-indigo-500/30">
            {/* Background Gradients & Glows */}
            <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />

            {/* Main Content */}
            <div className="relative z-10 w-full max-w-5xl px-6 py-20 mx-auto text-center">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col items-center max-w-3xl mx-auto"
                >
                    {/* Badge */}
                    <motion.div variants={itemVariants} className="mb-8">
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium tracking-wide">
                            <Sparkles className="w-4 h-4 text-indigo-400" />
                            Smarter Learning Awaits
                        </span>
                    </motion.div>

                    {/* Heading */}
                    <motion.h1
                        variants={itemVariants}
                        className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight"
                    >
                        AI-Powered Intelligent <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                            Study Assistant
                        </span>
                    </motion.h1>

                    {/* Description */}
                    <motion.p
                        variants={itemVariants}
                        className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl leading-relaxed"
                    >
                        Enhance your learning experience with our intelligent study tools.
                        Manage your schedule, track your progress, and get AI-driven insights to perform at your very best.
                    </motion.p>

                    {/* Action Buttons */}
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full"
                    >
                        <Link href="/register" className="w-full sm:w-auto">
                            <Button
                                size="lg"
                                className="w-full sm:w-auto h-14 px-8 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-500/25 transition-all text-base font-semibold group"
                            >
                                Get Started for Free
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <Link href="/login" className="w-full sm:w-auto">
                            <Button
                                size="lg"
                                variant="outline"
                                className="w-full sm:w-auto h-14 px-8 border-slate-700 bg-slate-900/50 hover:bg-slate-800 hover:text-white backdrop-blur-sm rounded-xl text-base font-medium transition-all"
                            >
                                Sign In
                            </Button>
                        </Link>
                    </motion.div>

                    {/* Feature Highlights */}
                    <motion.div
                        variants={itemVariants}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-24 text-left w-full"
                    >
                        <div className="flex flex-col gap-3 p-6 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-md">
                            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-2">
                                <BrainCircuit className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-200">AI-Driven Insights</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Receive personalized recommendations and feedback generated by advanced AI to optimize your study habits.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 p-6 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-md">
                            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 mb-2">
                                <BookOpen className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-200">Smart Scheduling</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Automatically organize your study sessions with an adaptable calendar that fits your learning pace.
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
