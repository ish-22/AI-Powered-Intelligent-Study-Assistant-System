"use client";
import { Button, Form, Input, Card, Typography, message, Result } from 'antd';
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useState } from 'react';

const { Title, Paragraph } = Typography;

export default function ForgotPasswordPage() {
    const [submitted, setSubmitted] = useState(false);

    const onFinish = (values: any) => {
        console.log('Forgot Password Email:', values.email);
        setSubmitted(true);
        message.success('Reset link sent to your email!');
    };

    if (submitted) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5' }}>
                <Card style={{ width: 400, borderRadius: 12, textAlign: 'center' }}>
                    <Result
                        status="success"
                        title="Email Sent"
                        subTitle="If an account exists for that email, we have sent password reset instructions."
                        extra={[
                            <Link href="/login" key="login">
                                <Button type="primary">Back to Login</Button>
                            </Link>
                        ]}
                    />
                </Card>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5' }}>
            <Card style={{ width: 380, borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
                <div style={{ marginBottom: 24 }}>
                    <Link href="/login">
                        <Button type="link" icon={<ArrowLeftOutlined />} style={{ padding: 0 }}>Back to Login</Button>
                    </Link>
                </div>

                <Title level={3}>Forgot Password?</Title>
                <Paragraph>
                    Enter your email address and we'll send you a link to reset your password.
                </Paragraph>

                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        name="email"
                        rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
                    >
                        <Input prefix={<MailOutlined />} placeholder="Email Address" size="large" />
                    </Form.Item>

                    <Button type="primary" htmlType="submit" block size="large">
                        Send Reset Link
                    </Button>
                </Form>
            </Card>
        </div>
    );
}
