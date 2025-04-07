import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../../models/User";
import { Role } from "../../models/Role"; // Import model Role nếu chưa có
import { stat } from "fs";

export class UserController {
    // Đăng nhập
    static async login(req: Request, res: Response) {
        const { username, password } = req.body;

        try {
            const user = await User.findOne({ where: { username } });
            if (!user) {
                return res
                    .status(401)
                    .json({ message: "Invalid username or password" });
            }

            const isPasswordValid = await bcrypt.compare(
                password,
                user.password
            );
            if (!isPasswordValid) {
                return res
                    .status(401)
                    .json({ message: "Invalid username or password" });
            }

            const accessToken = jwt.sign(
                { userId: user.user_id, role: user.role_id },
                process.env.JWT_SECRET as string,
                { expiresIn: "1d" }
            );

            const refreshToken = jwt.sign(
                { userId: user.user_id },
                process.env.JWT_REFRESH_SECRET as string,
                { expiresIn: "7d" }
            );

            return res.status(200).json({
                message: "Login successful",
                accessToken,
                refreshToken,
            });
        } catch (error) {
            console.error("Login error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // Lấy thông tin người dùng từ token
    static async getUserInfo(req: Request, res: Response) {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const token = authHeader.split(" ")[1];

        try {
            // Xác thực token
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET as string
            ) as { userId: string };

            // Lấy thông tin người dùng từ cơ sở dữ liệu
            const user = await User.findByPk(decoded.userId, {
                attributes: ["user_id", "username", "fullname", "role_id"], // Chỉ lấy các trường cần thiết
            });

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            return res.status(200).json({
                message: "User info retrieved successfully",
                user,
            });
        } catch (error) {
            console.error("Get user info error:", error);
            return res
                .status(401)
                .json({ message: "Invalid or expired token" });
        }
    }

    // Tạo tài khoản
    static async register(req: Request, res: Response) {
        const { username, password, fullname, role_id } = req.body;

        try {
            const existingUser = await User.findOne({ where: { username } });
            if (existingUser) {
                return res
                    .status(400)
                    .json({ message: "Username already exists" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = await User.create({
                username,
                password: hashedPassword,
                fullname,
                role_id,
            });

            return res.status(201).json({
                statusCode: 201,
                message: "User registered successfully",
                user: {
                    user_id: newUser.user_id,
                    username: newUser.username,
                    fullname: newUser.fullname,
                    role_id: newUser.role_id,
                },
            });
        } catch (error) {
            console.error("Register error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // Cập nhật thông tin người dùng
    static async updateUser(req: Request, res: Response) {
        const { userId } = req.params; // Lấy userId từ URL
        const { username, password, fullname, role_id } = req.body;

        try {
            // Tìm người dùng theo userId
            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // Cập nhật thông tin
            if (username) user.username = username;
            if (fullname) user.fullname = fullname;
            if (role_id) user.role_id = role_id;

            // Nếu có mật khẩu mới, băm mật khẩu trước khi lưu
            if (password) {
                const hashedPassword = await bcrypt.hash(password, 10);
                user.password = hashedPassword;
            }

            // Lưu thay đổi
            await user.save();

            return res.status(200).json({
                message: "User updated successfully",
                user: {
                    user_id: user.user_id,
                    username: user.username,
                    fullname: user.fullname,
                    role_id: user.role_id,
                },
            });
        } catch (error) {
            console.error("Update user error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // Lấy toàn bộ danh sách người dùng
    static async getAllUsers(req: Request, res: Response) {
        try {
            const users = await User.findAll({
                attributes: ["user_id", "username", "fullname"], // Chỉ lấy các trường cần thiết từ User
                include: [
                    {
                        model: Role, // Liên kết với bảng Role
                        attributes: ["role_name", "role_id"], // Lấy tên vai trò
                    },
                ],
            });

            return res.status(200).json({
                statusCode: 200,
                message: "Users retrieved successfully",
                data: users,
            });
        } catch (error) {
            console.error("Get all users error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}
