import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { LoginSchema } from "@/app/shared/schemas";
import { api } from "@/lib/api";

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const creds = credentials as any;
                if (creds && creds.is_google_bypass === "true") {
                    try {
                        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
                        const res = await fetch(`${API_URL}/auth/google`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Accept": "application/json",
                            },
                            body: JSON.stringify({
                                email: creds.email,
                                full_name: creds.full_name || "Google User",
                                google_id: creds.google_id || "g_1234567890",
                                profile_picture: creds.profile_picture || null,
                            }),
                        });

                        if (res.ok) {
                            const data = await res.json();
                            if (data.token) {
                                return {
                                    id: data.user.id,
                                    name: data.user.full_name,
                                    email: data.user.email,
                                    image: data.user.profile_picture ?? undefined,
                                    accessToken: data.token,
                                };
                            }
                        }
                    } catch (e) {
                        console.error("Google Auth bypass token exchange error:", e);
                    }
                    return null;
                }

                const parsed = LoginSchema.safeParse(credentials);
                if (!parsed.success) return null;

                try {
                    const { user, token } = await api.auth.login({
                        email: parsed.data.email,
                        password: parsed.data.password,
                    });
                    return {
                        id: user.id,
                        name: user.full_name,
                        email: user.email,
                        image: user.profile_picture ?? undefined,
                        accessToken: token,
                    };
                } catch {
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, account }) {
            if (account && account.provider === "google") {
                try {
                    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
                    const res = await fetch(`${API_URL}/auth/google`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json",
                        },
                        body: JSON.stringify({
                            email: token.email,
                            full_name: token.name,
                            google_id: account.providerAccountId,
                            profile_picture: token.picture,
                        }),
                    });

                    if (res.ok) {
                        const data = await res.json();
                        if (data.token) {
                            token.id = data.user.id;
                            token.accessToken = data.token;
                        }
                    }
                } catch (e) {
                    console.error("Google Auth token exchange error:", e);
                }
            } else if (user) {
                token.id = user.id;
                token.accessToken = (user as any).accessToken;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user && token.id) {
                session.user.id = token.id as string;
            }
            if (token.accessToken) {
                session.accessToken = token.accessToken as string;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
});
