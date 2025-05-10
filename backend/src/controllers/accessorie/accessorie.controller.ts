import { Request, Response } from "express";
import { Accessorie } from "../../models/Accessorie"; // Đảm bảo bạn đã định nghĩa model Accessorie

export class AccessorieController {
    // Lấy tất cả phụ tùng
    static async getAllAccessories(req: Request, res: Response) {
        try {
            const accessories = await Accessorie.findAll({
                attributes: [
                    "accessory_id",
                    "accessory_name",
                    "quantity",
                    "price",
                ], // Lấy tên, số lượng, giá
            });

            const totalAccessorie = await Accessorie.count(); // Tổng số phụ tùng

            return res.status(200).json({
                statusCode: 200,
                message: "Get all accessories successfully",
                data: {
                    totalAccessorie,
                    accessories,
                },
            });
        } catch (error) {
            console.error("Error fetching accessories:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // Thêm phụ tùng
    static async addAccessorie(req: Request, res: Response) {
        try {
            const { accessorie_name, quantity, price } = req.body;

            if (!accessorie_name || !quantity || !price) {
                return res
                    .status(400)
                    .json({ message: "Missing required fields" });
            }

            const newAccessorie = await Accessorie.create({
                accessory_name: accessorie_name,
                quantity,
                price,
            });

            return res.status(201).json({
                statusCode: 201,
                message: "Accessorie added successfully",
                data: newAccessorie,
            });
        } catch (error) {
            console.error("Error adding accessorie:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // Sửa phụ tùng theo id
    static async updateAccessorieById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { accessorie_name, quantity, price } = req.body;

            const accessorie = await Accessorie.findByPk(id);
            if (!accessorie) {
                return res
                    .status(404)
                    .json({ message: "Accessorie not found" });
            }

            await accessorie.update({
                accessory_name: accessorie_name,
                quantity,
                price,
            });

            return res.status(200).json({
                statusCode: 200,
                message: "Accessorie updated successfully",
                data: accessorie,
            });
        } catch (error) {
            console.error("Error updating accessorie:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // Xóa phụ tùng
    static async deleteAccessorieById(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const accessorie = await Accessorie.findByPk(id);
            if (!accessorie) {
                return res
                    .status(404)
                    .json({ message: "Accessorie not found" });
            }

            await accessorie.destroy();

            return res.status(200).json({
                statusCode: 200,
                message: "Accessorie deleted successfully",
            });
        } catch (error) {
            console.error("Error deleting accessorie:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}
