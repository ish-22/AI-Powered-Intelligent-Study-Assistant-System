"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import AntdProvider from "@/components/AntdProvider";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <AntdProvider>{children}</AntdProvider>
        </SessionProvider>
    );
}
