import { Motocycle } from "../models/Motocycle";
import { MotocycleColor } from "../models/MotocycleColor";
import { Photo } from "../models/Photo";
import { MotocycleSpecification } from "../models/MotocycleSpecification";
import sequelize from "../configs/database";

export const seedMotocycles = async () => {
    const motocycleData = [
        {
            motocycle_name: "Honda Wave Alpha 110cc",
            description:
                "Honda Wave Alpha phiên bản mới với thiết kế hiện đại, tiết kiệm nhiên liệu và động cơ bền bỉ.",
            status: "Còn hàng",
            motocycle_model_id: "MD001", // Honda Wave Alpha
            colors: [
                { color_id: "CL001", quantity: 15, price: 18000000 },
                { color_id: "CL002", quantity: 10, price: 18000000 },
            ],
            photos: [
                "https://cdn.honda.com.vn/motorbikes/September2023/whZmDOevLGrETLGQat0m.png",
                "https://cdn.honda.com.vn/motorbikes/September2023/OyCJKbdFHNQQJv0KJUcB.png",
            ],
            specifications: [
                {
                    specification_id: "SP001",
                    specification_value: "1.914 × 688 × 1.075 mm",
                },
                { specification_id: "SP011", specification_value: "109,1 cc" },
            ],
        },
        {
            motocycle_name: "Honda Winner X",
            description:
                "Winner X - mẫu xe côn tay thể thao cỡ nhỏ với thiết kế trẻ trung, năng động.",
            status: "Còn hàng",
            motocycle_model_id: "MD003", // Honda Winner X
            colors: [
                { color_id: "CL003", quantity: 8, price: 46000000 },
                { color_id: "CL004", quantity: 12, price: 46500000 },
            ],
            photos: [
                "https://cdn.honda.com.vn/motorbikes/October2022/rRWrgSkjH3gZgvA4oCg7.png",
                "https://cdn.honda.com.vn/motorbikes/October2022/ggWkuKXcvwbaouJkRNX5.png",
            ],
            specifications: [
                {
                    specification_id: "SP001",
                    specification_value: "2.019 × 727 × 1.088 mm",
                },
                { specification_id: "SP011", specification_value: "149,1 cc" },
            ],
        },
        {
            motocycle_name: "Yamaha Exciter 155 VVA",
            description:
                "Yamaha Exciter 155 - vua côn tay thế hệ mới với thiết kế đậm chất thể thao và công nghệ hiện đại.",
            status: "Còn hàng",
            motocycle_model_id: "MD006", // Yamaha Exciter
            colors: [
                { color_id: "CL002", quantity: 7, price: 50900000 },
                { color_id: "CL003", quantity: 9, price: 50900000 },
            ],
            photos: [
                "https://yamaha-motor.com.vn/wp/wp-content/uploads/2021/12/Exciter-155-phien-ban-Monster-Energy-Yamaha-MotoGP-1.png",
                "https://yamaha-motor.com.vn/wp/wp-content/uploads/2021/12/Exciter-155-phien-ban-Monster-Energy-Yamaha-MotoGP-2.png",
            ],
            specifications: [
                {
                    specification_id: "SP001",
                    specification_value: "1.975 × 665 × 1.085 mm",
                },
                { specification_id: "SP011", specification_value: "155 cc" },
            ],
        },
        {
            motocycle_name: "Yamaha NVX 155 VVA",
            description:
                "NVX 155 VVA - xe tay ga thể thao cao cấp với công nghệ van biến thiên độc quyền từ Yamaha.",
            status: "Còn hàng",
            motocycle_model_id: "MD009", // Yamaha NVX
            colors: [
                { color_id: "CL001", quantity: 10, price: 53000000 },
                { color_id: "CL005", quantity: 8, price: 53000000 },
            ],
            photos: [
                "https://yamaha-motor.com.vn/wp/wp-content/uploads/2020/12/NVX-155-VVA-mau-xanh-1.png",
                "https://yamaha-motor.com.vn/wp/wp-content/uploads/2020/12/NVX-155-VVA-mau-xanh-2.png",
            ],
            specifications: [
                {
                    specification_id: "SP001",
                    specification_value: "1.980 × 700 × 1.150 mm",
                },
                { specification_id: "SP011", specification_value: "155 cc" },
            ],
        },
        {
            motocycle_name: "Suzuki Raider R150 Fi",
            description:
                "Suzuki Raider - mẫu xe côn tay underbone 150cc mạnh mẽ với thiết kế góc cạnh, thể thao.",
            status: "Còn hàng",
            motocycle_model_id: "MD011", // Suzuki Raider
            colors: [
                { color_id: "CL002", quantity: 5, price: 49990000 },
                { color_id: "CL003", quantity: 7, price: 49990000 },
            ],
            photos: [
                "https://suzuki.com.vn/images/Raider-R150-2023/Raider-Moi-Xanh-GP-1.jpg",
                "https://suzuki.com.vn/images/Raider-R150-2023/Raider-Moi-Xanh-GP-2.jpg",
            ],
            specifications: [
                {
                    specification_id: "SP001",
                    specification_value: "1.960 × 675 × 980 mm",
                },
                { specification_id: "SP011", specification_value: "147,3 cc" },
            ],
        },
        {
            motocycle_name: "Honda SH Mode 125cc",
            description:
                "SH Mode - xe tay ga cao cấp với thiết kế sang trọng, tinh tế và nhiều tính năng hiện đại.",
            status: "Còn hàng",
            motocycle_model_id: "MD004", // Honda SH Mode
            colors: [
                { color_id: "CL001", quantity: 6, price: 62000000 },
                { color_id: "CL005", quantity: 8, price: 62000000 },
            ],
            photos: [
                "https://cdn.honda.com.vn/motorbikes/October2022/7vgtUlJJANVo2YHk3qrV.png",
                "https://cdn.honda.com.vn/motorbikes/October2022/J5uhDvSuTVfeszdAJ2Zr.png",
            ],
            specifications: [
                {
                    specification_id: "SP001",
                    specification_value: "1.950 × 669 × 1.100 mm",
                },
                { specification_id: "SP011", specification_value: "124,8 cc" },
            ],
        },
        {
            motocycle_name: "Honda Air Blade 125/160",
            description:
                "Air Blade - xe tay ga thể thao với thiết kế cá tính, động cơ mạnh mẽ và tiết kiệm nhiên liệu.",
            status: "Còn hàng",
            motocycle_model_id: "MD005", // Honda Air Blade
            colors: [
                { color_id: "CL003", quantity: 10, price: 42000000 },
                { color_id: "CL004", quantity: 12, price: 42000000 },
            ],
            photos: [
                "https://cdn.honda.com.vn/motorbikes/December2021/qkGdRQdWdbo0iI9DhOJm.png",
                "https://cdn.honda.com.vn/motorbikes/December2021/xmEXXQJGujv74gD79tz7.png",
            ],
            specifications: [
                {
                    specification_id: "SP001",
                    specification_value: "1.887 × 687 × 1.092 mm",
                },
                {
                    specification_id: "SP011",
                    specification_value: "125/160 cc",
                },
            ],
        },
        {
            motocycle_name: "Yamaha Sirius",
            description:
                "Sirius - xe số phổ thông bán chạy của Yamaha với ưu điểm bền bỉ, tiết kiệm nhiên liệu.",
            status: "Còn hàng",
            motocycle_model_id: "MD010", // Yamaha Sirius
            colors: [
                { color_id: "CL001", quantity: 15, price: 21300000 },
                { color_id: "CL002", quantity: 10, price: 21300000 },
            ],
            photos: [
                "https://yamaha-motor.com.vn/wp/wp-content/uploads/2020/08/Sirius-Phanh-Co-Xanh-duong.png",
                "https://yamaha-motor.com.vn/wp/wp-content/uploads/2020/08/siriuschidien2.jpg",
            ],
            specifications: [
                {
                    specification_id: "SP001",
                    specification_value: "1.890 × 665 × 1.035 mm",
                },
                { specification_id: "SP011", specification_value: "110 cc" },
            ],
        },
        {
            motocycle_name: "Suzuki GSX-R150",
            description:
                "GSX-R150 - mẫu sportbike cỡ nhỏ với thiết kế thể thao đúng chất, động cơ mạnh mẽ.",
            status: "Còn hàng",
            motocycle_model_id: "MD012", // Suzuki GSX-R150
            colors: [
                { color_id: "CL002", quantity: 4, price: 71000000 },
                { color_id: "CL003", quantity: 3, price: 71000000 },
            ],
            photos: [
                "https://suzuki.com.vn/images/GSX-R150-2023/GSX-R150-xanh.png",
                "https://suzuki.com.vn/images/GSX-R150-2023/GSX-R150-xanh-2.png",
            ],
            specifications: [
                {
                    specification_id: "SP001",
                    specification_value: "2.020 × 700 × 1.075 mm",
                },
                { specification_id: "SP011", specification_value: "147,3 cc" },
            ],
        },
        {
            motocycle_name: "Suzuki Address",
            description:
                "Suzuki Address - xe tay ga nhỏ gọn, hiện đại với khả năng tiết kiệm nhiên liệu vượt trội.",
            status: "Còn hàng",
            motocycle_model_id: "MD013", // Suzuki Address
            colors: [
                { color_id: "CL001", quantity: 8, price: 28000000 },
                { color_id: "CL005", quantity: 6, price: 28000000 },
            ],
            photos: [
                "https://suzuki.com.vn/images/ADDRESS-2023/Address-den-1.png",
                "https://suzuki.com.vn/images/ADDRESS-2023/Address-den-2.png",
            ],
            specifications: [
                {
                    specification_id: "SP001",
                    specification_value: "1.845 × 665 × 1.095 mm",
                },
                { specification_id: "SP011", specification_value: "113 cc" },
            ],
        },
    ];

    const transaction = await sequelize.transaction();
    try {
        for (const data of motocycleData) {
            // Find or create motocycle to avoid duplicate key error
            const [motocycle, created] = await Motocycle.findOrCreate({
                where: { motocycle_name: data.motocycle_name },
                defaults: {
                    motocycle_name: data.motocycle_name,
                    description: data.description,
                    status: data.status,
                    motocycle_model_id: data.motocycle_model_id,
                },
                transaction,
            }); // Create motocycle colors only if motorcycle was just created or no colors exist
            if (data.colors && data.colors.length > 0) {
                // Check if colors already exist for this motorcycle
                const existingColors = await MotocycleColor.count({
                    where: { motocycle_id: motocycle.motocycle_id },
                    transaction,
                });

                // Only add colors if none exist
                if (existingColors === 0) {
                    const colorData = data.colors.map((color) => ({
                        motocycle_id: motocycle.motocycle_id,
                        color_id: color.color_id,
                        quantity: color.quantity,
                        price: color.price,
                    }));
                    await MotocycleColor.bulkCreate(colorData, { transaction });
                }
            } // Create photos only if none exist for this motorcycle
            if (data.photos && data.photos.length > 0) {
                // Check if photos already exist for this motorcycle
                const existingPhotos = await Photo.count({
                    where: { motocycle_id: motocycle.motocycle_id },
                    transaction,
                });

                // Only add photos if none exist
                if (existingPhotos === 0) {
                    const photoData = data.photos.map((url) => ({
                        photo_url: url,
                        motocycle_id: motocycle.motocycle_id,
                    }));
                    await Photo.bulkCreate(photoData, { transaction });
                }
            }

            // Create specifications only if none exist for this motorcycle
            if (data.specifications && data.specifications.length > 0) {
                // Check if specifications already exist for this motorcycle
                const existingSpecs = await MotocycleSpecification.count({
                    where: { motocycle_id: motocycle.motocycle_id },
                    transaction,
                });

                // Only add specifications if none exist
                if (existingSpecs === 0) {
                    const specData = data.specifications.map((spec) => ({
                        motocycle_id: motocycle.motocycle_id,
                        specification_id: spec.specification_id,
                        specification_value: spec.specification_value,
                    }));
                    await MotocycleSpecification.bulkCreate(specData, {
                        transaction,
                    });
                }
            }
        }

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        console.error("Error seeding motorcycles:", error);
        throw error;
    }
};
