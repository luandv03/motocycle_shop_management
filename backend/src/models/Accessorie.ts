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
import { InvoiceAccessorieDetail } from "./InvoiceAccessorieDetail"; // Import InvoiceAccessorieDetail model

@Table({ tableName: "accessorie" })
export class Accessorie extends Model {
    @PrimaryKey
    @Column(DataType.STRING)
    accessory_id!: string;

    @Column(DataType.STRING)
    accessory_name!: string;

    @Column(DataType.INTEGER)
    quantity!: number;

    @Column(DataType.INTEGER)
    price!: number;

    @HasMany(() => RepairAccessories)
    repairAccessories!: RepairAccessories[];

    @HasMany(() => InvoiceAccessorieDetail) // Thêm quan hệ hasMany với InvoiceAccessorieDetail
    invoiceAccessorieDetails!: InvoiceAccessorieDetail[];

    @BeforeCreate
    static async generateAccessoryId(instance: Accessorie) {
        const count = await Accessorie.count();
        instance.accessory_id = `A${(count + 1).toString().padStart(3, "0")}`;
    }
}
