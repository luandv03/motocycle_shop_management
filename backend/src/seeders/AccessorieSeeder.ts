import { Accessorie } from "../models/Accessorie";

export const seedAccessories = async () => {
    const data = [
        { accessorie_name: "Nón bảo hiểm", quantity: 50, price: 200000 },
        { accessorie_name: "Găng tay", quantity: 100, price: 50000 },
        { accessorie_name: "Áo mưa", quantity: 30, price: 150000 },
        { accessorie_name: "Giá đỡ điện thoại", quantity: 20, price: 120000 },
        { accessorie_name: "Gương chiếu hậu", quantity: 40, price: 80000 },
        { accessorie_name: "Baga xe", quantity: 15, price: 250000 },
        { accessorie_name: "Ống xả (pô xe)", quantity: 10, price: 450000 },
        { accessorie_name: "Đèn xi nhan", quantity: 60, price: 30000 },
        { accessorie_name: "Bình ắc quy", quantity: 25, price: 400000 },
        { accessorie_name: "Khóa chống trộm", quantity: 35, price: 100000 },
        { accessorie_name: "Lốp xe", quantity: 20, price: 600000 },
        { accessorie_name: "Nhông xích", quantity: 30, price: 200000 },
        { accessorie_name: "Yên xe", quantity: 15, price: 300000 },
        { accessorie_name: "Kính chắn gió", quantity: 12, price: 180000 },
        { accessorie_name: "Chắn bùn", quantity: 18, price: 120000 },
    ];

    for (const item of data) {
        await Accessorie.findOrCreate({
            where: { accessorie_name: item.accessorie_name }, // Kiểm tra dựa trên accessory_id
            defaults: item,
        });
    }
};
