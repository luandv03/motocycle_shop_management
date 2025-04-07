import React, { createContext, useState, useEffect, useContext } from "react";
import { getUserInfo } from "../services/auth.service"; // Import API getUserInfo
import { message } from "antd";
import { useNavigate } from "react-router-dom"; // Import useNavigate

// Định nghĩa kiểu dữ liệu cho User
interface User {
    user_id: string;
    username: string;
    fullname: string;
    role_id: string;
}

// Định nghĩa kiểu dữ liệu cho AuthContext
interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (accessToken: string) => void;
    logout: () => void;
}

// Tạo AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider Component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate(); // Điều hướng

    // Hàm lấy thông tin người dùng
    const fetchUserInfo = async (token: string) => {
        try {
            const response = await getUserInfo(token); // Gọi API getUserInfo
            setUser(response.user); // Lưu thông tin người dùng vào state
        } catch (error: any) {
            message.error(
                error.message || "Không thể lấy thông tin người dùng!"
            );
            logout(); // Đăng xuất nếu token không hợp lệ
        } finally {
            setLoading(false);
        }
    };

    // Hàm login
    const login = (accessToken: string) => {
        localStorage.setItem("accessToken", accessToken); // Lưu token vào localStorage
        fetchUserInfo(accessToken); // Lấy thông tin người dùng
        navigate("/dashboard"); // Điều hướng đến trang Dashboard sau khi đăng nhập
    };

    // Hàm logout
    const logout = () => {
        localStorage.removeItem("accessToken"); // Xóa token khỏi localStorage
        setUser(null); // Xóa thông tin người dùng
        navigate("/sign-in"); // Điều hướng về trang Sign-In
    };

    // Kiểm tra token khi ứng dụng khởi chạy
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            fetchUserInfo(token);
        } else {
            setLoading(false);
            navigate("/sign-in"); // Điều hướng về trang Sign-In nếu không có token
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook để sử dụng AuthContext
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth phải được sử dụng trong AuthProvider");
    }
    return context;
};
