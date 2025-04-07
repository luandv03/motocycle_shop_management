import {
    Table,
    Column,
    Model,
    PrimaryKey,
    DataType,
    BeforeCreate,
} from "sequelize-typescript";

@Table({ tableName: "color" })
export class Color extends Model {
    @PrimaryKey
    @Column(DataType.STRING)
    color_id!: string;

    @Column(DataType.STRING)
    color_name!: string;

    @Column(DataType.STRING)
    color_code!: string;

    @BeforeCreate
    static async generateColorId(instance: Color) {
        const count = await Color.count();
        instance.color_id = `CL${(count + 1).toString().padStart(3, "0")}`;
    }
}
