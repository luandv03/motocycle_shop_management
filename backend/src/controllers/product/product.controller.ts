import { Request, Response } from "express";
import { Brand } from "../../models/Brand";
import { MotocycleModel } from "../../models/MotocycleModel";
import { Color } from "../../models/Color";
import { Specification } from "../../models/Specification";
import { Op } from "sequelize";

export class ProductController {
    // Brand: Lấy danh sách brand theo phân trang
    static async getBrands(req: Request, res: Response) {
        const { page = 1, limit = 10 } = req.query;

        try {
            const offset = (Number(page) - 1) * Number(limit);
            const { count, rows } = await Brand.findAndCountAll({
                limit: Number(limit),
                offset,
            });

            return res.status(200).json({
                statusCode: 200,
                message: "Get brands successfully",
                data: {
                    total: count,
                    pages: Math.ceil(count / Number(limit)),
                    brands: rows,
                },
            });
        } catch (error) {
            console.error("Error fetching brands:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // Brand: Lấy brand theo tên (search)
    static async searchBrand(req: Request, res: Response) {
        const { name } = req.query;

        try {
            const brands = await Brand.findAll({
                where: {
                    brand_name: {
                        [Op.like]: `%${name}%`, // Sử dụng Op.like
                    },
                },
            });

            return res.status(200).json({
                statusCode: 200,
                message: "Search brands successfully",
                data: brands,
            });
        } catch (error) {
            console.error("Error searching brand:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // Brand: Thêm brand
    static async addBrand(req: Request, res: Response) {
        const { brand_name } = req.body;

        try {
            const brand = await Brand.create({ brand_name });
            return res.status(201).json({
                statusCode: 201,
                message: "Brand added successfully",
                data: brand,
            });
        } catch (error) {
            console.error("Error adding brand:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // Brand: Xem chi tiết brand theo id
    static async getBrandById(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const brand = await Brand.findByPk(id);
            if (!brand) {
                return res.status(404).json({ message: "Brand not found" });
            }

            return res.status(200).json({
                statusCode: 200,
                message: "Get brand successfully",
                data: brand,
            });
        } catch (error) {
            console.error("Error fetching brand by id:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // Brand: Sửa brand theo id
    static async updateBrand(req: Request, res: Response) {
        const { id } = req.params;
        const { brand_name } = req.body;

        try {
            const brand = await Brand.findByPk(id);
            if (!brand) {
                return res.status(404).json({ message: "Brand not found" });
            }

            brand.brand_name = brand_name;
            await brand.save();

            return res.status(200).json({
                statusCode: 200,
                message: "Brand updated successfully",
                data: brand,
            });
        } catch (error) {
            console.error("Error updating brand:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // Brand: Xóa brand theo id
    static async deleteBrand(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const brand = await Brand.findByPk(id);
            if (!brand) {
                return res.status(404).json({ message: "Brand not found" });
            }

            await brand.destroy();
            return res
                .status(200)
                .json({ message: "Brand deleted successfully" });
        } catch (error) {
            console.error("Error deleting brand:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // MotocycleModel: Lấy danh sách theo phân trang
    static async getMotocycleModels(req: Request, res: Response) {
        const { page = 1, limit = 10 } = req.query;

        try {
            const offset = (Number(page) - 1) * Number(limit);
            const { count, rows } = await MotocycleModel.findAndCountAll({
                limit: Number(limit),
                offset,
                include: [{ model: Brand, attributes: ["brand_name"] }],
            });

            return res.status(200).json({
                statusCode: 200,
                message: "Get models successfully",
                data: {
                    total: count,
                    pages: Math.ceil(count / Number(limit)),
                    models: rows,
                },
            });
        } catch (error) {
            console.error("Error fetching models:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // MotocycleModel: Lọc theo brand
    static async filterMotocycleModelsByBrand(req: Request, res: Response) {
        const { brandId = "all" } = req.query;

        try {
            const whereCondition =
                brandId && brandId !== "all" ? { brand_id: brandId } : {};

            const models = await MotocycleModel.findAll({
                where: whereCondition,
                include: [{ model: Brand, attributes: ["brand_name"] }],
            });

            return res.status(200).json({
                statusCode: 200,
                message: "Filter models by brand successfully",
                data: models,
            });
        } catch (error) {
            console.error("Error filtering models by brand:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // MotocycleModel: Lấy theo tên (search) + brandId
    static async searchMotocycleModel(req: Request, res: Response) {
        const { name, brand_id } = req.query;

        try {
            const whereCondition: any = {
                model_name: {
                    [Op.like]: `%${name || ""}%`, // Tìm kiếm theo tên (nếu có)
                },
            };

            // Nếu có brand_id trong query, thêm điều kiện lọc theo brand_id
            if (brand_id && brand_id !== "all") {
                whereCondition.brand_id = brand_id;
            }

            const models = await MotocycleModel.findAll({
                where: whereCondition,
                include: [{ model: Brand, attributes: ["brand_name"] }],
            });

            return res.status(200).json({
                statusCode: 200,
                message: "Search models successfully",
                data: models,
            });
        } catch (error) {
            console.error("Error searching models:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // MotocycleModel: Thêm model
    static async addMotocycleModel(req: Request, res: Response) {
        const { motocycle_model_name, brand_id } = req.body;

        try {
            const model = await MotocycleModel.create({
                motocycle_model_name,
                brand_id,
            });
            return res.status(201).json({
                statusCode: 201,
                message: "Model added successfully",
                data: model,
            });
        } catch (error) {
            console.error("Error adding model:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // MotocycleModel: Xem chi tiết model theo id
    static async getMotocycleModelById(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const model = await MotocycleModel.findByPk(id, {
                include: [{ model: Brand, attributes: ["brand_name"] }],
            });

            if (!model) {
                return res.status(404).json({ message: "Model not found" });
            }

            return res.status(200).json({
                statusCode: 200,
                message: "Get model successfully",
                data: model,
            });
        } catch (error) {
            console.error("Error fetching model by id:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // MotocycleModel: Sửa model theo id
    static async updateMotocycleModel(req: Request, res: Response) {
        const { id } = req.params;
        const { motocycle_model_name, brand_id } = req.body;

        try {
            const model = await MotocycleModel.findByPk(id);
            if (!model) {
                return res.status(404).json({ message: "Model not found" });
            }

            model.motocycle_model_name = motocycle_model_name;
            model.brand_id = brand_id;
            await model.save();

            return res.status(200).json({
                statusCode: 200,
                message: "Model updated successfully",
                data: model,
            });
        } catch (error) {
            console.error("Error updating model:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // MotocycleModel: Xóa model theo id
    static async deleteMotocycleModel(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const model = await MotocycleModel.findByPk(id);
            if (!model) {
                return res.status(404).json({ message: "Model not found" });
            }

            await model.destroy();
            return res
                .status(200)
                .json({ message: "Model deleted successfully" });
        } catch (error) {
            console.error("Error deleting model:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // Lấy tất cả danh sách màu sắc
    static async getAllColors(req: Request, res: Response) {
        try {
            const colors = await Color.findAll({
                attributes: ["color_id", "color_name", "color_code"], // Chỉ lấy các trường cần thiết
            });

            return res.status(200).json({
                statusCode: 200,
                message: "Get all colors successfully",
                data: colors,
            });
        } catch (error) {
            console.error("Error fetching colors:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // Lấy tất cả danh sách thông số kỹ thuật
    static async getAllSpecifications(req: Request, res: Response) {
        try {
            const specifications = await Specification.findAll({
                attributes: ["specification_id", "specification_name"], // Chỉ lấy các trường cần thiết
            });

            return res.status(200).json({
                statusCode: 200,
                message: "Get all specifications successfully",
                data: specifications,
            });
        } catch (error) {
            console.error("Error fetching specifications:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}
