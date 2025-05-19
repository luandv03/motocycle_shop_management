import { User } from "../models/User";
import bcrypt from "bcrypt";

export const seedUsers = async () => {
    // Create admin user
    const adminPassword = await bcrypt.hash("12345678", 10);

    const users = [
        {
            username: "admin",
            password: adminPassword,
            fullname: "Administrator",
            role_id: "R001", // Admin role
        },
        {
            username: "ntd052025",
            password: adminPassword,
            fullname: "Nguyễn Thành Đạt",
            role_id: "R002", // User role
        },
        {
            username: "nvd052025",
            password: adminPassword,
            fullname: "Nguyễn Văn Nam",
            role_id: "R003", // User role
        },
    ];

    for (const user of users) {
        await User.findOrCreate({
            where: { username: user.username }, // Kiểm tra dựa trên username
            defaults: user,
        });
    }
};
