import React, { useState } from "react";
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
    Modal,
    Form,
    Select,
    notification,
    InputNumber,
} from "antd";
import {
    SearchOutlined,
    EyeOutlined,
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import Search from "antd/es/transfer/search";

const { Option } = Select;
const { Search } = Input;

const customers = ["Nguyễn Văn A", "Trần Thị B", "Lê Văn C"];

const vehicles = [
    {
        id: 1,
        name: "Honda Wave",
        colors: [
            { color: "Red", price: 32000000 },
            { color: "Blue", price: 31000000 },
            { color: "Black", price: 31000000 },
        ],
    },
    {
        id: 2,
        name: "Yamaha Exciter",
        colors: [
            { color: "Red", price: 45000000 },
            { color: "Blue", price: 44000000 },
            { color: "Black", price: 44000000 },
        ],
    },
    {
        id: 3,
        name: "Suzuki Raider",
        colors: [
            { color: "Red", price: 42000000 },
            { color: "Blue", price: 41000000 },
            { color: "Black", price: 41000000 },
        ],
    },
];

const accessories = [
    { id: 1, name: "Helmet", price: 200000 },
    { id: 2, name: "Gloves", price: 10000 },
    { id: 3, name: "Jacket", price: 500000 },
    { id: 4, name: "Saddlebag", price: 300000 },
    { id: 5, name: "Mirror", price: 150000 },
    { id: 6, name: "Footpeg", price: 250000 },
    { id: 7, name: "Windshield", price: 800000 },
    { id: 8, name: "Handlebar", price: 600000 },
];

const repairOrders = [
    {
        id: "R001",
        customer: "Nguyễn Văn A",
        details: "Thay dầu",
        total: 500000,
    },
    {
        id: "R002",
        customer: "Trần Thị B",
        details: "Thay lốp",
        total: 1000000,
    },
    {
        id: "R003",
        customer: "Lê Văn C",
        details: "Bảo trì định kỳ",
        total: 1500000,
    },
    {
        id: "R004",
        customer: "Nguyễn Văn A",
        details: "Sửa phanh",
        total: 700000,
    },
];

const InvoiceManagementPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState("");
    const [filterInvoiceType, setFilterInvoiceType] = useState<string | null>(
        null
    );
    const [invoices, setInvoices] = useState([
        {
            key: "1",
            invoiceId: "INV001",
            customerName: "Nguyễn Văn A",
            invoiceType: "Mua xe",
            totalAmount: "50,000,000 VND",
            createdDate: "2025-04-01",
            status: "Đã thanh toán",
        },
        {
            key: "2",
            invoiceId: "INV002",
            customerName: "Trần Thị B",
            invoiceType: "Sửa chữa",
            totalAmount: "1,500,000 VND",
            createdDate: "2025-04-02",
            status: "Chưa thanh toán",
        },
    ]);

    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
    });

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    const handleTableChange = (pagination: any) => {
        setPagination({
            current: pagination.current,
            pageSize: pagination.pageSize,
        });
    };

    const handleDelete = (key: string) => {
        setInvoices(invoices.filter((invoice) => invoice.key !== key));
    };

    const handleCreateInvoice = () => {
        console.log("Creating invoice...");

        // log form data
        console.log("Form Data:", form.getFieldsValue());

        setIsModalVisible(false);
        form.resetFields();

        // Hiển thị thông báo
        notification.success({
            message: "Tạo hóa đơn thành công",
            description: "Hóa đơn của bạn đã được tạo thành công.",
            placement: "topRight",
        });

        // form.validateFields().then((values) => {
        //     console.log("Invoice Data:", values);
        //     setInvoices([
        //         ...invoices,
        //         {
        //             key: Math.random().toString(),
        //             ...values,
        //             totalAmount: `${values.totalAmount} VND`,
        //             createdDate: new Date().toISOString().split("T")[0],
        //             status: "Chưa thanh toán",
        //         },
        //     ]);
        //     setIsModalVisible(false);
        //     form.resetFields();
        // });
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

    const calculateTotalAmount = () => {
        const invoiceType = form.getFieldValue("invoiceType");
        let total = 0;

        if (invoiceType === "Mua xe") {
            const vehicles = form.getFieldValue("vehicles") || [];
            total = vehicles.reduce(
                (sum: number, item: { total?: number }) =>
                    sum + (item.total || 0),
                0
            );
        } else if (invoiceType === "Mua phụ tùng") {
            const accessories = form.getFieldValue("accessories") || [];
            total = accessories.reduce(
                (sum: number, item: { total: number }) =>
                    sum + (item?.total || 0),
                0
            );
        } else if (invoiceType === "Sửa chữa") {
            const repairCode = form.getFieldValue("repairCode");
            const selectedRepair = repairOrders.find(
                (order) => order.id === repairCode
            );
            total = selectedRepair ? selectedRepair.total : 0;
        }

        form.setFieldsValue({ subtotalAmount: total });

        calculateFinalAmount();
    };

    const calculateFinalAmount = () => {
        const subtotalAmount = form.getFieldValue("subtotalAmount") || 0;
        const vat = form.getFieldValue("vat") || 0; // VAT (%)
        const discount = form.getFieldValue("discount") || 0; // Discount (%)

        // Tính toán tổng tiền
        const totalAmount =
            subtotalAmount * (1 + vat / 100) * (1 - discount / 100);

        // Cập nhật giá trị totalAmount vào form
        form.setFieldsValue({ totalAmount });
    };

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
                        <Option value={null}>Tất cả</Option>{" "}
                        {/* Thêm tùy chọn Tất cả */}
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
            <Modal
                title="Tạo hóa đơn"
                visible={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false);
                    form.resetFields();
                }}
                onOk={handleCreateInvoice}
                okText="Tạo hóa đơn"
                cancelText="Hủy"
                width={800}
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        invoiceType: "Mua xe", // Giá trị mặc định cho loại hóa đơn
                    }}
                >
                    {/* Loại hóa đơn */}
                    <Form.Item
                        label="Loại hóa đơn"
                        name="invoiceType"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng chọn loại hóa đơn!",
                            },
                        ]}
                    >
                        <Select
                            placeholder="Chọn loại hóa đơn"
                            onChange={(value) => {
                                if (value === "Sửa chữa") {
                                    form.setFieldsValue({
                                        customer: undefined,
                                    });
                                }

                                // Reset toàn bộ form
                                form.resetFields();

                                // Đặt giá trị mặc định cho loại hóa đơn
                                form.setFieldsValue({ invoiceType: value });
                            }}
                        >
                            <Option value="Mua xe">Mua xe</Option>
                            <Option value="Sửa chữa">Sửa chữa</Option>
                            <Option value="Mua phụ tùng">Mua phụ tùng</Option>
                        </Select>
                    </Form.Item>

                    {/* Thông tin khách hàng */}
                    <Form.Item
                        shouldUpdate={(prevValues, currentValues) =>
                            prevValues.invoiceType !== currentValues.invoiceType
                        }
                    >
                        {({ getFieldValue }) => (
                            <Form.Item
                                label="Thông tin khách hàng"
                                name="customer"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn khách hàng!",
                                    },
                                ]}
                            >
                                <Select
                                    showSearch
                                    placeholder="Chọn khách hàng"
                                    disabled={
                                        getFieldValue("invoiceType") ===
                                        "Sửa chữa"
                                    }
                                    filterOption={(input, option) =>
                                        (option?.label ?? "")
                                            .toLowerCase()
                                            .includes(input.toLowerCase())
                                    }
                                    options={customers.map((customer) => ({
                                        value: customer,
                                        label: customer,
                                    }))}
                                />
                            </Form.Item>
                        )}
                    </Form.Item>

                    {/* Sản phẩm/Dịch vụ */}
                    <Form.Item
                        label="Sản phẩm/Dịch vụ"
                        shouldUpdate={(prevValues, currentValues) =>
                            prevValues.invoiceType !== currentValues.invoiceType
                        }
                        required
                    >
                        {({ getFieldValue }) =>
                            getFieldValue("invoiceType") === "Mua xe" ? (
                                <>
                                    <label
                                        htmlFor=""
                                        style={{
                                            marginBottom: "8px",
                                            display: "block",
                                        }}
                                    >
                                        Danh sách xe
                                    </label>
                                    <Form.List name="vehicles">
                                        {(fields, { add, remove }) => (
                                            <>
                                                {fields.map(
                                                    ({
                                                        key,
                                                        name,
                                                        fieldKey,
                                                        ...restField
                                                    }) => (
                                                        <Row
                                                            key={key}
                                                            gutter={16}
                                                        >
                                                            {/* Lựa chọn xe */}
                                                            <Col span={8}>
                                                                <Form.Item
                                                                    {...restField}
                                                                    name={[
                                                                        name,
                                                                        "vehicle",
                                                                    ]}
                                                                    fieldKey={[
                                                                        fieldKey,
                                                                        "vehicle",
                                                                    ]}
                                                                    rules={[
                                                                        {
                                                                            required:
                                                                                true,
                                                                            message:
                                                                                "Vui lòng chọn xe!",
                                                                        },
                                                                    ]}
                                                                >
                                                                    <Select
                                                                        placeholder="Chọn xe"
                                                                        onChange={(
                                                                            value
                                                                        ) =>
                                                                            form.setFieldsValue(
                                                                                {
                                                                                    [`vehicles[${name}].color`]:
                                                                                        undefined,
                                                                                    [`vehicles[${name}].price`]:
                                                                                        undefined,
                                                                                    [`vehicles[${name}].total`]:
                                                                                        undefined,
                                                                                }
                                                                            )
                                                                        }
                                                                    >
                                                                        {vehicles.map(
                                                                            (
                                                                                vehicle
                                                                            ) => (
                                                                                <Option
                                                                                    key={
                                                                                        vehicle.id
                                                                                    }
                                                                                    value={
                                                                                        vehicle.name
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        vehicle.name
                                                                                    }
                                                                                </Option>
                                                                            )
                                                                        )}
                                                                    </Select>
                                                                </Form.Item>
                                                            </Col>

                                                            {/* Lựa chọn màu sắc */}
                                                            <Col span={4}>
                                                                <Form.Item
                                                                    {...restField}
                                                                    name={[
                                                                        name,
                                                                        "color",
                                                                    ]}
                                                                    fieldKey={[
                                                                        fieldKey,
                                                                        "color",
                                                                    ]}
                                                                    rules={[
                                                                        {
                                                                            required:
                                                                                true,
                                                                            message:
                                                                                "Vui lòng chọn màu sắc!",
                                                                        },
                                                                    ]}
                                                                >
                                                                    <Select
                                                                        placeholder="Chọn màu sắc"
                                                                        onChange={(
                                                                            value
                                                                        ) => {
                                                                            const selectedVehicle =
                                                                                vehicles.find(
                                                                                    (
                                                                                        vehicle
                                                                                    ) =>
                                                                                        vehicle.name ===
                                                                                        form.getFieldValue(
                                                                                            [
                                                                                                "vehicles",
                                                                                                name,
                                                                                                "vehicle",
                                                                                            ]
                                                                                        ) // Lấy xe đã chọn
                                                                                );
                                                                            if (
                                                                                !selectedVehicle
                                                                            ) {
                                                                                console.error(
                                                                                    "Không tìm thấy xe đã chọn!"
                                                                                );
                                                                                return;
                                                                            }

                                                                            const selectedColor =
                                                                                selectedVehicle.colors.find(
                                                                                    (
                                                                                        color
                                                                                    ) =>
                                                                                        color.color ===
                                                                                        value // Tìm màu sắc đã chọn
                                                                                );
                                                                            if (
                                                                                !selectedColor
                                                                            ) {
                                                                                console.error(
                                                                                    "Không tìm thấy màu sắc đã chọn!"
                                                                                );
                                                                                return;
                                                                            }

                                                                            // Cập nhật giá trị Đơn giá (price) vào form
                                                                            const currentVehicles =
                                                                                form.getFieldValue(
                                                                                    "vehicles"
                                                                                ) ||
                                                                                [];

                                                                            currentVehicles[
                                                                                name
                                                                            ] =
                                                                                {
                                                                                    ...currentVehicles[
                                                                                        name
                                                                                    ],
                                                                                    price: selectedColor.price, // Cập nhật Đơn giá
                                                                                    total:
                                                                                        currentVehicles[
                                                                                            name
                                                                                        ]
                                                                                            ?.quantity >
                                                                                        0
                                                                                            ? selectedColor.price *
                                                                                              currentVehicles[
                                                                                                  name
                                                                                              ]
                                                                                                  .quantity
                                                                                            : undefined, // Reset Thành tiền
                                                                                };
                                                                            form.setFieldsValue(
                                                                                {
                                                                                    vehicles:
                                                                                        currentVehicles,
                                                                                }
                                                                            );
                                                                        }}
                                                                    >
                                                                        {vehicles
                                                                            .find(
                                                                                (
                                                                                    vehicle
                                                                                ) =>
                                                                                    vehicle.name ===
                                                                                    form.getFieldValue(
                                                                                        [
                                                                                            "vehicles",
                                                                                            name,
                                                                                            "vehicle",
                                                                                        ]
                                                                                    )
                                                                            )
                                                                            ?.colors.map(
                                                                                (
                                                                                    color
                                                                                ) => (
                                                                                    <Option
                                                                                        key={
                                                                                            color.color
                                                                                        }
                                                                                        value={
                                                                                            color.color
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            color.color
                                                                                        }
                                                                                    </Option>
                                                                                )
                                                                            )}
                                                                    </Select>
                                                                </Form.Item>
                                                            </Col>

                                                            {/* Nhập số lượng */}
                                                            <Col span={2}>
                                                                <Form.Item
                                                                    {...restField}
                                                                    name={[
                                                                        name,
                                                                        "quantity",
                                                                    ]}
                                                                    fieldKey={[
                                                                        fieldKey,
                                                                        "quantity",
                                                                    ]}
                                                                    rules={[
                                                                        {
                                                                            required:
                                                                                true,
                                                                            message:
                                                                                "Vui lòng nhập số lượng!",
                                                                        },
                                                                    ]}
                                                                >
                                                                    <InputNumber
                                                                        placeholder="Số lượng"
                                                                        min={1}
                                                                        style={{
                                                                            width: "100%",
                                                                        }}
                                                                        onChange={() => {
                                                                            const currentVehicles =
                                                                                form.getFieldValue(
                                                                                    "vehicles"
                                                                                ) ||
                                                                                [];
                                                                            const quantity =
                                                                                currentVehicles[
                                                                                    name
                                                                                ]
                                                                                    ?.quantity ||
                                                                                0;
                                                                            const price =
                                                                                currentVehicles[
                                                                                    name
                                                                                ]
                                                                                    ?.price ||
                                                                                0;

                                                                            if (
                                                                                quantity &&
                                                                                price
                                                                            ) {
                                                                                currentVehicles[
                                                                                    name
                                                                                ] =
                                                                                    {
                                                                                        ...currentVehicles[
                                                                                            name
                                                                                        ],
                                                                                        total:
                                                                                            quantity *
                                                                                            price, // Cập nhật Thành tiền
                                                                                    };
                                                                                form.setFieldsValue(
                                                                                    {
                                                                                        vehicles:
                                                                                            currentVehicles,
                                                                                    }
                                                                                );
                                                                            }

                                                                            calculateTotalAmount();
                                                                        }}
                                                                    />
                                                                </Form.Item>
                                                            </Col>

                                                            {/* Đơn giá */}
                                                            <Col span={4}>
                                                                <Form.Item
                                                                    {...restField}
                                                                    name={[
                                                                        name,
                                                                        "price",
                                                                    ]}
                                                                    fieldKey={[
                                                                        fieldKey,
                                                                        "price",
                                                                    ]}
                                                                >
                                                                    <InputNumber
                                                                        placeholder="Đơn giá"
                                                                        style={{
                                                                            width: "100%",
                                                                        }}
                                                                        disabled
                                                                    />
                                                                </Form.Item>
                                                            </Col>

                                                            {/* Thành tiền */}
                                                            <Col span={4}>
                                                                <Form.Item
                                                                    {...restField}
                                                                    name={[
                                                                        name,
                                                                        "total",
                                                                    ]}
                                                                    fieldKey={[
                                                                        fieldKey,
                                                                        "total",
                                                                    ]}
                                                                >
                                                                    <InputNumber
                                                                        placeholder="Thành tiền"
                                                                        style={{
                                                                            width: "100%",
                                                                        }}
                                                                        disabled
                                                                    />
                                                                </Form.Item>
                                                            </Col>

                                                            {/* Nút xóa */}
                                                            <Col span={2}>
                                                                <Button
                                                                    type="text"
                                                                    danger
                                                                    onClick={() =>
                                                                        remove(
                                                                            name
                                                                        )
                                                                    }
                                                                >
                                                                    Xóa
                                                                </Button>
                                                            </Col>
                                                        </Row>
                                                    )
                                                )}
                                                <Form.Item>
                                                    <Button
                                                        type="dashed"
                                                        onClick={() => add()}
                                                        block
                                                        icon={<PlusOutlined />}
                                                    >
                                                        Thêm xe
                                                    </Button>
                                                </Form.Item>
                                            </>
                                        )}
                                    </Form.List>
                                </>
                            ) : getFieldValue("invoiceType") ===
                              "Mua phụ tùng" ? (
                                <>
                                    <label
                                        htmlFor=""
                                        style={{
                                            marginBottom: "8px",
                                            display: "block",
                                        }}
                                    >
                                        Danh sách phụ tùng
                                    </label>
                                    <Form.List name="accessories">
                                        {(fields, { add, remove }) => (
                                            <>
                                                {fields.map(
                                                    ({
                                                        key,
                                                        name,
                                                        fieldKey,
                                                        ...restField
                                                    }) => (
                                                        <Row
                                                            key={key}
                                                            gutter={16}
                                                        >
                                                            {/* Lựa chọn phụ tùng */}
                                                            <Col span={8}>
                                                                <Form.Item
                                                                    {...restField}
                                                                    name={[
                                                                        name,
                                                                        "accessory",
                                                                    ]}
                                                                    fieldKey={[
                                                                        fieldKey,
                                                                        "accessory",
                                                                    ]}
                                                                    rules={[
                                                                        {
                                                                            required:
                                                                                true,
                                                                            message:
                                                                                "Vui lòng chọn phụ tùng!",
                                                                        },
                                                                    ]}
                                                                >
                                                                    <Select
                                                                        placeholder="Chọn phụ tùng"
                                                                        onChange={(
                                                                            value
                                                                        ) => {
                                                                            const selectedAccessory =
                                                                                accessories.find(
                                                                                    (
                                                                                        accessory
                                                                                    ) =>
                                                                                        accessory.name ===
                                                                                        value
                                                                                );
                                                                            if (
                                                                                selectedAccessory
                                                                            ) {
                                                                                const currentAccessories =
                                                                                    form.getFieldValue(
                                                                                        "accessories"
                                                                                    ) ||
                                                                                    [];
                                                                                currentAccessories[
                                                                                    name
                                                                                ] =
                                                                                    {
                                                                                        ...currentAccessories[
                                                                                            name
                                                                                        ],
                                                                                        price: selectedAccessory.price, // Cập nhật Đơn giá
                                                                                        total:
                                                                                            currentAccessories[
                                                                                                name
                                                                                            ]
                                                                                                ?.quantity >
                                                                                            0
                                                                                                ? selectedAccessory.price *
                                                                                                  currentAccessories[
                                                                                                      name
                                                                                                  ]
                                                                                                      .quantity
                                                                                                : undefined, // Reset Thành tiền
                                                                                    };
                                                                                form.setFieldsValue(
                                                                                    {
                                                                                        accessories:
                                                                                            currentAccessories,
                                                                                    }
                                                                                );
                                                                            }
                                                                        }}
                                                                    >
                                                                        {accessories.map(
                                                                            (
                                                                                accessory
                                                                            ) => (
                                                                                <Option
                                                                                    key={
                                                                                        accessory.id
                                                                                    }
                                                                                    value={
                                                                                        accessory.name
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        accessory.name
                                                                                    }
                                                                                </Option>
                                                                            )
                                                                        )}
                                                                    </Select>
                                                                </Form.Item>
                                                            </Col>

                                                            {/* Nhập số lượng */}
                                                            <Col span={4}>
                                                                <Form.Item
                                                                    {...restField}
                                                                    name={[
                                                                        name,
                                                                        "quantity",
                                                                    ]}
                                                                    fieldKey={[
                                                                        fieldKey,
                                                                        "quantity",
                                                                    ]}
                                                                    rules={[
                                                                        {
                                                                            required:
                                                                                true,
                                                                            message:
                                                                                "Vui lòng nhập số lượng!",
                                                                        },
                                                                    ]}
                                                                >
                                                                    <InputNumber
                                                                        placeholder="Số lượng"
                                                                        min={1}
                                                                        style={{
                                                                            width: "100%",
                                                                        }}
                                                                        onChange={() => {
                                                                            const currentAccessories =
                                                                                form.getFieldValue(
                                                                                    "accessories"
                                                                                ) ||
                                                                                [];
                                                                            const quantity =
                                                                                currentAccessories[
                                                                                    name
                                                                                ]
                                                                                    ?.quantity ||
                                                                                0;
                                                                            const price =
                                                                                currentAccessories[
                                                                                    name
                                                                                ]
                                                                                    ?.price ||
                                                                                0;

                                                                            if (
                                                                                quantity &&
                                                                                price
                                                                            ) {
                                                                                currentAccessories[
                                                                                    name
                                                                                ] =
                                                                                    {
                                                                                        ...currentAccessories[
                                                                                            name
                                                                                        ],
                                                                                        total:
                                                                                            quantity *
                                                                                            price, // Cập nhật Thành tiền
                                                                                    };
                                                                                form.setFieldsValue(
                                                                                    {
                                                                                        accessories:
                                                                                            currentAccessories,
                                                                                    }
                                                                                );
                                                                            }

                                                                            calculateTotalAmount();
                                                                        }}
                                                                    />
                                                                </Form.Item>
                                                            </Col>

                                                            {/* Đơn giá */}
                                                            <Col span={4}>
                                                                <Form.Item
                                                                    {...restField}
                                                                    name={[
                                                                        name,
                                                                        "price",
                                                                    ]}
                                                                    fieldKey={[
                                                                        fieldKey,
                                                                        "price",
                                                                    ]}
                                                                >
                                                                    <InputNumber
                                                                        placeholder="Đơn giá"
                                                                        style={{
                                                                            width: "100%",
                                                                        }}
                                                                        disabled
                                                                    />
                                                                </Form.Item>
                                                            </Col>

                                                            {/* Thành tiền */}
                                                            <Col span={4}>
                                                                <Form.Item
                                                                    {...restField}
                                                                    name={[
                                                                        name,
                                                                        "total",
                                                                    ]}
                                                                    fieldKey={[
                                                                        fieldKey,
                                                                        "total",
                                                                    ]}
                                                                >
                                                                    <Input
                                                                        placeholder="Thành tiền"
                                                                        style={{
                                                                            width: "100%",
                                                                        }}
                                                                        disabled
                                                                    />
                                                                </Form.Item>
                                                            </Col>

                                                            {/* Nút xóa */}
                                                            <Col span={2}>
                                                                <Button
                                                                    type="text"
                                                                    danger
                                                                    onClick={() =>
                                                                        remove(
                                                                            name
                                                                        )
                                                                    }
                                                                >
                                                                    Xóa
                                                                </Button>
                                                            </Col>
                                                        </Row>
                                                    )
                                                )}
                                                <Form.Item>
                                                    <Button
                                                        type="dashed"
                                                        onClick={() => add()}
                                                        block
                                                        icon={<PlusOutlined />}
                                                    >
                                                        Thêm phụ tùng
                                                    </Button>
                                                </Form.Item>
                                            </>
                                        )}
                                    </Form.List>
                                </>
                            ) : getFieldValue("invoiceType") === "Sửa chữa" ? (
                                <>
                                    <Form.Item
                                        label="Mã sửa chữa"
                                        name="repairCode"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Vui lòng chọn mã sửa chữa!",
                                            },
                                        ]}
                                    >
                                        <Select
                                            showSearch
                                            placeholder="Chọn mã sửa chữa"
                                            onChange={(value) => {
                                                const selectedRepair =
                                                    repairOrders.find(
                                                        (order) =>
                                                            order.id === value
                                                    );
                                                if (selectedRepair) {
                                                    form.setFieldsValue({
                                                        customer:
                                                            selectedRepair.customer,
                                                    });
                                                }
                                                calculateTotalAmount();
                                            }}
                                            options={repairOrders.map(
                                                (order) => ({
                                                    value: order.id,
                                                    label: `${order.id} - ${order.details} (${order.total})`,
                                                })
                                            )}
                                        />
                                    </Form.Item>
                                </>
                            ) : (
                                <Input placeholder="Nhập sản phẩm hoặc dịch vụ" />
                            )
                        }
                    </Form.Item>

                    {/* Tạm tính */}
                    <Form.Item label="Tạm tính (VNĐ)" name="subtotalAmount">
                        <InputNumber
                            style={{ width: "100%" }}
                            disabled
                            formatter={(value) =>
                                `${new Intl.NumberFormat("vi-VN", {
                                    style: "decimal",
                                    minimumFractionDigits: 0,
                                }).format(Number(value || 0))}`
                            }
                        />
                    </Form.Item>

                    {/* Thuế VAT */}
                    <Form.Item label="Thuế VAT (%)" name="vat">
                        <InputNumber
                            placeholder="Nhập VAT (%)"
                            style={{ width: "100%" }}
                            min={0}
                            max={100}
                            onChange={() => calculateFinalAmount()}
                        />
                    </Form.Item>

                    {/* Chiết khấu */}
                    <Form.Item label="Chiết khấu (%)" name="discount">
                        <InputNumber
                            placeholder="Nhập chiết khấu (%)"
                            style={{ width: "100%" }}
                            min={0}
                            max={100}
                            onChange={() => calculateFinalAmount()}
                        />
                    </Form.Item>

                    {/* Thành tiền */}
                    <Form.Item label="Thành tiền (VNĐ)" name="totalAmount">
                        <InputNumber
                            style={{ width: "100%" }}
                            disabled
                            formatter={(value) =>
                                `${new Intl.NumberFormat("vi-VN", {
                                    style: "decimal",
                                    minimumFractionDigits: 0,
                                }).format(Number(value || 0))}`
                            }
                        />
                    </Form.Item>

                    {/* Phương thức thanh toán */}
                    <Form.Item
                        label="Phương thức thanh toán"
                        name="paymentMethod"
                        rules={[
                            {
                                required: true,
                                message:
                                    "Vui lòng chọn phương thức thanh toán!",
                            },
                        ]}
                    >
                        <Select placeholder="Chọn phương thức thanh toán">
                            <Option value="Tiền mặt">Tiền mặt</Option>
                            <Option value="Chuyển khoản">Chuyển khoản</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal sửa hóa đơn    */}
        </div>
    );
};

export default InvoiceManagementPage;
