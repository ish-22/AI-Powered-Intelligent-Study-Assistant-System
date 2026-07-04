"use client";

import React, { useState } from "react";
import {
    Bell,
    Shield,
    Palette,
    Globe,
    Eye,
    Save,
    ChevronRight,
    LogOut,
    Mail,
    Smartphone,
    Moon,
    Sun,
    Lock,
    Key,
    Database,
    Cloud
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const settingSections = [
    { id: "notifications", label: "Notifications", icon: Bell, color: "text-blue-500" },
    { id: "security", label: "Security", icon: Shield, color: "text-red-500" },
    { id: "appearance", label: "Appearance", icon: Palette, color: "text-purple-500" },
    { id: "language", label: "Language & Region", icon: Globe, color: "text-emerald-500" },
    { id: "privacy", label: "Privacy", icon: Eye, color: "text-indigo-500" },
];

export default function SettingsPage() {
    const [activeSection, setActiveSection] = useState("notifications");

    return (
        <div className="max-w-6xl mx-auto pb-12 animate-fade-in flex flex-col md:flex-row gap-10">

            {/* Settings Navigation Sidebar */}
            <aside className="w-full md:w-72 space-y-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight">Settings</h1>
                    <p className="text-sm text-muted-foreground mt-1">Manage your account preferences</p>
                </div>

                <nav className="space-y-1">
                    {settingSections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={cn(
                                "w-full flex items-center gap-3 p-3 rounded-2xl transition-all font-semibold text-sm",
                                activeSection === section.id
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-muted"
                            )}
                        >
                            <section.icon className={cn("h-4 w-4", activeSection === section.id ? "text-primary" : section.color)} />
                            {section.label}
                            {activeSection === section.id && <ChevronRight className="ml-auto h-4 w-4" />}
                        </button>
                    ))}
                </nav>

                <Separator className="bg-white/5 my-6" />

                <div className="space-y-2">
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 rounded-2xl text-red-500 hover:bg-red-500/10 hover:text-red-600 font-bold text-sm h-11"
                        onClick={() => window.location.href = '/'}
                    >
                        <LogOut className="h-4 w-4" /> Sign Out
                    </Button>
                </div>
            </aside>

            {/* Settings Content Area */}
            <main className="flex-1">
                <motion.div
                    key={activeSection}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                >
                    {/* Header for Active Section */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
                        <div>
                            <h2 className="text-2xl font-bold capitalize">{activeSection}</h2>
                            <p className="text-sm text-muted-foreground">Adjust how your {activeSection} works in Study.AI</p>
                        </div>
                        <Button className="rounded-2xl h-10 px-6 gradient-bg border-none font-bold shadow-lg shadow-indigo-500/10">
                            <Save className="mr-2 h-4 w-4" /> Save Changes
                        </Button>
                    </div>

                    {/* Notification Settings */}
                    {activeSection === "notifications" && (
                        <div className="space-y-6">
                            <Card className="border-none bg-card/40 backdrop-blur-xl shadow-sm rounded-3xl p-8">
                                <div className="space-y-8">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <h4 className="text-sm font-bold flex items-center gap-2 italic">Email Notifications <Mail className="h-3.5 w-3.5" /></h4>
                                            <p className="text-xs text-muted-foreground">Get summaries and reports delivered to your inbox.</p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>
                                    <Separator className="bg-white/5" />
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <h4 className="text-sm font-bold flex items-center gap-2 italic">Push Notifications <Smartphone className="h-3.5 w-3.5" /></h4>
                                            <p className="text-xs text-muted-foreground">Stay updated on your learning streak and AI analysis.</p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>
                                </div>
                            </Card>

                            <Card className="border-none bg-indigo-600/5 backdrop-blur-xl border border-indigo-500/10 rounded-3xl p-8">
                                <CardTitle className="text-lg font-bold mb-4">Study Reminders</CardTitle>
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Daily Goal Reminders</span>
                                        <Switch />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Weekly Progress Reports</span>
                                        <Switch defaultChecked />
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}

                    {/* Security Settings */}
                    {activeSection === "security" && (
                        <div className="space-y-6">
                            <Card className="border-none bg-card/40 backdrop-blur-xl shadow-sm rounded-3xl p-8">
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center">
                                                <Key className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold">Two-Factor Authentication</h4>
                                                <p className="text-xs text-muted-foreground">Add an extra layer of security to your account.</p>
                                            </div>
                                        </div>
                                        <Button variant="outline" className="rounded-xl h-9 text-xs font-bold px-4">Enable</Button>
                                    </div>
                                    <Separator className="bg-white/5" />
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                                                <Lock className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold">Password Management</h4>
                                                <p className="text-xs text-muted-foreground">Last changed 3 months ago.</p>
                                            </div>
                                        </div>
                                        <Button variant="outline" className="rounded-xl h-9 text-xs font-bold px-4">Update</Button>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}

                    {/* Appearance Settings */}
                    {activeSection === "appearance" && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card className="border-none bg-card/40 backdrop-blur-xl shadow-sm rounded-3xl p-8 cursor-pointer hover:border-primary/20 transition-all border-2 border-transparent">
                                    <Sun className="h-8 w-8 text-amber-500 mb-4" />
                                    <h4 className="font-bold">Light Theme</h4>
                                    <p className="text-xs text-muted-foreground mt-1">Clean and high-contrast</p>
                                </Card>
                                <Card className="border-none bg-indigo-600/10 backdrop-blur-xl border-2 border-indigo-500/50 shadow-sm rounded-3xl p-8 cursor-pointer">
                                    <Moon className="h-8 w-8 text-indigo-400 mb-4" />
                                    <h4 className="font-bold">Dark Theme</h4>
                                    <p className="text-xs text-muted-foreground mt-1">Easier on the eyes at night</p>
                                </Card>
                            </div>
                        </div>
                    )}

                    {/* Language Settings */}
                    {activeSection === "language" && (
                        <div className="space-y-6">
                            <Card className="border-none bg-card/40 backdrop-blur-xl shadow-sm rounded-3xl p-8">
                                <div className="space-y-4">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Preferred Language</Label>
                                    <Select defaultValue="en">
                                        <SelectTrigger className="h-12 rounded-2xl bg-background/50 border-white/5">
                                            <SelectValue placeholder="Select Language" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            <SelectItem value="en">English (US)</SelectItem>
                                            <SelectItem value="es">Español</SelectItem>
                                            <SelectItem value="fr">Français</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </Card>
                        </div>
                    )}

                    {/* Privacy Section Placeholder */}
                    {activeSection === "privacy" && (
                        <div className="space-y-6">
                            <Card className="border-none bg-card/40 backdrop-blur-xl shadow-sm rounded-3xl p-8">
                                <div className="flex items-center gap-4 mb-8">
                                    <Database className="h-10 w-10 text-indigo-500 p-2 bg-indigo-500/10 rounded-xl" />
                                    <div>
                                        <h4 className="text-sm font-bold">Data Management</h4>
                                        <p className="text-xs text-muted-foreground text-pretty">Control how your learning data is used to train AI models.</p>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Contribute to Collective Intelligence</span>
                                        <Switch defaultChecked />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Personalized AI Suggestions</span>
                                        <Switch defaultChecked />
                                    </div>
                                </div>
                            </Card>

                            <Card className="border-none bg-red-600/5 backdrop-blur-xl border border-red-500/20 shadow-sm rounded-3xl p-8">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Cloud className="h-10 w-10 text-red-500 p-2 bg-red-500/10 rounded-xl" />
                                        <div>
                                            <h4 className="text-sm font-bold text-red-500">Cloud Data Removal</h4>
                                            <p className="text-[10px] text-muted-foreground">Permanently delete all your study history and analysis.</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" className="text-red-500 border border-red-500/20 rounded-xl h-10 px-6 font-bold text-xs hover:bg-red-500/10">Delete Data</Button>
                                </div>
                            </Card>
                        </div>
                    )}
                </motion.div>
            </main>
        </div>
    );
}
