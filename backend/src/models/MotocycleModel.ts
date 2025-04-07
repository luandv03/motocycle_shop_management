import {
    Table,
    Column,
    Model,
    PrimaryKey,
    DataType,
    BeforeCreate,
    ForeignKey,
    BelongsTo,
} from "sequelize-typescript";
import { Brand } from "./Brand";

@Table({ tableName: "motocycleModel" })
export class MotocycleModel extends Model {
    @PrimaryKey
    @Column(DataType.STRING)
    motocycle_model_id!: string;

    @ForeignKey(() => Brand)
    @Column(DataType.STRING)
    brand_id!: string;

    @BelongsTo(() => Brand)
    brand!: Brand;

    @Column(DataType.STRING)
    motocycle_model_name!: string;

    @BeforeCreate
    static async generateModelId(instance: MotocycleModel) {
        const count = await MotocycleModel.count();
        instance.motocycle_model_id = `MD${(count + 1)
            .toString()
            .padStart(3, "0")}`;
    }
}
