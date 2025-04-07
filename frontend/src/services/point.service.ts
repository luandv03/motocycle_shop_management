import axios from "axios";

const SERVER_DOMAIN = "http://localhost:5000";
const API = axios.create({
    baseURL: SERVER_DOMAIN,
    headers: {
        "Content-Type": "application/json",
    },
});

// 1. Lấy tất cả point rules
export const getAllPointRules = async () => {
    try {
        const response = await API.get("/api/points");
        return response.data.data; // Trả về danh sách point rules từ server
    } catch (error: any) {
        throw (
            error.response?.data || {
                message: "Không thể lấy danh sách point rules",
            }
        );
    }
};

// 2. Sửa point rule theo ID
export const updatePointRuleById = async (
    id: string,
    ruleName: string,
    conversionValue: string,
    unit: string,
    pointValue: number
) => {
    try {
        const response = await API.put(`/api/points/${id}`, {
            rule_name: ruleName,
            conversion_value: conversionValue,
            unit,
            point_value: pointValue,
        });
        return response.data.data; // Trả về thông tin point rule đã chỉnh sửa
    } catch (error: any) {
        throw (
            error.response?.data || {
                message: "Không thể chỉnh sửa point rule",
            }
        );
    }
};

// 3. Xóa point rule theo ID
export const deletePointRuleById = async (id: string) => {
    try {
        const response = await API.delete(`/api/points/${id}`);
        return response.data.message; // Trả về thông báo thành công
    } catch (error: any) {
        throw (
            error.response?.data || {
                message: "Không thể xóa point rule",
            }
        );
    }
};

// 4. Thêm point rule mới
export const addPointRule = async (
    ruleName: string,
    conversionValue: string,
    unit: string,
    pointValue: number
) => {
    try {
        const response = await API.post("/api/points", {
            rule_name: ruleName,
            conversion_value: conversionValue,
            unit,
            point_value: pointValue,
        });
        return response.data.data; // Trả về thông tin point rule vừa thêm
    } catch (error: any) {
        throw (
            error.response?.data || {
                message: "Không thể thêm point rule mới",
            }
        );
    }
};
