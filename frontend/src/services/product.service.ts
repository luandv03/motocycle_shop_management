import axios from "axios";

// Cấu hình Axios với SERVER_DOMAIN
const SERVER_DOMAIN = "http://localhost:5000";
const API = axios.create({
    baseURL: SERVER_DOMAIN,
    headers: {
        "Content-Type": "application/json",
    },
});

// 1. Lấy tất cả brand
export const getAllBrands = async (page: number = 1, limit: number = 100) => {
    try {
        const response = await API.get(
            `/api/products/brands?page=${page}&limit=${limit}`
        );
        return response.data.data; // Trả về dữ liệu brands từ server
    } catch (error: any) {
        // Xử lý lỗi
        throw (
            error.response?.data || { message: "Không thể lấy danh sách brand" }
        );
    }
};

// 2. Tạo brand mới
export const createBrand = async (brandName: string) => {
    try {
        const response = await API.post("/api/products/brands", {
            brand_name: brandName,
        });
        return response.data; // Trả về dữ liệu brand vừa tạo
    } catch (error: any) {
        // Xử lý lỗi
        throw error.response?.data || { message: "Không thể tạo brand mới" };
    }
};

// 3. Lọc model theo brand
export const filterModelsByBrand = async (brandId: string = "all") => {
    try {
        const response = await API.get(
            `/api/products/models/filter?brandId=${brandId}`
        );
        return response.data.data; // Trả về danh sách models từ server
    } catch (error: any) {
        throw (
            error.response?.data || {
                message: "Không thể lọc danh sách model theo brand",
            }
        );
    }
};

// 4. Tạo model mới
export const createModel = async (modelName: string, brandId: string) => {
    try {
        const response = await API.post("/api/products/models", {
            motocycle_model_name: modelName,
            brand_id: brandId,
        });
        return response.data; // Trả về dữ liệu model vừa tạo
    } catch (error: any) {
        throw error.response?.data || { message: "Không thể tạo model mới" };
    }
};

// 5. Lấy danh sách motocycle models theo brandId
export const getMotocycleModelsByBrand = async (brandId: string = "all") => {
    try {
        const response = await API.get(
            `/api/products/models/filter?brandId=${brandId}`
        );
        return response.data.data; // Trả về danh sách models từ server
    } catch (error: any) {
        throw (
            error.response?.data || {
                message: "Không thể lấy danh sách models theo brand",
            }
        );
    }
};

// 6. Lấy ra tất cả phụ tùng
export const getAllAccessories = async () => {
    try {
        const response = await API.get("/api/accessories");
        return response.data.data; // Trả về dữ liệu phụ tùng từ server
    } catch (error: any) {
        throw (
            error.response?.data || {
                message: "Không thể lấy danh sách phụ tùng",
            }
        );
    }
};

// 7. Tạo phụ tùng mới
export const createAccessory = async (
    accessorieName: string,
    quantity: number,
    price: number
) => {
    try {
        const response = await API.post("/api/accessories", {
            accessorie_name: accessorieName,
            quantity,
            price,
        });
        return response.data.data; // Trả về dữ liệu phụ tùng vừa tạo
    } catch (error: any) {
        throw (
            error.response?.data || {
                message: "Không thể thêm phụ tùng mới",
            }
        );
    }
};
