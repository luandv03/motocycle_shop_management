import axios from "axios";

const SERVER_DOMAIN = "http://localhost:5000";
const API = axios.create({
    baseURL: SERVER_DOMAIN,
    headers: {
        "Content-Type": "application/json",
    },
});

// 1. Lấy tất cả hóa đơn
export const getAllInvoices = async () => {
    try {
        const response = await API.get("/api/invoices");
        return response.data.data; // Trả về danh sách hóa đơn từ server
    } catch (error: any) {
        throw (
            error.response?.data || {
                message: "Không thể lấy danh sách hóa đơn!",
            }
        );
    }
};

// 2. Tạo hóa đơn
export const createInvoice = async (invoiceData: {
    customer_id: string;
    invoice_type: "Mua xe" | "Sửa chữa" | "Mua phụ tùng";
    items?: {
        motocycle_color_id?: string;
        accessory_id?: string;
        quantity: number;
        unit_price: number;
    }[];
    repair_id?: string;
    vat: number;
    discount: number;
    total_amount: number;
    payment_method: string;
    status: string;
    invoice_date: string;
    point?: number;
}) => {
    try {
        const response = await API.post("/api/invoices", invoiceData);
        return response.data; // Trả về dữ liệu hóa đơn vừa tạo
    } catch (error: any) {
        throw (
            error.response?.data || {
                message: "Không thể tạo hóa đơn!",
            }
        );
    }
};

export const getInvoiceById = async (id: string) => {
    try {
        const response = await API.get(`/api/invoices/${id}`);
        return response.data.data; // Trả về chi tiết hóa đơn từ server
    } catch (error: any) {
        throw (
            error.response?.data || {
                message: "Không thể lấy chi tiết hóa đơn!",
            }
        );
    }
};
