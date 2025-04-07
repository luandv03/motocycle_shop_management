import { Role } from "../models/Role";

export const seedRoles = async () => {
    const data = [
        { role_name: "admin" },
        { role_name: "Chủ cửa hàng" },
        { role_name: "Nhân viên sửa chữa" },
    ];

    for (const item of data) {
        await Role.findOrCreate({
            where: { role_name: item.role_name }, // Kiểm tra dựa trên role_name
            defaults: item,
        });
    }
};
