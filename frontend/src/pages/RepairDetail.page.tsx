import React, { useEffect, useState } from "react";
import {
    Card,
    Row,
    Col,
    Typography,
    Divider,
    Tag,
    Table,
    Spin,
    notification,
} from "antd";
import { useParams } from "react-router-dom";
import { getRepairById } from "../services/repair.service";

const { Title, Text } = Typography;

const RepairDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Lấy ID từ URL
    const [repairData, setRepairData] = useState<any>(null); // Dữ liệu sửa chữa
    const [loading, setLoading] = useState<boolean>(true); // Trạng thái loading

    useEffect(() => {
        const fetchRepairDetails = async () => {
            try {
                setLoading(true);
                const data = await getRepairById(id!); // Gọi API lấy chi tiết sửa chữa
                setRepairData(data);
            } catch (error: any) {
                notification.error({
                    message: "Lỗi",
                    description:
                        error.message || "Không thể tải chi tiết sửa chữa!",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchRepairDetails();
    }, [id]);

    // Cấu hình cột cho bảng phụ kiện sử dụng
    const accessoryColumns = [
        {
            title: "Tên phụ kiện",
            dataIndex: "accessory_name",
            key: "accessory_name",
            render: (value: string) => value || "N/A", // Hiển thị "N/A" nếu không có tên
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
            render: (value: number) =>
                new Intl.NumberFormat("vi-VN").format(value),
        },
        {
            title: "Thành tiền (VNĐ)",
            key: "total",
            render: (_: any, record: any) =>
                new Intl.NumberFormat("vi-VN").format(
                    record.unit_price * record.quantity
                ),
        },
    ];

    if (loading) {
        return (
            <div style={{ textAlign: "center", padding: 50 }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!repairData) {
        return null;
    }

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
                        <Text> {repairData.motocycle_name}</Text>
                    </Col>
                    <Col span={12}>
                        <Text strong>Thông tin khách hàng: </Text>
                        <Text>
                            {repairData.customer.fullname} -{" "}
                            {repairData.customer.phonenumber}
                        </Text>
                    </Col>
                </Row>

                <Divider />

                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Text strong>Địa chỉ khách hàng:</Text>
                        <Text>
                            {"  "} {repairData.customer.address}
                        </Text>
                    </Col>
                    <Col span={12}>
                        <Text strong>Thời gian sửa chữa: </Text>
                        <Text>
                            {new Date(repairData.repair_time).toLocaleString(
                                "vi-VN"
                            )}
                        </Text>
                    </Col>
                </Row>

                <Divider />

                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Text strong>Tình trạng sửa chữa: </Text>
                        <Text> {repairData.repair_detail}</Text>
                    </Col>
                </Row>

                <Divider />

                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Text strong>Các phụ kiện sử dụng:</Text>
                        <Table
                            columns={accessoryColumns}
                            dataSource={repairData.accessories}
                            pagination={false}
                            rowKey={(record, index) => index.toString()} // Sử dụng index làm key
                            style={{ marginTop: 16 }}
                        />
                    </Col>
                </Row>

                <Divider />

                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Text strong>Chi phí phụ tùng:</Text>
                        <Text>
                            {" "}
                            {new Intl.NumberFormat("vi-VN").format(
                                repairData.accessories.reduce(
                                    (sum: number, item: any) =>
                                        sum + item.unit_price * item.quantity,
                                    0
                                )
                            )}{" "}
                            VNĐ
                        </Text>
                    </Col>
                    <Col span={12}>
                        <Text strong>Tiền công:</Text>
                        <Text>
                            {" "}
                            {new Intl.NumberFormat("vi-VN").format(
                                repairData.extra_fee
                            )}{" "}
                            VNĐ
                        </Text>
                    </Col>
                </Row>

                <Divider />

                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Text strong>Tổng chi phí:</Text>
                        <Text>
                            {" "}
                            {new Intl.NumberFormat("vi-VN").format(
                                repairData.cost
                            )}{" "}
                            VNĐ
                        </Text>
                    </Col>
                    <Col span={12}>
                        <Text strong>Trạng thái sửa chữa: </Text>
                        <Tag
                            color={
                                repairData.status === "Hoàn thành"
                                    ? "green"
                                    : repairData.status === "Đang sửa"
                                    ? "orange"
                                    : "red"
                            }
                        >
                            {repairData.status}
                        </Tag>
                    </Col>
                </Row>

                <Divider />
            </Card>
        </div>
    );
};

export default RepairDetailPage;
