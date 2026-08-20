"use client";

import React, { useState, useEffect, useRef } from "react";
import {
    Upload,
    Trash2,
    BookOpen,
    Download,
    Search,
    Loader2,
    CheckCircle,
    FileText,
} from "lucide-react";
import { useCurrentUser } from "@/lib/use-current-user";

interface DocumentMeta {
    id: string;
    name: string;
    type: string;
    size: string;
    subject: string;
    hasQuiz: boolean;
    date: string;
    file_path?: string;
}

export default function WorkspaceMaterials() {
    const { session } = useCurrentUser();
    const [docs, setDocs] = useState<DocumentMeta[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [dragActive, setDragActive] = useState(false);
    const [subject, setSubject] = useState("General");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

    const fetchMaterials = async () => {
        if (!session?.accessToken) return;
        try {
            const res = await fetch(`${API_URL}/documents`, {
                headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                    Accept: "application/json",
                },
            });
            if (res.ok) {
                const data = await res.json();
                const formatted: DocumentMeta[] = (data.documents || []).map((d: any) => ({
                    id: d.id,
                    name: d.name,
                    type: (d.type || "file").toUpperCase(),
                    size: d.size || "1.2 MB",
                    subject: d.subject || "General",
                    hasQuiz: Array.isArray(d.quiz_data) && d.quiz_data.length > 0,
                    date: d.date || "Recently",
                    file_path: d.file_path,
                }));
                setDocs(formatted);
            }
        } catch (e) {
            console.error("Failed to fetch teacher materials:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMaterials();
    }, [session?.accessToken]);

    const handleFileUpload = async (file: File) => {
        if (!session?.accessToken || !file) return;
        setUploading(true);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("subject", subject);

        try {
            const res = await fetch(`${API_URL}/documents`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                    Accept: "application/json",
                },
                body: formData,
            });

            if (res.ok) {
                await fetchMaterials();
            } else {
                const err = await res.json();
                alert(err.message || "Failed to upload document");
            }
        } catch (e) {
            console.error("Upload error:", e);
            alert("Error uploading file. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this class document?") || !session?.accessToken) return;
        try {
            const res = await fetch(`${API_URL}/documents/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                    Accept: "application/json",
                },
            });
            if (res.ok) {
                setDocs((prev) => prev.filter((d) => d.id !== id));
            }
        } catch (e) {
            console.error("Delete error:", e);
        }
    };

    const filteredDocs = docs.filter(
        (d) =>
            d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                    Class Materials
                </h1>
                <p className="text-zinc-400 text-sm mt-1">
                    Upload course notes, slides, and learning assets to distribute to assigned students.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Upload Form Box */}
                <div className="p-6 rounded-3xl bg-[#0d0d1e] border border-white/5 shadow-xl h-fit space-y-6">
                    <h3 className="text-sm font-bold text-white">Upload New Lecture Document</h3>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-zinc-400">Subject Category</label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="e.g. Computer Science, Physics"
                            className="w-full px-3 py-2 text-xs rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-indigo-500 transition-all font-medium"
                        />
                    </div>

                    <div
                        className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${dragActive ? "border-indigo-500 bg-indigo-500/5" : "border-white/10 hover:border-white/20"
                            }`}
                        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                        onDragLeave={() => setDragActive(false)}
                        onDrop={(e) => {
                            e.preventDefault();
                            setDragActive(false);
                            if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0]);
                        }}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept=".pdf,.docx,.doc,.txt"
                            onChange={(e) => {
                                if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
                            }}
                        />
                        <Upload className="w-8 h-8 text-zinc-500 mb-3 group-hover:text-white" />
                        <p className="text-xs font-semibold text-white">Click or drag file to upload</p>
                        <p className="text-[10px] text-zinc-500 mt-1">Supports PDF, DOCX, TXT up to 50MB</p>
                    </div>

                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 transition-all text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/30"
                    >
                        {uploading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Uploading Document...
                            </>
                        ) : (
                            "Select File to Upload"
                        )}
                    </button>
                </div>

                {/* Materials List */}
                <div className="lg:col-span-2 p-6 rounded-3xl bg-[#0d0d1e] border border-white/5 shadow-xl space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h3 className="text-base font-bold text-white">Class Materials ({filteredDocs.length})</h3>
                            <p className="text-zinc-500 text-xs mt-0.5">Documents visible to assigned students</p>
                        </div>
                        <div className="relative max-w-xs w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <input
                                type="text"
                                placeholder="Search material..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-indigo-500 placeholder:text-zinc-600 transition-all font-medium"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        {loading ? (
                            <div className="py-12 flex flex-col items-center justify-center gap-3 text-zinc-500">
                                <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
                                <span className="text-xs">Loading class materials...</span>
                            </div>
                        ) : filteredDocs.length === 0 ? (
                            <div className="py-12 flex flex-col items-center justify-center gap-2 text-center text-zinc-500">
                                <FileText className="w-10 h-10 text-zinc-600" />
                                <p className="text-sm font-semibold text-zinc-300">No class materials uploaded yet</p>
                                <p className="text-xs">Upload files using the panel on the left.</p>
                            </div>
                        ) : (
                            filteredDocs.map((d) => (
                                <div
                                    key={d.id}
                                    className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                                            {d.type}
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-white">{d.name}</p>
                                            <p className="text-[10px] text-zinc-400 flex items-center gap-2 mt-0.5">
                                                <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300 font-medium">{d.subject}</span>
                                                <span className="w-1 h-1 rounded-full bg-zinc-600" />
                                                <span>{d.size}</span>
                                                <span className="w-1 h-1 rounded-full bg-zinc-600" />
                                                <span>{d.date}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs font-medium self-end sm:self-auto">
                                        {d.file_path && (
                                            <a
                                                href={`http://127.0.0.1:8000/storage/${d.file_path}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                download
                                                className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all cursor-pointer flex items-center gap-1 text-[10px] font-semibold"
                                                title="Download File"
                                            >
                                                <Download className="w-3.5 h-3.5" /> Download
                                            </a>
                                        )}

                                        {d.hasQuiz ? (
                                            <span className="px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold flex items-center gap-1">
                                                <CheckCircle className="w-3 h-3" /> Quiz Linked
                                            </span>
                                        ) : (
                                            <a
                                                href={`/teacher/quizzes?doc=${d.id}`}
                                                className="px-2.5 py-1.5 rounded-lg border border-purple-500/20 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-[10px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                                            >
                                                <BookOpen className="w-3 h-3 text-purple-400" /> Link Quiz
                                            </a>
                                        )}

                                        <button
                                            onClick={() => handleDelete(d.id)}
                                            className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                                            title="Delete Material"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
