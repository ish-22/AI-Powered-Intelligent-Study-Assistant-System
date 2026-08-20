"use client";

import React from "react";
import { User, Mail, GraduationCap, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TeacherProps {
    id: string;
    full_name: string;
    email: string;
    primary_course?: string;
    about_me?: string;
    profile_picture?: string;
}

export function AssignedTeacherCard({ teacher }: { teacher: TeacherProps | null }) {
    if (!teacher) {
        return (
            <Card className="border-none bg-card/40 backdrop-blur-xl shadow-sm rounded-3xl p-6">
                <CardHeader className="p-0 mb-3">
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-indigo-500" /> Assigned Teacher
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0 text-xs text-muted-foreground">
                    No teacher currently assigned. An administrator will assign a teacher to oversee your course materials and quizzes.
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-none bg-gradient-to-br from-indigo-900/20 via-card/50 to-purple-900/20 backdrop-blur-xl border border-indigo-500/20 shadow-xl rounded-3xl p-6 overflow-hidden relative">
            <div className="flex items-start gap-4">
                {teacher.profile_picture ? (
                    <img
                        src={teacher.profile_picture}
                        alt={teacher.full_name}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-500/30"
                    />
                ) : (
                    <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-lg shrink-0">
                        {teacher.full_name.charAt(0)}
                    </div>
                )}

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                            Assigned Instructor
                        </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mt-1 truncate">{teacher.full_name}</h3>

                    {teacher.primary_course && (
                        <p className="text-xs text-indigo-300 font-medium flex items-center gap-1 mt-0.5">
                            <GraduationCap className="w-3.5 h-3.5" /> {teacher.primary_course}
                        </p>
                    )}

                    {teacher.about_me && (
                        <p className="text-xs text-zinc-400 mt-2 line-clamp-2 italic">
                            "{teacher.about_me}"
                        </p>
                    )}

                    <div className="mt-4 flex items-center gap-3">
                        <a
                            href={`mailto:${teacher.email}`}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/20"
                        >
                            <Mail className="w-3.5 h-3.5" /> Contact Teacher
                        </a>
                        <span className="text-[11px] text-zinc-500">{teacher.email}</span>
                    </div>
                </div>
            </div>
        </Card>
    );
}
