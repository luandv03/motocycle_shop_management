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
    BeforeBulkCreate,
} from "sequelize-typescript";
import { MotocycleModel } from "./MotocycleModel";
import { Photo } from "./Photo";
import { MotocycleColor } from "./MotocycleColor"; // Import MotocycleColor model

@Table({ tableName: "motocycle" })
export class Motocycle extends Model {
    @PrimaryKey
    @Column(DataType.STRING)
    motocycle_id!: string;

    @ForeignKey(() => MotocycleModel)
    @Column(DataType.STRING)
    motocycle_model_id!: string;

    @BelongsTo(() => MotocycleModel)
    motocycle_model!: MotocycleModel;

    @Column(DataType.STRING)
    motocycle_name!: string;

    @Column(DataType.STRING)
    description!: string;

    @Column(DataType.STRING)
    status!: string;

    @HasMany(() => Photo)
    photos!: Photo[];

    @HasMany(() => MotocycleColor)
    motocycleColors!: MotocycleColor[]; // Thiết lập mối quan hệ với MotocycleColor

    @BeforeCreate
    static async generateMotocycleId(instance: Motocycle) {
        const count = await Motocycle.count();
        instance.motocycle_id = `M${(count + 1).toString().padStart(3, "0")}`;
    }
}
