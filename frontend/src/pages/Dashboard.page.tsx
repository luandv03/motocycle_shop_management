import React, { useState, useEffect } from "react";
import { Row, Col, Card, Table, Select, Progress, Spin } from "antd";
import {
    BarChartOutlined,
    SettingOutlined,
    UserOutlined,
    DollarOutlined,
} from "@ant-design/icons";
import { Column } from "@ant-design/charts";
import { getAllMotocycles } from "../services/motocycle.service";
import { getAllInvoices } from "../services/invoice.service";
import { getAllRepairs } from "../services/repair.service";

const DashboardPage: React.FC = () => {
    const [motocycles, setMotocycles] = useState<any[]>([]);
    const [invoices, setInvoices] = useState<any[]>([]);
    const [repairs, setRepairs] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // Fetch data from APIs
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [motocyclesData, invoicesData, repairsData] =
                    await Promise.all([
                        getAllMotocycles(),
                        getAllInvoices(),
                        getAllRepairs(),
                    ]);

                setMotocycles(motocyclesData.motocycles || []);
                setInvoices(invoicesData || []);
                setRepairs(repairsData.repairs || []);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const [revenueFilter, setRevenueFilter] = useState<
        "7 ngày gần đây" | "30 ngày gần đây" | "90 ngày gần đây"
    >("7 ngày gần đây");

    // Fake data cho doanh thu
    const revenueDataByFilter = {
        "7 ngày gần đây": [
            { date: "Thứ 2", revenue: 8000 },
            { date: "Thứ 3", revenue: 12000 },
            { date: "Thứ 4", revenue: 15000 },
            { date: "Thứ 5", revenue: 20000 },
            { date: "Thứ 6", revenue: 18000 },
            { date: "Thứ 7", revenue: 22000 },
            { date: "Chủ nhật", revenue: 25000 },
        ],
        "30 ngày gần đây": [
            { date: "Tuần 1", revenue: 120000 },
            { date: "Tuần 2", revenue: 150000 },
            { date: "Tuần 3", revenue: 180000 },
            { date: "Tuần 4", revenue: 200000 },
        ],
        "90 ngày gần đây": [
            { date: "Tháng 1", revenue: 500000 },
            { date: "Tháng 2", revenue: 600000 },
            { date: "Tháng 3", revenue: 700000 },
        ],
    };

    // Lấy dữ liệu doanh thu dựa trên bộ lọc
    const revenueData =
        revenueDataByFilter[
            revenueFilter as
                | "7 ngày gần đây"
                | "30 ngày gần đây"
                | "90 ngày gần đây"
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

    // Tính toán top sản phẩm từ dữ liệu xe máy
    const topProducts = motocycles.slice(0, 5).map((motocycle) => {
        return {
            name: motocycle.motocycle_name,
            percentage: Math.floor(Math.random() * 40) + 10 + "%", // Random percentage for demonstration
        };
    });

    // Format dữ liệu đơn hàng gần đây từ API
    const recentOrders = invoices.slice(0, 5).map((invoice) => ({
        orderId: invoice.invoice_id,
        customer: invoice.customer?.fullname || "N/A",
        amount: `${invoice.total_amount?.toLocaleString() || 0} VND`,
        status: invoice.status,
    }));

    // Format dữ liệu sửa chữa gần đây từ API
    const recentRepairs = repairs.slice(0, 5).map((repair) => ({
        id: repair.repair_id,
        vehicle: repair.motocycle_name,
        customer: repair.customer?.fullname || "N/A",
        status: repair.status,
    }));

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

    if (loading) {
        return (
            <div style={{ textAlign: "center", padding: "50px" }}>
                <Spin size="large" tip="Đang tải dữ liệu..." />
            </div>
        );
    }

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
                        extra={<a href="/products/motorcycles">Xem chi tiết</a>}
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
