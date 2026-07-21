"use client";

import React, { useState, useEffect } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { signOut } from "next-auth/react";
import { useCurrentUser } from "@/lib/use-current-user";
import { api } from "@/lib/api";
import { useTheme } from "next-themes";
import ChangePasswordModal from "@/components/ChangePasswordModal";

const settingSections = [
    { id: "notifications", label: "Notifications", icon: Bell, color: "text-blue-500" },
    { id: "security", label: "Security & Account", icon: Shield, color: "text-red-500" },
    { id: "appearance", label: "Appearance", icon: Palette, color: "text-purple-500" },
    { id: "language", label: "Language & Region", icon: Globe, color: "text-emerald-500" },
    { id: "privacy", label: "Privacy", icon: Eye, color: "text-indigo-500" },
];

export default function SettingsPage() {
    const [activeSection, setActiveSection] = useState("notifications");
    const { session, profile } = useCurrentUser();
    const { theme, setTheme } = useTheme();

    const [isSaving, setIsSaving] = useState(false);
    const [isPassModalOpen, setIsPassModalOpen] = useState(false);

    const [language, setLanguage] = useState("en");
    const [email, setEmail] = useState("");
    const [preferences, setPreferences] = useState({
        email_notifications: true,
        push_notifications: true,
        daily_reminders: false,
        weekly_reports: true,
        collective_intelligence: true,
        personalized_ai: true
    });

    useEffect(() => {
        if (profile) {
            setLanguage(profile.language || "en");
            setEmail(profile.email || "");
            if (profile.preferences) {
                setPreferences((prev) => ({
                    ...prev,
                    ...profile.preferences
                }));
            }
        }
    }, [profile]);

    const handlePrefChange = (key: string, value: boolean) => {
        setPreferences(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        if (!session?.accessToken) return;
        setIsSaving(true);
        try {
            const payload: any = { language, preferences };
            if (email && email !== profile?.email) {
                payload.email = email;
            }
            await api.profile.update(session.accessToken, payload);

            // Set Google Translate cookie
            if (language === 'en') {
                document.cookie = "googtrans=/en/en; path=/";
            } else {
                document.cookie = `googtrans=/en/${language}; path=/`;
            }

            alert("Settings saved successfully!");
            window.location.reload();
        } catch (error) {
            alert("Failed to save settings. Email might be in use.");
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleSignOut = async () => {
        if (session?.accessToken) {
            await api.auth.logout(session.accessToken).catch(() => { });
        }
        await signOut({ callbackUrl: "/login" });
    };

    return (
        <div className="max-w-6xl mx-auto pb-12 animate-fade-in flex flex-col md:flex-row gap-10">
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

                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 rounded-2xl text-red-500 hover:bg-red-500/10 hover:text-red-600 font-bold text-sm h-11"
                    onClick={handleSignOut}
                >
                    <LogOut className="h-4 w-4" /> Sign Out
                </Button>
            </aside>

            <main className="flex-1">
                <motion.div
                    key={activeSection}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
                        <div>
                            <h2 className="text-2xl font-bold capitalize">{activeSection}</h2>
                            <p className="text-sm text-muted-foreground">Adjust how your {activeSection} works in Study.AI</p>
                        </div>
                        <Button
                            className="rounded-2xl h-10 px-6 gradient-bg border-none font-bold shadow-lg shadow-indigo-500/10 text-white"
                            onClick={handleSave}
                            disabled={isSaving}
                        >
                            <Save className="mr-2 h-4 w-4" /> {isSaving ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>

                    {activeSection === "notifications" && (
                        <div className="space-y-6">
                            <Card className="border-none bg-card/40 backdrop-blur-xl shadow-sm rounded-3xl p-8">
                                <div className="space-y-8">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <h4 className="text-sm font-bold flex items-center gap-2">Email Notifications <Mail className="h-3.5 w-3.5" /></h4>
                                            <p className="text-xs text-muted-foreground">Get summaries and reports delivered to your inbox.</p>
                                        </div>
                                        <Switch checked={preferences.email_notifications} onCheckedChange={(v) => handlePrefChange('email_notifications', v)} />
                                    </div>
                                    <Separator className="bg-white/5" />
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <h4 className="text-sm font-bold flex items-center gap-2">Push Notifications <Smartphone className="h-3.5 w-3.5" /></h4>
                                            <p className="text-xs text-muted-foreground">Stay updated on your learning streak and AI analysis.</p>
                                        </div>
                                        <Switch checked={preferences.push_notifications} onCheckedChange={(v) => handlePrefChange('push_notifications', v)} />
                                    </div>
                                </div>
                            </Card>
                            <Card className="border-none bg-indigo-600/5 backdrop-blur-xl border border-indigo-500/10 rounded-3xl p-8">
                                <CardTitle className="text-lg font-bold mb-4">Study Reminders</CardTitle>
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Daily Goal Reminders</span>
                                        <Switch checked={preferences.daily_reminders} onCheckedChange={(v) => handlePrefChange('daily_reminders', v)} />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Weekly Progress Reports</span>
                                        <Switch checked={preferences.weekly_reports} onCheckedChange={(v) => handlePrefChange('weekly_reports', v)} />
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}

                    {activeSection === "security" && (
                        <div className="space-y-6">
                            <Card className="border-none bg-card/40 backdrop-blur-xl shadow-sm rounded-3xl p-8">
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4 w-full">
                                            <div className="h-10 w-10 shrink-0 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                                                <Mail className="h-5 w-5" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-sm font-bold">Email Address</h4>
                                                <input
                                                    className="w-full bg-muted/50 border border-white/5 rounded-xl p-3 text-sm mt-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                    value={email}
                                                    onChange={e => setEmail(e.target.value)}
                                                    placeholder="Your Email"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <Separator className="bg-white/5" />
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                                                <Lock className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold">Password Management</h4>
                                                <p className="text-xs text-muted-foreground">Keep your account secure.</p>
                                            </div>
                                        </div>
                                        <Button variant="outline" className="rounded-xl h-9 text-xs font-bold px-4" onClick={() => setIsPassModalOpen(true)}>Update</Button>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}

                    {activeSection === "appearance" && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card
                                    className={cn("border-none backdrop-blur-xl shadow-sm rounded-3xl p-8 cursor-pointer hover:border-primary/20 transition-all border-2", theme === "light" ? "bg-amber-500/10 border-amber-500" : "bg-card/40 border-transparent")}
                                    onClick={() => setTheme("light")}
                                >
                                    <Sun className="h-8 w-8 text-amber-500 mb-4" />
                                    <h4 className="font-bold">Light Theme</h4>
                                    <p className="text-xs text-muted-foreground mt-1">Clean and high-contrast</p>
                                </Card>
                                <Card
                                    className={cn("border-none backdrop-blur-xl shadow-sm rounded-3xl p-8 cursor-pointer hover:border-primary/20 transition-all border-2", theme === "dark" ? "bg-indigo-600/10 border-indigo-500" : "bg-card/40 border-transparent")}
                                    onClick={() => setTheme("dark")}
                                >
                                    <Moon className="h-8 w-8 text-indigo-400 mb-4" />
                                    <h4 className="font-bold">Dark Theme</h4>
                                    <p className="text-xs text-muted-foreground mt-1">Easier on the eyes at night</p>
                                </Card>
                            </div>
                        </div>
                    )}

                    {activeSection === "language" && (
                        <div className="space-y-6">
                            <Card className="border-none bg-card/40 backdrop-blur-xl shadow-sm rounded-3xl p-8">
                                <div className="space-y-4">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Preferred Language</Label>
                                    <Select value={language} onValueChange={setLanguage}>
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

                    {activeSection === "privacy" && (
                        <div className="space-y-6">
                            <Card className="border-none bg-card/40 backdrop-blur-xl shadow-sm rounded-3xl p-8">
                                <div className="flex items-center gap-4 mb-8">
                                    <Database className="h-10 w-10 text-indigo-500 p-2 bg-indigo-500/10 rounded-xl" />
                                    <div>
                                        <h4 className="text-sm font-bold">Data Management</h4>
                                        <p className="text-xs text-muted-foreground">Control how your learning data is used to train AI models.</p>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Contribute to Collective Intelligence</span>
                                        <Switch checked={preferences.collective_intelligence} onCheckedChange={(v) => handlePrefChange('collective_intelligence', v)} />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Personalized AI Suggestions</span>
                                        <Switch checked={preferences.personalized_ai} onCheckedChange={(v) => handlePrefChange('personalized_ai', v)} />
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

            <ChangePasswordModal open={isPassModalOpen} onCancel={() => setIsPassModalOpen(false)} />
        </div>
    );
}
