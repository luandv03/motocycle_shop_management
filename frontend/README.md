admin 12345678

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
Table,
Button,
Input,
Row,
Col,
Space,
Tooltip,
Popconfirm,
Select,
message,
} from "antd";
import {
SearchOutlined,
EyeOutlined,
EditOutlined,
DeleteOutlined,
PlusOutlined,
} from "@ant-design/icons";
import { getAllInvoices } from "../services/invoice.service";
import CreateInvoice from "../components/CreateInvoice";

const { Option } = Select;
const { Search } = Input;

const InvoiceManagementPage: React.FC = () => {
const navigate = useNavigate();
const [searchText, setSearchText] = useState("");
const [filterInvoiceType, setFilterInvoiceType] = useState<string | null>(
null
);
const [invoices, setInvoices] = useState<any[]>([]);
const [loading, setLoading] = useState(false);

    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
    });

    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        const fetchInvoices = async () => {
            setLoading(true);
            try {
                const data = await getAllInvoices();
                const formattedInvoices = data.map((invoice: any) => ({
                    key: invoice.invoice_id,
                    invoiceId: invoice.invoice_id,
                    customerName: invoice.customer.fullname,
                    invoiceType: invoice.invoice_type,
                    totalAmount: `${invoice.total_amount.toLocaleString()} VND`,
                    createdDate: new Date(invoice.invoice_date)
                        .toISOString()
                        .split("T")[0],
                    status:
                        invoice.status === "pending"
                            ? "Chưa thanh toán"
                            : "Đã thanh toán",
                }));
                setInvoices(formattedInvoices);
            } catch (error: any) {
                message.error("Lỗi khi lấy danh sách hóa đơn!");
            } finally {
                setLoading(false);
            }
        };

        fetchInvoices();
    }, []);

    const handleTableChange = (pagination: any) => {
        setPagination({
            current: pagination.current,
            pageSize: pagination.pageSize,
        });
    };

    const handleDelete = (key: string) => {
        setInvoices(invoices.filter((invoice) => invoice.key !== key));
    };

    const columns = [
        {
            title: "Mã hóa đơn",
            dataIndex: "invoiceId",
            key: "invoiceId",
        },
        {
            title: "Tên khách hàng",
            dataIndex: "customerName",
            key: "customerName",
        },
        {
            title: "Loại hóa đơn",
            dataIndex: "invoiceType",
            key: "invoiceType",
        },
        {
            title: "Tổng tiền",
            dataIndex: "totalAmount",
            key: "totalAmount",
        },
        {
            title: "Ngày tạo",
            dataIndex: "createdDate",
            key: "createdDate",
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status: string) => (
                <span
                    style={{
                        color: status === "Đã thanh toán" ? "green" : "red",
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
                            onClick={() =>
                                navigate(`/invoice/${record.invoiceId}`)
                            }
                        />
                    </Tooltip>
                    <Tooltip title="Sửa">
                        <EditOutlined
                            style={{ color: "#52c41a", cursor: "pointer" }}
                            onClick={() => console.log("Edit", record)}
                        />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Popconfirm
                            title="Bạn có chắc chắn muốn xóa hóa đơn này?"
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

    return (
        <div style={{ padding: 24 }}>
            {/* Thanh tìm kiếm */}
            <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                <Col span={10}>
                    <Search
                        placeholder="Tìm kiếm hóa đơn"
                        prefix={<SearchOutlined />}
                        enterButton
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ width: "100%" }}
                    />
                </Col>
                <Col span={4}>
                    <Select
                        placeholder="Lọc theo loại hóa đơn"
                        allowClear
                        style={{ width: "100%" }}
                        value={filterInvoiceType}
                        onChange={(value) => setFilterInvoiceType(value)}
                    >
                        <Option value={null}>Tất cả</Option>
                        <Option value="Mua xe">Mua xe</Option>
                        <Option value="Sửa chữa">Sửa chữa</Option>
                        <Option value="Mua phụ tùng">Mua phụ tùng</Option>
                    </Select>
                </Col>
            </Row>

            <Row justify="end" style={{ marginBottom: 16 }}>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsModalVisible(true)}
                >
                    Tạo hóa đơn
                </Button>
            </Row>

            {/* Bảng danh sách hóa đơn */}
            <Table
                columns={columns}
                dataSource={invoices.filter((invoice) => {
                    const matchesSearchText =
                        invoice.invoiceId
                            .toLowerCase()
                            .includes(searchText.toLowerCase()) ||
                        invoice.customerName
                            .toLowerCase()
                            .includes(searchText.toLowerCase()) ||
                        invoice.invoiceType
                            .toLowerCase()
                            .includes(searchText.toLowerCase());

                    const matchesInvoiceType =
                        filterInvoiceType === null ||
                        invoice.invoiceType === filterInvoiceType;

                    return matchesSearchText && matchesInvoiceType;
                })}
                loading={loading}
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    showSizeChanger: true,
                    pageSizeOptions: ["10", "20", "50"],
                    total: invoices.length,
                }}
                onChange={handleTableChange}
                bordered
            />

            {/* Modal tạo hóa đơn */}
            <CreateInvoice
                isModalVisible={isModalVisible}
                setIsModalVisible={setIsModalVisible}
                updateInvoiceList={(invoice: any) => {
                    const newInvoice = {
                        key: invoice.invoice_id,
                        invoiceId: invoice.invoice_id,
                        customerName: invoice.customer.fullname,
                        invoiceType: invoice.invoice_type,
                        totalAmount: `${invoice.total_amount.toLocaleString()} VND`,
                        createdDate: new Date(invoice.invoice_date)
                            .toISOString()
                            .split("T")[0],
                        status:
                            invoice.status === "pending"
                                ? "Chưa thanh toán"
                                : "Đã thanh toán",
                    };

                    setInvoices((prevInvoices) => [
                        newInvoice,
                        ...prevInvoices,
                    ]);
                    message.success("Tạo hóa đơn thành công!");
                }}
            />
        </div>
    );

};

export default InvoiceManagementPage;
