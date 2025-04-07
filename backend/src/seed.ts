import sequelize from "./configs/database";
import { runSeeders } from "./seeders";

const run = async () => {
    try {
        // Kết nối cơ sở dữ liệu
        await sequelize.authenticate();
        console.log("Database connected successfully!");

        // Đồng bộ hóa các model (nếu cần)
        await sequelize.sync({ alter: true });
        console.log("Database synchronized successfully!");

        // Chạy seeders
        await runSeeders();
        console.log("Seeding completed successfully!");

        // Đóng kết nối
        await sequelize.close();
        console.log("Database connection closed.");
    } catch (error) {
        console.error("Error while running seeders:", error);
        process.exit(1); // Thoát với mã lỗi
    }
};

run();
