import axios from "axios";

// Cấu hình Axios với SERVER_DOMAIN
const SERVER_DOMAIN = "http://localhost:5000";
const API = axios.create({
    baseURL: SERVER_DOMAIN,
    headers: {
        "Content-Type": "application/json",
    },
});

// API Login
export const login = async (username: string, password: string) => {
    try {
        const response = await API.post("/api/users/login", {
            username,
            password,
        });
        return response.data; // Trả về dữ liệu từ server
    } catch (error: any) {
        // Xử lý lỗi
        throw error.response?.data || { message: "Đã xảy ra lỗi" };
    }
};

// API Get User Info
export const getUserInfo = async (token: string) => {
    try {
        const response = await API.get("/api/users/profile", {
            headers: {
                Authorization: `Bearer ${token}`, // Gửi token trong header
            },
        });
        return response.data; // Trả về dữ liệu từ server
    } catch (error: any) {
        // Xử lý lỗi
        throw (
            error.response?.data || {
                message: "Không thể lấy thông tin người dùng",
            }
        );
    }
};

// 1. Lấy danh sách tất cả người dùng
export const getAllUsers = async () => {
    try {
        const response = await API.get("/api/users");
        return response.data.data; // Trả về danh sách người dùng từ server
    } catch (error: any) {
        // Xử lý lỗi
        throw (
            error.response?.data || {
                message: "Không thể lấy danh sách người dùng",
            }
        );
    }
};

// 2. Thêm mới một người dùng
export const registerUser = async (
    username: string,
    fullname: string,
    password: string,
    roleId: string
) => {
    try {
        const response = await API.post("/api/users/register", {
            username,
            fullname,
            password,
            role_id: roleId,
        });
        return response.data.user; // Trả về thông tin người dùng vừa tạo
    } catch (error: any) {
        // Xử lý lỗi
        throw (
            error.response?.data || {
                message: "Không thể thêm người dùng mới",
            }
        );
    }
};
