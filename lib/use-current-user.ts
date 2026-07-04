"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { api, type AuthUser } from "@/lib/api";

export function useCurrentUser() {
    const { data: session, status } = useSession();
    const [profile, setProfile] = useState<AuthUser | null>(null);

    useEffect(() => {
        const token = session?.accessToken;

        if (!token) {
            setProfile(null);
            return;
        }

        let active = true;

        api.auth.me(token)
            .then(({ user }) => {
                if (active) setProfile(user);
            })
            .catch(() => {
                if (active) setProfile(null);
            });

        return () => {
            active = false;
        };
    }, [session?.accessToken]);

    const displayName = profile?.full_name || session?.user?.name || "Study user";
    const displayEmail = profile?.email || session?.user?.email || "account connected";
    const avatarUrl = profile?.profile_picture || session?.user?.image || "";
    const initials = displayName
        .split(" ")
        .filter(Boolean)
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return {
        session,
        status,
        profile,
        displayName,
        displayEmail,
        avatarUrl,
        initials,
    };
}
