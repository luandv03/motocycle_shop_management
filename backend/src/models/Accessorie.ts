import {
    Table,
    Column,
    Model,
    PrimaryKey,
    DataType,
    BeforeCreate,
    HasMany,
} from "sequelize-typescript";
import { RepairAccessories } from "./RepairAccessories";

@Table({ tableName: "accessorie" })
export class Accessorie extends Model {
    @PrimaryKey
    @Column(DataType.STRING)
    accessory_id!: string;

    @Column(DataType.STRING)
    accessorie_name!: string;

    @Column(DataType.INTEGER)
    quantity!: number;

    @Column(DataType.INTEGER)
    price!: number;

    @HasMany(() => RepairAccessories)
    repairAccessories!: RepairAccessories[];

    @BeforeCreate
    static async generateAccessoryId(instance: Accessorie) {
        const count = await Accessorie.count();
        instance.accessory_id = `A${(count + 1).toString().padStart(3, "0")}`;
    }
}
