"use client";

import React, { useState, useEffect, useRef } from "react";
import {
    Send,
    Plus,
    MessageSquare,
    Trash2,
    Copy,
    RotateCcw,
    Sparkles,
    User,
    Bot,
    Search,
    MoreVertical,
    MinusCircle,
    PlusCircle,
    HelpCircle,
    Share2,
    ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Mock Data
const initialHistory = [
    { id: 1, title: "Understanding Quantum Decoherence", date: "2 hours ago" },
    { id: 2, title: "Calculus III Proofs", date: "Yesterday" },
    { id: 3, title: "Modern Architecture Trends", date: "2 days ago" },
    { id: 4, title: "Photosynthesis Process", date: "Monday" },
];

const suggestedQuestions = [
    "Explain the Chain Rule in Calculus",
    "Summarize the French Revolution",
    "How do Neural Networks learn?",
    "Define 'Economic Elasticity'"
];

const initialMessages = [
    {
        id: 1,
        role: "ai",
        content: "Hi John! I'm your AI Study Assistant. I have analyzed your recent documents on **Quantum Physics** and **Neural Networks**. How can I help you study today?",
        timestamp: "10:30 AM"
    },
    {
        id: 2,
        role: "user",
        content: "Can you simplify the concept of backpropagation for me?",
        timestamp: "10:31 AM"
    },
    {
        id: 3,
        role: "ai",
        content: "Of course! Think of **Backpropagation** like a student receiving a graded test. \n\n1. The student sees the errors (the 'loss').\n2. They look back at each step of their work to see which part caused the mistake.\n3. They adjust their knowledge so they don't repeat that mistake next time.\n\nIn neural networks, we calculate the gradient of the loss function with respect to each weight by the chain rule, iterating backwards from the last layer to the first. Would you like a more technical explanation or some examples?",
        timestamp: "10:32 AM"
    }
];

export default function ChatPage() {
    const [messages, setMessages] = useState(initialMessages);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = (content: string = inputValue) => {
        if (!content.trim()) return;

        const newUserMessage = {
            id: messages.length + 1,
            role: "user",
            content: content,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages([...messages, newUserMessage]);
        setInputValue("");
        setIsTyping(true);

        // Simulate AI Response
        setTimeout(() => {
            setIsTyping(false);
            const newAiMessage = {
                id: messages.length + 2,
                role: "ai",
                content: `I've looked into "${content}". Here's a study-optimized explanation focused on your current curriculum goals...`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, newAiMessage]);
        }, 2000);
    };

    return (
        <div className="flex h-[calc(100vh-120px)] gap-6 overflow-hidden animate-fade-in">
            {/* Left Sidebar: Chat History */}
            <aside className="w-72 hidden lg:flex flex-col gap-4">
                <Button className="w-full h-12 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white border-none shadow-lg shadow-indigo-500/20 font-bold gap-2">
                    <Plus className="h-5 w-5" /> New Chat
                </Button>

                <div className="flex-1 bg-card/40 backdrop-blur-xl rounded-3xl border border-white/5 flex flex-col overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-white/5">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                            <Input placeholder="Search chats..." className="pl-9 h-9 bg-muted/50 border-none text-xs rounded-xl focus-visible:ring-1 focus-visible:ring-primary" />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-hide">
                        {initialHistory.map((chat) => (
                            <button
                                key={chat.id}
                                className="w-full flex items-center gap-3 p-3 rounded-2xl transition-all hover:bg-muted group text-left"
                            >
                                <div className="h-8 w-8 rounded-xl bg-muted flex items-center justify-center shrink-0">
                                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-semibold truncate text-foreground">{chat.title}</p>
                                    <p className="text-[10px] text-muted-foreground mt-0.5">{chat.date}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                    <div className="p-4 border-t border-white/5">
                        <Button variant="ghost" className="w-full justify-start gap-2 text-xs text-muted-foreground hover:text-red-500 rounded-xl">
                            <Trash2 className="h-4 w-4" /> Clear all history
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Chat Area */}
            <main className="flex-1 flex flex-col bg-card/40 backdrop-blur-xl rounded-3xl border border-white/5 shadow-sm overflow-hidden relative">
                {/* Chat Header */}
                <div className="h-16 border-b border-white/5 px-6 flex items-center justify-between shrink-0 bg-background/20">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl gradient-bg flex items-center justify-center text-white">
                            <Sparkles className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold">AI Study Tutor</h2>
                            <div className="flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Online</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="rounded-xl"><Share2 className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="rounded-xl"><MoreVertical className="h-4 w-4" /></Button>
                    </div>
                </div>

                {/* Messages */}
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto px-4 py-8 space-y-8 scrollbar-hide"
                >
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={cn(
                                "flex gap-4 max-w-3xl mx-auto",
                                msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                            )}
                        >
                            <Avatar className={cn(
                                "h-9 w-9 shrink-0",
                                msg.role === 'ai' ? "bg-indigo-500" : "bg-emerald-500"
                            )}>
                                {msg.role === 'ai' ? <Bot className="h-5 w-5 text-white" /> : <User className="h-5 w-5 text-white" />}
                            </Avatar>

                            <div className={cn(
                                "flex flex-col gap-2 group",
                                msg.role === 'user' ? "items-end" : "items-start"
                            )}>
                                <div className={cn(
                                    "p-4 rounded-3xl text-sm leading-relaxed shadow-sm",
                                    msg.role === 'user'
                                        ? "bg-indigo-600 text-white rounded-tr-none"
                                        : "bg-background/80 border border-white/5 text-foreground rounded-tl-none whitespace-pre-wrap"
                                )}>
                                    {msg.content}
                                </div>

                                <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-[10px] text-muted-foreground font-medium">{msg.timestamp}</span>
                                    {msg.role === 'ai' && (
                                        <div className="flex items-center gap-2">
                                            <button className="text-muted-foreground hover:text-indigo-500 transition-colors"><Copy className="h-3 w-3" /></button>
                                            <button className="text-muted-foreground font-bold text-[10px] uppercase hover:text-indigo-500 transition-colors">Simplify</button>
                                            <button className="text-muted-foreground font-bold text-[10px] uppercase hover:text-indigo-500 transition-colors">Details</button>
                                            <button className="text-muted-foreground hover:text-indigo-500 transition-colors"><RotateCcw className="h-3 w-3" /></button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {isTyping && (
                        <div className="flex gap-4 max-w-3xl mx-auto">
                            <Avatar className="h-9 w-9 shrink-0 bg-indigo-500">
                                <Bot className="h-5 w-5 text-white" />
                            </Avatar>
                            <div className="bg-background/80 border border-white/5 p-4 rounded-3xl rounded-tl-none">
                                <div className="flex gap-1">
                                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-6 shrink-0 bg-gradient-to-t from-background/80 to-transparent">
                    <div className="max-w-3xl mx-auto space-y-4">
                        {/* Suggested Questions */}
                        {messages.length < 4 && (
                            <div className="flex flex-wrap gap-2 justify-center">
                                {suggestedQuestions.map((q) => (
                                    <button
                                        key={q}
                                        onClick={() => handleSend(q)}
                                        className="px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 transition-all"
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="relative group">
                            <Input
                                placeholder="Ask your study assistant anything..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                className="w-full h-14 pl-6 pr-16 bg-background rounded-2xl border-2 border-white/5 focus-visible:ring-indigo-500 focus-visible:ring-offset-0 focus-visible:border-indigo-500/50 text-sm shadow-xl transition-all"
                            />
                            <Button
                                onClick={() => handleSend()}
                                disabled={!inputValue.trim()}
                                className={cn(
                                    "absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-xl transition-all",
                                    inputValue.trim() ? "gradient-bg shadow-lg shadow-indigo-500/20" : "bg-muted text-muted-foreground"
                                )}
                            >
                                <Send className="h-5 w-5" />
                            </Button>
                        </div>
                        <p className="text-[10px] text-center text-muted-foreground">
                            AI can make mistakes. Verify important information with your textbooks.
                        </p>
                    </div>
                </div>

                {/* Bottom Floating Tools */}
                <div className="absolute top-20 right-6 flex flex-col gap-2">
                    <Button variant="outline" size="sm" className="rounded-full bg-background/50 backdrop-blur-md border-white/10 group h-10 px-4">
                        <PlusCircle className="h-4 w-4 mr-2 text-indigo-500" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Detail Mod</span>
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-full bg-background/50 backdrop-blur-md border-white/10 group h-10 px-4">
                        <MinusCircle className="h-4 w-4 mr-2 text-emerald-500" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Simple Mod</span>
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-full bg-background/50 backdrop-blur-md border-white/10 group h-10 px-4">
                        <HelpCircle className="h-4 w-4 mr-2 text-amber-500" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Exam Mode</span>
                    </Button>
                </div>
            </main>
        </div>
    );
}
