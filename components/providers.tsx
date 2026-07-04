"use client";

import React from "react";
import { unstableSetRender } from "antd";
import { createRoot } from "react-dom/client";
import { SessionProvider } from "next-auth/react";
import AntdProvider from "@/components/AntdProvider";

unstableSetRender((node, container) => {
    const root = createRoot(container);
    root.render(node);
    return async () => {
        root.unmount();
    };
});

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <AntdProvider>{children}</AntdProvider>
        </SessionProvider>
    );
}
