"use client";
import { Layout, Button, Typography, Space, Card } from 'antd';
import Link from 'next/link';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

export default function Home() {
    return (
        <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
            <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '50px' }}>
                <Card style={{ maxWidth: 600, textAlign: 'center', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                    <Title level={2}>AI-Powered Intelligent Study Assistant</Title>
                    <Paragraph>
                        Enhance your learning experience with our intelligent study tools.
                        Manage your schedule, track your progress, and get AI-driven insights.
                    </Paragraph>
                    <Space size="middle">
                        <Link href="/login">
                            <Button type="primary" size="large">Login</Button>
                        </Link>
                        <Link href="/register">
                            <Button size="large">Register</Button>
                        </Link>
                    </Space>
                </Card>
            </Content>
        </Layout>
    );
}
