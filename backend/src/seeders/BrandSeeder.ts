import { Brand } from "../models/Brand";

export const seedBrands = async () => {
    const data = [
        { brand_name: "Honda" },
        { brand_name: "Yamaha" },
        { brand_name: "Suzuki" },
    ];

    for (const item of data) {
        await Brand.findOrCreate({
            where: { brand_name: item.brand_name }, // Kiểm tra dựa trên brand_name
            defaults: item,
        });
    }
};
