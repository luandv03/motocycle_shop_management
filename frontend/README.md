import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
FilterOutlined,
} from "@ant-design/icons";
import {
getAllBrands,
getMotocycleModelsByBrand,
} from "../services/product.service";
import { getAllMotocycles } from "../services/motocycle.service";
import CreateNewMotocycle from "../components/CreateNewMotocycle";

const { Search } = Input;
const { Option } = Select;

const ProductManagementPage: React.FC = () => {
const [brands, setBrands] = useState<any[]>([]); // Danh sách brands
const [models, setModels] = useState<any[]>([]); // Danh sách models
const [data, setData] = useState<any[]>([]); // Dữ liệu danh sách sản phẩm
const [filteredData, setFilteredData] = useState<any[]>([]); // Dữ liệu đã lọc
const [loading, setLoading] = useState(false);
const [filters, setFilters] = useState({
brand: "Tất cả",
model: "Tất cả",
status: "Tất cả",
});
const [isFilterVisible, setIsFilterVisible] = useState(false);
const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
const [isModalVisible, setIsModalVisible] = useState(false);
const [isAddModalVisible, setIsAddModalVisible] = useState(false);
const [selectedProduct, setSelectedProduct] = useState<any>(null);
const navigate = useNavigate();

    // Lấy danh sách brands từ API
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

    // Lấy danh sách models theo brand từ API
    const fetchModels = async (brandId: string) => {
        try {
            const response = await getMotocycleModelsByBrand(brandId);
            setModels([
                { motocycle_model_id: "all", motocycle_model_name: "Tất cả" },
                ...response,
            ]);
        } catch (error: any) {
            message.error(error.message || "Không thể lấy danh sách dòng xe!");
        }
    };

    // Lấy danh sách motocycles từ API
    const fetchMotocycles = async () => {
        setLoading(true);
        try {
            const response = await getAllMotocycles();
            const motocycles = response.motocycles.map((item: any) => ({
                key: item.motocycle_id,
                id: item.motocycle_id,
                name: item.motocycle_name,
                brand: item.brand_name,
                model: item.motocycle_model_name,
                status: item.status,
                stock: item.total_quantity,
            }));
            setData(motocycles);
            setFilteredData(motocycles); // Gán dữ liệu ban đầu cho filteredData
        } catch (error: any) {
            message.error(error.message || "Không thể lấy danh sách sản phẩm!");
        } finally {
            setLoading(false);
        }
    };

    // Xử lý tìm kiếm
    const handleSearch = (value: string) => {
        console.log("Search value:", value);
        const filtered = data.filter((product) => {
            const matchesName = product.name
                .toLowerCase()
                .includes(value.toLowerCase());
            const matchesBrand =
                filters.brand === "Tất cả" || product.brand === filters.brand;
            const matchesModel =
                filters.model === "Tất cả" || product.model === filters.model;
            const matchesStatus =
                filters.status === "Tất cả" ||
                product.status === filters.status;

            return matchesName && matchesBrand && matchesModel && matchesStatus;
        });

        console.log("Filtered data:", filtered);
        setFilteredData(filtered);
    };

    // Xử lý khi áp dụng bộ lọc
    const applyFilters = () => {
        const filtered = data.filter((product) => {
            const matchesBrand =
                filters.brand === "Tất cả" || product.brand === filters.brand;
            const matchesModel =
                filters.model === "Tất cả" || product.model === filters.model;
            const matchesStatus =
                filters.status === "Tất cả" ||
                product.status === filters.status;

            return matchesBrand && matchesModel && matchesStatus;
        });
        setFilteredData(filtered);
    };

    // Gọi API khi component được mount
    useEffect(() => {
        fetchBrands();
        fetchMotocycles();
    }, []);

    // Gọi API lấy models khi brand thay đổi
    useEffect(() => {
        if (filters.brand === "Tất cả") {
            setModels([
                { motocycle_model_id: "all", motocycle_model_name: "Tất cả" },
            ]);
        } else {
            fetchModels(filters.brand);
        }
    }, [filters.brand]);

    // Gọi lại bộ lọc khi áp dụng
    useEffect(() => {
        applyFilters();
    }, [filters]);

    // Xử lý khi thay đổi phân trang
    const handleTableChange = (page: number, pageSize: number) => {
        setPagination({ current: page, pageSize });
    };

    // Cột của bảng
    const columns = [
        {
            title: "Mã sản phẩm",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Tên sản phẩm",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Hãng xe",
            dataIndex: "brand",
            key: "brand",
        },
        {
            title: "Dòng xe",
            dataIndex: "model",
            key: "model",
        },
        {
            title: "Tình trạng",
            dataIndex: "status",
            key: "status",
        },
        {
            title: "Số lượng tồn kho",
            dataIndex: "stock",
            key: "stock",
        },
        {
            title: "Hành động",
            key: "actions",
            render: (_: any, record: any) => (
                <Space size="middle">
                    <EyeOutlined
                        style={{ color: "#1890ff", cursor: "pointer" }}
                        onClick={() =>
                            navigate(`/products/motorcycle/${record.id}`)
                        }
                    />
                    <EditOutlined
                        style={{ color: "#52c41a", cursor: "pointer" }}
                        onClick={() =>
                            navigate(`/products/motorcycles/edit/${record.id}`)
                        }
                    />
                    <DeleteOutlined
                        style={{ color: "#ff4d4f", cursor: "pointer" }}
                        onClick={() => showDeleteModal(record)}
                    />
                </Space>
            ),
        },
    ];

    // Hiển thị modal xác nhận xóa
    const showDeleteModal = (record: any) => {
        setSelectedProduct(record);
        setIsModalVisible(true);
    };

    // Xử lý khi xác nhận xóa
    const handleDelete = () => {
        console.log("Deleted:", selectedProduct);
        setIsModalVisible(false);
        setSelectedProduct(null);
    };

    // Xử lý khi hủy modal
    const handleCancel = () => {
        setIsModalVisible(false);
        setSelectedProduct(null);
    };

    return (
        <div style={{ padding: 24 }}>
            {/* Thanh tìm kiếm và bộ lọc */}
            <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
                <Col span={12}>
                    <Search
                        placeholder="Tìm kiếm sản phẩm"
                        enterButton
                        onSearch={handleSearch}
                    />
                </Col>
                <Col style={{ textAlign: "right" }}>
                    <Button
                        icon={<FilterOutlined />}
                        onClick={() => setIsFilterVisible(true)}
                    >
                        Bộ lọc
                    </Button>
                </Col>
            </Row>

            {/* Modal bộ lọc */}
            <Modal
                title="Bộ lọc sản phẩm"
                visible={isFilterVisible}
                onCancel={() => setIsFilterVisible(false)}
                footer={[
                    <Button
                        key="reset"
                        onClick={() =>
                            setFilters({
                                brand: "Tất cả",
                                model: "Tất cả",
                                status: "Tất cả",
                            })
                        }
                    >
                        Đặt lại
                    </Button>,
                    <Button
                        key="apply"
                        type="primary"
                        onClick={() => setIsFilterVisible(false)}
                    >
                        Áp dụng
                    </Button>,
                ]}
            >
                <Form layout="vertical">
                    {/* Bộ lọc Hãng xe */}
                    <Form.Item label="Hãng xe">
                        <Select
                            placeholder="Chọn hãng xe"
                            value={filters.brand}
                            onChange={(value) =>
                                setFilters({
                                    ...filters,
                                    brand: value,
                                    model: "Tất cả",
                                })
                            }
                        >
                            {brands.map((brand) => (
                                <Option
                                    key={brand.brand_id}
                                    value={brand.brand_name}
                                >
                                    {brand.brand_name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    {/* Bộ lọc Dòng xe */}
                    <Form.Item label="Dòng xe">
                        <Select
                            placeholder="Chọn dòng xe"
                            value={filters.model}
                            onChange={(value) =>
                                setFilters({ ...filters, model: value })
                            }
                        >
                            {models.map((model) => (
                                <Option
                                    key={model.motocycle_model_id}
                                    value={model.motocycle_model_name}
                                >
                                    {model.motocycle_model_name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    {/* Bộ lọc Tình trạng xe */}
                    <Form.Item label="Tình trạng xe">
                        <Select
                            placeholder="Chọn tình trạng"
                            value={filters.status}
                            onChange={(value) =>
                                setFilters({ ...filters, status: value })
                            }
                        >
                            <Option value="Tất cả">Tất cả</Option>
                            <Option value="Xe mới">Xe mới</Option>
                            <Option value="Xe cũ">Xe cũ</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Bảng danh sách sản phẩm */}
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
                    Bạn có chắc chắn muốn xóa sản phẩm{" "}
                    <strong>{selectedProduct?.name}</strong> không?
                </p>
            </Modal>

            {/* Modal thêm sản phẩm */}
            <CreateNewMotocycle
                visible={isAddModalVisible}
                onCancel={() => setIsAddModalVisible(false)}
                onSave={(values) => {
                    console.log("New Product:", values);
                    setIsAddModalVisible(false);
                }}
            />
        </div>
    );

};

export default ProductManagementPage;
