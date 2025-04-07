import { Router } from "express";
import { UserController } from "../../controllers/user/user.controller";

const router = Router();

// Route đăng nhập
router.post("/login", UserController.login);

// Route đăng ký tài khoản
router.post("/register", UserController.register);

// Route lấy thông tin người dùng
router.get("/profile", UserController.getUserInfo);

// Route cập nhật thông tin người dùng
router.put("/edit/:userId", UserController.updateUser);

// Route lấy danh sách người dùng
router.get("/", UserController.getAllUsers);

export default router;
