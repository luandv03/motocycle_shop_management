import { Router } from "express";
import { UploadController } from "../../controllers/upload/upload.controller";
import upload from "../../middlewares/upload";

const router = Router();

// Route upload ảnh
router.post("/upload", upload.single("photo"), UploadController.uploadPhoto);

export default router;
