import { Request, Response } from "express";
import { Op } from "sequelize";
import { Motocycle } from "../../models/Motocycle";
import { Brand } from "../../models/Brand";
import { MotocycleModel } from "../../models/MotocycleModel";
import { Photo } from "../../models/Photo";
import { MotocycleSpecification } from "../../models/MotocycleSpecification";
import { MotocycleColor } from "../../models/MotocycleColor";
import { Specification } from "../../models/Specification";
import { Color } from "../../models/Color";

export class MotocycleController {
    // Lấy danh sách xe máy (kết hợp phân trang)
    static async getMotocycles(req: Request, res: Response) {
        const { page = 1, limit = 10 } = req.query;

        try {
            const offset = (Number(page) - 1) * Number(limit);

            // Lấy danh sách xe máy kèm thông tin hãng, model và tổng số lượng tồn kho
            const { count, rows } = await Motocycle.findAndCountAll({
                limit: Number(limit),
                offset,
                include: [
                    { model: MotocycleModel, include: [{ model: Brand }] },
                    {
                        model: MotocycleColor,
                        attributes: [
                            [
                                MotocycleColor.sequelize!.fn(
                                    "SUM",
                                    MotocycleColor.sequelize!.col("quantity")
                                ),
                                "total_quantity",
                            ],
                        ],
                    },
                ],
                group: [
                    "Motocycle.motocycle_id",
                    "MotocycleModel.model_id",
                    "Brand.brand_id",
                ],
            });

            return res.status(200).json({
                statusCode: 200,
                message: "Get motocycles successfully",
                data: {
                    total: count.length,
                    pages: Math.ceil(count.length / Number(limit)),
                    motocycles: rows,
                },
            });
        } catch (error) {
            console.error("Error fetching motocycles:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // Tìm kiếm xe máy theo tên và các tiêu chí lọc
    static async searchMotocycles(req: Request, res: Response) {
        const {
            name = "",
            brand_id,
            model_id,
            status,
            page = 1,
            limit = 10,
        } = req.query;

        try {
            const offset = (Number(page) - 1) * Number(limit);

            // Điều kiện tìm kiếm
            const whereCondition: any = {
                motocycle_name: {
                    [Op.like]: `%${name}%`,
                },
            };

            if (brand_id && brand_id !== "all") {
                whereCondition["$MotocycleModel.brand_id$"] = brand_id;
            }

            if (model_id && model_id !== "all") {
                whereCondition.model_id = model_id;
            }

            if (status && status !== "all") {
                whereCondition.status = status;
            }

            // Tìm kiếm xe máy
            const { count, rows } = await Motocycle.findAndCountAll({
                where: whereCondition,
                limit: Number(limit),
                offset,
                include: [
                    { model: MotocycleModel, include: [{ model: Brand }] },
                    {
                        model: MotocycleColor,
                        attributes: [
                            [
                                MotocycleColor.sequelize!.fn(
                                    "SUM",
                                    MotocycleColor.sequelize!.col("quantity")
                                ),
                                "total_quantity",
                            ],
                        ],
                    },
                ],
                group: [
                    "Motocycle.motocycle_id",
                    "MotocycleModel.model_id",
                    "Brand.brand_id",
                ],
            });

            return res.status(200).json({
                statusCode: 200,
                message: "Search motocycles successfully",
                data: {
                    total: count.length,
                    pages: Math.ceil(count.length / Number(limit)),
                    motocycles: rows,
                },
            });
        } catch (error) {
            console.error("Error searching motocycles:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // Tạo mới một xe máy
    static async createMotocycle(req: Request, res: Response) {
        const {
            motocycle_name,
            description,
            status,
            motocycle_model_id,
            photos = [],
            specifications = [],
            colors = [],
        } = req.body;

        const transaction = await Motocycle.sequelize?.transaction();

        try {
            // Tạo xe máy
            const motocycle = await Motocycle.create(
                {
                    motocycle_name,
                    description,
                    status,
                    motocycle_model_id,
                },
                { transaction }
            );

            // Lưu ảnh vào bảng Photo
            if (photos.length > 0) {
                const photoData = photos.map((url: string) => ({
                    photo_url: url,
                    motocycle_id: motocycle.motocycle_id,
                }));
                await Photo.bulkCreate(photoData, { transaction });
            }

            // Lưu thông số kỹ thuật vào bảng MotocycleSpecification
            if (specifications.length > 0) {
                const specificationData = specifications.map(
                    (spec: {
                        specification_id: string;
                        specification_value: string;
                    }) => ({
                        motocycle_id: motocycle.motocycle_id,
                        specification_id: spec.specification_id,
                        specification_value: spec.specification_value,
                    })
                );
                await MotocycleSpecification.bulkCreate(specificationData, {
                    transaction,
                });
            }

            // Lưu màu sắc vào bảng MotocycleColor
            if (colors.length > 0) {
                const colorData = colors.map(
                    (color: {
                        color_id: string;
                        quantity: number;
                        price: number;
                    }) => ({
                        motocycle_id: motocycle.motocycle_id,
                        color_id: color.color_id,
                        quantity: color.quantity,
                        price: color.price,
                    })
                );
                await MotocycleColor.bulkCreate(colorData, { transaction });
            }

            // Commit transaction
            await transaction?.commit();

            return res.status(201).json({
                statusCode: 201,
                message: "Motocycle created successfully",
                data: motocycle,
            });
        } catch (error) {
            // Rollback transaction nếu có lỗi
            await transaction?.rollback();
            console.error("Error creating motocycle:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    static async getMotocycleById(req: Request, res: Response) {
        const { id } = req.params;

        try {
            // Lấy thông tin xe máy
            const motocycle = await Motocycle.findOne({
                where: { motocycle_id: id },
                include: [
                    // Bao gồm danh sách ảnh
                    { model: Photo, attributes: ["photo_id", "photo_url"] },

                    // Bao gồm thông tin model và brand
                    {
                        model: MotocycleModel,
                        include: [
                            {
                                model: Brand,
                                attributes: ["brand_id", "brand_name"],
                            },
                        ],
                        attributes: [
                            "motocycle_model_id",
                            "motocycle_model_name",
                        ],
                    },
                ],
            });

            if (!motocycle) {
                return res.status(404).json({ message: "Motocycle not found" });
            }

            // Lấy danh sách thông số kỹ thuật
            const specifications = await MotocycleSpecification.findAll({
                where: { motocycle_id: id },
                include: [
                    {
                        model: Specification,
                        attributes: ["specification_name"],
                    },
                ],
                attributes: ["specification_value"],
            });

            // Lấy danh sách màu sắc
            const colors = await MotocycleColor.findAll({
                where: { motocycle_id: id },
                include: [
                    {
                        model: Color, // Bao gồm thông tin từ bảng Color
                        attributes: ["color_name", "color_code"],
                    },
                ],
                attributes: ["color_id", "quantity", "price"],
            });

            return res.status(200).json({
                statusCode: 200,
                message: "Motocycle fetched successfully",
                data: {
                    motocycle,
                    specifications: specifications.map((spec) => ({
                        name: spec.Specification?.specification_name,
                        value: spec.specification_value,
                    })),
                    colors: colors.map((color) => ({
                        color_id: color.color_id,
                        color_name: color.Color?.color_name, // Lấy từ bảng Color
                        color_code: color.Color?.color_code, // Lấy từ bảng Color
                        quantity: color.quantity,
                        price: color.price,
                    })),
                },
            });
        } catch (error) {
            console.error("Error fetching motocycle by id:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // update motocycle by id
    static async updateMotocycleById(req: Request, res: Response) {
        const { id } = req.params;
        const {
            motocycle_name,
            description,
            status,
            motocycle_model_id,
            photos = [],
            specifications = [],
            colors = [],
        } = req.body;

        const transaction = await Motocycle.sequelize?.transaction();

        try {
            // Cập nhật thông tin cơ bản của xe máy
            const motocycle = await Motocycle.findByPk(id);
            if (!motocycle) {
                return res.status(404).json({ message: "Motocycle not found" });
            }

            await motocycle.update(
                {
                    motocycle_name,
                    description,
                    status,
                    motocycle_model_id,
                },
                { transaction }
            );

            // Cập nhật danh sách ảnh
            if (photos.length > 0) {
                // Xóa ảnh cũ
                await Photo.destroy({
                    where: { motocycle_id: id },
                    transaction,
                });

                // Thêm ảnh mới
                const photoData = photos.map((url: string) => ({
                    photo_url: url,
                    motocycle_id: id,
                }));
                await Photo.bulkCreate(photoData, { transaction });
            }

            // Cập nhật thông số kỹ thuật
            if (specifications.length > 0) {
                // Xóa thông số kỹ thuật cũ
                await MotocycleSpecification.destroy({
                    where: { motocycle_id: id },
                    transaction,
                });

                // Thêm thông số kỹ thuật mới
                const specificationData = specifications.map(
                    (spec: {
                        specification_id: string;
                        specification_value: string;
                    }) => ({
                        motocycle_id: id,
                        specification_id: spec.specification_id,
                        specification_value: spec.specification_value,
                    })
                );
                await MotocycleSpecification.bulkCreate(specificationData, {
                    transaction,
                });
            }

            // Cập nhật danh sách màu sắc
            if (colors.length > 0) {
                // Xóa màu sắc cũ
                await MotocycleColor.destroy({
                    where: { motocycle_id: id },
                    transaction,
                });

                // Thêm màu sắc mới
                const colorData = colors.map(
                    (color: {
                        color_id: string;
                        quantity: number;
                        price: number;
                    }) => ({
                        motocycle_id: id,
                        color_id: color.color_id,
                        quantity: color.quantity,
                        price: color.price,
                    })
                );
                await MotocycleColor.bulkCreate(colorData, { transaction });
            }

            // Commit transaction
            await transaction?.commit();

            return res.status(200).json({
                statusCode: 200,
                message: "Motocycle updated successfully",
                data: motocycle,
            });
        } catch (error) {
            // Rollback transaction nếu có lỗi
            await transaction?.rollback();
            console.error("Error updating motocycle:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // get all motocycles
    static async getAllMotocycles(req: Request, res: Response) {
        try {
            // Lấy danh sách tất cả xe máy (không tính tổng số lượng ở đây)
            const motocycles = await Motocycle.findAll({
                include: [
                    {
                        model: MotocycleModel,
                        include: [
                            {
                                model: Brand,
                                attributes: ["brand_name"], // Lấy tên hãng xe
                            },
                        ],
                        attributes: ["motocycle_model_name"], // Lấy tên dòng xe
                    },
                ],
                attributes: [
                    "motocycle_id",
                    "motocycle_name",
                    "status", // Lấy mã xe, tên xe, tình trạng xe
                ],
            });

            // Tính tổng số lượng tồn kho cho từng xe máy
            const quantities = await MotocycleColor.findAll({
                attributes: [
                    "motocycle_id",
                    [
                        MotocycleColor.sequelize!.fn(
                            "SUM",
                            MotocycleColor.sequelize!.col("quantity")
                        ),
                        "total_quantity", // Tính tổng số lượng tồn kho
                    ],
                ],
                group: ["motocycle_id"], // Nhóm theo motocycle_id
            });

            // Chuyển đổi kết quả tính tổng số lượng thành một map để dễ truy cập
            const quantityMap = quantities.reduce((map: any, item: any) => {
                map[item.motocycle_id] = item.dataValues.total_quantity || 0;
                return map;
            }, {});

            // Kết hợp dữ liệu tổng số lượng vào danh sách xe máy
            const result = motocycles.map((motocycle: any) => ({
                motocycle_id: motocycle.motocycle_id,
                motocycle_name: motocycle.motocycle_name,
                brand_name: motocycle.motocycle_model?.brand?.brand_name,
                motocycle_model_name:
                    motocycle.motocycle_model?.motocycle_model_name,
                status: motocycle.status,
                total_quantity: quantityMap[motocycle.motocycle_id] || 0, // Lấy tổng số lượng tồn kho
            }));

            // Tính tổng số lượng xe máy
            const totalMotocycle = await Motocycle.count();

            return res.status(200).json({
                statusCode: 200,
                message: "Get all motocycles successfully",
                data: {
                    totalMotocycle,
                    motocycles: result,
                },
            });
        } catch (error) {
            console.error("Error fetching all motocycles:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}
