import React, { useState, useEffect } from "react";
import {
    Table,
    Button,
    Input,
    Select,
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
    getAllBrands,
    filterModelsByBrand,
    createModel,
} from "../services/product.service";
import { useAuth } from "../providers/AuthProvider"; // Import AuthProvider

const { Search } = Input;
const { Option } = Select;

const ModelManagementPage: React.FC = () => {
    const { user } = useAuth(); // Lấy thông tin người dùng từ AuthProvider
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [selectedModel, setSelectedModel] = useState<any>(null);
    const [selectedBrand, setSelectedBrand] = useState<string>("all");
    const [data, setData] = useState<any[]>([]);
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const [brands, setBrands] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const [form] = Form.useForm();

    // Lấy danh sách các brand từ API
    const fetchBrands = async () => {
        try {
            const response = await getAllBrands();
            setBrands([
                { brand_id: "all", brand_name: "Tất cả" },
                ...response.brands,
            ]);
        } catch (error: any) {
            message.error(error.message || "Không thể lấy danh sách hãng!");
        }
    };

    // Lấy danh sách model từ API
    const fetchModels = async () => {
        setLoading(true);
        try {
            const response = await filterModelsByBrand(selectedBrand);
            const models = response.map((model: any) => ({
                key: model.motocycle_model_id,
                model: model.motocycle_model_name,
                brand: model.brand.brand_name,
            }));
            setData(models);
            setFilteredData(models); // Gán dữ liệu ban đầu cho filteredData
        } catch (error: any) {
            message.error(error.message || "Không thể lấy danh sách dòng xe!");
        } finally {
            setLoading(false);
        }
    };

    // Xử lý tìm kiếm
    const handleSearch = (value: string) => {
        const filtered = data.filter(
            (model) =>
                model.model &&
                model.model.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredData(filtered);
    };

    // Xử lý khi lưu dòng xe mới
    const handleSaveModel = async (values: any) => {
        try {
            console.log("values", values);

            const response = await createModel(values.model, values.brand);

            console.log("response", response);
            const newModel = {
                key: response.data.model_cycle_id,
                model: response.data.motocycle_model_name,
                brand:
                    brands.find((b) => b.brand_id === values.brand)
                        ?.brand_name || "",
            };
            setData([...data, newModel]);
            setFilteredData([...filteredData, newModel]);
            message.success("Thêm dòng xe mới thành công!");
            form.resetFields();
            setIsAddModalVisible(false);
        } catch (error: any) {
            message.error(error.message || "Không thể thêm dòng xe mới!");
        }
    };

    // Xử lý khi thay đổi phân trang
    const handleTableChange = (page: number, pageSize: number) => {
        setPagination({ current: page, pageSize });
    };

    // Gọi API khi component được mount
    useEffect(() => {
        fetchBrands();
    }, []);

    // Gọi API khi thay đổi brand hoặc phân trang
    useEffect(() => {
        fetchModels();
    }, [selectedBrand, pagination]);

    // Cột của bảng
    const columns = [
        {
            title: "Tên dòng xe",
            dataIndex: "model",
            key: "model",
        },
        {
            title: "Tên hãng",
            dataIndex: "brand",
            key: "brand",
        },
        {
            title: "Hành động",
            key: "actions",
            render: (_: any, record: any) => (
                <Space size="middle">
                    <EyeOutlined
                        style={{ color: "#1890ff", cursor: "pointer" }}
                        onClick={() => console.log("View:", record)}
                    />
                    {user?.role_id !== "R003" && (
                        <>
                            {" "}
                            <EditOutlined
                                style={{ color: "#52c41a", cursor: "pointer" }}
                                onClick={() => console.log("Edit:", record)}
                            />
                            <DeleteOutlined
                                style={{ color: "#ff4d4f", cursor: "pointer" }}
                                onClick={() => console.log("Delete:", record)}
                            />
                        </>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            {/* Thanh tìm kiếm và bộ lọc */}
            <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                <Col span={10}>
                    <Search
                        placeholder="Tìm kiếm dòng xe"
                        enterButton
                        onSearch={handleSearch}
                    />
                </Col>
                <Col span={4}>
                    <Select
                        placeholder="Chọn hãng xe"
                        style={{ width: "100%" }}
                        value={selectedBrand}
                        onChange={(value) => setSelectedBrand(value)}
                    >
                        {brands.map((brand) => (
                            <Option key={brand.brand_id} value={brand.brand_id}>
                                {brand.brand_name}
                            </Option>
                        ))}
                    </Select>
                </Col>
            </Row>

            {/* Nút thêm dòng xe mới */}
            {user && user.role_id !== "R003" && (
                <Row justify="end" style={{ marginBottom: 16 }}>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setIsAddModalVisible(true)}
                    >
                        Thêm dòng xe mới
                    </Button>
                </Row>
            )}

            {/* Bảng danh sách dòng xe */}
            <Table
                columns={columns}
                dataSource={filteredData.slice(
                    (pagination.current - 1) * pagination.pageSize,
                    pagination.current * pagination.pageSize
                )}
                loading={loading}
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: filteredData.length,
                    showSizeChanger: true,
                    pageSizeOptions: ["10", "20", "50"],
                    onChange: handleTableChange,
                }}
            />

            {/* Modal thêm dòng xe mới */}
            <Modal
                title="Thêm dòng xe mới"
                visible={isAddModalVisible}
                onCancel={() => setIsAddModalVisible(false)}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={handleSaveModel}>
                    <Form.Item
                        label="Tên dòng xe"
                        name="model"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tên dòng xe!",
                            },
                        ]}
                    >
                        <Input placeholder="Nhập tên dòng xe" />
                    </Form.Item>
                    <Form.Item
                        label="Hãng xe"
                        name="brand"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng chọn hãng xe!",
                            },
                        ]}
                    >
                        <Select placeholder="Chọn hãng xe">
                            {brands
                                .filter((brand) => brand?.brand_id !== "all")
                                .map((brand) => (
                                    <Option
                                        key={brand.brand_id}
                                        value={brand.brand_id}
                                    >
                                        {brand.brand_name}
                                    </Option>
                                ))}
                        </Select>
                    </Form.Item>
                    <Row justify="end" gutter={16}>
                        <Col>
                            <Button onClick={() => setIsAddModalVisible(false)}>
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
        </div>
    );
};

export default ModelManagementPage;
