import { PointRule } from "../models/PointRule";

export const seedPointRules = async () => {
    const data = [
        {
            rule_name: "Quy tắc tính điểm khi mua xe",
            conversion_value: "10000",
            unit: "VND",
            point_value: 1,
        },
        {
            rule_name: "Quy tắc tính điểm khi sửa chữa xe",
            conversion_value: "20000",
            unit: "VND",
            point_value: 1,
        },
        {
            rule_name: "Quy tắc tính điểm khi mua xe phụ tùng",
            conversion_value: "15000",
            unit: "VND",
            point_value: 1,
        },
    ];

    for (const item of data) {
        await PointRule.findOrCreate({
            where: { rule_name: item.rule_name }, // Kiểm tra dựa trên rule_name
            defaults: item,
        });
    }
};
