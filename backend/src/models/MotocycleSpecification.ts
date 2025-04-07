import {
    Table,
    Column,
    Model,
    PrimaryKey,
    DataType,
    ForeignKey,
    BelongsTo,
} from "sequelize-typescript";
import { Motocycle } from "./Motocycle";
import { Specification } from "./Specification";

@Table({ tableName: "motocycleSpecification" })
export class MotocycleSpecification extends Model {
    @ForeignKey(() => Motocycle)
    @PrimaryKey
    @Column(DataType.STRING)
    motocycle_id!: string;

    @ForeignKey(() => Specification)
    @PrimaryKey
    @Column(DataType.STRING)
    specification_id!: string;

    @Column(DataType.STRING)
    specification_value!: string;

    @BelongsTo(() => Specification)
    Specification!: Specification; // Định nghĩa mối quan hệ với bảng Specification
}
