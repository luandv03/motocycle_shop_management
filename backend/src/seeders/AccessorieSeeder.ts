import { Accessorie } from "../models/Accessorie";

export const seedAccessories = async () => {
    const data = [
        { accessory_name: "Nón bảo hiểm", quantity: 50, price: 200000 },
        { accessory_name: "Găng tay", quantity: 100, price: 50000 },
        { accessory_name: "Áo mưa", quantity: 30, price: 150000 },
        { accessory_name: "Giá đỡ điện thoại", quantity: 20, price: 120000 },
        { accessory_name: "Gương chiếu hậu", quantity: 40, price: 80000 },
        { accessory_name: "Baga xe", quantity: 15, price: 250000 },
        { accessory_name: "Ống xả (pô xe)", quantity: 10, price: 450000 },
        { accessory_name: "Đèn xi nhan", quantity: 60, price: 30000 },
        { accessory_name: "Bình ắc quy", quantity: 25, price: 400000 },
        { accessory_name: "Khóa chống trộm", quantity: 35, price: 100000 },
        { accessory_name: "Lốp xe", quantity: 20, price: 600000 },
        { accessory_name: "Nhông xích", quantity: 30, price: 200000 },
        { accessory_name: "Yên xe", quantity: 15, price: 300000 },
        { accessory_name: "Kính chắn gió", quantity: 12, price: 180000 },
        { accessory_name: "Chắn bùn", quantity: 18, price: 120000 },
    ];

    for (const item of data) {
        await Accessorie.findOrCreate({
            where: { accessory_name: item.accessory_name }, // Kiểm tra dựa trên accessory_id
            defaults: item,
        });
    }
};
