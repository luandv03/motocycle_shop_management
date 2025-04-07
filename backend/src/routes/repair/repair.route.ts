import { Router } from "express";
import { RepairController } from "../../controllers/repair/repair.controller";

const router = Router();

// Lấy tất cả các lần sửa chữa
router.get("/", RepairController.getAllRepairs);

// Thêm một lần sửa chữa mới
router.post("/", RepairController.addRepair);

// Lấy thông tin chi tiết của một lần sửa chữa theo ID
router.get("/:id", RepairController.getRepairById);

// Cập nhật thông tin của một lần sửa chữa theo ID
router.put("/:id", RepairController.updateRepairById);

export default router;
