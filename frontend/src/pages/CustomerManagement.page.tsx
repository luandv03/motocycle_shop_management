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
    InputNumber,
    message,
} from "antd";
import {
    SearchOutlined,
    EyeOutlined,
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
    getAllCustomers,
    addCustomer,
    editCustomerById,
} from "../services/customer.service"; // Import các API

const { Search } = Input;

const CustomerManagementPage: React.FC = () => {
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
    const [searchText, setSearchText] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
    const [customers, setCustomers] = useState<any[]>([]);
    const [filteredCustomers, setFilteredCustomers] = useState<any[]>([]);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    // Gọi API để lấy danh sách khách hàng
    const fetchCustomers = async () => {
        try {
            const response = await getAllCustomers();
            const formattedCustomers = response.customers.map(
                (customer: any) => ({
                    key: customer.customer_id,
                    customer_id: customer.customer_id,
                    name: customer.fullname,
                    phone: customer.phonenumber,
                    address: customer.address,
                    purchaseCount: customer.purchase_count,
                    repairCount: customer.repair_count,
                    points: customer.loyaltyPoint,
                })
            );
            setCustomers(formattedCustomers);
            setFilteredCustomers(formattedCustomers); // Khởi tạo dữ liệu hiển thị
        } catch (error: any) {
            message.error(
                error.message || "Không thể lấy danh sách khách hàng!"
            );
        }
    };

    useEffect(() => {
        fetchCustomers(); // Gọi API khi component được mount
    }, []);

    // Xử lý tìm kiếm
    const handleSearch = (value: string) => {
        const filtered = customers.filter((customer) =>
            customer.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredCustomers(filtered);
    };

    // Xử lý khi thay đổi phân trang
    const handleTableChange = (page: number, pageSize: number) => {
        setPagination({ current: page, pageSize });
    };

    // Xử lý thêm khách hàng mới
    const handleAddCustomer = async () => {
        try {
            const values = await form.validateFields();
            const newCustomer = await addCustomer(
                values.name,
                values.phone,
                values.address,
                values.points
            );
            const formattedCustomer = {
                key: newCustomer.customer_id,
                customer_id: newCustomer.customer_id,
                name: newCustomer.fullname,
                phone: newCustomer.phonenumber,
                address: newCustomer.address,
                purchaseCount: 0,
                repairCount: 0,
                points: newCustomer.loyaltyPoint,
            };
            setCustomers([...customers, formattedCustomer]);
            setFilteredCustomers([...filteredCustomers, formattedCustomer]);
            setIsAddModalVisible(false);
            form.resetFields();
            message.success("Thêm khách hàng mới thành công!");
        } catch (error: any) {
            message.error(error.message || "Không thể thêm khách hàng mới!");
        }
    };

    // Xử lý chỉnh sửa khách hàng
    const handleEditCustomer = async () => {
        try {
            const values = await form.validateFields();
            const updatedCustomer = await editCustomerById(
                selectedCustomer.customer_id,
                values.name,
                values.phone,
                values.address,
                values.points
            );
            const updatedCustomers = customers.map((customer) =>
                customer.customer_id === updatedCustomer.customer_id
                    ? {
                          ...customer,
                          name: updatedCustomer.fullname,
                          phone: updatedCustomer.phonenumber,
                          address: updatedCustomer.address,
                          points: updatedCustomer.loyaltyPoint,
                      }
                    : customer
            );
            setCustomers(updatedCustomers);
            setFilteredCustomers(updatedCustomers);
            setIsEditModalVisible(false);
            form.resetFields();
            message.success("Chỉnh sửa khách hàng thành công!");
        } catch (error: any) {
            message.error(error.message || "Không thể chỉnh sửa khách hàng!");
        }
    };

    const columns = [
        {
            title: "Mã khách hàng",
            dataIndex: "customer_id",
            key: "customer_id",
        },
        {
            title: "Tên khách hàng",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Số điện thoại",
            dataIndex: "phone",
            key: "phone",
        },
        {
            title: "Địa chỉ",
            dataIndex: "address",
            key: "address",
        },
        {
            title: "Số lượt mua",
            dataIndex: "purchaseCount",
            key: "purchaseCount",
        },
        {
            title: "Số lần sửa chữa",
            dataIndex: "repairCount",
            key: "repairCount",
        },
        {
            title: "Điểm tích lũy",
            dataIndex: "points",
            key: "points",
        },
        {
            title: "Hành động",
            key: "actions",
            render: (_: any, record: any) => (
                <Space size="middle">
                    <EyeOutlined
                        style={{ color: "#1890ff", cursor: "pointer" }}
                        onClick={() =>
                            navigate(`/customers/${record.customer_id}`)
                        }
                    />
                    <EditOutlined
                        style={{ color: "#52c41a", cursor: "pointer" }}
                        onClick={() => {
                            setSelectedCustomer(record);
                            setIsEditModalVisible(true);
                            form.setFieldsValue({
                                name: record.name,
                                phone: record.phone,
                                address: record.address,
                                points: record.points,
                            });
                        }}
                    />
                    {/* <DeleteOutlined
                        style={{ color: "#ff4d4f", cursor: "pointer" }}
                        onClick={() => {
                            setSelectedCustomer(record);
                            setIsModalVisible(true);
                        }}
                    /> */}
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            {/* Thanh tìm kiếm và nút thêm khách hàng */}
            <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                <Col span={10}>
                    <Search
                        placeholder="Tìm kiếm khách hàng"
                        prefix={<SearchOutlined />}
                        enterButton
                        onSearch={handleSearch}
                        style={{ width: "100%" }}
                    />
                </Col>
            </Row>

            <Row justify="end" style={{ marginBottom: 16 }}>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsAddModalVisible(true)}
                >
                    Thêm khách hàng mới
                </Button>
            </Row>

            {/* Bảng khách hàng */}
            <Table
                columns={columns}
                dataSource={filteredCustomers}
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: filteredCustomers.length,
                    showSizeChanger: true,
                    pageSizeOptions: ["10", "20", "50"],
                    onChange: handleTableChange,
                }}
                bordered
            />

            {/* Modal thêm khách hàng mới */}
            <Modal
                title="Thêm khách hàng mới"
                visible={isAddModalVisible}
                onOk={handleAddCustomer}
                onCancel={() => {
                    setIsAddModalVisible(false);
                    form.resetFields();
                }}
                okText="Lưu"
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Tên khách hàng"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tên khách hàng!",
                            },
                        ]}
                    >
                        <Input placeholder="Nhập tên khách hàng" />
                    </Form.Item>
                    <Form.Item
                        label="Số điện thoại"
                        name="phone"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập số điện thoại!",
                            },
                        ]}
                    >
                        <Input placeholder="Nhập số điện thoại" />
                    </Form.Item>
                    <Form.Item
                        label="Địa chỉ"
                        name="address"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập địa chỉ!",
                            },
                        ]}
                    >
                        <Input placeholder="Nhập địa chỉ" />
                    </Form.Item>
                    <Form.Item
                        label="Điểm tích lũy"
                        name="points"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập điểm tích lũy!",
                            },
                        ]}
                    >
                        <InputNumber
                            placeholder="Nhập điểm tích lũy"
                            style={{ width: "100%" }}
                            min={0}
                        />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal chỉnh sửa khách hàng */}
            <Modal
                title="Chỉnh sửa khách hàng"
                visible={isEditModalVisible}
                onOk={handleEditCustomer}
                onCancel={() => {
                    setIsEditModalVisible(false);
                    form.resetFields();
                }}
                okText="Lưu"
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Tên khách hàng"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tên khách hàng!",
                            },
                        ]}
                    >
                        <Input placeholder="Nhập tên khách hàng" />
                    </Form.Item>
                    <Form.Item
                        label="Số điện thoại"
                        name="phone"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập số điện thoại!",
                            },
                        ]}
                    >
                        <Input placeholder="Nhập số điện thoại" />
                    </Form.Item>
                    <Form.Item
                        label="Địa chỉ"
                        name="address"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập địa chỉ!",
                            },
                        ]}
                    >
                        <Input placeholder="Nhập địa chỉ" />
                    </Form.Item>
                    <Form.Item
                        label="Điểm tích lũy"
                        name="points"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập điểm tích lũy!",
                            },
                        ]}
                    >
                        <InputNumber
                            placeholder="Nhập điểm tích lũy"
                            style={{ width: "100%" }}
                            min={0}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CustomerManagementPage;
