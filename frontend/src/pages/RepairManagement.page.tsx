import React, { useState } from "react";
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
    InputNumber,
    Select,
} from "antd";
import {
    SearchOutlined,
    EyeOutlined,
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Option } = Select;
const { Search } = Input;

const RepairManagementPage: React.FC = () => {
    const [searchText, setSearchText] = useState("");
    const [repairs, setRepairs] = useState([
        {
            key: "1",
            vehicle: "Honda Wave Alpha",
            customer: "Nguyễn Văn A",
            repairDetails: "Hỏng đèn, Sửa phanh",
            accessoriesUsed: ["Bóng đèn", "Xăm xe"],
            laborCost: "200,000 VND",
            accessoryCost: "300,000 VND",
            totalCost: "500,000 VND",
            status: "Hoàn thành",
        },
        {
            key: "2",
            vehicle: "Yamaha Exciter",
            customer: "Trần Thị B",
            repairDetails: "Thay nhớt, Sửa lốp",
            accessoriesUsed: ["Phanh xe", "Đèn pha"],
            laborCost: "300,000 VND",
            accessoryCost: "400,000 VND",
            totalCost: "700,000 VND",
            status: "Đang sửa",
        },
    ]);

    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
    });
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [selectedAccessories, setSelectedAccessories] = useState<
        { name: string; price: number; quantity: number }[]
    >([]);
    const [accessoryCost, setAccessoryCost] = useState(0);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false); // Trạng thái hiển thị Modal Edit
    const [editingRepair, setEditingRepair] = useState<any>(null); // Lưu thông tin sửa chữa đang chỉnh sửa
    const navigate = useNavigate();

    const customers = ["Nguyễn Văn A", "Trần Thị B", "Lê Văn C"];
    const accessories = [
        { name: "Bóng đèn", price: 50000 },
        { name: "Xăm xe", price: 30000 },
        { name: "Phanh xe", price: 100000 },
    ];

    const handleTableChange = (pagination: any) => {
        setPagination({
            current: pagination.current,
            pageSize: pagination.pageSize,
        });
    };

    const handleDelete = (key: string) => {
        setRepairs(repairs.filter((repair) => repair.key !== key));
    };

    const handleAccessoryQuantityChange = (index: number, quantity: number) => {
        const updatedAccessories = [...selectedAccessories];
        const accessory = updatedAccessories[index];
        const oldCost = accessory.price * accessory.quantity;
        accessory.quantity = quantity;
        const newCost = accessory.price * quantity;
        setSelectedAccessories(updatedAccessories);
        setAccessoryCost(accessoryCost - oldCost + newCost);
    };

    const handleFormValuesChange = (_: any, allValues: any) => {
        const laborCost = allValues.laborCost || 0;
        const totalCost = accessoryCost + laborCost;
        form.setFieldsValue({ totalCost });
    };

    const handleAddRepair = () => {
        form.validateFields().then((values) => {
            // Chuyển đổi chuỗi `repairDetails` thành mảng các đối tượng

            const newRepair = {
                key: Math.random().toString(),
                vehicle: values.vehicle,
                customer: values.customer,
                repairDetails: values.repairDetails, // Sử dụng mảng đã chuyển đổi
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
            form.resetFields();
            setSelectedAccessories([]);
            setAccessoryCost(0);
        });
    };

    const handleEdit = (record: any) => {
        setEditingRepair(record); // Lưu thông tin sửa chữa đang chỉnh sửa
        setIsEditModalVisible(true);
        form.setFieldsValue({
            ...record,
            laborCost: parseInt(record.laborCost.replace(/[^0-9]/g, "")), // Chuyển đổi tiền công thành số
            accessoryCost: parseInt(
                record.accessoryCost.replace(/[^0-9]/g, "")
            ), // Chuyển đổi chi phí phụ tùng thành số
        });
    };

    const handleSaveEdit = () => {
        form.validateFields().then((values) => {
            const updatedRepair = {
                ...editingRepair,
                ...values,
                laborCost: `${values.laborCost} VND`,
                accessoryCost: `${values.accessoryCost} VND`,
                totalCost: `${values.totalCost} VND`,
            };

            const updatedRepairs = repairs.map((repair) =>
                repair.key === editingRepair.key ? updatedRepair : repair
            );

            setRepairs(updatedRepairs);
            setIsEditModalVisible(false);
            setEditingRepair(null);
            form.resetFields();
        });
    };

    const columns = [
        {
            title: "Tên xe",
            dataIndex: "vehicle",
            key: "vehicle",
        },
        {
            title: "Thông tin khách hàng",
            dataIndex: "customer",
            key: "customer",
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
            render: (accessories: string[]) => (
                <ul style={{ paddingLeft: "4px" }}>
                    {accessories.map((accessory, index) => (
                        <li key={index}>{accessory}</li>
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
                dataSource={repairs.filter(
                    (repair) =>
                        repair.vehicle
                            .toLowerCase()
                            .includes(searchText.toLowerCase()) ||
                        repair.customer
                            .toLowerCase()
                            .includes(searchText.toLowerCase())
                )}
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    showSizeChanger: true,
                    pageSizeOptions: ["10", "20", "50"],
                    total: repairs.length,
                }}
                onChange={handleTableChange}
                bordered
            />

            {/* Modal thêm sửa chữa */}
            <Modal
                title="Thêm sửa chữa mới"
                visible={isModalVisible}
                onOk={handleAddRepair}
                onCancel={() => {
                    setIsModalVisible(false);
                    form.resetFields();
                    setSelectedAccessories([]);
                    setAccessoryCost(0);
                }}
                okText="Lưu"
                cancelText="Hủy"
            >
                <Form
                    form={form}
                    layout="vertical"
                    onValuesChange={handleFormValuesChange}
                >
                    <Form.Item
                        label="Tên xe"
                        name="vehicle"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tên xe!",
                            },
                        ]}
                    >
                        <Input placeholder="Nhập tên xe" />
                    </Form.Item>

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

                    <Form.Item
                        label="Tình trạng sửa chữa"
                        name="repairDetails"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tình trạng sửa chữa!",
                            },
                        ]}
                    >
                        <Input.TextArea placeholder="Nhập tình trạng sửa chữa" />
                    </Form.Item>

                    <Form.List name="accessories">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(
                                    ({ key, name, fieldKey, ...restField }) => (
                                        <Row
                                            key={key}
                                            gutter={16}
                                            align="middle"
                                        >
                                            <Col span={10}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, "accessory"]}
                                                    fieldKey={[
                                                        fieldKey,
                                                        "accessory",
                                                    ]}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "Vui lòng chọn phụ kiện!",
                                                        },
                                                    ]}
                                                >
                                                    <Select
                                                        placeholder="Chọn phụ kiện"
                                                        onChange={(value) => {
                                                            const selectedAccessory =
                                                                accessories.find(
                                                                    (item) =>
                                                                        item.name ===
                                                                        value
                                                                );
                                                            if (
                                                                selectedAccessory
                                                            ) {
                                                                setSelectedAccessories(
                                                                    (prev) => [
                                                                        ...prev,
                                                                        {
                                                                            name: selectedAccessory.name,
                                                                            price: selectedAccessory.price,
                                                                            quantity: 1,
                                                                        },
                                                                    ]
                                                                );
                                                                setAccessoryCost(
                                                                    (prev) =>
                                                                        prev +
                                                                        selectedAccessory.price
                                                                );
                                                            }
                                                        }}
                                                    >
                                                        {accessories
                                                            .filter(
                                                                (item) =>
                                                                    !selectedAccessories.some(
                                                                        (
                                                                            selected
                                                                        ) =>
                                                                            selected.name ===
                                                                            item.name
                                                                    )
                                                            )
                                                            .map((item) => (
                                                                <Option
                                                                    key={
                                                                        item.name
                                                                    }
                                                                    value={
                                                                        item.name
                                                                    }
                                                                >
                                                                    {item.name}{" "}
                                                                    -{" "}
                                                                    {item.price}{" "}
                                                                    VND
                                                                </Option>
                                                            ))}
                                                    </Select>
                                                </Form.Item>
                                            </Col>

                                            <Col span={10}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, "quantity"]}
                                                    fieldKey={[
                                                        fieldKey,
                                                        "quantity",
                                                    ]}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "Vui lòng nhập số lượng!",
                                                        },
                                                    ]}
                                                >
                                                    <InputNumber
                                                        placeholder="Nhập số lượng"
                                                        min={1}
                                                        style={{
                                                            width: "100%",
                                                        }}
                                                        onChange={(value) => {
                                                            const index =
                                                                selectedAccessories.findIndex(
                                                                    (item) =>
                                                                        item.name ===
                                                                        form.getFieldValue(
                                                                            [
                                                                                "accessories",
                                                                                name,
                                                                                "accessory",
                                                                            ]
                                                                        )
                                                                );
                                                            if (index !== -1) {
                                                                handleAccessoryQuantityChange(
                                                                    index,
                                                                    value || 1
                                                                );
                                                            }
                                                        }}
                                                    />
                                                </Form.Item>
                                            </Col>

                                            <Col span={4}>
                                                <Button
                                                    type="text"
                                                    danger
                                                    onClick={() => {
                                                        const accessoryName =
                                                            form.getFieldValue([
                                                                "accessories",
                                                                name,
                                                                "accessory",
                                                            ]);
                                                        const index =
                                                            selectedAccessories.findIndex(
                                                                (item) =>
                                                                    item.name ===
                                                                    accessoryName
                                                            );
                                                        if (index !== -1) {
                                                            const accessory =
                                                                selectedAccessories[
                                                                    index
                                                                ];
                                                            setAccessoryCost(
                                                                (prev) =>
                                                                    prev -
                                                                    accessory.price *
                                                                        accessory.quantity
                                                            );
                                                            setSelectedAccessories(
                                                                (prev) =>
                                                                    prev.filter(
                                                                        (
                                                                            item
                                                                        ) =>
                                                                            item.name !==
                                                                            accessoryName
                                                                    )
                                                            );
                                                        }
                                                        remove(name);
                                                    }}
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
                                        Thêm phụ kiện
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>

                    <Form.Item label="Chi phí phụ tùng">
                        <InputNumber
                            value={accessoryCost}
                            disabled
                            style={{ width: "100%" }}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Tiền công"
                        name="laborCost"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tiền công!",
                            },
                        ]}
                    >
                        <InputNumber
                            placeholder="Nhập tiền công"
                            style={{ width: "100%" }}
                            min={0}
                        />
                    </Form.Item>

                    <Form.Item label="Tổng chi phí" name="totalCost">
                        <InputNumber disabled style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item
                        label="Trạng thái sửa chữa"
                        name="status"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng chọn trạng thái!",
                            },
                        ]}
                    >
                        <Select
                            placeholder="Chọn trạng thái"
                            options={[
                                { value: "Pending", label: "Pending" },
                                { value: "Repairing", label: "Repairing" },
                                { value: "Done", label: "Done" },
                            ]}
                        />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal chỉnh sửa sửa chữa */}
            <Modal
                title="Chỉnh sửa sửa chữa"
                visible={isEditModalVisible}
                onOk={handleSaveEdit}
                onCancel={() => {
                    setIsEditModalVisible(false);
                    setEditingRepair(null);
                    form.resetFields();
                }}
                okText="Lưu"
                cancelText="Hủy"
            >
                <Form
                    form={form}
                    layout="vertical"
                    onValuesChange={handleFormValuesChange}
                >
                    <Form.Item
                        label="Tên xe"
                        name="vehicle"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tên xe!",
                            },
                        ]}
                    >
                        <Input placeholder="Nhập tên xe" />
                    </Form.Item>

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

                    <Form.Item
                        label="Tình trạng sửa chữa"
                        name="repairDetails"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tình trạng sửa chữa!",
                            },
                        ]}
                    >
                        <Input.TextArea placeholder="Nhập tình trạng sửa chữa" />
                    </Form.Item>

                    <Form.List name="accessories">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(
                                    ({ key, name, fieldKey, ...restField }) => (
                                        <Row
                                            key={key}
                                            gutter={16}
                                            align="middle"
                                        >
                                            <Col span={10}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, "accessory"]}
                                                    fieldKey={[
                                                        fieldKey,
                                                        "accessory",
                                                    ]}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "Vui lòng chọn phụ kiện!",
                                                        },
                                                    ]}
                                                >
                                                    <Select
                                                        placeholder="Chọn phụ kiện"
                                                        onChange={(value) => {
                                                            const selectedAccessory =
                                                                accessories.find(
                                                                    (item) =>
                                                                        item.name ===
                                                                        value
                                                                );
                                                            if (
                                                                selectedAccessory
                                                            ) {
                                                                setSelectedAccessories(
                                                                    (prev) => [
                                                                        ...prev,
                                                                        {
                                                                            name: selectedAccessory.name,
                                                                            price: selectedAccessory.price,
                                                                            quantity: 1,
                                                                        },
                                                                    ]
                                                                );
                                                                setAccessoryCost(
                                                                    (prev) =>
                                                                        prev +
                                                                        selectedAccessory.price
                                                                );
                                                            }
                                                        }}
                                                    >
                                                        {accessories
                                                            .filter(
                                                                (item) =>
                                                                    !selectedAccessories.some(
                                                                        (
                                                                            selected
                                                                        ) =>
                                                                            selected.name ===
                                                                            item.name
                                                                    )
                                                            )
                                                            .map((item) => (
                                                                <Option
                                                                    key={
                                                                        item.name
                                                                    }
                                                                    value={
                                                                        item.name
                                                                    }
                                                                >
                                                                    {item.name}{" "}
                                                                    -{" "}
                                                                    {item.price}{" "}
                                                                    VND
                                                                </Option>
                                                            ))}
                                                    </Select>
                                                </Form.Item>
                                            </Col>

                                            <Col span={10}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, "quantity"]}
                                                    fieldKey={[
                                                        fieldKey,
                                                        "quantity",
                                                    ]}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "Vui lòng nhập số lượng!",
                                                        },
                                                    ]}
                                                >
                                                    <InputNumber
                                                        placeholder="Nhập số lượng"
                                                        min={1}
                                                        style={{
                                                            width: "100%",
                                                        }}
                                                        onChange={(value) => {
                                                            const index =
                                                                selectedAccessories.findIndex(
                                                                    (item) =>
                                                                        item.name ===
                                                                        form.getFieldValue(
                                                                            [
                                                                                "accessories",
                                                                                name,
                                                                                "accessory",
                                                                            ]
                                                                        )
                                                                );
                                                            if (index !== -1) {
                                                                handleAccessoryQuantityChange(
                                                                    index,
                                                                    value || 1
                                                                );
                                                            }
                                                        }}
                                                    />
                                                </Form.Item>
                                            </Col>

                                            <Col span={4}>
                                                <Button
                                                    type="text"
                                                    danger
                                                    onClick={() => {
                                                        const accessoryName =
                                                            form.getFieldValue([
                                                                "accessories",
                                                                name,
                                                                "accessory",
                                                            ]);
                                                        const index =
                                                            selectedAccessories.findIndex(
                                                                (item) =>
                                                                    item.name ===
                                                                    accessoryName
                                                            );
                                                        if (index !== -1) {
                                                            const accessory =
                                                                selectedAccessories[
                                                                    index
                                                                ];
                                                            setAccessoryCost(
                                                                (prev) =>
                                                                    prev -
                                                                    accessory.price *
                                                                        accessory.quantity
                                                            );
                                                            setSelectedAccessories(
                                                                (prev) =>
                                                                    prev.filter(
                                                                        (
                                                                            item
                                                                        ) =>
                                                                            item.name !==
                                                                            accessoryName
                                                                    )
                                                            );
                                                        }
                                                        remove(name);
                                                    }}
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
                                        Thêm phụ kiện
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>

                    <Form.Item label="Chi phí phụ tùng">
                        <InputNumber
                            value={accessoryCost}
                            disabled
                            style={{ width: "100%" }}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Tiền công"
                        name="laborCost"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tiền công!",
                            },
                        ]}
                    >
                        <InputNumber
                            placeholder="Nhập tiền công"
                            style={{ width: "100%" }}
                            min={0}
                        />
                    </Form.Item>

                    <Form.Item label="Tổng chi phí" name="totalCost">
                        <InputNumber disabled style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item
                        label="Trạng thái sửa chữa"
                        name="status"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng chọn trạng thái!",
                            },
                        ]}
                    >
                        <Select
                            placeholder="Chọn trạng thái"
                            options={[
                                { value: "Pending", label: "Pending" },
                                { value: "Repairing", label: "Repairing" },
                                { value: "Completed", label: "Completed" },
                            ]}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default RepairManagementPage;
