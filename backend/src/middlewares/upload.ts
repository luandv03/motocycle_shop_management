import multer from "multer";
import cloudinary from "../configs/cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: () => ({
        folder: process.env.CLOUD_FOLDER || "uploads", // Thư mục lưu trữ trên Cloudinary
        allowed_formats: ["jpg", "jpeg", "png"], // Các định dạng được phép
    }),
});

const upload = multer({ storage });

export default upload;
