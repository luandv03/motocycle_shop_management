import {
    Table,
    Column,
    Model,
    PrimaryKey,
    DataType,
    BeforeCreate,
} from "sequelize-typescript";

@Table({ tableName: "pointRule" })
export class PointRule extends Model {
    @PrimaryKey
    @Column(DataType.STRING)
    point_rule_id!: string;

    @Column(DataType.STRING)
    rule_name!: string;

    @Column(DataType.STRING)
    conversion_value!: string;

    @Column(DataType.STRING)
    unit!: string;

    @Column(DataType.INTEGER)
    point_value!: number;

    @BeforeCreate
    static async generatePointRuleId(instance: PointRule) {
        const maxId = await PointRule.max("point_rule_id");
        const currentId =
            typeof maxId === "string" ? parseInt(maxId.slice(2)) : 0; // Kiểm tra maxId là chuỗi
        const nextId = `PR${(currentId + 1).toString().padStart(3, "0")}`; // Tăng giá trị lên 1
        instance.point_rule_id = nextId;
    }
}
