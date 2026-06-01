"use client";
import { Button, Form, Input, Card, Typography, Checkbox, message, Divider } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, GoogleOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterSchema, RegisterInput } from '@/app/shared/schemas';

const { Title, Text } = Typography;

export default function RegisterPage() {
    const { control, handleSubmit, formState: { errors, isValid } } = useForm<RegisterInput>({
        resolver: zodResolver(RegisterSchema),
        mode: 'onChange',
    });

    const onSubmit = async (data: RegisterInput) => {
        try {
            console.log('Registration Data:', data);
            message.success('Registration successful! Please login.');
            // API call to /api/auth/register
        } catch (error) {
            message.error('Registration failed. Please try again.');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5' }}>
            <Card style={{ width: 400, borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <Title level={3}>Create Account</Title>
                    <Text type="secondary">Join the Intelligent Study Assistant</Text>
                </div>

                <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
                    <Form.Item
                        validateStatus={errors.fullName ? 'error' : ''}
                        help={errors.fullName?.message}
                    >
                        <Controller
                            name="fullName"
                            control={control}
                            render={({ field }) => (
                                <Input {...field} prefix={<UserOutlined />} placeholder="Full Name" size="large" />
                            )}
                        />
                    </Form.Item>

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

                    <Form.Item
                        validateStatus={errors.confirmPassword ? 'error' : ''}
                        help={errors.confirmPassword?.message}
                    >
                        <Controller
                            name="confirmPassword"
                            control={control}
                            render={({ field }) => (
                                <Input.Password {...field} prefix={<LockOutlined />} placeholder="Confirm Password" size="large" />
                            )}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Controller
                            name="terms"
                            control={control}
                            render={({ field }) => (
                                <Checkbox {...field} checked={field.value}>
                                    I agree to the <Link href="/terms">Terms & Conditions</Link>
                                </Checkbox>
                            )}
                        />
                        {errors.terms && <div style={{ color: '#ff4d4f', fontSize: 12 }}>{errors.terms.message}</div>}
                    </Form.Item>

                    <Button type="primary" htmlType="submit" block size="large" disabled={!isValid}>
                        Register
                    </Button>

                    <Divider plain>Or</Divider>

                    <Button block size="large" icon={<GoogleOutlined />}>
                        Sign up with Google
                    </Button>

                    <div style={{ textAlign: 'center', marginTop: 16 }}>
                        Already have an account? <Link href="/login">Login</Link>
                    </div>
                </Form>
            </Card>
        </div>
    );
}
