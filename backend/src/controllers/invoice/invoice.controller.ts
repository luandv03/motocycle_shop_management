import { stat } from "fs";
import { Request, Response } from "express";
import { Invoice } from "../../models/Invoice";
import { Customer } from "../../models/Customer";
import { MotocycleColor } from "../../models/MotocycleColor";
import { Accessorie } from "../../models/Accessorie";
import { Repairs } from "../../models/Repairs";
import { InvoiceMotocycleDetail } from "../../models/InvoiceMotocycleDetail";
import { InvoiceAccessorieDetail } from "../../models/InvoiceAccessorieDetail";
import { InvoiceRepairDetail } from "../../models/InvoiceRepairDetail";
import { Motocycle } from "../../models/Motocycle";
import { RepairAccessories } from "../../models/RepairAccessories";
import { MotocycleModel } from "../../models/MotocycleModel";
import { Brand } from "../../models/Brand";
import { Color } from "../../models/Color";

export class InvoiceController {
    static async getAllInvoices(req: Request, res: Response) {
        try {
            const invoices = await Invoice.findAll({
                attributes: [
                    "invoice_id",
                    "invoice_type",
                    "status",
                    "invoice_date",
                    "total_amount",
                ], // Chỉ lấy các trường cần thiết từ bảng Invoice
                include: [
                    {
                        model: Customer,
                        attributes: ["customer_id", "fullname"], // Lấy thông tin khách hàng
                    },
                ],
                order: [["invoice_date", "DESC"]], // Sắp xếp theo ngày hóa đơn giảm dần
            });

            return res.status(200).json({
                message: "Invoices retrieved successfully",
                data: invoices,
            });
        } catch (error) {
            console.error("Error fetching invoices:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    static async createInvoice(req: Request, res: Response) {
        const {
            invoice_type,
            customer_id,
            repair_id,
            items,
            vat,
            discount,
            payment_method,
            total_amount,
            point,
            status,
        } = req.body;

        const transaction = await Invoice.sequelize?.transaction();

        try {
            // Tạo hóa đơn
            const invoice = await Invoice.create(
                {
                    invoice_type,
                    customer_id: customer_id || null,
                    vat,
                    discount,
                    total_amount,
                    payment_method,
                    invoice_date: new Date(),
                    status,
                },
                { transaction }
            );

            // Cập nhật điểm cho khách hàng
            if (customer_id && point) {
                const customer = await Customer.findByPk(customer_id, {
                    transaction,
                });
                if (!customer) {
                    await transaction?.rollback();
                    return res
                        .status(404)
                        .json({ message: "Customer not found" });
                }

                // Cộng thêm điểm từ payload vào điểm hiện tại
                customer.loyaltyPoint = (customer.loyaltyPoint || 0) + point;
                await customer.save({ transaction });
            }

            // Xử lý chi tiết hóa đơn dựa trên loại hóa đơn
            if (invoice_type === "Mua xe") {
                for (const item of items) {
                    const motocycleColor = await MotocycleColor.findByPk(
                        item.motocycle_color_id
                    );
                    if (!motocycleColor) {
                        await transaction?.rollback();
                        return res
                            .status(404)
                            .json({ message: "Motocycle color not found" });
                    }

                    await InvoiceMotocycleDetail.create(
                        {
                            invoice_id: invoice.invoice_id,
                            motorcycle_color_id: item.motocycle_color_id,
                            quantity: item.quantity,
                            unit_price: item.unit_price,
                        },
                        { transaction }
                    );
                }
            } else if (invoice_type === "Sửa chữa") {
                const repair = await Repairs.findByPk(repair_id);
                if (!repair) {
                    await transaction?.rollback();
                    return res
                        .status(404)
                        .json({ message: "Repair not found" });
                }

                await InvoiceRepairDetail.create(
                    {
                        invoice_id: invoice.invoice_id,
                        repair_id: repair_id,
                    },
                    { transaction }
                );
            } else if (invoice_type === "Mua phụ tùng") {
                const accessoryDetails = items.map((item: any) => ({
                    invoice_id: invoice.invoice_id,
                    accessory_id: item.accessory_id,
                    quantity: item.quantity,
                    unit_price: item.unit_price,
                }));

                // Kiểm tra sự tồn tại của tất cả các phụ tùng trước khi tạo
                for (const item of items) {
                    const accessory = await Accessorie.findByPk(
                        item.accessory_id
                    );
                    if (!accessory) {
                        await transaction?.rollback();
                        return res
                            .status(404)
                            .json({ message: "Accessory not found" });
                    }
                }

                // Tạo tất cả các chi tiết hóa đơn phụ tùng cùng lúc
                await InvoiceAccessorieDetail.bulkCreate(accessoryDetails, {
                    transaction,
                });
            } else {
                await transaction?.rollback();
                return res
                    .status(400)
                    .json({ message: "Invalid invoice type" });
            }

            // Commit transaction
            await transaction?.commit();

            return res.status(201).json({
                statusCode: 201,
                message: "Invoice created successfully",
                data: invoice,
            });
        } catch (error) {
            // Rollback transaction nếu có lỗi
            await transaction?.rollback();
            console.error("Error creating invoice:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    static async getInvoiceDetailsById(req: Request, res: Response) {
        const { id } = req.params;

        try {
            // Tìm hóa đơn theo ID
            const invoice = await Invoice.findByPk(id, {
                include: [
                    {
                        model: Customer,
                        attributes: ["fullname"], // Lấy tên khách hàng
                    },
                ],
            });

            if (!invoice) {
                return res.status(404).json({
                    statusCode: 404,
                    message: "Invoice not found",
                });
            }

            let details: any = {};

            // Xử lý chi tiết hóa đơn dựa trên loại hóa đơn
            if (invoice.invoice_type === "Mua xe") {
                const motocycleDetails = await InvoiceMotocycleDetail.findAll({
                    where: { invoice_id: id },
                    include: [
                        {
                            model: MotocycleColor,
                            include: [
                                {
                                    model: Motocycle,
                                    attributes: [
                                        "motocycle_name",
                                        "motocycle_id",
                                    ],
                                },
                                {
                                    model: Color, // Bao gồm thông tin màu sắc
                                    attributes: ["color_name", "color_code"],
                                },
                            ],
                            attributes: ["quantity", "price"],
                        },
                    ],
                });

                details = motocycleDetails.map((detail: any) => ({
                    motocycle_id:
                        detail.motocycleColor?.Motocycle?.motocycle_id,
                    color_name: detail.motocycleColor?.Color?.color_name, // Lấy tên màu
                    motocycle_name:
                        detail.motocycleColor?.Motocycle?.motocycle_name,
                    unit_price: detail.unit_price,
                    quantity: detail.motocycleColor?.quantity,
                }));
            } else if (invoice.invoice_type === "Sửa chữa") {
                const repairDetail = await InvoiceRepairDetail.findOne({
                    where: { invoice_id: id },
                    include: [
                        {
                            model: Repairs,
                            attributes: [
                                "repair_id",
                                "repair_detail",
                                "extra_fee",
                                "cost",
                            ],
                            include: [
                                {
                                    model: RepairAccessories,
                                    include: [
                                        {
                                            model: Accessorie,
                                            attributes: ["accessory_name"],
                                        },
                                    ],
                                    attributes: ["quantity", "unit_price"],
                                },
                            ],
                        },
                    ],
                });

                if (repairDetail) {
                    details = {
                        repair_id: repairDetail.repair?.repair_id,
                        description: repairDetail.repair?.repair_detail,
                        extra_fee: repairDetail.repair?.extra_fee,
                        cost: repairDetail.repair?.cost,
                        accessories: repairDetail.repair?.repairAccessories.map(
                            (item: any) => ({
                                accessory_name: item.accessorie?.accessory_name,
                                unit_price: item.unit_price,
                                quantity: item.quantity,
                            })
                        ),
                    };
                }
            } else if (invoice.invoice_type === "Mua phụ tùng") {
                const accessoryDetails = await InvoiceAccessorieDetail.findAll({
                    where: { invoice_id: id },
                    include: [
                        {
                            model: Accessorie,
                            attributes: [
                                "accessory_id",
                                "accessory_name",
                                "price",
                            ],
                        },
                    ],
                });

                details = accessoryDetails.map((detail: any) => ({
                    accessory_id: detail?.accessory.accessory_id,
                    accessory_name: detail?.accessory.accessory_name,
                    unit_price: detail.unit_price,
                    quantity: detail.quantity,
                }));
            }

            return res.status(200).json({
                statusCode: 200,
                message: "Invoice details retrieved successfully",
                data: {
                    invoice_id: invoice.invoice_id,
                    customer_name: invoice.customer?.fullname,
                    invoice_type: invoice.invoice_type,
                    status: invoice.status,
                    invoice_date: invoice.invoice_date,
                    total_amount: invoice.total_amount,
                    vat: invoice.vat,
                    discount: invoice.discount,
                    payment_method: invoice.payment_method,
                    details,
                },
            });
        } catch (error) {
            console.error("Error fetching invoice details:", error);
            return res.status(500).json({
                statusCode: 500,
                message: "Internal server error",
            });
        }
    }

    static async updateStatusInvoice(req: Request, res: Response) {
        const { id } = req.params;
        const { status } = req.body;

        try {
            const invoice = await Invoice.findByPk(id);
            if (!invoice) {
                return res.status(404).json({
                    message: "Invoice not found",
                });
            }

            invoice.status = status;
            await invoice.save();

            return res.status(200).json({
                statusCode: 200,
                message: "Invoice status updated successfully",
                data: invoice,
            });
        } catch (error) {
            console.error("Error updating invoice status:", error);
            return res.status(500).json({
                message: "Internal server error",
            });
        }
    }
}
