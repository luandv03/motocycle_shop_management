import {
    Table,
    Column,
    Model,
    PrimaryKey,
    DataType,
    BeforeCreate,
} from "sequelize-typescript";

@Table({ tableName: "specification" })
export class Specification extends Model {
    @PrimaryKey
    @Column(DataType.STRING)
    specification_id!: string;

    @Column(DataType.STRING)
    specification_name!: string;

    @BeforeCreate
    static async generateSpecificationId(instance: Specification) {
        const count = await Specification.count();
        instance.specification_id = `SP${(count + 1)
            .toString()
            .padStart(3, "0")}`;
    }
}
