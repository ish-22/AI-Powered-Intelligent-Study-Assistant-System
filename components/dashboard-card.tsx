"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface DashboardCardProps {
    title: string;
    value: string | number;
    description?: string;
    icon?: LucideIcon;
    trend?: {
        value: string;
        isUp: boolean;
    };
    className?: string;
    gradient?: boolean;
}

export function DashboardCard({
    title,
    value,
    description,
    icon: Icon,
    trend,
    className,
    gradient = false,
}: DashboardCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            className={cn(
                "relative rounded-3xl p-6 overflow-hidden border transition-all duration-300",
                gradient
                    ? "bg-gradient-to-br from-indigo-600/10 to-purple-600/10 border-indigo-500/10"
                    : "bg-card/40 backdrop-blur-md border-white/10 dark:border-white/5 shadow-sm",
                className
            )}
        >
            {/* Decorative Gradient Blob */}
            <div className="absolute -right-6 -top-6 h-32 w-32 bg-indigo-500 opacity-[0.03] blur-3xl rounded-full" />

            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
                    <h3 className="text-2xl font-bold tracking-tight text-foreground">{value}</h3>

                    {description && (
                        <p className="mt-2 text-xs text-muted-foreground line-clamp-1">{description}</p>
                    )}

                    {trend && (
                        <div className="mt-4 flex items-center gap-1.5">
                            <span className={cn(
                                "flex items-center text-xs font-medium px-2 py-0.5 rounded-full",
                                trend.isUp ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                            )}>
                                {trend.isUp ? "↑" : "↓"} {trend.value}
                            </span>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">vs last month</span>
                        </div>
                    )}
                </div>

                {Icon && (
                    <div className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm",
                        gradient ? "gradient-bg text-white" : "bg-primary/10 text-primary"
                    )}>
                        <Icon className="h-6 w-6" />
                    </div>
                )}
            </div>
        </motion.div>
    );
}
