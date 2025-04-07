import axios from "axios";

// Cấu hình Axios với SERVER_DOMAIN
const SERVER_DOMAIN = "http://localhost:5000";
const API = axios.create({
    baseURL: SERVER_DOMAIN,
    headers: {
        "Content-Type": "application/json",
    },
});

// 1. Lấy toàn bộ danh sách motocycle
export const getAllMotocycles = async () => {
    try {
        const response = await API.get("/api/motocycles/all");
        return response.data.data; // Trả về dữ liệu motocycles từ server
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        // Xử lý lỗi
        throw (
            error.response?.data || {
                message: "Không thể lấy danh sách motocycles",
            }
        );
    }
};

// 2. Tạo motocycle mới
export const createMotocycle = async (motocycleData: any) => {
    try {
        const response = await API.post("/api/motocycles", motocycleData);
        return response.data.data; // Trả về dữ liệu motocycle vừa tạo
    } catch (error: any) {
        throw (
            error.response?.data || {
                message: "Không thể tạo motocycle mới",
            }
        );
    }
};

// 3. Lấy tất cả màu sắc
export const getAllColors = async () => {
    try {
        const response = await API.get("/api/products/colors");
        return response.data.data; // Trả về danh sách màu sắc từ server
    } catch (error: any) {
        throw (
            error.response?.data || {
                message: "Không thể lấy danh sách màu sắc",
            }
        );
    }
};

// 4. Lấy tất cả thông số
export const getAllSpecifications = async () => {
    try {
        const response = await API.get("/api/products/specifications");
        return response.data.data; // Trả về danh sách thông số từ server
    } catch (error: any) {
        throw (
            error.response?.data || {
                message: "Không thể lấy danh sách thông số",
            }
        );
    }
};

// 5. Lấy motocycle theo ID
export const getMotocycleById = async (motorcycleId: string) => {
    try {
        const response = await API.get(`/api/motocycles/${motorcycleId}`);
        return response.data.data; // Trả về dữ liệu motocycle từ server
    } catch (error: any) {
        throw (
            error.response?.data || {
                message: "Không thể lấy thông tin motocycle",
            }
        );
    }
};

// 6. Cập nhật thông tin motocycle
export const updateMotocycleById = async (id: string, motocycleData: any) => {
    try {
        const response = await API.put(`/api/motocycles/${id}`, motocycleData);
        return response.data.data; // Trả về dữ liệu motocycle đã cập nhật
    } catch (error: any) {
        throw (
            error.response?.data || {
                message: "Không thể cập nhật thông tin motocycle",
            }
        );
    }
};
