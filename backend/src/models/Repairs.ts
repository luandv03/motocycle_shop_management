import {
    Table,
    Column,
    Model,
    PrimaryKey,
    DataType,
    BeforeCreate,
    ForeignKey,
    BelongsTo,
    HasMany,
} from "sequelize-typescript";
import { Customer } from "./Customer";
import { RepairAccessories } from "./RepairAccessories";

@Table({ tableName: "repairs" })
export class Repairs extends Model {
    @PrimaryKey
    @Column(DataType.STRING)
    repair_id!: string;

    @ForeignKey(() => Customer)
    @Column(DataType.STRING)
    customer_id!: string;

    @BelongsTo(() => Customer)
    customer!: Customer;

    @Column(DataType.STRING)
    motocycle_name!: string;

    @Column(DataType.TEXT)
    repair_detail!: string;

    @Column(DataType.STRING)
    status!: string;

    @Column(DataType.DOUBLE)
    extra_fee!: number;

    @Column(DataType.DOUBLE)
    cost!: number;

    @Column(DataType.DATE)
    repair_time!: Date;

    @HasMany(() => RepairAccessories)
    repairAccessories!: RepairAccessories[];

    @BeforeCreate
    static async generateRepairId(instance: Repairs) {
        const count = await Repairs.count();
        instance.repair_id = `R${(count + 1).toString().padStart(3, "0")}`;
    }
}
