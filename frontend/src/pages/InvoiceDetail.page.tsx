import React from "react";
import { Link } from "react-router-dom";
import { Card, Table, Descriptions, Typography, Button } from "antd";
import jsPDF from "jspdf";
import { encode } from "base64-arraybuffer";

const { Title } = Typography;

const InvoiceDetailPage: React.FC = () => {
    // Mock dữ liệu hóa đơn
    const invoiceData = {
        invoiceId: "INV001",
        customerName: "Nguyễn Văn A",
        invoiceType: "Sửa chữa", // Loại hóa đơn: Mua xe, Sửa chữa, Mua phụ tùng
        createdDate: "2025-04-03",
        totalAmount: 32000000,
        vat: 10,
        discount: 5,
        vehicles: [
            {
                name: "Honda Wave",
                color: "Red",
                quantity: 1,
                price: 32000000,
                total: 32000000,
            },
        ],
        accessories: [
            {
                name: "Helmet",
                quantity: 2,
                price: 200000,
                total: 400000,
            },
        ],
        repairDetails: {
            repairCode: "RP001",
            description: "Thay dầu và sửa phanh",
            total: 500000,
        },
    };

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
            pdf.text("HÓA ĐƠN SỬA CHỮA XE MÁY", 105, 20, { align: "center" });

            // Thông tin cửa hàng
            pdf.setFontSize(12);
            pdf.text("Tên cửa hàng: Cửa hàng sửa chữa xe máy ABC", 10, 30);
            pdf.text("Mã số thuế: 123456789", 10, 36);
            pdf.text("Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM", 10, 42);
            pdf.text("Điện thoại: 0123456789", 10, 48);

            // Thông tin khách hàng
            pdf.text("Tên khách hàng: Nguyễn Văn A", 10, 60);
            pdf.text("Mã số thuế: 987654321", 10, 66);
            pdf.text("Địa chỉ: 456 Đường XYZ, Quận 2, TP.HCM", 10, 72);

            // Bảng chi tiết hóa đơn
            pdf.setFontSize(10);
            pdf.text("STT", 10, 90);
            pdf.text("Tên hàng hóa, dịch vụ", 30, 90);
            pdf.text("Đơn vị tính", 95, 90);
            pdf.text("Số lượng", 125, 90);
            pdf.text("Đơn giá", 150, 90);
            pdf.text("Thành tiền", 180, 90);

            pdf.line(10, 92, 200, 92); // Đường kẻ ngang

            // Dữ liệu bảng
            const items = [
                {
                    name: "Thay nhớt",
                    unit: "Lít",
                    quantity: 2,
                    price: 150000,
                    total: 300000,
                },
                {
                    name: "Sửa phanh",
                    unit: "Bộ",
                    quantity: 1,
                    price: 500000,
                    total: 500000,
                },
            ];

            let y = 100; // Vị trí dòng đầu tiên
            items.forEach((item, index) => {
                pdf.text((index + 1).toString(), 10, y); // STT
                pdf.text(item.name, 30, y); // Tên hàng hóa
                pdf.text(item.unit, 100, y); // Đơn vị tính
                pdf.text(item.quantity.toString(), 130, y, { align: "right" }); // Số lượng
                pdf.text(
                    new Intl.NumberFormat("vi-VN").format(item.price),
                    150,
                    y
                ); // Đơn giá
                pdf.text(
                    new Intl.NumberFormat("vi-VN").format(item.total),
                    180,
                    y
                ); // Thành tiền
                y += 10; // Tăng vị trí dòng tiếp theo
            });

            // Tổng tiền
            pdf.setFontSize(12);
            pdf.text("Tổng tiền dịch vụ sửa chữa:", 10, y + 10);
            pdf.text(
                new Intl.NumberFormat("vi-VN").format(
                    items.reduce((sum, item) => sum + item.total, 0)
                ),
                180,
                y + 10
            );

            // Ký tên
            pdf.text("Người mua hàng", 40, y + 30, { align: "center" });
            pdf.text("Người bán hàng", 140, y + 30, { align: "center" });

            // Lưu file PDF
            pdf.save(`Invoice_${new Date().getTime()}.pdf`);
        } catch (error) {
            console.error("Lỗi khi tạo PDF:", error);
        }
    };

    // Render bảng chi tiết cho từng loại hóa đơn
    const renderInvoiceDetails = () => {
        if (invoiceData.invoiceType === "Mua xe") {
            return (
                <Table
                    dataSource={invoiceData.vehicles}
                    columns={[
                        {
                            title: "Tên xe",
                            dataIndex: "name",
                            key: "name",
                        },
                        {
                            title: "Màu sắc",
                            dataIndex: "color",
                            key: "color",
                        },
                        {
                            title: "Số lượng",
                            dataIndex: "quantity",
                            key: "quantity",
                        },
                        {
                            title: "Đơn giá (VNĐ)",
                            dataIndex: "price",
                            key: "price",
                            render: (value) =>
                                new Intl.NumberFormat("vi-VN").format(value),
                        },
                        {
                            title: "Thành tiền (VNĐ)",
                            dataIndex: "total",
                            key: "total",
                            render: (value) =>
                                new Intl.NumberFormat("vi-VN").format(value),
                        },
                    ]}
                    pagination={false}
                    rowKey="name"
                />
            );
        } else if (invoiceData.invoiceType === "Mua phụ tùng") {
            return (
                <Table
                    dataSource={invoiceData.accessories}
                    columns={[
                        {
                            title: "Tên phụ tùng",
                            dataIndex: "name",
                            key: "name",
                        },
                        {
                            title: "Số lượng",
                            dataIndex: "quantity",
                            key: "quantity",
                        },
                        {
                            title: "Đơn giá (VNĐ)",
                            dataIndex: "price",
                            key: "price",
                            render: (value) =>
                                new Intl.NumberFormat("vi-VN").format(value),
                        },
                        {
                            title: "Thành tiền (VNĐ)",
                            dataIndex: "total",
                            key: "total",
                            render: (value) =>
                                new Intl.NumberFormat("vi-VN").format(value),
                        },
                    ]}
                    pagination={false}
                    rowKey="name"
                />
            );
        } else if (invoiceData.invoiceType === "Sửa chữa") {
            return (
                <Descriptions bordered column={1}>
                    <Descriptions.Item label="Mã sửa chữa">
                        <Link
                            to={`/repair/${invoiceData.repairDetails.repairCode}`}
                        >
                            {invoiceData.repairDetails.repairCode}
                        </Link>
                    </Descriptions.Item>
                    <Descriptions.Item label="Mô tả">
                        {invoiceData.repairDetails.description}
                    </Descriptions.Item>
                    <Descriptions.Item label="Thành tiền (VNĐ)">
                        {new Intl.NumberFormat("vi-VN").format(
                            invoiceData.repairDetails.total
                        )}
                    </Descriptions.Item>
                </Descriptions>
            );
        }
    };

    return (
        <div style={{ padding: 24 }}>
            <Card>
                <Title level={3}>Chi tiết hóa đơn</Title>
                <Descriptions bordered column={2}>
                    <Descriptions.Item label="Mã hóa đơn">
                        {invoiceData.invoiceId}
                    </Descriptions.Item>
                    <Descriptions.Item label="Tên khách hàng">
                        {invoiceData.customerName}
                    </Descriptions.Item>
                    <Descriptions.Item label="Loại hóa đơn">
                        {invoiceData.invoiceType}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày tạo">
                        {invoiceData.createdDate}
                    </Descriptions.Item>

                    <Descriptions.Item label="Thuế VAT (%)">
                        {invoiceData.vat}%
                    </Descriptions.Item>
                    <Descriptions.Item label="Chiết khấu (%)">
                        {invoiceData.discount}%
                    </Descriptions.Item>
                    <Descriptions.Item label="Tổng tiền (VNĐ)">
                        {new Intl.NumberFormat("vi-VN").format(
                            invoiceData.totalAmount
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
