import {
    Table,
    Column,
    Model,
    PrimaryKey,
    DataType,
    ForeignKey,
    BeforeCreate,
    BelongsTo,
} from "sequelize-typescript";
import { Repairs } from "./Repairs";
import { Accessorie } from "./Accessorie";

@Table({ tableName: "repair_accessories" })
export class RepairAccessories extends Model {
    @PrimaryKey
    @Column(DataType.STRING)
    repair_accessorie_id!: string;

    @ForeignKey(() => Repairs)
    @PrimaryKey
    @Column(DataType.STRING)
    repair_id!: string;

    @BelongsTo(() => Repairs)
    repair!: Repairs;

    @BelongsTo(() => Accessorie)
    accessorie!: Accessorie;

    @ForeignKey(() => Accessorie)
    @PrimaryKey
    @Column(DataType.STRING)
    accessory_id!: string;

    @Column(DataType.INTEGER)
    quantity!: number;

    @Column(DataType.DOUBLE)
    unit_price!: number;

    @BeforeCreate
    static async generateRepairAccessoryId(instance: RepairAccessories) {
        const count = await RepairAccessories.count();
        instance.repair_accessorie_id = `RA${(count + 1)
            .toString()
            .padStart(3, "0")}`;
    }
}
