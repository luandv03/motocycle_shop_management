import React from "react";
import { Table, Card, Row, Col, Space, Tooltip } from "antd";
import { EyeOutlined } from "@ant-design/icons";

const CustomerDetailPage: React.FC = () => {
    const customerInfo = {
        id: "CUST001",
        name: "Nguyễn Văn A",
        phone: "0987654321",
        points: 120,
    };

    const purchaseHistory = [
        {
            key: "1",
            bikeName: "Honda Wave Alpha",
            color: "Đỏ",
            quantity: 1,
            status: "Xe mới",
            price: "17,800,000 VND",
            purchaseTime: "2023-05-01",
        },
        {
            key: "2",
            bikeName: "Yamaha Exciter",
            color: "Xanh",
            quantity: 1,
            status: "Xe cũ",
            price: "45,000,000 VND",
            purchaseTime: "2023-06-15",
        },
    ];

    const repairHistory = [
        {
            key: "1",
            bikeName: "Honda Wave Alpha",
            issues: ["Thay lốp", "Sửa phanh"],
            totalCost: "1,200,000 VND",
            repairTime: "2023-07-10",
        },
        {
            key: "2",
            bikeName: "Yamaha Exciter",
            issues: ["Thay nhớt", "Sửa đèn"],
            totalCost: "800,000 VND",
            repairTime: "2023-08-20",
        },
    ];

    const purchaseColumns = [
        {
            title: "Tên xe máy",
            dataIndex: "bikeName",
            key: "bikeName",
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
            title: "Tình trạng xe",
            dataIndex: "status",
            key: "status",
        },
        {
            title: "Giá xe",
            dataIndex: "price",
            key: "price",
        },
        {
            title: "Thời gian mua",
            dataIndex: "purchaseTime",
            key: "purchaseTime",
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: any) => (
                <Space size="middle">
                    <Tooltip title="Xem chi tiết">
                        <EyeOutlined
                            style={{
                                color: "#1890ff",
                                cursor: "pointer",
                                transition: "transform 0.2s",
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.transform = "scale(1.2)")
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.transform = "scale(1)")
                            }
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    const repairColumns = [
        {
            title: "Tên xe",
            dataIndex: "bikeName",
            key: "bikeName",
        },
        {
            title: "Chi tiết sửa chữa",
            dataIndex: "issues",
            key: "issues",
            render: (issues: string[]) => (
                <ul>
                    {issues.map((issue, index) => (
                        <li key={index}>{issue}</li>
                    ))}
                </ul>
            ),
        },
        {
            title: "Tổng chi phí",
            dataIndex: "totalCost",
            key: "totalCost",
        },
        {
            title: "Thời gian sửa chữa",
            dataIndex: "repairTime",
            key: "repairTime",
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: any) => (
                <Space size="middle">
                    <Tooltip title="Xem chi tiết">
                        <EyeOutlined
                            style={{
                                color: "#1890ff",
                                cursor: "pointer",
                                transition: "transform 0.2s",
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.transform = "scale(1.2)")
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.transform = "scale(1)")
                            }
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            {/* Thông tin khách hàng */}
            <Card title="Thông tin khách hàng" style={{ marginBottom: 24 }}>
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <p>
                            <b>Mã khách hàng:</b> {customerInfo.id}
                        </p>
                        <p>
                            <b>Tên khách hàng:</b> {customerInfo.name}
                        </p>
                    </Col>
                    <Col span={12}>
                        <p>
                            <b>Số điện thoại:</b> {customerInfo.phone}
                        </p>
                        <p>
                            <b>Điểm tích lũy:</b> {customerInfo.points}
                        </p>
                    </Col>
                </Row>
            </Card>

            {/* Lịch sử mua hàng */}
            <Card title="Lịch sử mua hàng" style={{ marginBottom: 24 }}>
                <Table
                    dataSource={purchaseHistory}
                    columns={purchaseColumns}
                    pagination={{ pageSize: 5 }}
                    bordered
                />
            </Card>

            {/* Lịch sử sửa chữa */}
            <Card title="Lịch sử sửa chữa">
                <Table
                    dataSource={repairHistory}
                    columns={repairColumns}
                    pagination={{ pageSize: 5 }}
                    bordered
                />
            </Card>
        </div>
    );
};

export default CustomerDetailPage;
