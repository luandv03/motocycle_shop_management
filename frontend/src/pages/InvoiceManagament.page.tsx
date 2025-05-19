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
    Card,
    Statistic,
    DatePicker,
} from "antd";
import {
    SearchOutlined,
    EyeOutlined,
    DeleteOutlined,
    PlusOutlined,
    DollarOutlined,
} from "@ant-design/icons";
import { getAllInvoices } from "../services/invoice.service";
import CreateInvoice from "../components/CreateInvoice";
import moment from "moment";

const { Option } = Select;
const { Search } = Input;
const { RangePicker } = DatePicker;

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

    // Thống kê doanh thu
    const [totalRevenue, setTotalRevenue] = useState<number>(0);
    const [filteredRevenue, setFilteredRevenue] = useState<number>(0);
    const [selectedRange, setSelectedRange] = useState<
        [moment.Moment, moment.Moment] | null
    >(null);

    useEffect(() => {
        const fetchInvoices = async () => {
            setLoading(true);
            try {
                const data = await getAllInvoices();
                const formattedInvoices = data.map((invoice: any) => ({
                    key: invoice.invoice_id,
                    invoiceId: invoice.invoice_id,
                    customerName: invoice.customer?.fullname || "N/A",
                    invoiceType: invoice.invoice_type || "N/A",
                    totalAmount: invoice.total_amount || 0,
                    createdDate: invoice.invoice_date
                        ? moment(invoice.invoice_date)
                        : null,
                    status: invoice.status,
                }));

                setInvoices(formattedInvoices);

                // Tính tổng doanh thu
                const totalRevenue = formattedInvoices
                    .filter(
                        (invoice: any) => invoice.status === "Đã thanh toán"
                    )
                    .reduce(
                        (sum: number, invoice: any) =>
                            sum + invoice.totalAmount,
                        0
                    );

                console.log(totalRevenue);
                setTotalRevenue(totalRevenue);
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

    const handleDateRangeChange = (
        dates: [any, any] | null // Không dùng moment nữa
    ) => {
        setSelectedRange(dates);

        if (dates) {
            const [start, end] = dates;
            // Đảm bảo start và end là Date object
            const startDate = new Date(start);
            // endDate là cuối ngày
            const endDate = new Date(end);
            endDate.setHours(23, 59, 59, 999);

            const filteredInvoices = invoices.filter((invoice: any) => {
                if (invoice.status !== "Đã thanh toán" || !invoice.createdDate)
                    return false;
                const invoiceDate = new Date(invoice.createdDate);
                return invoiceDate >= startDate && invoiceDate <= endDate;
            });
            const filteredRevenue = filteredInvoices.reduce(
                (sum: number, invoice: any) => {
                    // Nếu totalAmount là string (có "VND"), lấy số
                    if (typeof invoice.totalAmount === "string") {
                        return (
                            sum +
                            parseInt(invoice.totalAmount.replace(/\D/g, ""), 10)
                        );
                    }
                    return sum + invoice.totalAmount;
                },
                0
            );
            setFilteredRevenue(filteredRevenue);
        } else {
            const total = invoices
                .filter((invoice: any) => invoice.status === "Đã thanh toán")
                .reduce((sum: number, invoice: any) => {
                    if (typeof invoice.totalAmount === "string") {
                        return (
                            sum +
                            parseInt(invoice.totalAmount.replace(/\D/g, ""), 10)
                        );
                    }
                    return sum + invoice.totalAmount;
                }, 0);
            setFilteredRevenue(total);
        }
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
            title: "Tổng tiền (VNĐ)",
            dataIndex: "totalAmount",
            key: "totalAmount",
            render: (value: number) =>
                new Intl.NumberFormat("vi-VN").format(value),
        },
        {
            title: "Ngày tạo",
            dataIndex: "createdDate",
            key: "createdDate",
            render: (date: string | Date | null) =>
                date ? new Date(date).toLocaleDateString("vi-VN") : "N/A",
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
            {/* Thống kê doanh thu */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Tổng doanh thu (VNĐ)"
                            value={totalRevenue}
                            prefix={<DollarOutlined />}
                            valueStyle={{ color: "#3f8600" }}
                            formatter={(value) =>
                                new Intl.NumberFormat("vi-VN").format(value)
                            }
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Doanh thu theo khoảng thời gian (VNĐ)"
                            value={filteredRevenue}
                            prefix={<DollarOutlined />}
                            valueStyle={{ color: "#1890ff" }}
                            formatter={(value) =>
                                new Intl.NumberFormat("vi-VN").format(value)
                            }
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <RangePicker
                        style={{ width: "100%" }}
                        onChange={handleDateRangeChange}
                        format="DD/MM/YYYY"
                    />
                </Col>
            </Row>

            {/* Thanh tìm kiếm và bộ lọc */}
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
                dataSource={invoices
                    .filter((invoice) => {
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

                        // Lọc theo ngày nếu có chọn
                        const matchesDateRange =
                            !selectedRange ||
                            (invoice.createdDate &&
                                (() => {
                                    const invoiceDate = new Date(
                                        invoice.createdDate
                                    );
                                    const startDate = new Date(
                                        selectedRange[0]
                                    );
                                    const endDate = new Date(selectedRange[1]);
                                    endDate.setHours(23, 59, 59, 999);
                                    return (
                                        invoiceDate >= startDate &&
                                        invoiceDate <= endDate
                                    );
                                })());

                        return (
                            matchesSearchText &&
                            matchesInvoiceType &&
                            matchesDateRange
                        );
                    })
                    .slice(
                        (pagination.current - 1) * pagination.pageSize,
                        pagination.current * pagination.pageSize
                    )}
                loading={loading}
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    showSizeChanger: true,
                    pageSizeOptions: ["10", "20", "50"],
                    // Tổng số bản ghi sau khi lọc
                    total: invoices.filter((invoice) => {
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

                        const matchesDateRange =
                            !selectedRange ||
                            (invoice.createdDate &&
                                (() => {
                                    const invoiceDate = new Date(
                                        invoice.createdDate
                                    );
                                    const startDate = new Date(
                                        selectedRange[0]
                                    );
                                    const endDate = new Date(selectedRange[1]);
                                    endDate.setHours(23, 59, 59, 999);
                                    return (
                                        invoiceDate >= startDate &&
                                        invoiceDate <= endDate
                                    );
                                })());

                        return (
                            matchesSearchText &&
                            matchesInvoiceType &&
                            matchesDateRange
                        );
                    }).length,
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
                        totalAmount: invoice.total_amount,
                        createdDate: new Date(invoice.invoice_date)
                            .toISOString()
                            .split("T")[0],
                        status: invoice.status,
                    };

                    setInvoices((prevInvoices) => [
                        newInvoice,
                        ...prevInvoices,
                    ]);
                    message.success("Tạo hóa đơn thành công!");
                }}
                handleChangeStatusInvoice={(invoiceId: string) => {
                    console.log("Cập nhật trạng thái hóa đơn", invoiceId);
                    setInvoices((prevInvoices) =>
                        prevInvoices.map((invoice) =>
                            invoice.invoiceId == invoiceId
                                ? { ...invoice, status: "Đã thanh toán" }
                                : invoice
                        )
                    );
                    message.success("Cập nhật trạng thái hóa đơn thành công!");
                }}
            />
        </div>
    );
};

export default InvoiceManagementPage;
