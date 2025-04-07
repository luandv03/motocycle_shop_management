import { Request, Response } from "express";
import { PointRule } from "../../models/PointRule";

export class PointController {
    // Lấy tất cả points
    static async getAllPoints(req: Request, res: Response) {
        try {
            const points = await PointRule.findAll();
            const totalPoints = await PointRule.count();

            return res.status(200).json({
                statusCode: 200,
                message: "Get all points successfully",
                data: {
                    totalPoints,
                    points,
                },
            });
        } catch (error) {
            console.error("Error fetching points:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // Thêm point
    static async addPoint(req: Request, res: Response) {
        try {
            const { rule_name, conversion_value, unit, point_value } = req.body;

            if (!rule_name || !conversion_value || !unit || !point_value) {
                return res
                    .status(400)
                    .json({ message: "Missing required fields" });
            }

            const newPoint = await PointRule.create({
                rule_name,
                conversion_value,
                unit,
                point_value,
            });

            return res.status(201).json({
                statusCode: 201,
                message: "Point added successfully",
                data: newPoint,
            });
        } catch (error) {
            console.error("Error adding point:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // Sửa point
    static async updatePoint(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { rule_name, conversion_value, unit, point_value } = req.body;

            const point = await PointRule.findByPk(id);
            if (!point) {
                return res.status(404).json({ message: "Point not found" });
            }

            await point.update({
                rule_name: rule_name || point.rule_name,
                conversion_value: conversion_value || point.conversion_value,
                unit: unit || point.unit,
                point_value:
                    point_value !== undefined ? point_value : point.point_value,
            });

            return res.status(200).json({
                statusCode: 200,
                message: "Point updated successfully",
                data: point,
            });
        } catch (error) {
            console.error("Error updating point:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // Xóa point
    static async deletePoint(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const point = await PointRule.findByPk(id);
            if (!point) {
                return res.status(404).json({ message: "Point not found" });
            }

            await point.destroy();

            return res.status(200).json({
                statusCode: 200,
                message: "Point deleted successfully",
            });
        } catch (error) {
            console.error("Error deleting point:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}
