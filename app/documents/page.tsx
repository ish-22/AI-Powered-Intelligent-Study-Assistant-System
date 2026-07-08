"use client";

import React, { useState, useEffect, useRef } from "react";
import {
    Plus, Search, FileText, File as FileIcon, MoreVertical,
    Download, Trash2, Eye, FileJson, LayoutGrid, List,
    Filter, Upload, MessageSquare, Sparkles, Lightbulb,
    CheckCircle2, AlertCircle, Loader2, X, ExternalLink,
    BookOpen, HelpCircle, Clock, Tag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Table, TableBody, TableCell, TableHead,
    TableHeader, TableRow
} from "@/components/ui/table";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

interface Doc {
    id: string;
    name: string;
    subject: string;
    date: string;
    size: string;
    status: string;
    type: string;
    file_path?: string;
}

const STORAGE = process.env.NEXT_PUBLIC_STORAGE_URL || "http://127.0.0.1:8000/storage";

export default function DocumentsPage() {
    const { data: session } = useSession();
    const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [docs, setDocs] = useState<Doc[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState("");
    const [subject, setSubject] = useState("");
    const [showSubjectInput, setShowSubjectInput] = useState(false);
    const [pendingFile, setPendingFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const token = (session as any)?.accessToken;
    const [viewDoc, setViewDoc] = useState<Doc | null>(null);
    const [summaryDoc, setSummaryDoc] = useState<Doc | null>(null);
    const [quizDoc, setQuizDoc] = useState<Doc | null>(null);

    useEffect(() => {
        if (!token) return;
        fetchDocs();
    }, [token]);

    async function fetchDocs() {
        setLoading(true);
        try {
            const res = await fetch(`${API}/documents`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setDocs(data.documents ?? []);
        } catch {
            setError("Failed to load documents.");
        } finally {
            setLoading(false);
        }
    }

    function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setPendingFile(file);
        setShowSubjectInput(true);
        e.target.value = "";
    }

    async function handleUpload() {
        if (!pendingFile || !token) return;
        setShowSubjectInput(false);
        setUploading(true);
        setUploadProgress(0);
        setError("");

        // Simulate progress
        const interval = setInterval(() => {
            setUploadProgress((p) => (p >= 85 ? 85 : p + 10));
        }, 150);

        try {
            const form = new FormData();
            form.append("file", pendingFile);
            form.append("subject", subject || "General");

            const res = await fetch(`${API}/documents`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: form,
            });

            clearInterval(interval);
            setUploadProgress(100);

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || "Upload failed.");
            }

            const data = await res.json();
            setDocs((prev) => [data.document, ...prev]);
        } catch (err: any) {
            setError(err.message || "Upload failed.");
        } finally {
            clearInterval(interval);
            setTimeout(() => {
                setUploading(false);
                setUploadProgress(0);
                setPendingFile(null);
                setSubject("");
            }, 600);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Delete this document?")) return;
        try {
            await fetch(`${API}/documents/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            setDocs((prev) => prev.filter((d) => d.id !== id));
        } catch {
            setError("Failed to delete document.");
        }
    }

    const filtered = docs.filter(
        (d) =>
            d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const iconColor = (type: string) =>
        type === "pdf" ? "bg-red-500 shadow-red-500/20"
            : type === "docx" || type === "doc" ? "bg-blue-500 shadow-blue-500/20"
                : "bg-amber-500 shadow-amber-500/20";

    const FileIcon2 = ({ type, size = "h-7 w-7" }: { type: string; size?: string }) =>
        type === "pdf" ? <FileText className={size} />
            : type === "docx" || type === "doc" ? <FileIcon className={size} />
                : <FileJson className={size} />;

    const fileUrl = (doc: Doc) =>
        doc.file_path ? `${STORAGE}/${doc.file_path}` : null;

    return (
        <div className="space-y-8 pb-12 animate-fade-in">

            {/* View Document Modal */}
            <AnimatePresence>
                {viewDoc && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                        onClick={() => setViewDoc(null)}>
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-card border border-white/10 rounded-3xl p-8 w-full max-w-md mx-4 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold flex items-center gap-2"><Eye className="h-5 w-5 text-indigo-500" /> Document Details</h3>
                                <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => setViewDoc(null)}><X className="h-4 w-4" /></Button>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3 p-4 rounded-2xl bg-muted/40">
                                    <FileText className="h-5 w-5 text-indigo-500 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">File Name</p>
                                        <p className="font-semibold break-all">{viewDoc.name}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-4 rounded-2xl bg-muted/40">
                                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1 flex items-center gap-1"><Tag className="h-3 w-3" /> Subject</p>
                                        <p className="font-semibold">{viewDoc.subject}</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-muted/40">
                                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Type</p>
                                        <p className="font-semibold uppercase">{viewDoc.type}</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-muted/40">
                                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1 flex items-center gap-1"><Clock className="h-3 w-3" /> Date</p>
                                        <p className="font-semibold">{viewDoc.date}</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-muted/40">
                                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Size</p>
                                        <p className="font-semibold">{viewDoc.size}</p>
                                    </div>
                                </div>
                                <div className="p-4 rounded-2xl bg-muted/40 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Status</p>
                                        <Badge variant={viewDoc.status === "Analyzed" ? "success" : "info"} className="rounded-lg">
                                            {viewDoc.status === "Analyzed" ? <CheckCircle2 className="mr-1 h-3 w-3" /> : <AlertCircle className="mr-1 h-3 w-3" />}
                                            {viewDoc.status}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                {fileUrl(viewDoc) ? (
                                    <a href={fileUrl(viewDoc)!} target="_blank" rel="noopener noreferrer" className="flex-1">
                                        <Button className="w-full rounded-xl gradient-bg border-none">
                                            <ExternalLink className="mr-2 h-4 w-4" /> Open File
                                        </Button>
                                    </a>
                                ) : (
                                    <Button className="flex-1 rounded-xl" disabled>
                                        <ExternalLink className="mr-2 h-4 w-4" /> File Unavailable
                                    </Button>
                                )}
                                {fileUrl(viewDoc) && (
                                    <a href={fileUrl(viewDoc)!} download>
                                        <Button variant="outline" className="rounded-xl">
                                            <Download className="h-4 w-4" />
                                        </Button>
                                    </a>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Generate Summary Modal */}
            <AnimatePresence>
                {summaryDoc && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                        onClick={() => setSummaryDoc(null)}>
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-card border border-white/10 rounded-3xl p-8 w-full max-w-md mx-4 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold flex items-center gap-2"><Sparkles className="h-5 w-5 text-indigo-500" /> Generate Summary</h3>
                                <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => setSummaryDoc(null)}><X className="h-4 w-4" /></Button>
                            </div>
                            <div className="p-4 rounded-2xl bg-muted/40 mb-6">
                                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Document</p>
                                <p className="font-semibold truncate">{summaryDoc.name}</p>
                                <p className="text-sm text-muted-foreground">{summaryDoc.subject}</p>
                            </div>
                            <div className="p-6 rounded-2xl border-2 border-dashed border-indigo-500/20 bg-indigo-500/5 text-center mb-6">
                                <BookOpen className="h-10 w-10 text-indigo-400 mx-auto mb-3" />
                                <p className="font-semibold text-indigo-600 dark:text-indigo-400">AI Summary Generation</p>
                                <p className="text-sm text-muted-foreground mt-1">This feature will analyze your document and generate a concise summary using AI.</p>
                                <Badge variant="outline" className="mt-3 rounded-lg text-xs">Coming Soon</Badge>
                            </div>
                            <Button className="w-full rounded-xl gradient-bg border-none" disabled>
                                <Sparkles className="mr-2 h-4 w-4" /> Generate Summary
                            </Button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Generate Quiz Modal */}
            <AnimatePresence>
                {quizDoc && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                        onClick={() => setQuizDoc(null)}>
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-card border border-white/10 rounded-3xl p-8 w-full max-w-md mx-4 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold flex items-center gap-2"><HelpCircle className="h-5 w-5 text-purple-500" /> Generate Quiz</h3>
                                <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => setQuizDoc(null)}><X className="h-4 w-4" /></Button>
                            </div>
                            <div className="p-4 rounded-2xl bg-muted/40 mb-6">
                                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Document</p>
                                <p className="font-semibold truncate">{quizDoc.name}</p>
                                <p className="text-sm text-muted-foreground">{quizDoc.subject}</p>
                            </div>
                            <div className="p-6 rounded-2xl border-2 border-dashed border-purple-500/20 bg-purple-500/5 text-center mb-6">
                                <Lightbulb className="h-10 w-10 text-purple-400 mx-auto mb-3" />
                                <p className="font-semibold text-purple-600 dark:text-purple-400">AI Quiz Generation</p>
                                <p className="text-sm text-muted-foreground mt-1">This feature will create quiz questions from your document to test your knowledge.</p>
                                <Badge variant="outline" className="mt-3 rounded-lg text-xs">Coming Soon</Badge>
                            </div>
                            <Button className="w-full rounded-xl border-none bg-purple-600 hover:bg-purple-700 text-white" disabled>
                                <Lightbulb className="mr-2 h-4 w-4" /> Generate Quiz
                            </Button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc,.txt"
                className="hidden"
                onChange={handleFileSelect}
            />

            {/* Subject input modal */}
            <AnimatePresence>
                {showSubjectInput && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-card border border-white/10 rounded-3xl p-8 w-full max-w-sm mx-4 shadow-2xl"
                        >
                            <h3 className="text-lg font-bold mb-1">Upload Document</h3>
                            <p className="text-sm text-muted-foreground mb-6 truncate">{pendingFile?.name}</p>
                            <div className="space-y-2 mb-6">
                                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Subject (optional)</label>
                                <Input
                                    placeholder="e.g. Physics, Mathematics..."
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    className="rounded-xl"
                                    onKeyDown={(e) => e.key === "Enter" && handleUpload()}
                                    autoFocus
                                />
                            </div>
                            <div className="flex gap-3">
                                <Button onClick={handleUpload} className="flex-1 rounded-xl gradient-bg border-none">
                                    Upload
                                </Button>
                                <Button variant="outline" onClick={() => { setShowSubjectInput(false); setPendingFile(null); }} className="rounded-xl">
                                    Cancel
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
                    <p className="text-muted-foreground mt-1">Manage your study materials and generate AI insights.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-xl border-2 h-11">
                        <Filter className="mr-2 h-4 w-4" /> Filters
                    </Button>
                    <Button
                        className="rounded-xl gradient-bg shadow-lg shadow-indigo-500/20 h-11 px-6 border-none"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                    >
                        <Plus className="mr-2 h-5 w-5" /> Upload File
                    </Button>
                </div>
            </section>

            {error && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {error}
                    <button onClick={() => setError("")} className="ml-auto"><X className="h-4 w-4" /></button>
                </div>
            )}

            {/* Search & Toggle */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card/30 backdrop-blur-md p-4 rounded-3xl border border-white/5 shadow-sm">
                <div className="relative w-full md:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search documents by name or subject..."
                        className="pl-10 h-12 bg-background/50 rounded-2xl border-none focus-visible:ring-1 focus-visible:ring-primary"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 p-1 bg-muted/50 rounded-2xl">
                    <Button variant={viewMode === "grid" ? "secondary" : "ghost"} size="icon" onClick={() => setViewMode("grid")} className="rounded-xl h-10 w-10">
                        <LayoutGrid className="h-4 w-4" />
                    </Button>
                    <Button variant={viewMode === "table" ? "secondary" : "ghost"} size="icon" onClick={() => setViewMode("table")} className="rounded-xl h-10 w-10">
                        <List className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Upload Progress */}
            <AnimatePresence>
                {uploading && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-8 right-8 z-50 w-80 bg-card rounded-2xl shadow-2xl border p-5"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-bold flex items-center gap-2">
                                <Upload className="h-4 w-4 text-indigo-500 animate-bounce" />
                                Uploading...
                            </span>
                            <span className="text-xs font-bold text-indigo-500">{uploadProgress}%</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <motion.div className="h-full gradient-bg" style={{ width: `${uploadProgress}%` }} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Drop Zone */}
            <section
                className="group relative border-2 border-dashed border-indigo-500/20 hover:border-indigo-500/40 rounded-3xl p-12 text-center transition-all bg-indigo-500/5 cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files?.[0];
                    if (file) { setPendingFile(file); setShowSubjectInput(true); }
                }}
            >
                <div className="flex flex-col items-center gap-4">
                    <div className="h-16 w-16 rounded-3xl gradient-bg flex items-center justify-center text-white shadow-xl shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                        <Upload className="h-8 w-8" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">Drag and Drop your study materials</h3>
                        <p className="text-muted-foreground mt-1">Support for PDF, DOCX, and TXT files up to 50MB</p>
                    </div>
                    <Button variant="ghost" className="text-indigo-600 dark:text-indigo-400 font-bold">Or click to browse files</Button>
                </div>
            </section>

            {/* Loading */}
            {loading && (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                </div>
            )}

            {/* Grid View */}
            {!loading && viewMode === "grid" && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filtered.map((doc) => (
                        <motion.div key={doc.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} whileHover={{ y: -5 }} className="group relative">
                            <Card className="border-none bg-card/40 backdrop-blur-xl shadow-sm rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-indigo-500/5 transition-all">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center text-white shadow-lg", iconColor(doc.type))}>
                                            <FileIcon2 type={doc.type} />
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="rounded-xl"><MoreVertical className="h-5 w-5" /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-56 rounded-xl">
                                                <DropdownMenuItem className="cursor-pointer" onClick={() => setViewDoc(doc)}><Eye className="mr-2 h-4 w-4" /> View Document</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="cursor-pointer text-indigo-600" onClick={() => setSummaryDoc(doc)}><Sparkles className="mr-2 h-4 w-4" /> Generate Summary</DropdownMenuItem>
                                                <DropdownMenuItem className="cursor-pointer text-purple-600" onClick={() => setQuizDoc(doc)}><Lightbulb className="mr-2 h-4 w-4" /> Generate Quiz</DropdownMenuItem>
                                                <DropdownMenuItem className="cursor-pointer text-emerald-600"><MessageSquare className="mr-2 h-4 w-4" /> Open AI Chat</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="cursor-pointer text-red-600" onClick={() => handleDelete(doc.id)}>
                                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <div className="mt-6">
                                        <h4 className="font-bold text-lg line-clamp-1">{doc.name}</h4>
                                        <p className="text-sm text-muted-foreground mt-1">{doc.subject}</p>
                                    </div>
                                    <div className="mt-6 flex items-center justify-between">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Date</span>
                                            <span className="text-xs font-semibold">{doc.date}</span>
                                        </div>
                                        <div className="flex flex-col gap-1 text-right">
                                            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Size</span>
                                            <span className="text-xs font-semibold">{doc.size}</span>
                                        </div>
                                    </div>
                                    <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                                        <Badge variant={doc.status === "Analyzed" ? "success" : doc.status === "Processing" ? "info" : "destructive"} className="rounded-lg px-3 py-1">
                                            {doc.status === "Analyzed" ? <CheckCircle2 className="mr-1 h-3 w-3" /> : <AlertCircle className="mr-1 h-3 w-3" />}
                                            {doc.status}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Table View */}
            {!loading && viewMode === "table" && (
                <Card className="border-none bg-card/40 backdrop-blur-xl shadow-sm rounded-3xl overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent border-white/5">
                                <TableHead className="w-[300px] font-bold">File Name</TableHead>
                                <TableHead className="font-bold">Subject</TableHead>
                                <TableHead className="font-bold">Upload Date</TableHead>
                                <TableHead className="font-bold">Size</TableHead>
                                <TableHead className="font-bold">Status</TableHead>
                                <TableHead className="text-right font-bold">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map((doc) => (
                                <TableRow key={doc.id} className="group hover:bg-white/5 transition-colors border-white/5">
                                    <TableCell className="py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center text-white", iconColor(doc.type))}>
                                                <FileIcon2 type={doc.type} size="h-5 w-5" />
                                            </div>
                                            <span className="font-semibold">{doc.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell><Badge variant="outline" className="rounded-lg">{doc.subject}</Badge></TableCell>
                                    <TableCell className="text-muted-foreground">{doc.date}</TableCell>
                                    <TableCell className="text-muted-foreground">{doc.size}</TableCell>
                                    <TableCell>
                                        <Badge variant={doc.status === "Analyzed" ? "success" : doc.status === "Processing" ? "info" : "destructive"} className="rounded-lg">
                                            {doc.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="rounded-xl"><MoreVertical className="h-4 w-4" /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48 rounded-xl">
                                                <DropdownMenuItem className="cursor-pointer" onClick={() => setViewDoc(doc)}><Eye className="mr-2 h-4 w-4" /> View</DropdownMenuItem>
                                                <DropdownMenuItem className="cursor-pointer text-indigo-600" onClick={() => setSummaryDoc(doc)}><Sparkles className="mr-2 h-4 w-4" /> Summary</DropdownMenuItem>
                                                <DropdownMenuItem className="cursor-pointer text-purple-600" onClick={() => setQuizDoc(doc)}><Lightbulb className="mr-2 h-4 w-4" /> Quiz</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="cursor-pointer text-red-600" onClick={() => handleDelete(doc.id)}>
                                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            )}

            {/* Empty State */}
            {!loading && filtered.length === 0 && (
                <div className="py-20 text-center">
                    <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4 text-muted-foreground">
                        <Search className="h-10 w-10" />
                    </div>
                    <h3 className="text-xl font-bold">{searchQuery ? "No documents found" : "No documents yet"}</h3>
                    <p className="text-muted-foreground mt-1">
                        {searchQuery ? "Try adjusting your search." : "Upload your first study material above."}
                    </p>
                    {searchQuery && <Button variant="link" className="mt-4 text-primary" onClick={() => setSearchQuery("")}>Clear search</Button>}
                </div>
            )}
        </div>
    );
}
