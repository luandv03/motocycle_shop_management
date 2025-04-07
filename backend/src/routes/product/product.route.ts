import { Router } from "express";
import { ProductController } from "../../controllers/product/product.controller";

const router = Router();

// Routes cho Brand
router.get("/brands", ProductController.getBrands); // Lấy danh sách brand theo phân trang
router.get("/brands/search", ProductController.searchBrand); // Tìm kiếm brand theo tên
router.post("/brands", ProductController.addBrand); // Thêm brand
router.get("/brands/:id", ProductController.getBrandById); // Xem chi tiết brand theo id
router.put("/brands/:id", ProductController.updateBrand); // Sửa brand theo id
router.delete("/brands/:id", ProductController.deleteBrand); // Xóa brand theo id

// Routes cho MotocycleModel
router.get("/models", ProductController.getMotocycleModels); // Lấy danh sách MotocycleModel theo phân trang
router.get("/models/filter", ProductController.filterMotocycleModelsByBrand); // Lọc MotocycleModel theo brand
router.get("/models/search", ProductController.searchMotocycleModel); // Tìm kiếm MotocycleModel theo tên
router.post("/models", ProductController.addMotocycleModel); // Thêm MotocycleModel
router.get("/models/:id", ProductController.getMotocycleModelById); // Xem chi tiết MotocycleModel theo id
router.put("/models/:id", ProductController.updateMotocycleModel); // Sửa MotocycleModel theo id
router.delete("/models/:id", ProductController.deleteMotocycleModel); // Xóa MotocycleModel theo id

// Routes cho Color
router.get("/colors", ProductController.getAllColors); // Lấy tất cả màu sắc

// Routes cho Specification
router.get("/specifications", ProductController.getAllSpecifications); // Lấy tất cả thông số kỹ thuật

export default router;
