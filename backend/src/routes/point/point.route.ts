import { Router } from "express";
import { PointController } from "../../controllers/point/point.controller";

const router = Router();

// Lấy tất cả points
router.get("/", PointController.getAllPoints);

// Thêm point
router.post("/", PointController.addPoint);

// Sửa point
router.put("/:id", PointController.updatePoint);

// Xóa point
router.delete("/:id", PointController.deletePoint);

export default router;
