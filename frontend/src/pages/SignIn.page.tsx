import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { login as loginAPI } from "../services/auth.service"; // Import API login
import { useAuth } from "../providers/AuthProvider"; // Sử dụng AuthProvider
import { useNavigate } from "react-router-dom";

const SignInPage: React.FC = () => {
    const { login } = useAuth(); // Lấy hàm login từ AuthProvider
    const [loading, setLoading] = useState(false); // Trạng thái loading khi gửi yêu cầu
    const navigate = useNavigate(); // Điều hướng sau khi đăng nhập thành công

    const handleLogin = async (values: {
        username: string;
        password: string;
    }) => {
        setLoading(true);
        try {
            const response = await loginAPI(values.username, values.password); // Gọi API login
            login(response.accessToken); // Gọi hàm login từ AuthProvider
            message.success("Đăng nhập thành công!");
            navigate("/dashboard"); // Điều hướng đến trang Dashboard
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            message.error(error.message || "Đăng nhập thất bại!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                background: "#f0f2f5",
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: "400px",
                    padding: "24px",
                    background: "#fff",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                }}
            >
                <h2
                    style={{
                        textAlign: "center",
                        marginBottom: "24px",
                        color: "#333",
                    }}
                >
                    Đăng nhập
                </h2>
                <Form
                    layout="vertical"
                    onFinish={handleLogin} // Xử lý khi submit form
                >
                    <Form.Item
                        label="Tên đăng nhập"
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tên đăng nhập!",
                            },
                        ]}
                    >
                        <Input placeholder="Nhập tên đăng nhập" />
                    </Form.Item>
                    <Form.Item
                        label="Mật khẩu"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập mật khẩu!",
                            },
                        ]}
                    >
                        <Input.Password placeholder="Nhập mật khẩu" />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            loading={loading} // Hiển thị trạng thái loading khi gửi yêu cầu
                        >
                            Đăng nhập
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default SignInPage;
