import { Color } from "../models/Color";

export const seedColors = async () => {
    const data = [
        { color_name: "Đen bóng", color_code: "#000000" },
        { color_name: "Đen nhám", color_code: "#1C1C1C" },
        { color_name: "Trắng", color_code: "#FFFFFF" },
        { color_name: "Trắng nhám", color_code: "#EDEDED" },
        { color_name: "Đỏ tươi", color_code: "#C40024" },
        { color_name: "Đỏ nhám", color_code: "#8B0000" },
        { color_name: "Đỏ đô", color_code: "#7C0A02" },
        { color_name: "Xám", color_code: "#808080" },
        { color_name: "Xám nhám", color_code: "#595959" },
        { color_name: "Nâu", color_code: "#4E342E" },
        { color_name: "Nâu đất", color_code: "#3B2F2F" },
        { color_name: "Xanh dương", color_code: "#0033A0" },
        { color_name: "Xanh lá", color_code: "#2E8B57" },
        { color_name: "Vàng", color_code: "#FFD700" },
        { color_name: "Cam", color_code: "#FF8C00" },
        { color_name: "Tím", color_code: "#800080" },
    ];

    for (const item of data) {
        await Color.findOrCreate({
            where: { color_name: item.color_name }, // Kiểm tra dựa trên color_name
            defaults: item,
        });
    }
};
