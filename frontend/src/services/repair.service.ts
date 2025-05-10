import axios from "axios";

const SERVER_DOMAIN = "http://localhost:5000";
const API = axios.create({
    baseURL: SERVER_DOMAIN,
    headers: {
        "Content-Type": "application/json",
    },
});

// 1. Lấy tất cả repairs
export const getAllRepairs = async () => {
    try {
        const response = await API.get("/api/repairs");
        return response.data.data; // Trả về danh sách repairs từ server
    } catch (error: any) {
        throw (
            error.response?.data || {
                message: "Không thể lấy danh sách sửa chữa!",
            }
        );
    }
};

// 2. Tạo repair mới
export const createRepair = async (repairData: {
    motocycle_name: string;
    customer_id: string;
    repair_detail: string;
    accessories: {
        accessory_id: string;
        quantity: number;
        unit_price: number;
    }[];
    extra_fee: number;
    cost: number;
    status: string;
    repair_time: string;
}) => {
    try {
        const response = await API.post("/api/repairs", repairData);
        return response.data.data; // Trả về thông tin repair vừa tạo
    } catch (error: any) {
        throw (
            error.response?.data || {
                message: "Không thể tạo sửa chữa mới!",
            }
        );
    }
};

// 3. Sửa repair
export const updateRepair = async (
    id: string,
    repairData: {
        motocycle_name: string;
        customer_id: string;
        repair_detail: string;
        accessories: {
            accessory_id: string;
            quantity: number;
            unit_price: number;
        }[];
        extra_fee: number;
        cost: number;
        status: string;
        repair_time: string;
    }
) => {
    try {
        const response = await API.put(`/api/repairs/${id}`, repairData);
        return response.data.data; // Trả về thông tin repair đã chỉnh sửa
    } catch (error: any) {
        throw (
            error.response?.data || {
                message: "Không thể chỉnh sửa sửa chữa!",
            }
        );
    }
};

export const getRepairById = async (id: string) => {
    try {
        const response = await API.get(`/api/repairs/${id}`);
        return response.data.data; // Trả về chi tiết sửa chữa từ server
    } catch (error: any) {
        throw (
            error.response?.data || {
                message: "Không thể lấy chi tiết sửa chữa!",
            }
        );
    }
};
