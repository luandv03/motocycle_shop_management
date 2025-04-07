import {
    Table,
    Column,
    Model,
    PrimaryKey,
    DataType,
    BeforeCreate,
    HasMany,
} from "sequelize-typescript";
import { User } from "./User";

@Table({ tableName: "role" })
export class Role extends Model {
    @PrimaryKey
    @Column(DataType.STRING)
    role_id!: string;

    @Column(DataType.STRING)
    role_name!: string;

    @HasMany(() => User)
    users!: User[];

    @BeforeCreate
    static async generateRoleId(instance: Role) {
        const count = await Role.count();
        instance.role_id = `R${(count + 1).toString().padStart(3, "0")}`;
    }
}
