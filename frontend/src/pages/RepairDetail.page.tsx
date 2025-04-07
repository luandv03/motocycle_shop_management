import React from "react";
import { Card, Row, Col, Typography, Divider, Tag, Button, Table } from "antd";
import { useNavigate, useLocation } from "react-router-dom";

const { Title, Text } = Typography;

const RepairDetailPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Dữ liệu giả để hiển thị nếu không có dữ liệu được truyền từ location.state
    const fakeRepair = {
        vehicle: "Honda Wave Alpha",
        customer: "Nguyễn Văn A",
        repairDetails: [
            { attribute: "Hỏng pha", value: "Thay bóng đèn" },
            { attribute: "Thủng xăm", value: "Thay xăm" },
        ],
        accessoriesUsed: [
            { name: "Bóng đèn", quantity: 1, price: "50,000 VND" },
            { name: "Xăm xe", quantity: 2, price: "30,000 VND" },
        ],
        accessoryCost: "300,000 VND",
        laborCost: "200,000 VND",
        totalCost: "500,000 VND",
        status: "Hoàn thành",
        repairTime: "01/04/2025 14:30", // Thời gian sửa chữa
    };

    const repair = location.state?.repair || fakeRepair; // Sử dụng dữ liệu từ location.state hoặc dữ liệu giả

    // Cấu hình cột cho bảng phụ kiện sử dụng
    const accessoryColumns = [
        {
            title: "Tên phụ kiện",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Số lượng",
            dataIndex: "quantity",
            key: "quantity",
        },
        {
            title: "Giá",
            dataIndex: "price",
            key: "price",
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <Card>
                <Title level={3} style={{ textAlign: "center" }}>
                    Chi tiết sửa chữa
                </Title>
                <Divider />

                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Text strong>Tên xe:</Text>
                        <Text> {repair.vehicle}</Text>
                    </Col>
                    <Col span={12}>
                        <Text strong>Thông tin khách hàng:</Text>
                        <Text> {repair.customer}</Text>
                    </Col>
                </Row>

                <Divider />

                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Text strong>Thời gian sửa chữa:</Text>
                        <Text> {repair.repairTime}</Text>
                    </Col>
                </Row>

                <Divider />

                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Text strong>Tình trạng:</Text>
                        <Text>
                            {" "}
                            {Array.isArray(repair.repairDetails)
                                ? repair.repairDetails
                                      .map(
                                          (detail: {
                                              attribute: string;
                                              value: string;
                                          }) =>
                                              `${detail.attribute}: ${detail.value}`
                                      )
                                      .join(", ")
                                : repair.repairDetails}
                        </Text>
                    </Col>
                </Row>

                <Divider />

                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Text strong>Các phụ kiện sử dụng:</Text>
                        <Table
                            columns={accessoryColumns}
                            dataSource={repair.accessoriesUsed}
                            pagination={false}
                            rowKey="name"
                            style={{ marginTop: 16 }}
                        />
                    </Col>
                </Row>

                <Divider />

                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Text strong>Chi phí phụ tùng:</Text>
                        <Text> {repair.accessoryCost}</Text>
                    </Col>
                    <Col span={12}>
                        <Text strong>Tiền công:</Text>
                        <Text> {repair.laborCost}</Text>
                    </Col>
                </Row>

                <Divider />

                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Text strong>Tổng chi phí:</Text>
                        <Text> {repair.totalCost}</Text>
                    </Col>
                    <Col span={12}>
                        <Text strong>Trạng thái sửa chữa:</Text>
                        <Tag
                            color={
                                repair.status === "Hoàn thành"
                                    ? "green"
                                    : repair.status === "Đang sửa"
                                    ? "orange"
                                    : "red"
                            }
                        >
                            {repair.status}
                        </Tag>
                    </Col>
                </Row>

                <Divider />
            </Card>
        </div>
    );
};

export default RepairDetailPage;
