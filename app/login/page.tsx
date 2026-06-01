"use client";
import { Button, Form, Input, Card, Typography, Checkbox, message, Divider } from 'antd';
import { LockOutlined, MailOutlined, GoogleOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema, LoginInput } from '@/app/shared/schemas';

const { Title, Text } = Typography;

export default function LoginPage() {
    const { control, handleSubmit, formState: { errors } } = useForm<LoginInput>({
        resolver: zodResolver(LoginSchema),
        defaultValues: { remember: true }
    });

    const onSubmit = async (data: LoginInput) => {
        try {
            console.log('Login Data:', data);
            message.loading({ content: 'Authenticating...', key: 'login' });
            // Integration with signIn('credentials')
            setTimeout(() => {
                message.success({ content: 'Login successful!', key: 'login' });
            }, 1000);
        } catch (error) {
            message.error({ content: 'Login failed. Invalid credentials.', key: 'login' });
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5' }}>
            <Card style={{ width: 380, borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <Title level={3}>Welcome Back</Title>
                    <Text type="secondary">Login to your account</Text>
                </div>

                <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
                    <Form.Item
                        validateStatus={errors.email ? 'error' : ''}
                        help={errors.email?.message}
                    >
                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                                <Input {...field} prefix={<MailOutlined />} placeholder="Email" size="large" />
                            )}
                        />
                    </Form.Item>

                    <Form.Item
                        validateStatus={errors.password ? 'error' : ''}
                        help={errors.password?.message}
                    >
                        <Controller
                            name="password"
                            control={control}
                            render={({ field }) => (
                                <Input.Password {...field} prefix={<LockOutlined />} placeholder="Password" size="large" />
                            )}
                        />
                    </Form.Item>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                        <Form.Item name="remember" noStyle>
                            <Controller
                                name="remember"
                                control={control}
                                render={({ field }) => (
                                    <Checkbox {...field} checked={field.value}>Remember me</Checkbox>
                                )}
                            />
                        </Form.Item>
                        <Link href="/forgot-password">Forgot password?</Link>
                    </div>

                    <Button type="primary" htmlType="submit" block size="large">
                        Login
                    </Button>

                    <Divider plain>Or</Divider>

                    <Button block size="large" icon={<GoogleOutlined />}>
                        Sign in with Google
                    </Button>

                    <div style={{ textAlign: 'center', marginTop: 16 }}>
                        Don't have an account? <Link href="/register">Register now</Link>
                    </div>
                </Form>
            </Card>
        </div>
    );
}
