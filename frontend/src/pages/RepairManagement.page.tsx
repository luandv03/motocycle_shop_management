/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import {
    Table,
    Button,
    Input,
    Row,
    Col,
    Space,
    Tooltip,
    Popconfirm,
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
import CreateNewRepair from "../components/CreateNewRepair";
import EditRepair from "../components/EditRepair";
import { getAllRepairs } from "../services/repair.service";

const { Search } = Input;

const RepairManagementPage: React.FC = () => {
    const [searchText, setSearchText] = useState("");
    const [repairs, setRepairs] = useState<any[]>([]); // Dữ liệu sửa chữa
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editingRepair, setEditingRepair] = useState<any>(null);
    const navigate = useNavigate();

    const customers = ["Nguyễn Văn A", "Trần Thị B", "Lê Văn C"];
    const accessories = [
        { name: "Bóng đèn", price: 50000 },
        { name: "Xăm xe", price: 30000 },
        { name: "Phanh xe", price: 100000 },
    ];

    // Gọi API để lấy danh sách sửa chữa
    const fetchRepairs = async () => {
        try {
            setLoading(true);
            const response = await getAllRepairs();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const formattedRepairs = response.repairs.map((repair: any) => ({
                key: repair.repair_id,
                repair_id: repair.repair_id,
                vehicle: repair.motocycle_name,
                customer: repair.customer,
                repairDetails: repair.repair_detail,
                accessoriesUsed: repair.accessories.map(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (accessory: any) => accessory
                ),
                laborCost: `${repair.extra_fee.toLocaleString()} VND`,
                accessoryCost: `${repair.cost.toLocaleString()} VND`,
                totalCost: `${(
                    repair.extra_fee + repair.cost
                ).toLocaleString()} VND`,
                status: repair.status,
                repairTime: repair.repair_time,
            }));
            setRepairs(formattedRepairs);
            setPagination({
                ...pagination,
                total: response.totalRepairs,
            });
        } catch (error: any) {
            message.error("Không thể lấy danh sách sửa chữa!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRepairs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleTableChange = (pagination: any) => {
        setPagination({
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
        });
    };

    const handleDelete = (key: string) => {
        setRepairs(repairs.filter((repair) => repair.key !== key));
        message.success("Xóa sửa chữa thành công!");
    };

    const handleEdit = (record: any) => {
        setEditingRepair(record);
        setIsEditModalVisible(true);
    };

    const columns = [
        {
            title: "Mã sửa chữa",
            dataIndex: "repair_id",
            key: "repair_id",
        },
        {
            title: "Tên xe",
            dataIndex: "vehicle",
            key: "vehicle",
        },
        {
            title: "Thông tin khách hàng",
            dataIndex: "customer",
            key: "customer",
            render: (customer: { customer_id: string; fullname: string }) => (
                <span>{customer.fullname}</span>
            ),
        },
        {
            title: "Tình trạng sửa chữa",
            dataIndex: "repairDetails",
            key: "repairDetails",
        },
        {
            title: "Các phụ kiện sử dụng",
            dataIndex: "accessoriesUsed",
            key: "accessoriesUsed",
            render: (
                accessories: { accessory_id: string; accessory_name: string }[]
            ) => (
                <ul style={{ paddingLeft: "4px" }}>
                    {accessories.map((accessory, index) => (
                        <li key={index}>{accessory.accessory_name}</li>
                    ))}
                </ul>
            ),
        },
        {
            title: "Chi phí phụ tùng",
            dataIndex: "accessoryCost",
            key: "accessoryCost",
        },
        {
            title: "Tiền công",
            dataIndex: "laborCost",
            key: "laborCost",
        },
        {
            title: "Tổng chi phí",
            dataIndex: "totalCost",
            key: "totalCost",
        },
        {
            title: "Trạng thái sửa chữa",
            dataIndex: "status",
            key: "status",
            render: (status: string) => (
                <span
                    style={{
                        color: status === "Completed" ? "green" : "orange",
                        fontWeight: "bold",
                    }}
                >
                    {status}
                </span>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: any) => (
                <Space size="middle">
                    <Tooltip title="Xem">
                        <EyeOutlined
                            style={{ color: "#1890ff", cursor: "pointer" }}
                            onClick={() => navigate(`/repairs/${record.key}`)}
                        />
                    </Tooltip>
                    <Tooltip title="Sửa">
                        <EditOutlined
                            style={{ color: "#52c41a", cursor: "pointer" }}
                            onClick={() => handleEdit(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Popconfirm
                            title="Bạn có chắc chắn muốn xóa sửa chữa này?"
                            onConfirm={() => handleDelete(record.key)}
                            okText="Xóa"
                            cancelText="Hủy"
                        >
                            <DeleteOutlined
                                style={{ color: "#ff4d4f", cursor: "pointer" }}
                            />
                        </Popconfirm>
                    </Tooltip>
                </Space>
            ),
        },
    ];

    const filteredRepairs = repairs.filter(
        (repair) =>
            repair.vehicle.toLowerCase().includes(searchText.toLowerCase()) ||
            repair.customer.fullname
                .toLowerCase()
                .includes(searchText.toLowerCase())
    );

    return (
        <div style={{ padding: 24 }}>
            {/* Thanh tìm kiếm */}
            <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                <Col span={10}>
                    <Search
                        placeholder="Tìm kiếm sửa chữa"
                        prefix={<SearchOutlined />}
                        value={searchText}
                        enterButton
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ width: "100%" }}
                    />
                </Col>
            </Row>

            <Row justify="end" style={{ marginBottom: 16 }}>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsModalVisible(true)}
                >
                    Thêm sửa chữa mới
                </Button>
            </Row>

            {/* Bảng danh sách sửa chữa */}
            <Table
                columns={columns}
                dataSource={filteredRepairs.slice(
                    (pagination.current - 1) * pagination.pageSize,
                    pagination.current * pagination.pageSize
                )}
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: filteredRepairs.length,
                    showSizeChanger: true,
                    pageSizeOptions: ["10", "20", "50"],
                }}
                onChange={handleTableChange}
                loading={loading}
                bordered
            />

            {/* Modal thêm sửa chữa */}
            <CreateNewRepair
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                onSubmit={(values, selectedAccessories, accessoryCost) => {
                    const newRepair = {
                        key: Math.random().toString(),
                        vehicle: values.vehicle,
                        customer: values.customer,
                        repairDetails: values.repairDetails,
                        accessoriesUsed: selectedAccessories.map(
                            (item) => `${item.name} x${item.quantity}`
                        ),
                        laborCost: `${values.laborCost} VND`,
                        accessoryCost: `${accessoryCost} VND`,
                        totalCost: `${values.totalCost} VND`,
                        status: values.status,
                    };

                    setRepairs([...repairs, newRepair]);
                    setIsModalVisible(false);
                }}
            />

            {/* Modal chỉnh sửa sửa chữa */}
            <EditRepair
                visible={isEditModalVisible}
                onClose={() => {
                    setIsEditModalVisible(false);
                    setEditingRepair(null);
                }}
                onSubmit={(updatedRepair) => {
                    console.log("Updated Repair:", updatedRepair);
                    const updatedRepairs = repairs.map((repair) =>
                        repair.key === updatedRepair.key
                            ? updatedRepair
                            : repair
                    );
                    setRepairs(updatedRepairs);
                    setIsEditModalVisible(false);
                    setEditingRepair(null);
                }}
                editingRepair={editingRepair}
                customers={customers}
                accessories={accessories}
            />
        </div>
    );
};

export default RepairManagementPage;
