import { Request, Response } from "express";
import { Customer } from "../../models/Customer";
import { Invoice } from "../../models/Invoice";

export class CustomerController {
    // Lấy tất cả khách hàng
    static async getAllCustomers(req: Request, res: Response) {
        try {
            const customers = await Customer.findAll({
                attributes: [
                    "customer_id",
                    "fullname",
                    "phonenumber",
                    "address",
                    "loyaltyPoint",
                    [
                        Customer.sequelize!.fn(
                            "COUNT",
                            Customer.sequelize!.col("invoices.invoice_id")
                        ),
                        "total_invoices", // Tổng số hóa đơn
                    ],
                    [
                        Customer.sequelize!.fn(
                            "SUM",
                            Customer.sequelize!.literal(
                                `CASE WHEN "invoices"."invoice_type" != 'Sửa chữa' THEN 1 ELSE 0 END`
                            )
                        ),
                        "purchase_count", // Số lượt mua
                    ],
                    [
                        Customer.sequelize!.fn(
                            "SUM",
                            Customer.sequelize!.literal(
                                `CASE WHEN "invoices"."invoice_type" = 'Sửa chữa' THEN 1 ELSE 0 END`
                            )
                        ),
                        "repair_count", // Số lần sửa chữa
                    ],
                ],
                include: [
                    {
                        model: Invoice,
                        attributes: [], // Không lấy thêm cột từ Invoice
                    },
                ],
                group: ["Customer.customer_id"], // Nhóm theo mã khách hàng
            });

            const totalCustomers = await Customer.count(); // Tổng số khách hàng

            return res.status(200).json({
                statusCode: 200,
                message: "Get all customers successfully",
                data: {
                    totalCustomers,
                    customers,
                },
            });
        } catch (error) {
            console.error("Error fetching customers:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // Thêm khách hàng mới
    static async addCustomer(req: Request, res: Response) {
        try {
            const { fullname, phonenumber, address, loyaltyPoint } = req.body;

            if (!fullname || !phonenumber || !address) {
                return res
                    .status(400)
                    .json({ message: "Missing required fields" });
            }

            const newCustomer = await Customer.create({
                fullname,
                phonenumber,
                address,
                loyaltyPoint: loyaltyPoint || 0, // Mặc định điểm tích lũy là 0 nếu không được cung cấp
            });

            return res.status(201).json({
                statusCode: 201,
                message: "Customer added successfully",
                data: newCustomer,
            });
        } catch (error) {
            console.error("Error adding customer:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // Sửa thông tin khách hàng theo id
    static async editCustomer(req: Request, res: Response) {
        try {
            const { id } = req.params; // Lấy customer_id từ URL
            const { fullname, phonenumber, address, loyaltyPoint } = req.body;

            // Kiểm tra xem khách hàng có tồn tại không
            const customer = await Customer.findByPk(id);
            if (!customer) {
                return res.status(404).json({ message: "Customer not found" });
            }

            // Cập nhật thông tin khách hàng
            await customer.update({
                fullname: fullname || customer.fullname,
                phonenumber: phonenumber || customer.phonenumber,
                address: address || customer.address,
                loyaltyPoint:
                    loyaltyPoint !== undefined
                        ? loyaltyPoint
                        : customer.loyaltyPoint,
            });

            return res.status(200).json({
                statusCode: 200,
                message: "Customer updated successfully",
                data: customer,
            });
        } catch (error) {
            console.error("Error updating customer:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}
