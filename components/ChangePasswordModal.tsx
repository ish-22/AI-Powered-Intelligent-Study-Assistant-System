"use client";
import { Button, Form, Input, Modal, message } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ResetPasswordSchema, ResetPasswordInput } from '@/app/shared/schemas';

export default function ChangePasswordModal({ open, onCancel }: { open: boolean, onCancel: () => void }) {
    const { control, handleSubmit, formState: { errors } } = useForm<ResetPasswordInput>({
        resolver: zodResolver(ResetPasswordSchema),
    });

    const onSubmit = async (data: ResetPasswordInput) => {
        message.loading({ content: 'Updating password...', key: 'update_pass' });
        setTimeout(() => {
            message.success({ content: 'Password updated successfully!', key: 'update_pass' });
            onCancel();
        }, 1500);
    };

    return (
        <Modal
            title="Change Password"
            open={open}
            onCancel={onCancel}
            footer={null}
            destroyOnClose
        >
            <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
                <Form.Item
                    label="Current Password"
                    validateStatus={errors.password ? 'error' : ''}
                >
                    <Input.Password prefix={<LockOutlined />} placeholder="Current Password" />
                </Form.Item>

                <Form.Item
                    label="New Password"
                    validateStatus={errors.password ? 'error' : ''}
                    help={errors.password?.message}
                >
                    <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                            <Input.Password {...field} prefix={<LockOutlined />} placeholder="New Password" />
                        )}
                    />
                </Form.Item>

                <Form.Item
                    label="Confirm New Password"
                    validateStatus={errors.confirmPassword ? 'error' : ''}
                    help={errors.confirmPassword?.message}
                >
                    <Controller
                        name="confirmPassword"
                        control={control}
                        render={({ field }) => (
                            <Input.Password {...field} prefix={<LockOutlined />} placeholder="Confirm New Password" />
                        )}
                    />
                </Form.Item>

                <div style={{ textAlign: 'right', marginTop: 24 }}>
                    <Button onClick={onCancel} style={{ marginRight: 8 }}>Cancel</Button>
                    <Button type="primary" htmlType="submit">Update Password</Button>
                </div>
            </Form>
        </Modal>
    );
}
