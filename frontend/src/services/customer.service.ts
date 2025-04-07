import axios from "axios";

const SERVER_DOMAIN = "http://localhost:5000";
const API = axios.create({
    baseURL: SERVER_DOMAIN,
    headers: {
        "Content-Type": "application/json",
    },
});

// 1. Lấy tất cả khách hàng
export const getAllCustomers = async () => {
    try {
        const response = await API.get("/api/customers");
        return response.data.data; // Trả về danh sách khách hàng từ server
    } catch (error: any) {
        throw (
            error.response?.data || {
                message: "Không thể lấy danh sách khách hàng",
            }
        );
    }
};

// 2. Thêm khách hàng mới
export const addCustomer = async (
    fullname: string,
    phonenumber: string,
    address: string,
    loyaltyPoint: number
) => {
    try {
        const response = await API.post("/api/customers", {
            fullname,
            phonenumber,
            address,
            loyaltyPoint,
        });
        return response.data.data; // Trả về thông tin khách hàng vừa thêm
    } catch (error: any) {
        throw (
            error.response?.data || {
                message: "Không thể thêm khách hàng mới",
            }
        );
    }
};

// 3. Chỉnh sửa khách hàng theo ID
export const editCustomerById = async (
    id: string,
    fullname: string,
    phonenumber: string,
    address: string,
    loyaltyPoint: number
) => {
    try {
        const response = await API.put(`/api/customers/${id}`, {
            fullname,
            phonenumber,
            address,
            loyaltyPoint,
        });
        return response.data.data; // Trả về thông tin khách hàng đã chỉnh sửa
    } catch (error: any) {
        throw (
            error.response?.data || {
                message: "Không thể chỉnh sửa thông tin khách hàng",
            }
        );
    }
};
