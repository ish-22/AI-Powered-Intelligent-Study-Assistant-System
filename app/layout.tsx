import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";
import { Providers } from "@/components/providers";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
    title: "Study.AI | Your Personal AI Study Assistant",
    description: "Boost your learning with AI-powered summaries, quizzes, and personalized study paths.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={cn(inter.variable, "font-sans antialiased bg-background")}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <Providers>
                        <div className="relative flex min-h-screen">
                            {/* Sidebar - Hidden on mobile, shown on desktop */}
                            <Sidebar />

                            <div className="flex flex-1 flex-col lg:pl-72">
                                {/* Navbar - Sticky at the top */}
                                <Navbar />

                                {/* Main Content Area */}
                                <main className="flex-1 overflow-y-auto px-4 py-8 md:px-8">
                                    <div className="mx-auto max-w-7xl">
                                        {children}
                                    </div>
                                </main>

                                {/* Optional Footer/Background Gradient */}
                                <div className="fixed inset-0 -z-10 h-full w-full bg-background">
                                    <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-[0.4] dark:opacity-[0.1]" />
                                    <div className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] bg-indigo-500/10 blur-[120px] rounded-full" />
                                    <div className="absolute bottom-0 left-0 -z-10 h-[500px] w-[500px] bg-purple-500/10 blur-[120px] rounded-full" />
                                </div>
                            </div>
                        </div>
                    </Providers>
                </ThemeProvider>
            </body>
        </html>
    );
}
