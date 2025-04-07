import { Router } from "express";
import { CustomerController } from "../../controllers/customer/customer.controller";

const router = Router();

// Lấy tất cả khách hàng
router.get("/", CustomerController.getAllCustomers);

// Thêm khách hàng mới
router.post("/", CustomerController.addCustomer);

// Sửa thông tin khách hàng theo id
router.put("/:id", CustomerController.editCustomer);

export default router;
