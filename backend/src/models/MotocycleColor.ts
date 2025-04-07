import {
    Table,
    Column,
    Model,
    PrimaryKey,
    DataType,
    ForeignKey,
    BeforeCreate,
    BelongsTo,
    BeforeBulkCreate,
} from "sequelize-typescript";
import { Motocycle } from "./Motocycle";
import { Color } from "./Color";

@Table({ tableName: "motocycleColor" })
export class MotocycleColor extends Model {
    @PrimaryKey
    @Column(DataType.STRING)
    motocycle_color_id!: string;

    @ForeignKey(() => Motocycle)
    @Column(DataType.STRING)
    motocycle_id!: string;

    @ForeignKey(() => Color)
    @Column(DataType.STRING)
    color_id!: string;

    @Column(DataType.INTEGER)
    quantity!: number;

    @Column(DataType.DOUBLE)
    price!: number;

    @BelongsTo(() => Color)
    Color!: Color; // Định nghĩa mối quan hệ với bảng Color

    @BelongsTo(() => Motocycle)
    Motocycle!: Motocycle; // Định nghĩa mối quan hệ với bảng Motocycle

    @BeforeCreate
    static async generateMotocycleColorId(instance: MotocycleColor) {
        const count = await MotocycleColor.count();
        instance.motocycle_color_id = `MC${(count + 1)
            .toString()
            .padStart(3, "0")}`;
    }

    @BeforeBulkCreate
    static async generateMotocycleColorIds(instances: MotocycleColor[]) {
        let count = await MotocycleColor.count();
        for (const instance of instances) {
            count += 1;
            instance.motocycle_color_id = `MC${count
                .toString()
                .padStart(3, "0")}`;
        }
    }
}
