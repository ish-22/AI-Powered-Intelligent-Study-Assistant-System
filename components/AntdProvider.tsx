"use client";

import { ConfigProvider, theme } from 'antd';
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
                {children}
            </ConfigProvider>
        </AntdRegistry>
    );
}
