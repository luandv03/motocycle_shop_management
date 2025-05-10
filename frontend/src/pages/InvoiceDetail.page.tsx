import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
    Card,
    Table,
    Descriptions,
    Typography,
    Button,
    Spin,
    notification,
} from "antd";
import jsPDF from "jspdf";
import { encode } from "base64-arraybuffer";
import { getInvoiceById } from "../services/invoice.service";

const { Title } = Typography;

const InvoiceDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Lấy ID từ URL
    const [invoiceData, setInvoiceData] = useState<any>(null); // Dữ liệu hóa đơn
    const [loading, setLoading] = useState<boolean>(true); // Trạng thái loading

    useEffect(() => {
        const fetchInvoiceDetails = async () => {
            try {
                setLoading(true);
                const data = await getInvoiceById(id!); // Gọi API lấy chi tiết hóa đơn
                setInvoiceData(data);
            } catch (error: any) {
                notification.error({
                    message: "Lỗi",
                    description:
                        error.message || "Không thể tải chi tiết hóa đơn!",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchInvoiceDetails();
    }, [id]);

    const exportToPDF = async () => {
        const pdf = new jsPDF("p", "mm", "a4");

        try {
            // Tải file font từ thư mục public
            const fontData = await fetch("/fonts/Roboto-Regular.ttf")
                .then((res) => res.arrayBuffer())
                .then((buffer) => encode(buffer)); // Sử dụng encode từ base64-arraybuffer

            // Nhúng font vào jsPDF
            pdf.addFileToVFS("Roboto-Regular.ttf", fontData);
            pdf.addFont("Roboto-Regular.ttf", "Roboto", "normal");
            pdf.setFont("Roboto");

            // Tiêu đề hóa đơn
            pdf.setFontSize(16);
            pdf.text("HÓA ĐƠN", 105, 20, { align: "center" });

            // Thông tin hóa đơn
            pdf.setFontSize(12);
            pdf.text(`Mã hóa đơn: ${invoiceData.invoice_id}`, 10, 30);
            pdf.text(`Tên khách hàng: ${invoiceData.customer_name}`, 10, 36);
            pdf.text(
                `Ngày tạo: ${new Date(
                    invoiceData.invoice_date
                ).toLocaleDateString("vi-VN")}`,
                10,
                42
            );
            pdf.text(`Loại hóa đơn: ${invoiceData.invoice_type}`, 10, 48);
            pdf.text(
                `Phương thức thanh toán: ${invoiceData.payment_method}`,
                10,
                54
            );

            // Bảng chi tiết hóa đơn
            pdf.setFontSize(10);
            pdf.text("STT", 10, 70);
            pdf.text("Tên hàng hóa, dịch vụ", 30, 70);
            pdf.text("Số lượng", 120, 70);
            pdf.text("Đơn giá", 150, 70);
            pdf.text("Thành tiền", 180, 70);

            pdf.line(10, 72, 200, 72); // Đường kẻ ngang

            let y = 80; // Vị trí dòng đầu tiên
            if (
                invoiceData.invoice_type === "Mua xe" ||
                invoiceData.invoice_type === "Mua phụ tùng"
            ) {
                invoiceData.details.forEach((item: any, index: number) => {
                    pdf.text((index + 1).toString(), 10, y); // STT
                    pdf.text(
                        item.motocycle_name || item.accessory_name || "N/A",
                        30,
                        y
                    ); // Tên hàng hóa
                    pdf.text(item.quantity.toString(), 120, y); // Số lượng
                    pdf.text(
                        new Intl.NumberFormat("vi-VN").format(item.unit_price),
                        150,
                        y
                    ); // Đơn giá
                    pdf.text(
                        new Intl.NumberFormat("vi-VN").format(
                            item.unit_price * item.quantity
                        ),
                        180,
                        y
                    ); // Thành tiền
                    y += 10; // Tăng vị trí dòng tiếp theo
                });
            } else if (invoiceData.invoice_type === "Sửa chữa") {
                const repairDetails = invoiceData.details;
                pdf.text("Mô tả sửa chữa:", 10, y);
                pdf.text(repairDetails.description, 50, y);
                y += 10;

                repairDetails.accessories.forEach(
                    (item: any, index: number) => {
                        pdf.text((index + 1).toString(), 10, y); // STT
                        pdf.text(item.accessory_name || "N/A", 30, y); // Tên phụ tùng
                        pdf.text(item.quantity.toString(), 120, y); // Số lượng
                        pdf.text(
                            new Intl.NumberFormat("vi-VN").format(
                                item.unit_price
                            ),
                            150,
                            y
                        ); // Đơn giá
                        pdf.text(
                            new Intl.NumberFormat("vi-VN").format(
                                item.unit_price * item.quantity
                            ),
                            180,
                            y
                        ); // Thành tiền
                        y += 10; // Tăng vị trí dòng tiếp theo
                    }
                );
            }

            // Tổng tiền
            pdf.setFontSize(12);
            pdf.text(
                `Tổng tiền: ${new Intl.NumberFormat("vi-VN").format(
                    invoiceData.total_amount
                )} VNĐ`,
                10,
                y + 10
            );

            // Lưu file PDF
            pdf.save(`Invoice_${invoiceData.invoice_id}.pdf`);
        } catch (error) {
            console.error("Lỗi khi tạo PDF:", error);
        }
    };

    const renderInvoiceDetails = () => {
        if (invoiceData.invoice_type === "Mua xe") {
            return (
                <Table
                    dataSource={invoiceData.details}
                    columns={[
                        {
                            title: "Mã xe",
                            dataIndex: "motocycle_id",
                            key: "motocycle_id",
                            render: (value) => (
                                <Link to={`/products/motorcycle/${value}`}>
                                    {value}
                                </Link>
                            ),
                        },
                        {
                            title: "Tên xe",
                            dataIndex: "motocycle_name",
                            key: "motocycle_name",
                        },
                        {
                            title: "Màu sắc",
                            dataIndex: "color_name",
                            key: "color_name",
                        },
                        {
                            title: "Số lượng",
                            dataIndex: "quantity",
                            key: "quantity",
                        },
                        {
                            title: "Đơn giá (VNĐ)",
                            dataIndex: "unit_price",
                            key: "unit_price",
                            render: (value) =>
                                new Intl.NumberFormat("vi-VN").format(value),
                        },
                        {
                            title: "Thành tiền (VNĐ)",
                            key: "total",
                            render: (_, record) =>
                                new Intl.NumberFormat("vi-VN").format(
                                    record.unit_price * record.quantity
                                ),
                        },
                    ]}
                    pagination={false}
                    rowKey="motocycle_id"
                />
            );
        } else if (invoiceData.invoice_type === "Mua phụ tùng") {
            return (
                <Table
                    dataSource={invoiceData.details}
                    columns={[
                        {
                            title: "Mã phụ tùng",
                            dataIndex: "accessory_id",
                            key: "accessory_id",
                        },
                        {
                            title: "Tên phụ tùng",
                            dataIndex: "accessory_name",
                            key: "accessory_name",
                        },
                        {
                            title: "Số lượng",
                            dataIndex: "quantity",
                            key: "quantity",
                        },
                        {
                            title: "Đơn giá (VNĐ)",
                            dataIndex: "unit_price",
                            key: "unit_price",
                            render: (value) =>
                                new Intl.NumberFormat("vi-VN").format(value),
                        },
                        {
                            title: "Thành tiền (VNĐ)",
                            key: "total",
                            render: (_, record) =>
                                new Intl.NumberFormat("vi-VN").format(
                                    record.unit_price * record.quantity
                                ),
                        },
                    ]}
                    pagination={false}
                    rowKey="accessory_id"
                />
            );
        } else if (invoiceData.invoice_type === "Sửa chữa") {
            return (
                <>
                    <Descriptions bordered column={1}>
                        <Descriptions.Item label="Mã sửa chữa">
                            <Link
                                to={`/repairs/${invoiceData.details.repair_id}`}
                            >
                                {" "}
                                {invoiceData.details.repair_id}
                            </Link>
                        </Descriptions.Item>
                        <Descriptions.Item label="Mô tả">
                            {invoiceData.details.description}
                        </Descriptions.Item>
                        <Descriptions.Item label="Thành tiền (VNĐ)">
                            {new Intl.NumberFormat("vi-VN").format(
                                invoiceData.details.cost
                            )}
                        </Descriptions.Item>
                    </Descriptions>

                    <div style={{ marginTop: 24 }}>
                        <Title level={5}>Danh sách phụ tùng</Title>
                        <Table
                            dataSource={invoiceData.details.accessories}
                            columns={[
                                {
                                    title: "Tên phụ tùng",
                                    dataIndex: "accessory_name",
                                    key: "accessory_name",
                                    render: (value) => value || "N/A", // Hiển thị "N/A" nếu không có tên
                                },
                                {
                                    title: "Số lượng",
                                    dataIndex: "quantity",
                                    key: "quantity",
                                },
                                {
                                    title: "Đơn giá (VNĐ)",
                                    dataIndex: "unit_price",
                                    key: "unit_price",
                                    render: (value) =>
                                        new Intl.NumberFormat("vi-VN").format(
                                            value
                                        ),
                                },
                                {
                                    title: "Thành tiền (VNĐ)",
                                    key: "total",
                                    render: (_, record) =>
                                        new Intl.NumberFormat("vi-VN").format(
                                            record.unit_price * record.quantity
                                        ),
                                },
                            ]}
                            pagination={false}
                            rowKey={(record, index) => index.toString()} // Sử dụng index làm key nếu không có ID
                        />
                    </div>
                </>
            );
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: "center", padding: 50 }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!invoiceData) {
        return null;
    }

    return (
        <div style={{ padding: 24 }}>
            <Card>
                <Title level={3}>Chi tiết hóa đơn</Title>
                <Descriptions bordered column={2}>
                    <Descriptions.Item label="Mã hóa đơn">
                        {invoiceData.invoice_id}
                    </Descriptions.Item>
                    <Descriptions.Item label="Tên khách hàng">
                        {invoiceData.customer_name}
                    </Descriptions.Item>
                    <Descriptions.Item label="Loại hóa đơn">
                        {invoiceData.invoice_type}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày tạo">
                        {new Date(invoiceData.invoice_date).toLocaleDateString(
                            "vi-VN"
                        )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Thuế VAT (%)">
                        {invoiceData.vat}%
                    </Descriptions.Item>
                    <Descriptions.Item label="Chiết khấu (%)">
                        {new Intl.NumberFormat("vi-VN").format(
                            invoiceData.discount
                        )}
                        %
                    </Descriptions.Item>
                    <Descriptions.Item label="Tổng tiền (VNĐ)">
                        {new Intl.NumberFormat("vi-VN").format(
                            invoiceData.total_amount
                        )}
                    </Descriptions.Item>
                </Descriptions>

                <div style={{ marginTop: 24 }}>
                    <Title level={4}>Chi tiết</Title>
                    {renderInvoiceDetails()}
                </div>

                <Button
                    type="primary"
                    style={{ marginTop: 24 }}
                    onClick={() => exportToPDF()}
                >
                    Xuất PDF
                </Button>
            </Card>
        </div>
    );
};

export default InvoiceDetailPage;
