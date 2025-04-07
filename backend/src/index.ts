import express from "express";
import cors from "cors"; // Import middleware CORS

import sequelize from "./configs/database";
import userRoutes from "./routes/user/user.route";
import productRoutes from "./routes/product/product.route";
import motocycleRoutes from "./routes/motocycle/motocycle.route";
import uploadRoutes from "./routes/upload/upload.route";
import accessorieRoutes from "./routes/accessorie/accessorie.route";
import customerRoutes from "./routes/customer/customer.route";
import repairRoutes from "./routes/repair/repair.route";
import pointRoutes from "./routes/point/point.route";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// CORS configuration
app.use(
    cors({
        origin: "*", // Cho phép tất cả các nguồn (hoặc thay bằng danh sách nguồn cụ thể)
        methods: ["GET", "POST", "PUT", "DELETE"], // Các phương thức HTTP được phép
        allowedHeaders: ["Content-Type", "Authorization"], // Các header được phép
    })
);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/motocycles", motocycleRoutes);
app.use("/api/photos", uploadRoutes);
app.use("/api/accessories", accessorieRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/repairs", repairRoutes);
app.use("/api/points", pointRoutes);

// Test route
app.get("/", (req, res) => {
    res.send("Server is running!");
});

// Connect to the database and start the server
const startServer = async () => {
    try {
        // Đồng bộ hóa các model với cơ sở dữ liệu
        await sequelize.sync({ alter: true }); // Sử dụng { alter: true } để cập nhật bảng nếu cần
        console.log("Database synchronized successfully!");

        await sequelize.authenticate();
        console.log("Database connected successfully!");

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};

startServer();
