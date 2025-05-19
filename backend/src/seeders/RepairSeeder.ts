import { Repairs } from "../models/Repairs";
import { RepairAccessories } from "../models/RepairAccessories";
import sequelize from "../configs/database";

export const seedRepairs = async () => {
    // Created some demo customer IDs - in a real situation, you would query existing customers
    const customerIds = ["C001", "C002", "C003", "C004", "C005"];

    const statuses = [
        "Chờ xử lý",
        "Đang sửa chữa",
        "Đã sửa xong",
        "Đã thanh toán",
        "Đã hủy",
    ];

    const repairData = [
        {
            customer_id: customerIds[0],
            motocycle_name: "Honda Wave Alpha",
            repair_detail: "Thay nhớt, vệ sinh bộ lọc gió",
            status: "Đã sửa xong",
            extra_fee: 50000,
            cost: 250000,
            repair_time: new Date("2025-05-15"),
            accessories: [
                { accessory_id: "A002", quantity: 1, unit_price: 50000 },
                { accessory_id: "A008", quantity: 2, unit_price: 30000 },
            ],
        },
        {
            customer_id: customerIds[1],
            motocycle_name: "Yamaha Exciter",
            repair_detail: "Thay nhông xích, điều chỉnh côn",
            status: "Đã thanh toán",
            extra_fee: 100000,
            cost: 400000,
            repair_time: new Date("2025-05-16"),
            accessories: [
                { accessory_id: "A012", quantity: 1, unit_price: 200000 },
            ],
        },
        {
            customer_id: customerIds[2],
            motocycle_name: "Honda Winner X",
            repair_detail: "Thay lốp trước và sau",
            status: "Đã thanh toán",
            extra_fee: 80000,
            cost: 780000,
            repair_time: new Date("2025-05-15"),
            accessories: [
                { accessory_id: "A011", quantity: 2, unit_price: 600000 },
            ],
        },
        {
            customer_id: customerIds[0],
            motocycle_name: "Suzuki Raider",
            repair_detail: "Sửa ống xả, thay bugi",
            status: "Đang sửa chữa",
            extra_fee: 150000,
            cost: 650000,
            repair_time: new Date("2025-05-17"),
            accessories: [
                { accessory_id: "A007", quantity: 1, unit_price: 450000 },
            ],
        },
        {
            customer_id: customerIds[3],
            motocycle_name: "Honda SH Mode",
            repair_detail: "Thay bình ắc quy, kiểm tra điện",
            status: "Chờ xử lý",
            extra_fee: 70000,
            cost: 470000,
            repair_time: new Date("2025-05-18"),
            accessories: [
                { accessory_id: "A009", quantity: 1, unit_price: 400000 },
            ],
        },
        {
            customer_id: customerIds[4],
            motocycle_name: "Yamaha NVX",
            repair_detail: "Thay gương chiếu hậu bên trái",
            status: "Đã sửa xong",
            extra_fee: 30000,
            cost: 110000,
            repair_time: new Date("2025-05-16"),
            accessories: [
                { accessory_id: "A005", quantity: 1, unit_price: 80000 },
            ],
        },
        {
            customer_id: customerIds[1],
            motocycle_name: "Suzuki GSX-R150",
            repair_detail: "Nâng cấp hệ thống phanh, thay dầu phanh",
            status: "Đã thanh toán",
            extra_fee: 200000,
            cost: 500000,
            repair_time: new Date("2025-05-15"),
            accessories: [],
        },
        {
            customer_id: customerIds[2],
            motocycle_name: "Honda Air Blade",
            repair_detail: "Vệ sinh họng xăng, kiểm tra kim phun",
            status: "Đang sửa chữa",
            extra_fee: 120000,
            cost: 320000,
            repair_time: new Date("2025-05-17"),
            accessories: [],
        },
        {
            customer_id: customerIds[3],
            motocycle_name: "Yamaha Sirius",
            repair_detail: "Thay yên xe, điều chỉnh chiều cao",
            status: "Đã sửa xong",
            extra_fee: 50000,
            cost: 350000,
            repair_time: new Date("2025-05-16"),
            accessories: [
                { accessory_id: "A013", quantity: 1, unit_price: 300000 },
            ],
        },
        {
            customer_id: customerIds[4],
            motocycle_name: "Suzuki Address",
            repair_detail: "Kiểm tra, sửa chữa hộp số",
            status: "Chờ xử lý",
            extra_fee: 300000,
            cost: 600000,
            repair_time: new Date("2025-05-18"),
            accessories: [],
        },
    ];

    const transaction = await sequelize.transaction();

    try {
        for (const data of repairData) {
            // Create repair
            const repair = await Repairs.create(
                {
                    customer_id: data.customer_id,
                    motocycle_name: data.motocycle_name,
                    repair_detail: data.repair_detail,
                    status: data.status,
                    extra_fee: data.extra_fee,
                    cost: data.cost,
                    repair_time: data.repair_time,
                },
                { transaction }
            );

            // Create repair accessories
            if (data.accessories && data.accessories.length > 0) {
                const accessoryData = data.accessories.map((accessory) => ({
                    repair_id: repair.repair_id,
                    accessory_id: accessory.accessory_id,
                    quantity: accessory.quantity,
                    unit_price: accessory.unit_price,
                }));
                await RepairAccessories.bulkCreate(accessoryData, {
                    transaction,
                });
            }
        }

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        console.error("Error seeding repairs:", error);
        throw error;
    }
};
