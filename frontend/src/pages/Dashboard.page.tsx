import React, { useState } from "react";
import { Row, Col, Card, Table, Menu, Select, Progress } from "antd";
import {
    BarChartOutlined,
    SettingOutlined,
    UserOutlined,
    DollarOutlined,
} from "@ant-design/icons";
import { Column } from "@ant-design/charts";

const DashboardPage: React.FC = () => {
    const [revenueFilter, setRevenueFilter] = useState("7 ngày gần đây");

    // Dữ liệu cho các card
    const stats = [
        {
            icon: (
                <BarChartOutlined style={{ fontSize: 24, color: "#1890ff" }} />
            ),
            title: "Xe máy",
            count: 120,
            percentage: "+12% từ tháng trước",
        },
        {
            icon: (
                <SettingOutlined style={{ fontSize: 24, color: "#52c41a" }} />
            ),
            title: "Phụ tùng",
            count: 45,
            percentage: "+5% từ tháng trước",
        },
        {
            icon: <UserOutlined style={{ fontSize: 24, color: "#faad14" }} />,
            title: "Khách hàng",
            count: 200,
            percentage: "+8% từ tháng trước",
        },
        {
            icon: <DollarOutlined style={{ fontSize: 24, color: "#ff4d4f" }} />,
            title: "Doanh thu",
            count: "1,200,000,000 VND",
            percentage: "-3% từ tháng trước",
        },
    ];

    // Dữ liệu cho biểu đồ doanh thu
    const revenueData = [
        { date: "Thứ 2", revenue: 8000 },
        { date: "Thứ 3", revenue: 12000 },
        { date: "Thứ 4", revenue: 15000 },
        { date: "Thứ 5", revenue: 20000 },
        { date: "Thứ 6", revenue: 18000 },
        { date: "Thứ 7", revenue: 22000 },
        { date: "Chủ nhật", revenue: 25000 },
    ];

    const revenueConfig = {
        data: revenueData,
        xField: "date",
        yField: "revenue",
        label: {
            position: "middle",
            style: {
                fill: "#FFFFFF",
                opacity: 0.6,
            },
        },
        meta: {
            revenue: {
                alias: "Doanh thu (VNĐ)",
            },
        },
    };

    // Dữ liệu cho Top sản phẩm bán ra
    const topProducts = [
        { name: "Yamaha YZF-R15", percentage: "32%" },
        { name: "Honda Wave Alpha", percentage: "28%" },
        { name: "Engine Oil Filter", percentage: "18%" },
        { name: "Suspension Kit", percentage: "12%" },
    ];

    // Dữ liệu cho Đơn hàng gần đây
    const recentOrders = [
        {
            orderId: "ORD-001",
            customer: "Nguyễn Văn A",
            amount: "1,200,000 VND",
            status: "Completed",
        },
        {
            orderId: "ORD-002",
            customer: "Trần Thị B",
            amount: "800,000 VND",
            status: "Pending",
        },
    ];

    // Dữ liệu cho Danh sách sửa chữa gần đây
    const recentRepairs = [
        {
            id: "REP-001",
            vehicle: "Honda Wave Alpha",
            customer: "Nguyễn Văn A",
            status: "Completed",
        },
        {
            id: "REP-002",
            vehicle: "Yamaha Exciter",
            customer: "Trần Thị B",
            status: "In Progress",
        },
    ];

    const orderColumns = [
        { title: "Order ID", dataIndex: "orderId", key: "orderId" },
        { title: "Customer", dataIndex: "customer", key: "customer" },
        { title: "Amount", dataIndex: "amount", key: "amount" },
        { title: "Status", dataIndex: "status", key: "status" },
    ];

    const repairColumns = [
        { title: "ID", dataIndex: "id", key: "id" },
        { title: "Vehicle", dataIndex: "vehicle", key: "vehicle" },
        { title: "Customer", dataIndex: "customer", key: "customer" },
        { title: "Status", dataIndex: "status", key: "status" },
    ];

    const revenueMenu = (
        <Menu
            onClick={(e) => setRevenueFilter(e.key)}
            items={[
                { key: "7 ngày gần đây", label: "7 ngày gần đây" },
                { key: "30 ngày gần đây", label: "30 ngày gần đây" },
                { key: "90 ngày gần đây", label: "90 ngày gần đây" },
            ]}
        />
    );

    return (
        <div style={{ padding: 24 }}>
            {/* Thống kê */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                {stats.map((stat, index) => (
                    <Col span={6} key={index}>
                        <Card>
                            <Row align="middle">
                                <Col span={6}>{stat.icon}</Col>
                                <Col span={18}>
                                    <h4>{stat.title}</h4>
                                    <p style={{ fontSize: 24, margin: 0 }}>
                                        {stat.count}
                                    </p>
                                    <p style={{ color: "#8c8c8c", margin: 0 }}>
                                        {stat.percentage}
                                    </p>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Doanh thu tổng quan và Top sản phẩm bán ra */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col span={16}>
                    <Card
                        title="Doanh thu tổng quan"
                        extra={
                            <Select
                                value={revenueFilter}
                                onChange={(value) => setRevenueFilter(value)}
                                style={{ width: 150 }}
                            >
                                <Select.Option value="7 ngày gần đây">
                                    7 ngày gần đây
                                </Select.Option>
                                <Select.Option value="30 ngày gần đây">
                                    30 ngày gần đây
                                </Select.Option>
                                <Select.Option value="90 ngày gần đây">
                                    90 ngày gần đây
                                </Select.Option>
                            </Select>
                        }
                    >
                        <Column {...revenueConfig} />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card
                        title="Top sản phẩm bán ra"
                        extra={<a href="/products">Xem chi tiết</a>}
                    >
                        {topProducts.map((product, index) => (
                            <Row key={index} style={{ marginBottom: 16 }}>
                                <Col span={16}>{product.name}</Col>
                                <Col span={8} style={{ textAlign: "right" }}>
                                    {product.percentage}
                                </Col>
                                <Col span={24}>
                                    <div style={{ marginTop: 8 }}>
                                        <Progress
                                            percent={parseInt(
                                                product.percentage
                                            )}
                                            showInfo={false}
                                            strokeColor="#faad14"
                                        />
                                    </div>
                                </Col>
                            </Row>
                        ))}
                    </Card>
                </Col>
            </Row>

            {/* Đơn hàng gần đây và Danh sách sửa chữa gần đây */}
            <Row gutter={[16, 16]}>
                <Col span={12}>
                    <Card
                        title="Đơn hàng gần đây"
                        extra={<a href="/invoices">Xem chi tiết</a>}
                    >
                        <Table
                            dataSource={recentOrders}
                            columns={orderColumns}
                            pagination={false}
                            bordered
                        />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card
                        title="Danh sách sửa chữa gần đây"
                        extra={<a href="/repairs">Xem chi tiết</a>}
                    >
                        <Table
                            dataSource={recentRepairs}
                            columns={repairColumns}
                            pagination={false}
                            bordered
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default DashboardPage;
