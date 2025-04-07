import React, { useState, useEffect } from "react";
import {
    Table,
    Button,
    Space,
    Tooltip,
    Popconfirm,
    Modal,
    Form,
    Input,
    Select,
    notification,
    message,
} from "antd";
import {
    PlusOutlined,
    EyeOutlined,
    EditOutlined,
    DeleteOutlined,
} from "@ant-design/icons";
import { getAllUsers, registerUser } from "../services/auth.service"; // Import API

const AccountManagementPage: React.FC = () => {
    const [data, setData] = useState<any[]>([]); // Dữ liệu người dùng
    const [roles] = useState([
        { role_id: "R002", role_name: "Chủ cửa hàng" },
        { role_id: "R003", role_name: "Nhân viên sửa chữa" },
    ]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);
    const [editingAccount, setEditingAccount] = useState<any>(null);
    const [viewingAccount, setViewingAccount] = useState<any>(null);
    const [form] = Form.useForm();

    // Gọi API để lấy danh sách người dùng
    const fetchUsers = async () => {
        try {
            const users = await getAllUsers();
            const formattedUsers = users.map((user: any) => ({
                key: user.user_id,
                user_id: user.user_id,
                fullname: user.fullname,
                username: user.username,
                role: user.role.role_name,
            }));
            setData(formattedUsers);
        } catch (error: any) {
            message.error(
                error.message || "Không thể lấy danh sách người dùng!"
            );
        }
    };

    useEffect(() => {
        fetchUsers(); // Gọi API khi component được mount
    }, []);

    // Xử lý khi thêm tài khoản mới
    const handleAddAccount = async (values: any) => {
        try {
            const role = roles.find((r) => r.role_name === values.role);
            if (!role) {
                message.error("Quyền không hợp lệ!");
                return;
            }

            const newUser = await registerUser(
                values.username,
                values.fullname,
                values.password,
                role.role_id
            );

            const newAccount = {
                key: newUser.user_id,
                user_id: newUser.user_id,
                fullname: newUser.fullname,
                username: newUser.username,
                role: roles.find((r) => r.role_id === newUser.role_id)
                    ?.role_name,
            };

            setData([...data, newAccount]);
            setIsModalVisible(false);
            form.resetFields();
            notification.success({
                message: "Thêm tài khoản thành công!",
                placement: "topRight",
            });
        } catch (error: any) {
            message.error(error.message || "Không thể thêm tài khoản mới!");
        }
    };

    // Xử lý khi lưu chỉnh sửa tài khoản
    const handleEditAccount = (values: any) => {
        const updatedData = data.map((item) =>
            item.key === editingAccount.key
                ? { ...item, ...values, role: values.role }
                : item
        );
        setData(updatedData);
        setIsEditModalVisible(false);
        notification.success({
            message: "Cập nhật tài khoản thành công!",
            placement: "topRight",
        });
    };

    const columns = [
        {
            title: "Mã người dùng",
            dataIndex: "user_id",
            key: "user_id",
        },
        {
            title: "Tên người dùng",
            dataIndex: "fullname",
            key: "fullname",
        },
        {
            title: "Tài khoản",
            dataIndex: "username",
            key: "username",
        },
        {
            title: "Quyền",
            dataIndex: "role",
            key: "role",
        },
        {
            title: "Hành động",
            key: "actions",
            render: (_: any, record: any) => (
                <Space size="middle">
                    <Tooltip title="Xem">
                        <EyeOutlined
                            style={{ color: "#1890ff", cursor: "pointer" }}
                            onClick={() => {
                                setViewingAccount(record);
                                setIsViewModalVisible(true);
                            }}
                        />
                    </Tooltip>
                    {record.role !== "admin" && (
                        <>
                            <Tooltip title="Sửa">
                                <EditOutlined
                                    style={{
                                        color: "#52c41a",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => {
                                        setEditingAccount(record);
                                        setIsEditModalVisible(true);
                                        form.setFieldsValue(record);
                                    }}
                                />
                            </Tooltip>
                            <Tooltip title="Xóa">
                                <Popconfirm
                                    title="Bạn có chắc chắn muốn xóa tài khoản này?"
                                    onConfirm={() =>
                                        setData(
                                            data.filter(
                                                (item) =>
                                                    item.key !== record.key
                                            )
                                        )
                                    }
                                    okText="Xóa"
                                    cancelText="Hủy"
                                >
                                    <DeleteOutlined
                                        style={{
                                            color: "#ff4d4f",
                                            cursor: "pointer",
                                        }}
                                    />
                                </Popconfirm>
                            </Tooltip>
                        </>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            {/* Nút Thêm tài khoản */}
            <div style={{ marginBottom: 16, textAlign: "right" }}>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsModalVisible(true)}
                >
                    Thêm tài khoản
                </Button>
            </div>

            {/* Bảng danh sách tài khoản */}
            <Table
                columns={columns}
                dataSource={data}
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    pageSizeOptions: ["10", "20", "50"],
                }}
                bordered
            />

            {/* Modal Thêm tài khoản */}
            <Modal
                title="Thêm tài khoản"
                visible={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false);
                    form.resetFields();
                }}
                onOk={() => {
                    form.validateFields().then((values) => {
                        handleAddAccount(values);
                    });
                }}
                okText="Lưu"
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Họ và tên"
                        name="fullname"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập họ và tên!",
                            },
                        ]}
                    >
                        <Input placeholder="Nhập họ và tên" />
                    </Form.Item>
                    <Form.Item
                        label="Tên tài khoản"
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tên tài khoản!",
                            },
                        ]}
                    >
                        <Input placeholder="Nhập tên tài khoản" />
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
                    <Form.Item
                        label="Quyền"
                        name="role"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng chọn quyền!",
                            },
                        ]}
                    >
                        <Select placeholder="Chọn quyền">
                            {roles.map((role) => (
                                <Select.Option
                                    key={role.role_id}
                                    value={role.role_name}
                                >
                                    {role.role_name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal Xem chi tiết */}
            <Modal
                title="Chi tiết tài khoản"
                visible={isViewModalVisible}
                onCancel={() => setIsViewModalVisible(false)}
                footer={null}
            >
                <p>
                    <strong>Mã người dùng:</strong> {viewingAccount?.user_id}
                </p>
                <p>
                    <strong>Họ và tên:</strong> {viewingAccount?.fullname}
                </p>
                <p>
                    <strong>Tên tài khoản:</strong> {viewingAccount?.username}
                </p>
                <p>
                    <strong>Quyền:</strong> {viewingAccount?.role}
                </p>
            </Modal>

            {/* Modal Chỉnh sửa tài khoản */}
            <Modal
                title="Chỉnh sửa tài khoản"
                visible={isEditModalVisible}
                onCancel={() => setIsEditModalVisible(false)}
                onOk={() => {
                    form.validateFields().then((values) => {
                        handleEditAccount(values);
                    });
                }}
                okText="Lưu"
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Tên tài khoản"
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tên tài khoản!",
                            },
                        ]}
                    >
                        <Input placeholder="Nhập tên tài khoản" />
                    </Form.Item>
                    <Form.Item
                        label="Quyền"
                        name="role"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng chọn quyền!",
                            },
                        ]}
                    >
                        <Select placeholder="Chọn quyền">
                            {roles.map((role) => (
                                <Select.Option
                                    key={role.role_id}
                                    value={role.role_name}
                                >
                                    {role.role_name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default AccountManagementPage;
