import AntdProvider from '@/components/AntdProvider';
import '@/styles/globals.css';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <AntdProvider>
                    {children}
                </AntdProvider>
            </body>
        </html>
    );
}
