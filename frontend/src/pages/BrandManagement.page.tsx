import React, { useState, useEffect } from "react";
import {
    Table,
    Button,
    Input,
    Row,
    Col,
    Space,
    Modal,
    Form,
    message,
} from "antd";
import {
    PlusOutlined,
    EyeOutlined,
    EditOutlined,
    DeleteOutlined,
} from "@ant-design/icons";
import { getAllBrands, createBrand } from "../services/product.service"; // Import các hàm API
import { useAuth } from "../providers/AuthProvider";

const { Search } = Input;

const BrandManagementPage: React.FC = () => {
    const { user } = useAuth(); // Lấy thông tin người dùng từ AuthProvider
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState<any>(null);
    const [editingBrand, setEditingBrand] = useState<any>(null);
    const [data, setData] = useState<any[]>([]); // Dữ liệu danh sách brand
    const [loading, setLoading] = useState(false); // Trạng thái loading khi gọi API

    const [form] = Form.useForm(); // Khởi tạo form

    // Lấy danh sách brand từ API
    const fetchBrands = async () => {
        setLoading(true);
        try {
            const response = await getAllBrands(
                pagination.current,
                pagination.pageSize
            );
            setData(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                response.brands.map((brand: any) => ({
                    key: brand.brand_id,
                    id: brand.brand_id,
                    name: brand.brand_name,
                }))
            );
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            message.error(error.message || "Không thể lấy danh sách hãng!");
        } finally {
            setLoading(false);
        }
    };

    // Hiển thị modal xác nhận xóa
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const showDeleteModal = (record: any) => {
        setSelectedBrand(record);
        setIsModalVisible(true);
    };

    // Xử lý khi xác nhận xóa
    const handleDelete = () => {
        if (selectedBrand) {
            setData((prev) =>
                prev.filter((item) => item.id !== selectedBrand.id)
            );
            message.success(`Đã xóa hãng ${selectedBrand?.name}`);
        }
        setIsModalVisible(false);
        setSelectedBrand(null);
    };

    // Xử lý khi hủy modal
    const handleCancel = () => {
        setIsModalVisible(false);
        setSelectedBrand(null);
    };

    // Hiển thị modal thêm hãng mới
    const showAddBrandModal = () => {
        setIsAddModalVisible(true);
    };

    // Xử lý khi lưu hãng mới
    const handleSaveBrand = async (values: any) => {
        try {
            const res = await createBrand(values.name); // Gọi API tạo brand mới
            console.log("New Brand:", res);

            setData([
                ...data,
                {
                    key: res?.data?.brand_id,
                    id: res?.data?.brand_id,
                    name: res?.data?.brand_name,
                },
            ]);
            message.success("Thêm hãng mới thành công!");
            form.resetFields(); // Reset giá trị của form
            setIsAddModalVisible(false);
        } catch (error: any) {
            message.error(error.message || "Không thể thêm hãng mới!");
        }
    };

    // Xử lý khi hủy modal thêm hãng mới
    const handleCancelAddBrand = () => {
        setIsAddModalVisible(false);
    };

    // Xử lý khi xem chi tiết
    const handleView = (record: any) => {
        setSelectedBrand(record);
        setIsViewModalVisible(true);
    };

    // Xử lý khi mở modal chỉnh sửa
    const handleEdit = (record: any) => {
        setEditingBrand(record);
        form.setFieldsValue({ name: record.name });
        setIsEditModalVisible(true);
    };

    // Xử lý khi lưu chỉnh sửa
    const handleSaveEdit = async (values: any) => {
        // Giả lập cập nhật, thực tế gọi API updateBrand
        setData((prev) =>
            prev.map((item) =>
                item.id === editingBrand.id
                    ? { ...item, name: values.name }
                    : item
            )
        );
        message.success("Cập nhật hãng thành công!");
        setIsEditModalVisible(false);
        setEditingBrand(null);
    };

    // Xử lý khi hủy modal chỉnh sửa
    const handleCancelEdit = () => {
        setIsEditModalVisible(false);
        setEditingBrand(null);
    };

    // Xử lý khi thay đổi phân trang
    const handleTableChange = (page: number, pageSize: number) => {
        setPagination({ current: page, pageSize });
    };

    // Gọi API lấy danh sách brand khi component được mount hoặc khi phân trang thay đổi
    useEffect(() => {
        fetchBrands();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pagination]);

    // Cột của bảng
    const columns = [
        {
            title: "Mã hãng",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Tên hãng",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Hành động",
            key: "actions",
            render: (_: any, record: any) => (
                <Space size="middle">
                    <EyeOutlined
                        style={{ color: "#1890ff", cursor: "pointer" }}
                        onClick={() => handleView(record)}
                    />
                    {user?.role_id !== "R003" && (
                        <>
                            <EditOutlined
                                style={{ color: "#52c41a", cursor: "pointer" }}
                                onClick={() => handleEdit(record)}
                            />
                            <DeleteOutlined
                                style={{ color: "#ff4d4f", cursor: "pointer" }}
                                onClick={() => showDeleteModal(record)}
                            />
                        </>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            {/* Thanh tìm kiếm */}
            <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                <Col span={10}>
                    <Search
                        placeholder="Tìm kiếm hãng"
                        enterButton
                        onSearch={(value) => console.log("Search:", value)}
                    />
                </Col>
            </Row>

            {/* Nút thêm hãng mới */}
            {user && user.role_id !== "R003" && (
                <Row justify="end" style={{ marginBottom: 16 }}>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={showAddBrandModal}
                    >
                        Thêm hãng mới
                    </Button>
                </Row>
            )}

            {/* Bảng danh sách hãng */}
            <Table
                columns={columns}
                dataSource={data}
                loading={loading}
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: data.length,
                    showSizeChanger: true,
                    pageSizeOptions: ["10", "20", "50"],
                    onChange: handleTableChange,
                }}
            />
            {/* Modal xác nhận xóa */}
            <Modal
                title="Xác nhận xóa"
                visible={isModalVisible}
                onOk={handleDelete}
                onCancel={handleCancel}
                okText="Xóa"
                cancelText="Hủy"
            >
                <p>
                    Bạn có chắc chắn muốn xóa hãng{" "}
                    <strong>{selectedBrand?.name}</strong> không?
                </p>
            </Modal>
            {/* Modal xem chi tiết */}
            <Modal
                title="Thông tin hãng"
                visible={isViewModalVisible}
                onCancel={() => setIsViewModalVisible(false)}
                footer={null}
            >
                <p>
                    <b>Mã hãng:</b> {selectedBrand?.id}
                </p>
                <p>
                    <b>Tên hãng:</b> {selectedBrand?.name}
                </p>
            </Modal>
            {/* Modal chỉnh sửa hãng */}
            <Modal
                title="Chỉnh sửa hãng"
                visible={isEditModalVisible}
                onCancel={handleCancelEdit}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSaveEdit}
                    initialValues={{ name: editingBrand?.name }}
                >
                    <Form.Item
                        label="Tên hãng"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tên hãng!",
                            },
                        ]}
                    >
                        <Input placeholder="Nhập tên hãng" />
                    </Form.Item>
                    <Row justify="end" gutter={16}>
                        <Col>
                            <Button onClick={handleCancelEdit}>Hủy</Button>
                        </Col>
                        <Col>
                            <Button type="primary" htmlType="submit">
                                Lưu
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Modal>
            {/* Modal thêm hãng mới */}
            <Modal
                title="Thêm hãng mới"
                visible={isAddModalVisible}
                onCancel={handleCancelAddBrand}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={handleSaveBrand}>
                    <Form.Item
                        label="Tên hãng"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tên hãng!",
                            },
                        ]}
                    >
                        <Input placeholder="Nhập tên hãng" />
                    </Form.Item>
                    <Row justify="end" gutter={16}>
                        <Col>
                            <Button onClick={handleCancelAddBrand}>Hủy</Button>
                        </Col>
                        <Col>
                            <Button type="primary" htmlType="submit">
                                Lưu
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
};

export default BrandManagementPage;
