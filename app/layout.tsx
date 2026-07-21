import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { Providers } from "@/components/providers";
import { ThemeProvider } from "@/components/theme-provider";
import { AppShell } from "@/components/app-shell";
import { cn } from "@/lib/utils";
import Script from "next/script";

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
            <head>
                <meta name="google" content="notranslate" className="hidden" />
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            if (typeof Node === 'function' && Node.prototype) {
                                const originalRemoveChild = Node.prototype.removeChild;
                                Node.prototype.removeChild = function(child) {
                                    if (child.parentNode !== this) {
                                        return child;
                                    }
                                    return originalRemoveChild.apply(this, arguments);
                                };

                                const originalInsertBefore = Node.prototype.insertBefore;
                                Node.prototype.insertBefore = function(newNode, referenceNode) {
                                    if (referenceNode && referenceNode.parentNode !== this) {
                                        return newNode;
                                    }
                                    return originalInsertBefore.apply(this, arguments);
                                };
                                
                                const originalReplaceChild = Node.prototype.replaceChild;
                                Node.prototype.replaceChild = function(newChild, oldChild) {
                                    if (oldChild.parentNode !== this) {
                                        return oldChild;
                                    }
                                    return originalReplaceChild.apply(this, arguments);
                                };
                            }

                            function googleTranslateElementInit() {
                                new google.translate.TranslateElement({pageLanguage: 'en', autoDisplay: false}, 'google_translate_element');
                            }
                        `
                    }}
                />
                <Script
                    src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
                    strategy="afterInteractive"
                />
            </head>
            <body className={cn(inter.variable, "font-sans antialiased bg-background")}>
                <div id="google_translate_element" className="hidden" />
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <Providers>
                        <AppShell>{children}</AppShell>
                    </Providers>
                </ThemeProvider>
            </body>
        </html>
    );
}
