"use client";
import { Layout, Menu, Typography, Card, Row, Col, Avatar, Button, Descriptions, Tag, Divider, message, Space } from 'antd';
import {
    UserOutlined,
    DashboardOutlined,
    BookOutlined,
    SettingOutlined,
    LogoutOutlined,
    EditOutlined,
    CalendarOutlined,
    ClockCircleOutlined
} from '@ant-design/icons';
import { useState } from 'react';
import ChangePasswordModal from '@/components/ChangePasswordModal';
import { useCurrentUser } from '@/lib/use-current-user';

const { Header, Content, Sider } = Layout;
const { Title, Text, Paragraph } = Typography;

export default function ProfileDashboard() {
    const [collapsed, setCollapsed] = useState(false);
    const [isPassModalOpen, setIsPassModalOpen] = useState(false);
    const { displayName, displayEmail, profile } = useCurrentUser();

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>ISA</Text>
                </div>
                <Menu theme="dark" defaultSelectedKeys={['profile']} mode="inline">
                    <Menu.Item key="dashboard" icon={<DashboardOutlined />}>Dashboard</Menu.Item>
                    <Menu.Item key="courses" icon={<BookOutlined />}>My Courses</Menu.Item>
                    <Menu.Item key="profile" icon={<UserOutlined />}>Profile</Menu.Item>
                    <Menu.Item key="settings" icon={<SettingOutlined />}>Settings</Menu.Item>
                    <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={() => message.info('Logging out...')}>Logout</Menu.Item>
                </Menu>
            </Sider>
            <Layout>
                <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Title level={4} style={{ margin: 0 }}>Student Profile</Title>
                    <Space>
                        <Avatar icon={<UserOutlined />} />
                        <Text strong>{displayName}</Text>
                    </Space>
                </Header>
                <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', borderRadius: 8 }}>
                    <Row gutter={[24, 24]}>
                        <Col xs={24} md={8}>
                            <Card style={{ textAlign: 'center' }}>
                                <Avatar size={100} icon={<UserOutlined />} style={{ marginBottom: 16 }} />
                                <Title level={3}>{displayName}</Title>
                                <Tag color="blue">Student</Tag>
                                <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
                                    Joined: {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Recently'}
                                </Text>
                                <Button type="primary" icon={<EditOutlined />} block>Edit Profile</Button>
                            </Card>
                        </Col>
                        <Col xs={24} md={16}>
                            <Card title="Account Information">
                                <Descriptions bordered column={1}>
                                    <Descriptions.Item label="Full Name">{displayName}</Descriptions.Item>
                                    <Descriptions.Item label="Email">{displayEmail}</Descriptions.Item>
                                    <Descriptions.Item label="Account Status"><Tag color="green">Active</Tag></Descriptions.Item>
                                    <Descriptions.Item label="Last Login">
                                        <Space>
                                            <ClockCircleOutlined />
                                            {profile?.last_login_date ? new Date(profile.last_login_date).toLocaleString() : 'Not available'}
                                        </Space>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Member Since">
                                        <Space>
                                            <CalendarOutlined />
                                            {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Not available'}
                                        </Space>
                                    </Descriptions.Item>
                                </Descriptions>

                                <Divider />

                                <Title level={5}>Security</Title>
                                <Space size="middle">
                                    <Button danger onClick={() => setIsPassModalOpen(true)}>Change Password</Button>
                                    <Button>Two-Factor Auth</Button>
                                </Space>
                            </Card>
                        </Col>
                    </Row>
                </Content>
            </Layout>
            <ChangePasswordModal open={isPassModalOpen} onCancel={() => setIsPassModalOpen(false)} />
        </Layout>
    );
}
