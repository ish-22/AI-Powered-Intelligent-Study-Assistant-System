"use client";

import { ConfigProvider, theme, App } from 'antd';
import { AntdRegistry } from '@ant-design/nextjs-registry';

export default function AntdProvider({ children }: { children: React.ReactNode }) {
    return (
        <AntdRegistry>
            <ConfigProvider
                theme={{
                    algorithm: theme.defaultAlgorithm,
                    token: {
                        colorPrimary: '#1677ff',
                        borderRadius: 6,
                    },
                }}
            >
                <App>
                    {children}
                </App>
            </ConfigProvider>
        </AntdRegistry>
    );
}
