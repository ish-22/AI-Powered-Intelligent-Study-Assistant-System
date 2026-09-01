"use client";

import React, { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
    Send, Plus, MessageSquare, Trash2, Copy, RotateCcw,
    Sparkles, User, Bot, Search, MoreVertical, Loader2,
    AlertCircle, CheckCheck, PenLine, FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

const suggestedQuestions = [
    "Explain the Chain Rule in Calculus",
    "Summarize the French Revolution",
    "How do Neural Networks learn?",
    "Define Economic Elasticity",
];

interface ChatItem { id: string; title: string; updated_at: string; }
interface Message { id: string; role: "user" | "assistant"; content: string; created_at?: string; }

function ChatPageContent() {
    const { data: session } = useSession();
    const token = (session as any)?.accessToken;
    const searchParams = useSearchParams();

    const [chats, setChats] = useState<ChatItem[]>([]);
    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [sending, setSending] = useState(false);
    const [loadingChats, setLoadingChats] = useState(true);
    const [loadingMsgs, setLoadingMsgs] = useState(false);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [docContext, setDocContext] = useState<{ id: string; name: string } | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const docChatStarted = useRef(false);

    const scrollToBottom = () => {
        setTimeout(() => {
            if (scrollRef.current)
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }, 50);
    };

    // Load chat list
    const fetchChats = useCallback(async () => {
        if (!token) return;
        setLoadingChats(true);
        try {
            const res = await fetch(`${API}/chats`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setChats(data.chats ?? []);
        } catch {
            setError("Failed to load chats.");
        } finally {
            setLoadingChats(false);
        }
    }, [token]);

    useEffect(() => { fetchChats(); }, [fetchChats]);

    // Auto-start a document chat when arriving from recommendations page
    useEffect(() => {
        const docId = searchParams.get("document_id");
        const docName = searchParams.get("document_name");
        if (!docId || !token || docChatStarted.current) return;
        docChatStarted.current = true;
        setDocContext({ id: docId, name: decodeURIComponent(docName ?? "Document") });
        startDocumentChat(docId, decodeURIComponent(docName ?? "Document"));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, searchParams]);

    const startDocumentChat = async (docId: string, docName: string) => {
        if (!token) return;
        try {
            const res = await fetch(`${API}/chats`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify({ document_id: docId }),
            });
            const data = await res.json();
            if (!res.ok || !data.chat?.id) {
                throw new Error(data?.message || "Failed to start document chat session.");
            }
            const chat = { title: `Chat about: ${docName}`, ...data.chat };
            setChats(prev => [chat, ...prev]);
            setActiveChatId(chat.id);
            // Send an opening message so the AI introduces the document
            await doSend(chat.id, `Hi! I'd like to discuss the document "${docName}". Can you give me a brief overview of what it covers?`);
        } catch (err: any) {
            setError(err?.message || "Failed to start document chat.");
        }
    };

    // Load messages for active chat
    const openChat = async (id: string) => {
        if (!id) return;
        setActiveChatId(id);
        setMessages([]);
        setLoadingMsgs(true);
        setError("");
        try {
            const res = await fetch(`${API}/chats/${id}/messages`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data?.message || "Failed to load messages.");
            }
            setMessages(data.messages ?? []);
            scrollToBottom();
        } catch (err: any) {
            setError(err?.message || "Failed to load messages.");
        } finally {
            setLoadingMsgs(false);
        }
    };

    // Create new chat then open it
    const newChat = async () => {
        if (!token) return;
        setDocContext(null);
        try {
            const res = await fetch(`${API}/chats`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (!res.ok || !data.chat?.id) {
                throw new Error(data?.message || "Failed to create new chat.");
            }
            const chat = { title: 'New Chat', ...data.chat };
            setChats((prev) => [chat, ...prev]);
            await openChat(chat.id);
        } catch (err: any) {
            setError(err?.message || "Failed to create chat.");
        }
    };

    // Delete chat
    const deleteChat = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await fetch(`${API}/chats/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            setChats((prev) => prev.filter((c) => c.id !== id));
            if (activeChatId === id) {
                setActiveChatId(null);
                setMessages([]);
            }
        } catch {
            setError("Failed to delete chat.");
        }
    };

    // Send message
    const sendMessage = async (content: string = input) => {
        if (!content.trim() || sending) return;
        if (!token) { setError("Please log in again — session expired."); return; }
        if (!activeChatId) {
            // Auto-create a chat first
            try {
                const res = await fetch(`${API}/chats`, {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                    body: JSON.stringify(docContext ? { document_id: docContext.id } : {}),
                });
                const data = await res.json();
                if (!res.ok || !data.chat?.id) {
                    throw new Error(data?.message || "Failed to start chat.");
                }
                const chat = { title: docContext ? `Chat about: ${docContext.name}` : 'New Chat', ...data.chat };
                setChats((prev) => [chat, ...prev]);
                setActiveChatId(chat.id);
                await doSend(chat.id, content);
            } catch (err: any) {
                setError(err?.message || "Failed to start chat.");
            }
            return;
        }
        await doSend(activeChatId, content);
    };

    const doSend = async (chatId: string, content: string) => {
        if (!token) { setError("Please log in again — session expired."); return; }
        const userMsg: Message = {
            id: `tmp-${Date.now()}`,
            role: "user",
            content,
            created_at: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setSending(true);
        setError("");
        scrollToBottom();

        try {
            const res = await fetch(`${API}/chats/${chatId}/message`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: content }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.message || `Request failed (${res.status})`);
            }

            const aiMsg = { ...data.message, id: data.message?.id ?? `ai-${Date.now()}` };
            setMessages((prev) => [...prev, aiMsg]);

            if (data.chat_title) {
                setChats((prev) =>
                    prev.map((c) =>
                        c.id === chatId ? { ...c, title: data.chat_title, updated_at: new Date().toISOString() } : c
                    )
                );
            }
            scrollToBottom();
        } catch (err: any) {
            setError(err?.message || "Failed to send message.");
            setMessages((prev) => prev.filter((m) => m.id !== userMsg.id));
        } finally {
            setSending(false);
        }
    };

    const copyText = (id: string, text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    const formatTime = (iso?: string) => {
        if (!iso) return "";
        return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    const filteredChats = chats.filter((c) =>
        c.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const activeChat = chats.find((c) => c.id === activeChatId);

    return (
        <div className="flex h-[calc(100vh-120px)] gap-6 overflow-hidden animate-fade-in">

            {/* Sidebar */}
            <aside className="w-72 hidden lg:flex flex-col gap-4">
                <Button
                    onClick={newChat}
                    className="w-full h-12 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white border-none shadow-lg shadow-indigo-500/20 font-bold gap-2"
                >
                    <Plus className="h-5 w-5" /> New Chat
                </Button>

                <div className="flex-1 bg-card/40 backdrop-blur-xl rounded-3xl border border-white/5 flex flex-col overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-white/5">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                            <Input
                                placeholder="Search chats..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 h-9 bg-muted/50 border-none text-xs rounded-xl focus-visible:ring-1 focus-visible:ring-primary"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-hide">
                        {loadingChats ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                            </div>
                        ) : filteredChats.length === 0 ? (
                            <p className="text-xs text-muted-foreground text-center py-8 px-4">
                                {searchQuery ? "No chats found." : "No chats yet. Start a new one!"}
                            </p>
                        ) : (
                            filteredChats.map((chat, idx) => (
                                <div
                                    key={chat.id ?? `chat-${idx}`}
                                    onClick={() => openChat(chat.id)}
                                    className={cn(
                                        "w-full flex items-center gap-3 p-3 rounded-2xl transition-all hover:bg-muted group text-left cursor-pointer",
                                        activeChatId === chat.id && "bg-indigo-500/10 border border-indigo-500/20"
                                    )}
                                >
                                    <div className={cn(
                                        "h-8 w-8 rounded-xl flex items-center justify-center shrink-0",
                                        activeChatId === chat.id ? "bg-indigo-500/20" : "bg-muted"
                                    )}>
                                        <MessageSquare className={cn("h-4 w-4", activeChatId === chat.id ? "text-indigo-500" : "text-muted-foreground")} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs font-semibold truncate text-foreground">{chat.title}</p>
                                        <p className="text-[10px] text-muted-foreground mt-0.5">
                                            {new Date(chat.updated_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <button
                                        onClick={(e) => deleteChat(chat.id, e)}
                                        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-500 transition-all shrink-0"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </aside>

            {/* Main Chat */}
            <main className="flex-1 flex flex-col bg-card/40 backdrop-blur-xl rounded-3xl border border-white/5 shadow-sm overflow-hidden relative">

                {/* Header */}
                <div className="h-16 border-b border-white/5 px-6 flex items-center justify-between shrink-0 bg-background/20">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl gradient-bg flex items-center justify-center text-white">
                            <Sparkles className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold truncate max-w-[200px]">
                                {activeChat?.title ?? "AI Study Tutor"}
                            </h2>
                            <div className="flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Online</span>
                            </div>
                        </div>
                    </div>
                    <Button onClick={newChat} variant="ghost" size="icon" className="rounded-xl" title="New Chat">
                        <PenLine className="h-4 w-4" />
                    </Button>
                </div>

                {/* Document context banner */}
                <AnimatePresence>
                    {docContext && (
                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="mx-4 mt-3 flex items-center gap-3 px-4 py-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs"
                        >
                            <FileText className="h-4 w-4 shrink-0" />
                            <span className="font-semibold">Discussing:</span>
                            <span className="truncate flex-1">{docContext.name}</span>
                            <button onClick={() => setDocContext(null)} className="text-indigo-400 hover:text-indigo-300 shrink-0">✕</button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Error banner */}
                <AnimatePresence>
                    {error && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="mx-4 mt-3 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            {error}
                            <button onClick={() => setError("")} className="ml-auto text-red-400 hover:text-red-300">✕</button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Messages */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-8 space-y-6 scrollbar-hide">

                    {/* Empty state */}
                    {!activeChatId && !loadingMsgs && (
                        <div className="flex flex-col items-center justify-center h-full gap-6 text-center px-4">
                            <div className="h-20 w-20 rounded-3xl gradient-bg flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
                                <Sparkles className="h-10 w-10" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">AI Study Assistant</h3>
                                <p className="text-muted-foreground mt-1 text-sm">Ask me anything about your studies.</p>
                            </div>
                            <div className="flex flex-wrap gap-2 justify-center max-w-lg">
                                {suggestedQuestions.map((q) => (
                                    <button key={q} onClick={() => sendMessage(q)}
                                        className="px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 transition-all">
                                        {q}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {loadingMsgs && (
                        <div className="flex justify-center py-12">
                            <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
                        </div>
                    )}

                    {messages.map((msg, idx) => (
                        <motion.div key={msg.id ?? `msg-${idx}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            className={cn("flex gap-4 max-w-3xl mx-auto", msg.role === "user" ? "flex-row-reverse" : "flex-row")}>

                            <Avatar className={cn("h-9 w-9 shrink-0 flex items-center justify-center rounded-xl",
                                msg.role === "assistant" ? "bg-indigo-500" : "bg-emerald-500")}>
                                {msg.role === "assistant"
                                    ? <Bot className="h-5 w-5 text-white" />
                                    : <User className="h-5 w-5 text-white" />}
                            </Avatar>

                            <div className={cn("flex flex-col gap-1.5 group", msg.role === "user" ? "items-end" : "items-start")}>
                                <div className={cn("p-4 rounded-3xl text-sm leading-relaxed shadow-sm max-w-[520px]",
                                    msg.role === "user"
                                        ? "bg-indigo-600 text-white rounded-tr-none"
                                        : "bg-background/80 border border-white/5 text-foreground rounded-tl-none whitespace-pre-wrap")}>
                                    {msg.content}
                                </div>
                                <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-[10px] text-muted-foreground">{formatTime(msg.created_at)}</span>
                                    {msg.role === "assistant" && (
                                        <button onClick={() => copyText(msg.id, msg.content)}
                                            className="text-muted-foreground hover:text-indigo-500 transition-colors">
                                            {copied === msg.id ? <CheckCheck className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {/* Typing indicator */}
                    {sending && (
                        <div className="flex gap-4 max-w-3xl mx-auto">
                            <Avatar className="h-9 w-9 shrink-0 flex items-center justify-center rounded-xl bg-indigo-500">
                                <Bot className="h-5 w-5 text-white" />
                            </Avatar>
                            <div className="bg-background/80 border border-white/5 p-4 rounded-3xl rounded-tl-none">
                                <div className="flex gap-1 items-center">
                                    {(["dot-0", "dot-1", "dot-2"] as const).map((key, i) => (
                                        <motion.div key={key}
                                            animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                                            transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                                            className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input */}
                <div className="p-6 shrink-0 bg-gradient-to-t from-background/80 to-transparent">
                    <div className="max-w-3xl mx-auto">
                        <div className="relative">
                            <Input
                                placeholder="Ask your study assistant anything..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                                disabled={sending}
                                className="w-full h-14 pl-6 pr-16 bg-background rounded-2xl border-2 border-white/5 focus-visible:ring-indigo-500 focus-visible:ring-offset-0 focus-visible:border-indigo-500/50 text-sm shadow-xl transition-all"
                            />
                            <Button
                                onClick={() => sendMessage()}
                                disabled={!input.trim() || sending}
                                className={cn(
                                    "absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-xl transition-all",
                                    input.trim() && !sending ? "gradient-bg shadow-lg shadow-indigo-500/20" : "bg-muted text-muted-foreground"
                                )}
                            >
                                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                            </Button>
                        </div>
                        <p className="text-[10px] text-center text-muted-foreground mt-3">
                            AI can make mistakes. Verify important information with your textbooks.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function ChatPage() {
    return (
        <Suspense fallback={
            <div className="flex h-[calc(100vh-120px)] items-center justify-center text-white">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
        }>
            <ChatPageContent />
        </Suspense>
    );
}
