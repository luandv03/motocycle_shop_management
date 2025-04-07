import { MotocycleModel } from "../models/MotocycleModel";

export const seedMotocycleModels = async () => {
    const data = [
        // Models for Brand B001 (Honda)
        { brand_id: "B001", motocycle_model_name: "Wave Alpha" },
        { brand_id: "B001", motocycle_model_name: "Future" },
        { brand_id: "B001", motocycle_model_name: "Winner X" },
        { brand_id: "B001", motocycle_model_name: "SH Mode" },
        { brand_id: "B001", motocycle_model_name: "Air Blade" },

        // Models for Brand B002 (Yamaha)
        { brand_id: "B002", motocycle_model_name: "Exciter" },
        { brand_id: "B002", motocycle_model_name: "Janus" },
        { brand_id: "B002", motocycle_model_name: "Grande" },
        { brand_id: "B002", motocycle_model_name: "NVX" },
        { brand_id: "B002", motocycle_model_name: "Sirius" },

        // Models for Brand B003 (Suzuki)
        { brand_id: "B003", motocycle_model_name: "Raider" },
        { brand_id: "B003", motocycle_model_name: "GSX-R150" },
        { brand_id: "B003", motocycle_model_name: "Address" },
        { brand_id: "B003", motocycle_model_name: "GD110HU" },
        { brand_id: "B003", motocycle_model_name: "Hayate" },
    ];

    for (const item of data) {
        await MotocycleModel.findOrCreate({
            where: { motocycle_model_name: item.motocycle_model_name }, // Kiểm tra dựa trên model_name
            defaults: item,
        });
    }
};
