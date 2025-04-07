import { Router } from "express";
import { MotocycleController } from "../../controllers/motocycle/motocycle.controller";

const router = Router();

// Route lấy danh sách xe máy (kết hợp phân trang)
router.get("/", MotocycleController.getMotocycles);

// Route lấy tất cả xe máy (không phân trang)
router.get("/all", MotocycleController.getAllMotocycles);

// Route xem chi tiết xe máy theo id
router.get("/:id", MotocycleController.getMotocycleById);

// Route tìm kiếm xe máy theo tên và các tiêu chí lọc
router.get("/search", MotocycleController.searchMotocycles);

// Route tạo xe mới
router.post("/", MotocycleController.createMotocycle);

// Route cập nhật xe theo id
router.put("/:id", MotocycleController.updateMotocycleById);

export default router;
