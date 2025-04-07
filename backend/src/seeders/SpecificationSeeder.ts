import { Specification } from "../models/Specification";

export const seedSpecifications = async () => {
    const data = [
        { specification_name: "Kích thước (Dài x Rộng x Cao)" },
        { specification_name: "Khối lượng bản thân" },
        { specification_name: "Khoảng cách trục bánh xe" },
        { specification_name: "Độ cao yên" },
        { specification_name: "Khoảng sáng gầm xe" },
        { specification_name: "Dung tích bình xăng" },
        { specification_name: "Kích cỡ lốp trước/lốp sau" },
        { specification_name: "Phuộc trước" },
        { specification_name: "Phuộc sau" },
        { specification_name: "Loại động cơ" },
        { specification_name: "Dung tích xi-lanh" },
        { specification_name: "Mức tiêu hao nhiên liệu" },
        { specification_name: "Xuất xứ" },
    ];

    for (const item of data) {
        await Specification.findOrCreate({
            where: { specification_name: item.specification_name }, // Kiểm tra dựa trên specification_name
            defaults: item,
        });
    }
};
