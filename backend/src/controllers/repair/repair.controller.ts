import { Request, Response } from "express";
import { Repairs } from "../../models/Repairs";
import { RepairAccessories } from "../../models/RepairAccessories";
import { Accessorie } from "../../models/Accessorie";
import { Customer } from "../../models/Customer";

export class RepairController {
    // Lấy tất cả repair
    static async getAllRepairs(req: Request, res: Response) {
        try {
            const repairs = await Repairs.findAll({
                include: [
                    {
                        model: Customer,
                        attributes: [
                            "customer_id",
                            "fullname",
                            "phonenumber",
                            "address",
                        ], // Thông tin khách hàng
                    },
                    {
                        model: RepairAccessories,
                        include: [
                            {
                                model: Accessorie,
                                attributes: ["accessorie_name"], // Lấy tên phụ tùng
                            },
                        ],
                    },
                ],
            });

            const totalRepairs = await Repairs.count(); // Tổng số lần sửa chữa

            // Xử lý danh sách phụ tùng cho từng repair
            const result = repairs.map((repair: any) => ({
                repair_id: repair.repair_id,
                motocycle_name: repair.motocycle_name,
                customer: repair.Customer,
                repair_detail: repair.repair_detail,
                accessories: repair.repairAccessories.map(
                    (ra: any) => ra.accessorie?.accessorie_name || null
                ), // Danh sách phụ tùng
                extra_fee: repair.extra_fee,
                cost: repair.cost,
                repair_time: repair.repair_time,
            }));

            return res.status(200).json({
                statusCode: 200,
                message: "Get all repairs successfully",
                data: {
                    totalRepairs,
                    repairs: result,
                },
            });
        } catch (error) {
            console.error("Error fetching repairs:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // Thêm repair mới
    static async addRepair(req: Request, res: Response) {
        try {
            const {
                motocycle_name,
                customer_id,
                repair_detail,
                accessories,
                extra_fee,
                cost,
                status,
                repair_time,
            } = req.body;

            if (
                !motocycle_name ||
                !customer_id ||
                !repair_detail ||
                !cost ||
                !repair_time ||
                !status
            ) {
                return res
                    .status(400)
                    .json({ message: "Missing required fields" });
            }

            // Kiểm tra xem khách hàng có tồn tại không
            const customer = await Customer.findByPk(customer_id);
            if (!customer) {
                return res.status(404).json({ message: "Customer not found" });
            }

            // Tạo repair mới
            const newRepair = await Repairs.create({
                motocycle_name,
                customer_id,
                repair_detail,
                extra_fee: extra_fee || 0,
                cost,
                status,
                repair_time,
            });

            const newAccessories: string[] = [];
            // Thêm phụ tùng vào RepairAccessories nếu có
            if (accessories && accessories.length > 0) {
                for (const accessory of accessories) {
                    const existAccessory = await Accessorie.findByPk(
                        accessory?.accessory_id
                    );
                    if (existAccessory) {
                        newAccessories.push(existAccessory.accessorie_name);
                        await RepairAccessories.create({
                            repair_id: newRepair?.repair_id,
                            accessory_id: accessory?.accessory_id,
                            quantity: accessory?.quantity,
                            unit_price: accessory?.unit_price,
                        });
                    }
                }
            }

            const newRepairtVip = {
                ...newRepair.toJSON(),
                accessories: newAccessories,
            };

            return res.status(201).json({
                statusCode: 201,
                message: "Repair added successfully",
                data: newRepairtVip,
            });
        } catch (error) {
            console.error("Error adding repair:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // Lấy chi tiết repair theo id
    static async getRepairById(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const repair = await Repairs.findByPk(id, {
                include: [
                    {
                        model: Customer,
                        attributes: [
                            "customer_id",
                            "fullname",
                            "phonenumber",
                            "address",
                        ], // Thông tin khách hàng
                    },
                    {
                        model: RepairAccessories,
                        include: [
                            {
                                model: Accessorie,
                                attributes: ["accessorie_name"], // Lấy tên phụ tùng
                            },
                        ],
                    },
                ],
            });

            if (!repair) {
                return res.status(404).json({ message: "Repair not found" });
            }

            const repairDetails = {
                repair_id: repair.repair_id,
                motocycle_name: repair.motocycle_name,
                customer: repair.customer,
                repair_detail: repair.repair_detail,
                accessories: (repair.repairAccessories || []).map(
                    (ra: any) => ({
                        accessory_name: ra.accessorie?.accessorie_name || null,
                        quantity: ra.quantity,
                        unit_price: ra.unit_price,
                    })
                ),
                extra_fee: repair.extra_fee,
                cost: repair.cost,
                status: repair.status,
                repair_time: repair.repair_time,
            };

            return res.status(200).json({
                statusCode: 200,
                message: "Get repair details successfully",
                data: repairDetails,
            });
        } catch (error) {
            console.error("Error fetching repair details:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // Cập nhật repair theo id
    static async updateRepairById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const {
                motocycle_name,
                customer_id,
                repair_detail,
                accessories,
                extra_fee,
                cost,
                status,
                repair_time,
            } = req.body;

            const repair = await Repairs.findByPk(id);
            if (!repair) {
                return res.status(404).json({ message: "Repair not found" });
            }

            // Cập nhật thông tin sửa chữa
            await repair.update({
                motocycle_name: motocycle_name || repair.motocycle_name,
                customer_id: customer_id || repair.customer_id,
                repair_detail: repair_detail || repair.repair_detail,
                extra_fee:
                    extra_fee !== undefined ? extra_fee : repair.extra_fee,
                cost: cost || repair.cost,
                status: status || repair.status,
                repair_time: repair_time || repair.repair_time,
            });

            // Cập nhật danh sách phụ tùng nếu có
            if (accessories && accessories.length > 0) {
                // Xóa các phụ tùng cũ liên quan đến repair
                await RepairAccessories.destroy({ where: { repair_id: id } });

                // Thêm phụ tùng mới
                for (const accessory of accessories) {
                    const existAccessory = await Accessorie.findByPk(
                        accessory?.accessory_id
                    );
                    if (existAccessory) {
                        await RepairAccessories.create({
                            repair_id: id,
                            accessory_id: accessory?.accessory_id,
                            quantity: accessory?.quantity,
                            unit_price: accessory?.unit_price,
                        });
                    }
                }
            }

            return res.status(200).json({
                statusCode: 200,
                message: "Repair updated successfully",
                data: repair,
            });
        } catch (error) {
            console.error("Error updating repair:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}
