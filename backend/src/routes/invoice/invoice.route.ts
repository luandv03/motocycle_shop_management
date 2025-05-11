import { Router } from "express";
import { InvoiceController } from "../../controllers/invoice/invoice.controller";

const router = Router();

// Route để lấy tất cả hóa đơn
router.get("/", InvoiceController.getAllInvoices);

// Route để tạo hóa đơn
router.post("/", InvoiceController.createInvoice);

// Route để lấy hóa đơn theo ID
router.get("/:id", InvoiceController.getInvoiceDetailsById);

// Route để cập nhật hóa đơn theo ID
router.put("/:id", InvoiceController.updateStatusInvoice);

export default router;
