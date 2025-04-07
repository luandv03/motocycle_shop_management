import { Request, Response } from "express";
import cloudinary from "../../configs/cloudinary"; // Import cấu hình Cloudinary

export class UploadController {
    // Upload ảnh lên Cloudinary
    static async uploadPhoto(req: Request, res: Response) {
        try {
            // Kiểm tra xem file có được upload hay không
            if (!req.file) {
                return res.status(400).json({ message: "No file uploaded" });
            }

            // Upload file lên Cloudinary
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: process.env.CLOUD_FOLDER || "uploads", // Thư mục lưu trữ trên Cloudinary
            });

            // Trả về thông tin ảnh
            return res.status(201).json({
                statusCode: 201,
                message: "Photo uploaded successfully",
                data: {
                    public_id: result.public_id,
                    url: result.secure_url,
                    format: result.format,
                    width: result.width,
                    height: result.height,
                },
            });
        } catch (error) {
            console.error("Error uploading photo:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}
