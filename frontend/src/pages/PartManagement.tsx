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
import {
    getAllAccessories,
    createAccessory,
} from "../services/product.service"; // Import API
import { useAuth } from "../providers/AuthProvider"; // Import AuthProvider

const { Search } = Input;

const PartManagementPage: React.FC = () => {
    const { user } = useAuth(); // Lấy thông tin người dùng từ context
    const [form] = Form.useForm(); // Khởi tạo form
    const [data, setData] = useState<any[]>([]); // Dữ liệu phụ tùng
    const [filteredData, setFilteredData] = useState<any[]>([]); // Dữ liệu sau khi tìm kiếm
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);
    const [selectedPart, setSelectedPart] = useState<any>(null);

    // Gọi API để lấy danh sách phụ tùng
    const fetchAccessories = async () => {
        try {
            const response = await getAllAccessories();
            const accessories = response.accessories.map(
                (item: any, index: number) => ({
                    key: index.toString(),
                    id: item.accessory_id,
                    name: item.accessory_name,
                    quantity: item.quantity,
                    price: `${item.price.toLocaleString()} VND`,
                })
            );
            setData(accessories);
            setFilteredData(accessories); // Khởi tạo dữ liệu hiển thị
        } catch (error: any) {
            message.error(error.message || "Không thể lấy danh sách phụ tùng!");
        }
    };

    useEffect(() => {
        fetchAccessories(); // Gọi API khi component được mount
    }, []);

    // Cột của bảng
    const columns = [
        {
            title: "Mã phụ tùng",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Tên phụ tùng",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Số lượng",
            dataIndex: "quantity",
            key: "quantity",
        },
        {
            title: "Giá",
            dataIndex: "price",
            key: "price",
        },
        {
            title: "Hành động",
            key: "actions",
            render: (_: any, record: any) => (
                <Space size="middle">
                    <EyeOutlined
                        style={{ color: "#1890ff", cursor: "pointer" }}
                        onClick={() => handleViewPart(record)}
                    />
                    {user?.role_id !== "R003" && (
                        <>
                            <EditOutlined
                                style={{ color: "#52c41a", cursor: "pointer" }}
                                onClick={() => handleEditPart(record)}
                            />
                            {/* <DeleteOutlined
                                style={{ color: "#ff4d4f", cursor: "pointer" }}
                                onClick={() => showDeleteModal(record)}
                            /> */}
                        </>
                    )}
                </Space>
            ),
        },
    ];

    // Hiển thị modal xác nhận xóa
    const showDeleteModal = (record: any) => {
        setSelectedPart(record);
        setIsModalVisible(true);
    };

    // Xử lý khi xác nhận xóa
    const handleDelete = () => {
        setData(data.filter((item) => item.key !== selectedPart.key));
        setFilteredData(
            filteredData.filter((item) => item.key !== selectedPart.key)
        );
        setIsModalVisible(false);
        setSelectedPart(null);
    };

    // Xử lý khi hủy modal
    const handleCancel = () => {
        setIsModalVisible(false);
        setSelectedPart(null);
    };

    // Hiển thị modal thêm phụ tùng mới
    const showAddPartModal = () => {
        setIsAddModalVisible(true);
    };

    // Xử lý khi lưu phụ tùng mới
    const handleSavePart = async (values: any) => {
        try {
            const res = await createAccessory(
                values.name,
                values.quantity,
                values.price
            );

            console.log("res", res);

            if (res) {
                message.success("Thêm phụ tùng mới thành công!");
                const newPart = {
                    key: (data.length + 1).toString(),
                    id: res.accessory_id,
                    name: values.name,
                    quantity: values.quantity,
                    price: `${values.price.toLocaleString()} VND`,
                };

                console.log("newPart", newPart);

                setData([newPart, ...data]);
                setFilteredData([newPart, ...filteredData]);
                setIsAddModalVisible(false);
                form.resetFields(); // Reset form sau khi thêm thành công
            }
        } catch (error) {
            message.error("Thêm phụ tùng mới thất bại!");
        }
    };

    // Xử lý khi hủy modal thêm phụ tùng mới
    const handleCancelAddPart = () => {
        setIsAddModalVisible(false);
    };

    // Xử lý tìm kiếm
    const handleSearch = (value: string) => {
        const filtered = data.filter(
            (item) =>
                item.name.toLowerCase().includes(value.toLowerCase()) ||
                item.id.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredData(filtered);
    };

    // Xử lý khi thay đổi phân trang
    const handleTableChange = (page: number, pageSize: number) => {
        setPagination({ current: page, pageSize });
    };

    // Hiển thị modal xem chi tiết
    const handleViewPart = (record: any) => {
        setSelectedPart(record);
        setIsViewModalVisible(true);
    };

    // Hiển thị modal chỉnh sửa
    const handleEditPart = (record: any) => {
        setSelectedPart(record);
        setIsEditModalVisible(true);
    };

    // Xử lý khi lưu chỉnh sửa
    const handleSaveEditPart = (values: any) => {
        const updatedData = data.map((item) =>
            item.key === selectedPart.key
                ? {
                      ...item,
                      ...values,
                      price: `${values.price.toLocaleString()} VND`,
                  }
                : item
        );
        setData(updatedData);
        setFilteredData(updatedData);
        setIsEditModalVisible(false);
        setSelectedPart(null);
    };

    return (
        <div style={{ padding: 24 }}>
            {/* Thanh tìm kiếm */}
            <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                <Col span={10}>
                    <Search
                        placeholder="Tìm kiếm phụ tùng"
                        enterButton
                        onSearch={handleSearch}
                    />
                </Col>
            </Row>

            {/* Nút thêm phụ tùng mới */}
            {user?.role_id !== "R003" && (
                <Row justify="end" style={{ marginBottom: 16 }}>
                    <Col>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={showAddPartModal}
                        >
                            Thêm phụ tùng mới
                        </Button>
                    </Col>
                </Row>
            )}

            {/* Bảng danh sách phụ tùng */}
            <Table
                columns={columns}
                dataSource={filteredData}
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: filteredData.length,
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
                    Bạn có chắc chắn muốn xóa phụ tùng{" "}
                    <strong>{selectedPart?.name}</strong> không?
                </p>
            </Modal>

            {/* Modal xem chi tiết */}
            <Modal
                title="Chi tiết phụ tùng"
                visible={isViewModalVisible}
                onCancel={() => setIsViewModalVisible(false)}
                footer={null}
            >
                <p>
                    <strong>Mã phụ tùng:</strong> {selectedPart?.id}
                </p>
                <p>
                    <strong>Tên phụ tùng:</strong> {selectedPart?.name}
                </p>
                <p>
                    <strong>Số lượng:</strong> {selectedPart?.quantity}
                </p>
                <p>
                    <strong>Giá:</strong> {selectedPart?.price}
                </p>
            </Modal>

            {/* Modal chỉnh sửa */}
            <Modal
                title="Chỉnh sửa phụ tùng"
                visible={isEditModalVisible}
                onCancel={() => setIsEditModalVisible(false)}
                footer={null}
            >
                <Form
                    layout="vertical"
                    onFinish={handleSaveEditPart}
                    initialValues={{
                        name: selectedPart?.name,
                        quantity: selectedPart?.quantity,
                        price: parseInt(
                            selectedPart?.price.replace(/[^0-9]/g, "")
                        ),
                    }}
                >
                    <Form.Item
                        label="Tên phụ tùng"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tên phụ tùng!",
                            },
                        ]}
                    >
                        <Input placeholder="Nhập tên phụ tùng" />
                    </Form.Item>
                    <Form.Item
                        label="Số lượng"
                        name="quantity"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập số lượng!",
                            },
                        ]}
                    >
                        <Input type="number" placeholder="Nhập số lượng" />
                    </Form.Item>
                    <Form.Item
                        label="Giá"
                        name="price"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập giá!",
                            },
                        ]}
                    >
                        <Input type="number" placeholder="Nhập giá" />
                    </Form.Item>
                    <Row justify="end" gutter={16}>
                        <Col>
                            <Button
                                onClick={() => setIsEditModalVisible(false)}
                            >
                                Hủy
                            </Button>
                        </Col>
                        <Col>
                            <Button type="primary" htmlType="submit">
                                Lưu
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Modal>

            {/* Modal thêm phụ tùng mới */}
            <Modal
                title="Tạo mới phụ tùng"
                visible={isAddModalVisible}
                onCancel={handleCancelAddPart}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={handleSavePart}>
                    <Form.Item
                        label="Tên phụ tùng"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tên phụ tùng!",
                            },
                        ]}
                    >
                        <Input placeholder="Nhập tên phụ tùng" />
                    </Form.Item>
                    <Form.Item
                        label="Số lượng"
                        name="quantity"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập số lượng!",
                            },
                        ]}
                    >
                        <Input type="number" placeholder="Nhập số lượng" />
                    </Form.Item>
                    <Form.Item
                        label="Giá"
                        name="price"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập giá!",
                            },
                        ]}
                    >
                        <Input type="number" placeholder="Nhập giá" />
                    </Form.Item>
                    <Row justify="end" gutter={16}>
                        <Col>
                            <Button onClick={handleCancelAddPart}>Hủy</Button>
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

export default PartManagementPage;
