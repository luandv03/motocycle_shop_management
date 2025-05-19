import { Invoice } from "../models/Invoice";
import { InvoiceMotocycleDetail } from "../models/InvoiceMotocycleDetail";
import { InvoiceAccessorieDetail } from "../models/InvoiceAccessorieDetail";
import { InvoiceRepairDetail } from "../models/InvoiceRepairDetail";
import sequelize from "../configs/database";

export const seedInvoices = async () => {
    // Created some demo customer IDs and point rule ID - in a real situation, you would query existing data
    const customerIds = ["C001", "C002", "C003", "C004", "C005"];
    const pointRuleId = "PR001";
    const repairIds = [
        "R001",
        "R002",
        "R003",
        "R004",
        "R005",
        "R006",
        "R007",
        "R008",
        "R009",
        "R010",
    ];
    const invoiceTypes = ["Mua xe", "Sửa chữa", "Mua phụ tùng"];
    const statuses = ["Đã thanh toán", "Chưa thanh toán"];
    const paymentMethods = ["Tiền mặt", "Chuyển khoản"];

    // Motorcycle color IDs for invoice details
    const motorcycleColorIds = [
        "MC001",
        "MC002",
        "MC003",
        "MC004",
        "MC005",
        "MC006",
        "MC007",
        "MC008",
        "MC009",
        "MC010",
    ];

    // Accessory IDs for invoice details
    const accessoryIds = [
        "A001",
        "A002",
        "A003",
        "A004",
        "A005",
        "A006",
        "A007",
        "A008",
        "A009",
        "A010",
        "A011",
        "A012",
        "A013",
        "A014",
        "A015",
    ];

    // Generate random dates within the past month
    const getRandomDate = () => {
        const now = new Date();
        const pastMonth = new Date(now);
        pastMonth.setMonth(now.getMonth() - 1);

        return new Date(
            pastMonth.getTime() +
                Math.random() * (now.getTime() - pastMonth.getTime())
        );
    };

    // Generate a collection of 30 invoices
    const invoicesData = [];

    // // Create motorcycle purchase invoices (10 items)
    // for (let i = 0; i < 10; i++) {
    //     const customerId =
    //         customerIds[Math.floor(Math.random() * customerIds.length)];
    //     const total = Math.floor(Math.random() * 50000000) + 10000000; // Between 10M and 60M VND

    //     invoicesData.push({
    //         invoice_type: "Mua xe",
    //         customer_id: customerId,
    //         point_rule_id: pointRuleId,
    //         vat: 10,
    //         discount: Math.floor(Math.random() * 10),
    //         total_amount: total,
    //         payment_method:
    //             paymentMethods[
    //                 Math.floor(Math.random() * paymentMethods.length)
    //             ],
    //         status: statuses[Math.floor(Math.random() * 2)], // Exclude "Đã hủy" status
    //         invoice_date: getRandomDate(),
    //         details: {
    //             motorcycle: [
    //                 {
    //                     motorcycle_color_id:
    //                         motorcycleColorIds[
    //                             Math.floor(
    //                                 Math.random() * motorcycleColorIds.length
    //                             )
    //                         ],
    //                     quantity: 1,
    //                     unit_price: total,
    //                 },
    //             ],
    //         },
    //     });
    // }

    // Create repair invoices (10 items)
    for (let i = 0; i < 10; i++) {
        const customerId =
            customerIds[Math.floor(Math.random() * customerIds.length)];
        const total = Math.floor(Math.random() * 500000) + 200000; // Between 200K and 700K VND

        invoicesData.push({
            invoice_type: "Sửa chữa",
            customer_id: customerId,
            point_rule_id: pointRuleId,
            vat: 10,
            discount: Math.floor(Math.random() * 5),
            total_amount: total,
            payment_method:
                paymentMethods[
                    Math.floor(Math.random() * paymentMethods.length)
                ],
            status: statuses[Math.floor(Math.random() * statuses.length)],
            invoice_date: getRandomDate(),
            details: {
                repair: [
                    {
                        repair_id: repairIds[i % repairIds.length],
                    },
                ],
            },
        });
    }

    // Create accessory purchase invoices (10 items)
    for (let i = 0; i < 10; i++) {
        const customerId =
            customerIds[Math.floor(Math.random() * customerIds.length)];
        const numItems = Math.floor(Math.random() * 3) + 1; // 1 to 3 items
        const accessories = [];

        let total = 0;
        for (let j = 0; j < numItems; j++) {
            const quantity = Math.floor(Math.random() * 3) + 1; // 1 to 3 quantity
            const unit_price = Math.floor(Math.random() * 200000) + 50000; // Between 50K and 250K VND
            total += quantity * unit_price;

            accessories.push({
                accessory_id:
                    accessoryIds[
                        Math.floor(Math.random() * accessoryIds.length)
                    ],
                quantity,
                unit_price,
            });
        }

        invoicesData.push({
            invoice_type: "Mua phụ tùng",
            customer_id: customerId,
            point_rule_id: pointRuleId,
            vat: 10,
            discount: Math.floor(Math.random() * 5),
            total_amount: total,
            payment_method:
                paymentMethods[
                    Math.floor(Math.random() * paymentMethods.length)
                ],
            status: statuses[Math.floor(Math.random() * statuses.length)],
            invoice_date: getRandomDate(),
            details: {
                accessories,
            },
        });
    }

    const transaction = await sequelize.transaction();

    try {
        for (const data of invoicesData) {
            // Create invoice
            const invoice = await Invoice.create(
                {
                    invoice_type: data.invoice_type,
                    customer_id: data.customer_id,
                    point_rule_id: data.point_rule_id,
                    vat: data.vat,
                    discount: data.discount,
                    total_amount: data.total_amount,
                    payment_method: data.payment_method,
                    status: data.status,
                    invoice_date: data.invoice_date,
                },
                { transaction }
            );

            if (data.invoice_type === "Sửa chữa" && data.details.repair) {
                const repairDetails = data.details.repair.map((detail) => ({
                    invoice_id: invoice.invoice_id,
                    repair_id: detail.repair_id,
                }));

                await InvoiceRepairDetail.bulkCreate(repairDetails, {
                    transaction,
                });
            } else if (
                data.invoice_type === "Mua phụ tùng" &&
                data.details.accessories
            ) {
                const accessoriesDetails = data.details.accessories.map(
                    (detail) => ({
                        invoice_id: invoice.invoice_id,
                        accessory_id: detail.accessory_id,
                        quantity: detail.quantity,
                        unit_price: detail.unit_price,
                    })
                );

                await InvoiceAccessorieDetail.bulkCreate(accessoriesDetails, {
                    transaction,
                });
            }
        }

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        console.error("Error seeding invoices:", error);
        throw error;
    }
};
