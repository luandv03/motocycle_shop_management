import React, { useState } from "react";
import {
    DesktopOutlined,
    MoneyCollectOutlined,
    TeamOutlined,
    UserOutlined,
    LogoutOutlined,
    DownOutlined,
    PieChartOutlined,
    ToolOutlined,
    PlusSquareOutlined,
    ArrowLeftOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import {
    Breadcrumb,
    Layout,
    Menu,
    theme,
    Avatar,
    Dropdown,
    Space,
    Button,
} from "antd";
import { Outlet, useNavigate, useLocation, matchPath } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider"; // Import useAuth từ AuthProvider

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = {
    key: React.Key;
    icon?: React.ReactNode;
    label: React.ReactNode;
    path?: string; // Thêm trường path
    children?: MenuItem[];
};

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    path?: string, // Thêm trường path
    children?: MenuItem[]
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
        path, // Gán path vào item
    } as MenuItem;
}

const items: MenuItem[] = [
    getItem("Dashboard", "1", <PieChartOutlined />, "/dashboard"),
    getItem("Quản lý sản phẩm", "2", <DesktopOutlined />, undefined, [
        getItem("Danh mục hãng xe", "3", undefined, "/products/brands"),
        getItem("Danh mục dòng xe", "4", undefined, "/products/models"),
        getItem("Quản lý xe máy", "5", undefined, "/products/motorcycles"),
        getItem("Quản lý phụ tùng", "6", undefined, "/products/parts"),
    ]),
    getItem("Quản lý tài khoản", "7", <UserOutlined />, "/accounts"),
    getItem("Quản lý khách hàng", "8", <TeamOutlined />, "/customers"),
    getItem("Quản lý sửa chữa", "9", <ToolOutlined />, "/repairs"),
    getItem("Quản lý hóa đơn", "10", <MoneyCollectOutlined />, "/invoices"),
    getItem("Quản lý tích điểm", "11", <PlusSquareOutlined />, "/points"),
];

const breadcrumbRoutes = [
    { path: "/dashboard", breadcrumb: "Dashboard" },
    { path: "/products", breadcrumb: "Quản lý sản phẩm" },
    { path: "/products/brands", breadcrumb: "Danh mục hãng xe" },
    { path: "/products/models", breadcrumb: "Danh mục dòng xe" },
    { path: "/products/motorcycles", breadcrumb: "Quản lý xe máy" },
    { path: "/products/parts", breadcrumb: "Quản lý phụ tùng" },
    { path: "/products/motorcycle", breadcrumb: "Quản lý xe máy" },
    { path: "/customers", breadcrumb: "Quản lý khách hàng" },
    { path: "/customers/:customerId", breadcrumb: "Chi tiết khách hàng" },
    {
        path: "/products/motorcycle/:motorcycleId",
        breadcrumb: "Chi tiết xe máy",
    },
    { path: "/products/motorcycles/edit", breadcrumb: "Quản lý xe máy" },
    {
        path: "/products/motorcycles/edit/:motorcycleId",
        breadcrumb: "Chỉnh sửa thông tin xe",
    },
    { path: "/repairs", breadcrumb: "Quản lý sửa chữa" },
    { path: "/repairs/:repairId", breadcrumb: "Chi tiết sửa chữa" },
    { path: "/points", breadcrumb: "Quản lý tích điểm" },
    { path: "/accounts", breadcrumb: "Quản lý tài khoản" },
    { path: "/invoices", breadcrumb: "Quản lý hóa đơn" },
    { path: "/invoice", breadcrumb: "Quản lý hóa đơn" },
    { path: "/invoice/:invoiceId", breadcrumb: "Chi tiết hóa đơn" },
    { path: "/profile", breadcrumb: "Thông tin tài khoản" },
];

const generateBreadcrumbItems = (pathname: string) => {
    const pathSnippets = pathname.split("/").filter((i) => i);

    const breadcrumbSet = new Set(); // Sử dụng Set để loại bỏ trùng lặp

    return pathSnippets
        .map((_, index) => {
            const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;

            // Tìm đường dẫn khớp trong breadcrumbRoutes
            const matchedRoute = breadcrumbRoutes.find((route) =>
                matchPath(route.path, url)
            );

            if (matchedRoute && !breadcrumbSet.has(matchedRoute.breadcrumb)) {
                breadcrumbSet.add(matchedRoute.breadcrumb); // Thêm breadcrumb vào Set
                return (
                    <Breadcrumb.Item key={url}>
                        {matchedRoute.breadcrumb}
                    </Breadcrumb.Item>
                );
            }

            return null; // Bỏ qua nếu đã tồn tại trong Set
        })
        .filter(Boolean); // Loại bỏ các giá trị null
};

const MainLayout: React.FC = () => {
    const { user, logout } = useAuth();

    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const navigate = useNavigate();
    const location = useLocation();

    // Lọc menu dựa trên role_id
    const filteredItems = items.filter((item) => {
        if (user?.role_id === "R001") {
            // Admin: Hiển thị tất cả menu
            return true;
        } else if (user?.role_id === "R002") {
            // Chủ cửa hàng: Ẩn mục "Quản lý tài khoản"
            return item.key !== "7";
        } else if (user?.role_id === "R003") {
            // Nhân viên sửa chữa: Ẩn các mục "Dashboard", "Quản lý tài khoản", "Quản lý hóa đơn", "Quản lý tích điểm"
            return !["1", "7", "10", "11"].includes(String(item.key));
        }
        return false; // Mặc định ẩn tất cả nếu không có role_id
    });

    const breadcrumbItems = generateBreadcrumbItems(location.pathname);

    const onMenuClick: MenuProps["onClick"] = (e) => {
        const clickedItem = filteredItems
            .flatMap((item) => [item, ...(item.children || [])]) // Flatten items and children
            .find((item) => item.key === e.key); // Find the clicked item

        if (clickedItem?.path) {
            navigate(clickedItem.path); // Điều hướng đến đường dẫn tương ứng
        }
    };

    // Dropdown menu items
    const userMenu = (
        <Menu>
            <Menu.Item
                key="profile"
                icon={<UserOutlined />}
                onClick={() => navigate("/profile")}
            >
                Thông tin tài khoản
            </Menu.Item>
            {/* <Menu.Item key="settings" icon={<SettingOutlined />}>
                Cài đặt
            </Menu.Item> */}
            <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={logout}>
                Đăng xuất
            </Menu.Item>
        </Menu>
    );

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
            >
                <Header
                    style={{
                        width: "100%",
                        background: "rgba(255, 255, 255, 0.2)", // Màu nền tùy chỉnh
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "0 16px",
                        cursor: "pointer",
                    }}
                >
                    <img
                        src="TDMoto.png" // Đường dẫn đến logo
                        alt="Logo"
                        style={{
                            maxWidth: "100%",
                            maxHeight: "50px", // Chiều cao tối đa của logo
                            objectFit: "contain",
                        }}
                    />
                </Header>
                <Menu
                    theme="dark"
                    defaultSelectedKeys={["1"]}
                    mode="inline"
                    items={filteredItems}
                    onClick={onMenuClick} // Gọi hàm điều hướng khi click
                />
            </Sider>
            <Layout>
                <Header
                    style={{
                        padding: "0 16px",
                        background: colorBgContainer,
                        display: "flex",
                        justifyContent:
                            breadcrumbItems.length > 1 &&
                            ![
                                "/products/brands",
                                "/products/parts",
                                "/products/models",
                                "/products/motorcycles",
                            ].includes(location.pathname)
                                ? "space-between" // Nếu có nút Back, căn giữa các thành phần
                                : "flex-end", // Nếu không có nút Back, căn sang phải
                        alignItems: "center",
                        height: "64px", // Đặt chiều cao cố định cho Header
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", // Thêm bóng đổ cho Header
                    }}
                >
                    {/* Hiển thị nút Back nếu Breadcrumb có từ 2 cấp trở lên */}
                    {/* Hiển thị nút Back nếu Breadcrumb có từ 2 cấp trở lên và không thuộc các routes bị loại trừ */}
                    {breadcrumbItems.length > 1 &&
                        ![
                            "/products/brands",
                            "/products/parts",
                            "/products/models",
                            "/products/motorcycles",
                        ].includes(location.pathname) && (
                            <Button
                                type="text"
                                icon={<ArrowLeftOutlined />}
                                onClick={() => navigate(-1)} // Điều hướng về trang trước
                                style={{
                                    marginRight: 16,
                                    fontSize: "24px", // Tăng kích thước mũi tên
                                    fontWeight: "bold", // Làm mũi tên đậm hơn
                                    padding: "8px 16px", // Tăng kích thước vùng nhấn
                                }}
                            ></Button>
                        )}
                    <Dropdown overlay={userMenu} trigger={["hover"]}>
                        <Space style={{ cursor: "pointer" }}>
                            <Avatar size="large" icon={<UserOutlined />} />
                            <span>{user?.fullname}</span>
                            <DownOutlined />
                        </Space>
                    </Dropdown>
                </Header>

                <Content style={{ margin: "0 16px" }}>
                    <Breadcrumb style={{ margin: "16px 0" }}>
                        {breadcrumbItems}
                    </Breadcrumb>
                    <div
                        style={{
                            padding: 24,
                            minHeight: 360,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        <Outlet />
                    </div>
                </Content>
                <Footer style={{ textAlign: "center" }}>
                    Thanh Dat Motoshop ©{new Date().getFullYear()} Created by
                    Thanh Dat
                </Footer>
            </Layout>
        </Layout>
    );
};

export default MainLayout;
