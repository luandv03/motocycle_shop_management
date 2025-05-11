import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import {
    Button,
    Input,
    Row,
    Col,
    Modal,
    Form,
    Select,
    notification,
    InputNumber,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { getAllCustomers } from "../services/customer.service";
import { getAllMotocycles } from "../services/motocycle.service";
import { getAllAccessories } from "../services/product.service";
import { getAllRepairs } from "../services/repair.service";
import { createInvoice } from "../services/invoice.service";
import axios from "axios";

const { Option } = Select;

const customers = [
    {
        customer_id: "1",
        fullname: "Nguyễn Văn A",
    },
];

const motocycles = [
    {
        motocycle_id: "M001",
        motocycle_name: "Honda Wave",
        motocycle_colors: [
            { motocycle_color_id: "1", color_name: "Red", price: 32000000 },
            { motocycle_color_id: "2", color_name: "Blue", price: 31000000 },
            { motocycle_color_id: "3", color_name: "Black", price: 31000000 },
        ],
    },
    {
        motocycle_id: "M002",
        motocycle_name: "Honda Winner X",
        motocycle_colors: [
            { motocycle_color_id: "1", color_name: "Red", price: 42000000 },
            { motocycle_color_id: "2", color_name: "Blue", price: 41000000 },
            { motocycle_color_id: "3", color_name: "Black", price: 41000000 },
        ],
    },
];

const accessories = [
    { accessory_id: 1, accessorie_name: "Helmet", price: 200000 },
    { accessory_id: 2, accessorie_name: "Gloves", price: 10000 },
    { accessory_id: 3, accessorie_name: "Jacket", price: 500000 },
    { accessory_id: 4, accessorie_name: "Saddlebag", price: 300000 },
    { accessory_id: 5, accessorie_name: "Mirror", price: 150000 },
    { accessory_id: 6, accessorie_name: "Footpeg", price: 250000 },
    { accessory_id: 7, accessorie_name: "Windshield", price: 800000 },
    { accessory_id: 8, accessorie_name: "Handlebar", price: 600000 },
];

const repairs = [
    {
        repair_id: "R001",
        customer: {
            customer_id: "C003",
            fullname: "Nguyễn Đức Phú",
        },
        details: "Thay dầu",
        total: 500000,
    },
    {
        repair_id: "R002",
        customer: {
            customer_id: "C001",
            fullname: "Đinh Văn Luận",
        },
        details: "Thay lốp",
        total: 1000000,
    },
    {
        repair_id: "R003",
        customer: {
            customer_id: "C001",
            fullname: "Đinh Văn Luận",
        },
        details: "Bảo trì định kỳ",
        total: 1500000,
    },
    {
        repair_id: "R004",
        customer: {
            customer_id: "C003",
            fullname: "Nguyễn Đức Phú",
        },
        details: "Sửa phanh",
        total: 700000,
    },
];

const points = [
    {
        point_rule_id: "PR002",
        rule_name: "Quy tắc tính điểm khi sửa chữa xe",
        conversion_value: "30000",
        unit: "VND",
        point_value: 1,
    },
    {
        point_rule_id: "PR003",
        rule_name: "Quy tắc tính điểm khi mua phụ tùng",
        conversion_value: "100000",
        unit: "VND",
        point_value: 10,
    },
    {
        point_rule_id: "PR004",
        rule_name: "Quy tắc tính điểm khi mua xe mới",
        conversion_value: "25000",
        unit: "VNĐ",
        point_value: 1,
    },
];

interface InvoiceManagementPageProps {
    isModalVisible: boolean;
    setIsModalVisible: (visible: boolean) => void;
    updateInvoiceList: (invoice: any) => void;
}

const InvoiceManagementPage: React.FC<InvoiceManagementPageProps> = ({
    isModalVisible,
    setIsModalVisible,
    updateInvoiceList,
}) => {
    const [form] = Form.useForm();
    const [customers, setCustomers] = useState<any[]>([]);
    const [motocycles, setMotocycles] = useState<any[]>([]);
    const [accessories, setAccessories] = useState<any[]>([]);
    const [repairs, setRepairs] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [customerRes, motocyclesRes, accessoriesRes, repairsRes] =
                    await Promise.all([
                        getAllCustomers(),
                        getAllMotocycles(),
                        getAllAccessories(),
                        getAllRepairs(),
                    ]);

                setCustomers(customerRes.customers || []);
                setMotocycles(motocyclesRes.motocycles || []);
                setAccessories(accessoriesRes.accessories || []);
                setRepairs(repairsRes.repairs || []);
            } catch (error: any) {
                notification.error({
                    message: "Lỗi",
                    description: "Không thể tải dữ liệu, vui lòng thử lại!",
                });
            }
        };

        fetchData();
    }, []);

    const handleCreateInvoice = async () => {
        try {
            // Lấy tất cả các giá trị từ form
            const values = await form.validateFields();

            // Loại bỏ các trường không bắt buộc (discount và vat)
            const { discount, vat, ...requiredFields } = values;

            // Kiểm tra nếu bất kỳ trường nào trong requiredFields còn trống
            const isEmptyField = Object.values(requiredFields).some(
                (value) => value === undefined || value === null || value === ""
            );

            if (isEmptyField) {
                notification.error({
                    message: "Lỗi",
                    description:
                        "Vui lòng điền đầy đủ thông tin trước khi tạo hóa đơn!",
                    placement: "topRight",
                });
                return;
            }

            console.log("Creating invoice...");

            // log form data
            console.log("Form Data:", form.getFieldsValue());

            // decode data
            const invoiceType = form.getFieldValue("invoiceType");

            let payload: {
                customer_id: string;
                invoice_type: "Mua xe" | "Sửa chữa" | "Mua phụ tùng";
                items?: {
                    motocycle_color_id?: string;
                    accessory_id?: string;
                    quantity: number;
                    unit_price: number;
                }[];
                repair_id?: string;
                vat: number;
                discount: number;
                total_amount: number;
                payment_method: string;
                status: string;
                invoice_date: string;
                point?: number;
            } = {
                customer_id: "",
                invoice_type: "Mua xe",
                vat: 0,
                discount: 0,
                total_amount: 0,
                payment_method: "Tiền mặt",
                status: "Đã thanh toán",
                invoice_date: new Date().toISOString().split("T")[0],
            };

            if (invoiceType === "Mua xe") {
                payload = {
                    customer_id: form.getFieldValue("customer"),
                    invoice_type: invoiceType,
                    items: form
                        .getFieldValue("motocycles")
                        .map((item: any) => ({
                            motocycle_color_id: item.color,
                            quantity: item.quantity,
                            unit_price: item.price,
                        })),
                    vat: form.getFieldValue("vat") || 0,
                    discount: form.getFieldValue("discount") || 0,
                    total_amount: form.getFieldValue("totalAmount"),
                    payment_method: "Tiền mặt",
                    status:
                        values.paymentMethod === "Tiền mặt"
                            ? "Đã thanh toán"
                            : "Chưa thanh toán",
                    invoice_date: new Date().toISOString().split("T")[0],
                };
            } else if (invoiceType === "Mua phụ tùng") {
                payload = {
                    customer_id: form.getFieldValue("customer"),
                    invoice_type: invoiceType,
                    items: form
                        .getFieldValue("accessories")
                        .map((item: any) => ({
                            accessory_id: item.accessory,
                            quantity: item.quantity,
                            unit_price: item.price,
                        })),
                    vat: form.getFieldValue("vat") || 0,
                    discount: form.getFieldValue("discount") || 0,
                    total_amount: form.getFieldValue("totalAmount"),
                    payment_method: "Tiền mặt",
                    status:
                        values.paymentMethod === "Tiền mặt"
                            ? "Đã thanh toán"
                            : "Chưa thanh toán",
                    invoice_date: new Date().toISOString().split("T")[0],
                };
            } else if (invoiceType === "Sửa chữa") {
                payload = {
                    customer_id: form.getFieldValue("customer"),
                    invoice_type: invoiceType,
                    repair_id: form.getFieldValue("repairCode"),
                    vat: form.getFieldValue("vat") || 0,
                    discount: form.getFieldValue("discount") || 0,
                    total_amount: form.getFieldValue("totalAmount"),
                    payment_method: "Tiền mặt",
                    status:
                        values.paymentMethod === "Tiền mặt"
                            ? "Đã thanh toán"
                            : "Chưa thanh toán",
                    invoice_date: new Date().toISOString().split("T")[0],
                };
            }

            const point = calculatePointValue();

            payload.point = point ? point : 0; // Điểm thưởng (nếu có)

            const res = await createInvoice(payload);
            console.log("Create invoice response:", res.data);

            if (res.statusCode == 201) {
                if (values.paymentMethod === "Chuyển khoản") {
                    const popupWinWidth = 800;
                    const popupWinHeight = 600;
                    const left = (screen.width - popupWinWidth) / 2;
                    const top = (screen.height - popupWinHeight) / 4;
                    const paymentUrl: string = `http://localhost:5000/api/payments/momo/create_payment_url?total_mount=${values.totalAmount}&invoice_id=${res.data.invoice_id}`;
                    const res2 = await axios
                        .get(paymentUrl)
                        .then((res) => {
                            return res.data;
                        })
                        .catch((err) => {
                            console.log(err);
                        });

                    // ...trong handleCreateInvoice:
                    if (res2.statusCode == 200) {
                        const paymentUrl = res2.data;
                        Modal.info({
                            title: "Quét mã QR để thanh toán",
                            content: (
                                <div style={{ textAlign: "center" }}>
                                    <QRCode value={paymentUrl} size={256} />
                                </div>
                            ),
                            width: 350,
                            okButtonProps: { style: { display: "none" } }, // Ẩn nút OK
                            closable: true, // Hiển thị dấu X để đóng
                        });
                    }

                    // const modalWindow = window.open(
                    //     paymentUrl,
                    //     "_blank",
                    //     `resizable=yes, width=${popupWinWidth},height=${popupWinHeight}, top=${top}, left=${left}`
                    // );
                    // if (!modalWindow) {
                    //     notification.error({
                    //         message: "Không thể mở cửa sổ thanh toán",
                    //         description:
                    //             "Vui lòng kiểm tra cài đặt trình duyệt của bạn.",
                    //     });
                    // }
                }

                setIsModalVisible(false);
                form.resetFields();

                const newInvoice = {
                    ...res.data,
                    customer: {
                        customer_id: res.data.customer_id,
                        fullname: customers.find(
                            (customer) =>
                                customer.customer_id === res.data.customer_id
                        )?.fullname,
                    },
                };

                console.log("New invoice:", newInvoice);

                updateInvoiceList(newInvoice); // Cập nhật danh sách hóa đơn

                // Hiển thị thông báo
                notification.success({
                    message: "Tạo hóa đơn thành công",
                    description: "Hóa đơn của bạn đã được tạo thành công.",
                    placement: "topRight",
                });
            } else {
                notification.error({
                    message: "Tạo hóa đơn thất bại",
                    description: res.data.message,
                    placement: "topRight",
                });
            }
        } catch (error) {
            console.error("Error creating invoice:", error);
            notification.error({
                message: "Tạo hóa đơn thất bại",
                description:
                    error instanceof Error
                        ? error.message
                        : "Đã xảy ra lỗi khi tạo hóa đơn.",
                placement: "topRight",
            });
        }
    };

    const calculateTotalAmount = () => {
        const invoiceType = form.getFieldValue("invoiceType");
        let total = 0;

        if (invoiceType === "Mua xe") {
            const motocycles = form.getFieldValue("motocycles") || [];
            total = motocycles.reduce(
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
            const selectedRepair = repairs.find(
                (order) => order.repair_id === repairCode
            );
            total = selectedRepair ? selectedRepair.cost : 0;
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

    const calculatePointValue = () => {
        const totalAmount = form.getFieldValue("totalAmount") || 0;
        const pointRule = points.find(
            (point) => point.point_rule_id === form.getFieldValue("point")
        );

        console.log(pointRule);

        if (pointRule) {
            return Math.floor(
                (totalAmount / Number(pointRule.conversion_value)) *
                    pointRule.point_value
            );
        } else {
            return 0;
        }
    };

    return (
        <>
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
                                        value: customer.customer_id, // Lưu customer_id vào form
                                        label: customer.fullname, // Hiển thị fullname trong Select
                                    }))}
                                    value={form.getFieldValue("customer")} // Hiển thị fullname dựa trên customer_id
                                    onChange={(value) => {
                                        form.setFieldsValue({
                                            customer: value, // Lưu customer_id vào form
                                        });
                                    }}
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
                                    <Form.List name="motocycles">
                                        {(fields, { add, remove }) => (
                                            <>
                                                {fields.map(
                                                    ({
                                                        key,
                                                        name,
                                                        fieldKey,
                                                        ...restField
                                                    }) => (
                                                        <>
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
                                                                            "motocycle",
                                                                        ]}
                                                                        fieldKey={[
                                                                            fieldKey,
                                                                            "motocycle",
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
                                                                                        [`motocycles[${name}].color`]:
                                                                                            undefined,
                                                                                        [`motocycles[${name}].price`]:
                                                                                            undefined,
                                                                                        [`motocycles[${name}].total`]:
                                                                                            undefined,
                                                                                    }
                                                                                )
                                                                            }
                                                                        >
                                                                            {motocycles.map(
                                                                                (
                                                                                    motocycle
                                                                                ) => (
                                                                                    <Option
                                                                                        key={
                                                                                            motocycle.motocycle_id
                                                                                        }
                                                                                        value={
                                                                                            motocycle.motocycle_id
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            motocycle.motocycle_name
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
                                                                                const selectedmotocycle =
                                                                                    motocycles.find(
                                                                                        (
                                                                                            motocycle
                                                                                        ) =>
                                                                                            motocycle.motocycle_id ===
                                                                                            form.getFieldValue(
                                                                                                [
                                                                                                    "motocycles",
                                                                                                    name,
                                                                                                    "motocycle",
                                                                                                ]
                                                                                            ) // Lấy xe đã chọn
                                                                                    );
                                                                                if (
                                                                                    !selectedmotocycle
                                                                                ) {
                                                                                    console.error(
                                                                                        "Không tìm thấy xe đã chọn!"
                                                                                    );
                                                                                    return;
                                                                                }

                                                                                const selectedColor =
                                                                                    selectedmotocycle.motocycle_colors.find(
                                                                                        (
                                                                                            color
                                                                                        ) =>
                                                                                            color.motocycle_color_id ===
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
                                                                                const currentmotocycles =
                                                                                    form.getFieldValue(
                                                                                        "motocycles"
                                                                                    ) ||
                                                                                    [];

                                                                                currentmotocycles[
                                                                                    name
                                                                                ] =
                                                                                    {
                                                                                        ...currentmotocycles[
                                                                                            name
                                                                                        ],
                                                                                        price: selectedColor.price, // Cập nhật Đơn giá
                                                                                        total:
                                                                                            currentmotocycles[
                                                                                                name
                                                                                            ]
                                                                                                ?.quantity >
                                                                                            0
                                                                                                ? selectedColor.price *
                                                                                                  currentmotocycles[
                                                                                                      name
                                                                                                  ]
                                                                                                      .quantity
                                                                                                : undefined, // Reset Thành tiền
                                                                                    };
                                                                                form.setFieldsValue(
                                                                                    {
                                                                                        motocycles:
                                                                                            currentmotocycles,
                                                                                    }
                                                                                );
                                                                            }}
                                                                        >
                                                                            {motocycles
                                                                                .find(
                                                                                    (
                                                                                        motocycle
                                                                                    ) =>
                                                                                        motocycle.motocycle_id ===
                                                                                        form.getFieldValue(
                                                                                            [
                                                                                                "motocycles",
                                                                                                name,
                                                                                                "motocycle",
                                                                                            ]
                                                                                        )
                                                                                )
                                                                                ?.motocycle_colors.map(
                                                                                    (
                                                                                        color
                                                                                    ) => (
                                                                                        <Option
                                                                                            key={
                                                                                                color.motocycle_color_id
                                                                                            }
                                                                                            value={
                                                                                                color.motocycle_color_id
                                                                                            }
                                                                                        >
                                                                                            {
                                                                                                color.color_name
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
                                                                            min={
                                                                                1
                                                                            }
                                                                            style={{
                                                                                width: "100%",
                                                                            }}
                                                                            onChange={() => {
                                                                                const currentmotocycles =
                                                                                    form.getFieldValue(
                                                                                        "motocycles"
                                                                                    ) ||
                                                                                    [];
                                                                                const quantity =
                                                                                    currentmotocycles[
                                                                                        name
                                                                                    ]
                                                                                        ?.quantity ||
                                                                                    0;
                                                                                const price =
                                                                                    currentmotocycles[
                                                                                        name
                                                                                    ]
                                                                                        ?.price ||
                                                                                    0;

                                                                                if (
                                                                                    quantity &&
                                                                                    price
                                                                                ) {
                                                                                    currentmotocycles[
                                                                                        name
                                                                                    ] =
                                                                                        {
                                                                                            ...currentmotocycles[
                                                                                                name
                                                                                            ],
                                                                                            total:
                                                                                                quantity *
                                                                                                price, // Cập nhật Thành tiền
                                                                                        };
                                                                                    form.setFieldsValue(
                                                                                        {
                                                                                            motocycles:
                                                                                                currentmotocycles,
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
                                                        </>
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
                                                                                        accessory.accessory_id ===
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
                                                                                        accessory.accessory_id
                                                                                    }
                                                                                    value={
                                                                                        accessory.accessory_id
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        accessory.accessorie_name
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
                                                    repairs.find(
                                                        (order) =>
                                                            order.repair_id ===
                                                            value
                                                    );

                                                console.log(selectedRepair);
                                                if (selectedRepair) {
                                                    form.setFieldsValue({
                                                        customer:
                                                            selectedRepair
                                                                .customer
                                                                .customer_id,
                                                    });
                                                }
                                                calculateTotalAmount();
                                            }}
                                            options={repairs.map((order) => ({
                                                value: order.repair_id,
                                                label: `${order.repair_id} - (${order.cost})`,
                                            }))}
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

                    <Form.Item label="Tích điểm" name="point">
                        <Select
                            allowClear
                            showSearch
                            placeholder="Chọn quy tắc"
                            filterOption={(input, option) =>
                                (option?.label ?? "")
                                    .toLowerCase()
                                    .includes(input.toLowerCase())
                            }
                            options={points.map((point) => ({
                                value: point.point_rule_id, // Lưu point_rule_id vào form
                                label: `${point.rule_name} - ${point.conversion_value} ${point.unit} = ${point.point_value} điểm`, // Hiển thị thông tin quy tắc
                            }))}
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
                            <Select.Option value="Tiền mặt">
                                Tiền mặt
                            </Select.Option>
                            <Option value="Chuyển khoản">Chuyển khoản</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default InvoiceManagementPage;
