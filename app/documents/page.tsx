"use client";

import React, { useState } from "react";
import {
    Plus,
    Search,
    FileText,
    File as FileIcon,
    MoreVertical,
    Download,
    Trash2,
    Eye,
    FileJson,
    LayoutGrid,
    List,
    Filter,
    Upload,
    X,
    MessageSquare,
    Sparkles,
    Lightbulb,
    CheckCircle2,
    AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Mock Documents
const initialDocuments = [
    { id: 1, name: "Advanced Thermodynamics.pdf", subject: "Physics", date: "2024-03-15", size: "2.4 MB", status: "Analyzed", type: "pdf" },
    { id: 2, name: "Organic Chemistry Notes.docx", subject: "Chemistry", date: "2024-03-14", size: "1.2 MB", status: "Processing", type: "docx" },
    { id: 3, name: "Modern History Summary.txt", subject: "History", date: "2024-03-12", size: "450 KB", status: "Analyzed", type: "txt" },
    { id: 4, name: "Calculus III Problems.pdf", subject: "Mathematics", date: "2024-03-10", size: "3.8 MB", status: "Error", type: "pdf" },
    { id: 5, name: "Microeconomics HW.docx", subject: "Economics", date: "2024-03-08", size: "850 KB", status: "Analyzed", type: "docx" },
    { id: 6, name: "Cell Biology Lab.pdf", subject: "Biology", date: "2024-03-05", size: "1.5 MB", status: "Analyzed", type: "pdf" },
];

export default function DocumentsPage() {
    const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const filteredDocs = initialDocuments.filter(doc =>
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleUpload = () => {
        setIsUploading(true);
        let progress = 0;
        const interval = setInterval(() => {
            progress += 5;
            setUploadProgress(progress);
            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    setIsUploading(false);
                    setUploadProgress(0);
                }, 500);
            }
        }, 100);
    };

    return (
        <div className="space-y-8 pb-12 animate-fade-in">
            {/* Header Section */}
            <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your study materials and generate AI insights.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-xl border-2 h-11">
                        <Filter className="mr-2 h-4 w-4" />
                        Filters
                    </Button>
                    <Button className="rounded-xl gradient-bg shadow-lg shadow-indigo-500/20 h-11 px-6 border-none" onClick={handleUpload}>
                        <Plus className="mr-2 h-5 w-5" />
                        Upload File
                    </Button>
                </div>
            </section>

            {/* Search & Layout Toggle */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card/30 backdrop-blur-md p-4 rounded-3xl border border-white/5 shadow-sm">
                <div className="relative w-full md:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search documents by name or subject..."
                        className="pl-10 h-11 bg-background/50 rounded-2xl border-none focus-visible:ring-1 focus-visible:ring-primary h-12"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 p-1 bg-muted/50 rounded-2xl">
                    <Button
                        variant={viewMode === "grid" ? "secondary" : "ghost"}
                        size="icon"
                        onClick={() => setViewMode("grid")}
                        className="rounded-xl h-10 w-10"
                    >
                        <LayoutGrid className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={viewMode === "table" ? "secondary" : "ghost"}
                        size="icon"
                        onClick={() => setViewMode("table")}
                        className="rounded-xl h-10 w-10"
                    >
                        <List className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Upload Progress Overlay */}
            <AnimatePresence>
                {isUploading && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-8 right-8 z-50 w-80 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border p-5"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-bold flex items-center gap-2">
                                <Upload className="h-4 w-4 text-indigo-500 animate-bounce" />
                                Uploading Document...
                            </span>
                            <span className="text-xs font-bold text-indigo-500">{uploadProgress}%</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <motion.div
                                className="h-full gradient-bg"
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Drag & Drop Zone Placeholder */}
            <section
                className="group relative border-2 border-dashed border-indigo-500/20 hover:border-indigo-500/40 rounded-3xl p-12 text-center transition-all bg-indigo-500/5 cursor-pointer"
                onClick={handleUpload}
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

            {/* Document Grid/Table View */}
            {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredDocs.map((doc) => (
                        <motion.div
                            key={doc.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ y: -5 }}
                            className="group relative"
                        >
                            <Card className="border-none bg-card/40 backdrop-blur-xl shadow-sm rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-indigo-500/5 transition-all">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className={cn(
                                            "h-14 w-14 rounded-2xl flex items-center justify-center text-white shadow-lg",
                                            doc.type === 'pdf' ? "bg-red-500 shadow-red-500/20" :
                                                doc.type === 'docx' ? "bg-blue-500 shadow-blue-500/20" :
                                                    "bg-amber-500 shadow-amber-500/20"
                                        )}>
                                            {doc.type === 'pdf' ? <FileText className="h-7 w-7" /> :
                                                doc.type === 'docx' ? <FileIcon className="h-7 w-7" /> :
                                                    <FileJson className="h-7 w-7" />}
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="rounded-xl">
                                                    <MoreVertical className="h-5 w-5" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-56 rounded-xl">
                                                <DropdownMenuItem className="cursor-pointer">
                                                    <Eye className="mr-2 h-4 w-4" /> View Document
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="cursor-pointer">
                                                    <Download className="mr-2 h-4 w-4" /> Download
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="cursor-pointer text-indigo-600">
                                                    <Sparkles className="mr-2 h-4 w-4" /> Generate Summary
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="cursor-pointer text-purple-600">
                                                    <Lightbulb className="mr-2 h-4 w-4" /> Generate Quiz
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="cursor-pointer text-emerald-600">
                                                    <MessageSquare className="mr-2 h-4 w-4" /> Open AI Chat
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="cursor-pointer text-red-600">
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
                                        <Badge variant={
                                            doc.status === 'Analyzed' ? 'success' :
                                                doc.status === 'Processing' ? 'info' : 'destructive'
                                        } className="rounded-lg px-3 py-1">
                                            {doc.status === 'Analyzed' ? <CheckCircle2 className="mr-1 h-3 w-3" /> :
                                                doc.status === 'Processing' ? <Sparkles className="mr-1 h-3 w-3 animate-spin-slow" /> :
                                                    <AlertCircle className="mr-1 h-3 w-3" />}
                                            {doc.status}
                                        </Badge>
                                        <div className="flex -space-x-2">
                                            <div className="h-7 w-7 rounded-full border-2 border-background bg-indigo-500 flex items-center justify-center text-[10px] text-white font-bold">AI</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            ) : (
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
                            {filteredDocs.map((doc) => (
                                <TableRow key={doc.id} className="group hover:bg-white/5 transition-colors border-white/5">
                                    <TableCell className="py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "h-10 w-10 rounded-xl flex items-center justify-center text-white",
                                                doc.type === 'pdf' ? "bg-red-500" :
                                                    doc.type === 'docx' ? "bg-blue-500" :
                                                        "bg-amber-500"
                                            )}>
                                                {doc.type === 'pdf' ? <FileText className="h-5 w-5" /> :
                                                    doc.type === 'docx' ? <FileIcon className="h-5 w-5" /> :
                                                        <FileJson className="h-5 w-5" />}
                                            </div>
                                            <span className="font-semibold">{doc.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="rounded-lg">{doc.subject}</Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{doc.date}</TableCell>
                                    <TableCell className="text-muted-foreground">{doc.size}</TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            doc.status === 'Analyzed' ? 'success' :
                                                doc.status === 'Processing' ? 'info' : 'destructive'
                                        } className="rounded-lg">
                                            {doc.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="rounded-xl">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-56 rounded-xl">
                                                <DropdownMenuItem className="cursor-pointer"><Eye className="mr-2 h-4 w-4" /> View</DropdownMenuItem>
                                                <DropdownMenuItem className="cursor-pointer"><Download className="mr-2 h-4 w-4" /> Download</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="cursor-pointer text-indigo-600"><Sparkles className="mr-2 h-4 w-4" /> Summary</DropdownMenuItem>
                                                <DropdownMenuItem className="cursor-pointer text-purple-600"><Lightbulb className="mr-2 h-4 w-4" /> Quiz</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="cursor-pointer text-red-600"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
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
            {filteredDocs.length === 0 && (
                <div className="py-20 text-center">
                    <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4 text-muted-foreground">
                        <Search className="h-10 w-10" />
                    </div>
                    <h3 className="text-xl font-bold">No documents found</h3>
                    <p className="text-muted-foreground mt-1">Try adjusting your search or filters to find what you're looking for.</p>
                    <Button variant="link" className="mt-4 text-primary" onClick={() => setSearchQuery("")}>Clear search</Button>
                </div>
            )}
        </div>
    );
}
