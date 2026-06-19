"use client";

import React, { useState } from "react";
import {
    FileText,
    Search,
    Sparkles,
    Copy,
    Download,
    Save,
    Settings2,
    ChevronRight,
    Plus,
    Hash,
    BookMarked,
    ListOrdered,
    Type,
    MoreHorizontal,
    Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Mock Data
const documents = [
    { id: 1, name: "Neural Networks.pdf", size: "2.4 MB", date: "2 hours ago" },
    { id: 2, name: "Bio-Genetics.docx", size: "1.2 MB", date: "5 hours ago" },
    { id: 3, name: "Modern History.txt", size: "450 KB", date: "Yesterday" },
    { id: 4, name: "Macroeconomics.pdf", size: "3.8 MB", date: "2 days ago" },
];

export default function SummaryPage() {
    const [selectedDoc, setSelectedDoc] = useState(documents[0].id);
    const [summaryLength, setSummaryLength] = useState("medium");
    const [isGenerating, setIsGenerating] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleGenerate = () => {
        setIsGenerating(true);
        setTimeout(() => setIsGenerating(false), 2000);
    };

    const handleCopy = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex h-[calc(100vh-120px)] gap-6 overflow-hidden animate-fade-in">
            {/* Left Sidebar: Documents */}
            <aside className="w-72 hidden xl:flex flex-col gap-4">
                <Card className="flex-1 border-none bg-card/40 backdrop-blur-xl shadow-sm rounded-3xl overflow-hidden flex flex-col">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-bold">Select Document</CardTitle>
                        <div className="relative mt-2">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                            <Input
                                placeholder="Search..."
                                className="pl-9 h-9 bg-muted/50 border-none text-xs rounded-xl"
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto px-2 space-y-1">
                        {documents.map((doc) => (
                            <button
                                key={doc.id}
                                onClick={() => setSelectedDoc(doc.id)}
                                className={cn(
                                    "w-full flex items-center gap-3 p-3 rounded-2xl transition-all group text-left",
                                    selectedDoc === doc.id
                                        ? "bg-primary/10 text-primary border border-primary/20"
                                        : "hover:bg-muted text-muted-foreground hover:text-foreground border border-transparent"
                                )}
                            >
                                <div className={cn(
                                    "h-9 w-9 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
                                    selectedDoc === doc.id ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                                )}>
                                    <FileText className="h-4 w-4" />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-sm font-semibold truncate">{doc.name}</p>
                                    <p className="text-[10px] opacity-60 mt-0.5">{doc.size} • {doc.date}</p>
                                </div>
                            </button>
                        ))}
                        <Button variant="ghost" className="w-full justify-start gap-2 p-3 rounded-2xl text-xs text-muted-foreground hover:text-primary">
                            <Plus className="h-4 w-4" /> Add Document
                        </Button>
                    </CardContent>
                </Card>
            </aside>

            {/* Main Content: Generated Summary */}
            <main className="flex-1 flex flex-col gap-4 min-w-0">
                <Card className="flex-1 border-none bg-card/40 backdrop-blur-xl shadow-sm rounded-3xl overflow-hidden flex flex-col">
                    <CardHeader className="border-b border-white/5 flex flex-row items-center justify-between py-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
                                <Sparkles className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-bold">Summary: Neural Networks</CardTitle>
                                <p className="text-[10px] text-muted-foreground">Generated by Study.AI ✨</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="rounded-xl h-9" onClick={handleCopy}>
                                {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                            </Button>
                            <Button variant="ghost" size="sm" className="rounded-xl h-9">
                                <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="rounded-xl h-9">
                                <Save className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="rounded-xl h-9 xl:hidden">
                                <Settings2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
                        {isGenerating ? (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                <div className="relative">
                                    <div className="h-16 w-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                                    <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-indigo-500 animate-pulse" />
                                </div>
                                <p className="text-sm font-semibold gradient-text animate-pulse">Deep analysis in progress...</p>
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="max-w-3xl mx-auto space-y-10"
                            >
                                {/* Executive Summary */}
                                <section className="space-y-4">
                                    <div className="flex items-center gap-2 text-indigo-500">
                                        <Hash className="h-5 w-5" />
                                        <h2 className="text-xl font-bold tracking-tight">Executive Summary</h2>
                                    </div>
                                    <p className="text-muted-foreground leading-relaxed text-sm">
                                        This document provides an in-depth exploration of artificial neural networks (ANNs), focusing on their architectural foundations, backpropagation mechanisms, and applications in deep learning. It details how mirrored structures of biological neurons enable machines to perceive patterns and make predictions with increasing accuracy.
                                    </p>
                                </section>

                                {/* Key Concepts */}
                                <section className="space-y-4">
                                    <div className="flex items-center gap-2 text-purple-500">
                                        <BookMarked className="h-5 w-5" />
                                        <h2 className="text-xl font-bold tracking-tight">Key Concepts</h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 hover:border-indigo-500/30 transition-all">
                                            <h4 className="font-bold text-sm">Activation Functions</h4>
                                            <p className="text-xs text-muted-foreground mt-1">Non-linear transformations like ReLU and Sigmoid that decide if a neuron fires.</p>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-purple-500/5 border border-purple-500/10 hover:border-purple-500/30 transition-all">
                                            <h4 className="font-bold text-sm">Backpropagation</h4>
                                            <p className="text-xs text-muted-foreground mt-1">The fundamental algorithm for training nets via gradient descent and chain rule.</p>
                                        </div>
                                    </div>
                                </section>

                                {/* Important Definitions */}
                                <section className="space-y-4">
                                    <div className="flex items-center gap-2 text-blue-500">
                                        <Type className="h-5 w-5" />
                                        <h2 className="text-xl font-bold tracking-tight">Important Definitions</h2>
                                    </div>
                                    <dl className="space-y-4">
                                        <div className="flex flex-col gap-1">
                                            <dt className="text-sm font-bold text-foreground">Perceptron</dt>
                                            <dd className="text-xs text-muted-foreground border-l-2 border-blue-500 pl-4 py-1">The simplest form of a neural network used for binary classifiers.</dd>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <dt className="text-sm font-bold text-foreground">Epoch</dt>
                                            <dd className="text-xs text-muted-foreground border-l-2 border-blue-500 pl-4 py-1">One complete pass of the entire training dataset through the network.</dd>
                                        </div>
                                    </dl>
                                </section>

                                {/* Topics Covered */}
                                <section className="space-y-4">
                                    <div className="flex items-center gap-2 text-emerald-500">
                                        <ListOrdered className="h-5 w-5" />
                                        <h2 className="text-xl font-bold tracking-tight">Topics Wise Summary</h2>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="p-5 rounded-3xl bg-muted/50 border border-transparent hover:border-emerald-500/20 transition-all">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-bold text-sm text-emerald-600">Architectures</h4>
                                                <Badge variant="outline" className="text-[10px]">Section 1</Badge>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">Discusses CNNs for visual data and RNNs for sequential data, highlighting their structural advantages.</p>
                                        </div>
                                    </div>
                                </section>

                                {/* Keywords */}
                                <section className="flex flex-wrap gap-2 pt-6">
                                    {['Tensors', 'Gradient Descent', 'Loss Function', 'Overfitting', 'Hyperparameters'].map(tag => (
                                        <Badge key={tag} className="bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/20 border-none rounded-full px-4 py-1 text-xs">
                                            #{tag}
                                        </Badge>
                                    ))}
                                </section>
                            </motion.div>
                        )}
                    </CardContent>
                    <div className="p-4 border-t border-white/5 flex items-center justify-between bg-card/60 backdrop-blur-md">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-6 w-6 rounded-full border-2 border-background bg-zinc-200 dark:bg-zinc-800" />
                            ))}
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-xs text-muted-foreground italic">Try asking AI more questions about this summary...</span>
                            <Button className="rounded-xl h-10 gradient-bg shadow-lg shadow-indigo-500/20 border-none px-6">
                                <Sparkles className="h-4 w-4 mr-2" />
                                Ask AI Tutor
                            </Button>
                        </div>
                    </div>
                </Card>
            </main>

            {/* Right Sidebar: Settings */}
            <aside className="w-80 hidden 2xl:flex flex-col gap-6">
                <Card className="border-none bg-card/40 backdrop-blur-xl shadow-sm rounded-3xl p-6">
                    <div className="flex items-center gap-3 mb-8">
                        <Settings2 className="h-5 w-5 text-indigo-500" />
                        <h3 className="font-bold text-lg">Summary Settings</h3>
                    </div>

                    <div className="space-y-8">
                        {/* Length Selector */}
                        <div className="space-y-4">
                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Length</Label>
                            <RadioGroup value={summaryLength} onValueChange={setSummaryLength}>
                                <div className="flex items-center space-x-2 p-3 rounded-2xl border border-transparent hover:bg-muted transition-all cursor-pointer">
                                    <RadioGroupItem value="short" id="short" />
                                    <Label htmlFor="short" className="flex-1 cursor-pointer">Short (Bullet points)</Label>
                                </div>
                                <div className="flex items-center space-x-2 p-3 rounded-2xl border border-transparent hover:bg-muted transition-all cursor-pointer">
                                    <RadioGroupItem value="medium" id="medium" />
                                    <Label htmlFor="medium" className="flex-1 cursor-pointer">Medium (Overview)</Label>
                                </div>
                                <div className="flex items-center space-x-2 p-3 rounded-2xl border border-transparent hover:bg-muted transition-all cursor-pointer">
                                    <RadioGroupItem value="detailed" id="detailed" />
                                    <Label htmlFor="detailed" className="flex-1 cursor-pointer">Detailed (Comprehensive)</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        {/* Structure Options */}
                        <div className="space-y-4">
                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Focus Areas</Label>
                            <div className="space-y-2">
                                {['Key Concepts', 'Keywords', 'Definitions', 'Topic Wise Summary'].map((item) => (
                                    <div key={item} className="flex items-center justify-between p-3 rounded-2xl border border-white/5 bg-background/30">
                                        <span className="text-sm font-medium">{item}</span>
                                        <div className="h-1.5 w-6 rounded-full bg-emerald-500" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Button
                            className="w-full h-12 rounded-2xl gradient-bg shadow-xl shadow-indigo-500/25 border-none font-bold group"
                            onClick={handleGenerate}
                            disabled={isGenerating}
                        >
                            {isGenerating ? "Regenerating..." : "Generate Summary"}
                            <Sparkles className="ml-2 h-4 w-4 transition-transform group-hover:rotate-12" />
                        </Button>
                    </div>
                </Card>

                {/* Pro Tip Card */}
                <Card className="border-none bg-indigo-600/5 backdrop-blur-xl border border-indigo-500/10 rounded-3xl p-6">
                    <div className="flex items-center gap-2 text-indigo-500 mb-2">
                        <Sparkles className="h-4 w-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">AI Pro Tip</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        Try "Detailed Summary" for complex research papers to ensure no technical nuances are missed.
                    </p>
                </Card>
            </aside>
        </div>
    );
}
