import { Router } from "express";
import { AccessorieController } from "../../controllers/accessorie/accessorie.controller";

const router = Router();

// Lấy tất cả phụ tùng
router.get("/", AccessorieController.getAllAccessories);

// Thêm phụ tùng
router.post("/", AccessorieController.addAccessorie);

// Sửa phụ tùng theo id
router.put("/:id", AccessorieController.updateAccessorieById);

// Xóa phụ tùng theo id
router.delete("/:id", AccessorieController.deleteAccessorieById);

export default router;
