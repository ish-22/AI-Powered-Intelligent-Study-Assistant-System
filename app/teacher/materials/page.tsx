"use client";

import React, { useState } from "react";
import {
    Files,
    Upload,
    Trash2,
    BookOpen,
    Download,
    Eye,
    TrendingUp,
    Search,
    Loader2,
    CheckCircle,
} from "lucide-react";

interface DocumentMeta {
    id: string;
    name: string;
    originalName: string;
    type: string;
    size: string;
    downloads: number;
    assignedQuiz: boolean;
    uploadedAt: string;
}

const initialDocs: DocumentMeta[] = [
    { id: "1", name: "Ch3_Forces_Notes.pdf", originalName: "Ch3_Forces_Notes.pdf", type: "PDF", size: "4.2 MB", downloads: 18, assignedQuiz: true, uploadedAt: "2 days ago" },
    { id: "2", name: "Linear_Algebra_Basis.docx", originalName: "Linear_Algebra_Basis.docx", type: "DOCX", size: "1.8 MB", downloads: 12, assignedQuiz: false, uploadedAt: "4 days ago" },
    { id: "3", name: "Intro_to_Quantum_Mechanics.pdf", originalName: "Intro_to_Quantum_Mechanics.pdf", type: "PDF", size: "6.8 MB", downloads: 22, assignedQuiz: true, uploadedAt: "1 week ago" },
];

export default function WorkspaceMaterials() {
    const [docs, setDocs] = useState<DocumentMeta[]>(initialDocs);
    const [uploading, setUploading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [dragActive, setDragActive] = useState(false);

    const handleUpload = (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);
        setTimeout(() => {
            const newDoc: DocumentMeta = {
                id: Math.random().toString(),
                name: "New_Class_Handout.pdf",
                originalName: "New_Class_Handout.pdf",
                type: "PDF",
                size: "2.4 MB",
                downloads: 0,
                assignedQuiz: false,
                uploadedAt: "Just now",
            };
            setDocs((prev) => [newDoc, ...prev]);
            setUploading(false);
        }, 1500);
    };

    const handleDelete = (id: string) => {
        setDocs((prev) => prev.filter((d) => d.id !== id));
    };

    const filteredDocs = docs.filter((d) =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                    Class Materials
                </h1>
                <p className="text-zinc-400 text-sm mt-1">
                    Upload course notes, slides, and learning assets to distribute to students and anchor RAG contexts.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Upload box */}
                <div className="p-6 rounded-3xl bg-[#0d0d1e] border border-white/5 shadow-xl h-fit space-y-6">
                    <h3 className="text-sm font-bold text-white">Upload New Lecture</h3>

                    <form onSubmit={handleUpload} className="space-y-4">
                        <div
                            className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${dragActive ? "border-indigo-500 bg-indigo-500/5" : "border-white/10 hover:border-white/20"
                                }`}
                            onDragOver={() => setDragActive(true)}
                            onDragLeave={() => setDragActive(false)}
                        >
                            <Upload className="w-8 h-8 text-zinc-500 mb-3 group-hover:text-white" />
                            <p className="text-xs font-semibold text-white">Drag & drop files here</p>
                            <p className="text-[10px] text-zinc-500 mt-1">Supports PDF, DOCX, or PPTX up to 25MB</p>
                        </div>

                        <button
                            type="submit"
                            disabled={uploading}
                            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 transition-all text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-650/30"
                        >
                            {uploading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Uploading and Chunking...
                                </>
                            ) : (
                                "Browse Files"
                            )}
                        </button>
                    </form>
                </div>

                {/* Materials List */}
                <div className="lg:col-span-2 p-6 rounded-3xl bg-[#0d0d1e] border border-white/5 shadow-xl space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h3 className="text-base font-bold text-white">Share List ({filteredDocs.length})</h3>
                            <p className="text-zinc-500 text-xs mt-0.5">Documents visible to your enrolled class</p>
                        </div>
                        <div className="relative max-w-xs w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <input
                                type="text"
                                placeholder="Search document..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-indigo-500 placeholder:text-zinc-600 transition-all font-medium"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        {filteredDocs.map((d) => (
                            <div key={d.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                                        {d.type}
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-white">{d.name}</p>
                                        <p className="text-[10px] text-zinc-400 flex items-center gap-2 mt-0.5">
                                            <span>{d.size}</span>
                                            <span className="w-1 h-1 rounded-full bg-zinc-600" />
                                            <span>Uploaded {d.uploadedAt}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-xs font-medium self-end sm:self-auto">
                                    <div className="text-zinc-400 flex items-center gap-1.5">
                                        <Download className="w-3.5 h-3.5" />
                                        <span>{d.downloads} downloads</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {d.assignedQuiz ? (
                                            <span className="px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold flex items-center gap-1">
                                                <CheckCircle className="w-3 h-3" /> Quiz Linked
                                            </span>
                                        ) : (
                                            <button className="px-2.5 py-1.5 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 text-white text-[10px] font-semibold flex items-center gap-1 cursor-pointer transition-colors">
                                                <BookOpen className="w-3 h-3 text-zinc-400" /> Link Quiz
                                            </button>
                                        )}

                                        <button
                                            onClick={() => handleDelete(d.id)}
                                            className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                                            title="Remove File"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
