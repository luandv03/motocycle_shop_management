import {
    Table,
    Column,
    Model,
    PrimaryKey,
    DataType,
    BeforeCreate,
    HasMany,
} from "sequelize-typescript";
import { MotocycleModel } from "./MotocycleModel";

@Table({ tableName: "brand" })
export class Brand extends Model {
    @PrimaryKey
    @Column(DataType.STRING)
    brand_id!: string;

    @Column(DataType.STRING)
    brand_name!: string;

    @HasMany(() => MotocycleModel)
    motocycleModels!: MotocycleModel[];

    @BeforeCreate
    static async generateBrandId(instance: Brand) {
        const count = await Brand.count();
        instance.brand_id = `B${(count + 1).toString().padStart(3, "0")}`;
    }
}
