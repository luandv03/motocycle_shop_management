import React, { useState } from "react";
import {
    Card,
    Form,
    Input,
    Button,
    Row,
    Col,
    Typography,
    notification,
} from "antd";

import { useAuth } from "../providers/AuthProvider"; // Import useAuth từ AuthProvider

const { Text } = Typography;

const ProfilePage: React.FC = () => {
    const { user } = useAuth();
    const [form] = Form.useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Xử lý reset mật khẩu
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleResetPassword = async (values: any) => {
        try {
            setIsSubmitting(true);
            // Gọi API reset password (thay bằng API thực tế)
            console.log("Reset password với dữ liệu:", values);
            notification.success({
                message: "Đặt lại mật khẩu thành công!",
                description: "Mật khẩu của bạn đã được cập nhật.",
            });
            form.resetFields();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            notification.error({
                message: "Đặt lại mật khẩu thất bại!",
                description: error.message || "Đã xảy ra lỗi.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ padding: 24 }}>
            <Row gutter={[16, 16]}>
                <Col span={12}>
                    <Card title="Thông tin người dùng" bordered>
                        <p style={{ marginBottom: 8 }}>
                            <Text strong>Họ và tên:</Text> {user?.fullname}
                        </p>
                        <p style={{ marginBottom: 8 }}>
                            <Text strong>Tên tài khoản:</Text> {user?.username}
                        </p>
                        <p>
                            <Text strong>Quyền:</Text>
                            {user?.role_id === "R001"
                                ? "Admin"
                                : user?.role_id === "R002"
                                ? "Chủ cửa hàng"
                                : user?.role_id === "R003"
                                ? "Nhân viên sửa chữa"
                                : "User"}
                        </p>
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="Đặt lại mật khẩu" bordered>
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleResetPassword}
                        >
                            <Form.Item
                                label="Mật khẩu cũ"
                                name="oldPassword"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập mật khẩu cũ!",
                                    },
                                ]}
                            >
                                <Input.Password placeholder="Nhập mật khẩu cũ" />
                            </Form.Item>
                            <Form.Item
                                label="Mật khẩu mới"
                                name="newPassword"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập mật khẩu mới!",
                                    },
                                    {
                                        min: 6,
                                        message:
                                            "Mật khẩu phải có ít nhất 6 ký tự!",
                                    },
                                ]}
                            >
                                <Input.Password placeholder="Nhập mật khẩu mới" />
                            </Form.Item>
                            <Form.Item
                                label="Xác nhận mật khẩu mới"
                                name="confirmPassword"
                                dependencies={["newPassword"]}
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Vui lòng xác nhận mật khẩu mới!",
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (
                                                !value ||
                                                getFieldValue("newPassword") ===
                                                    value
                                            ) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(
                                                new Error(
                                                    "Mật khẩu xác nhận không khớp!"
                                                )
                                            );
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password placeholder="Xác nhận mật khẩu mới" />
                            </Form.Item>
                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={isSubmitting}
                                    block
                                >
                                    Đặt lại mật khẩu
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ProfilePage;
