import axios from "axios";

// Cấu hình Axios với SERVER_DOMAIN
const SERVER_DOMAIN = "http://localhost:5000";
const API = axios.create({
    baseURL: SERVER_DOMAIN,
    headers: {
        "Content-Type": "multipart/form-data", // Định dạng form-data
    },
});

// Hàm upload ảnh
export const uploadPhoto = async (photo: File) => {
    try {
        const formData = new FormData();
        formData.append("photo", photo); // Thêm file ảnh vào form-data

        const response = await API.post("/api/photos/upload", formData);
        return response.data.data; // Trả về dữ liệu ảnh từ server
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        // Xử lý lỗi
        throw error.response?.data || { message: "Không thể upload ảnh" };
    }
};
