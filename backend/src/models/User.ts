import {
    Table,
    Column,
    Model,
    PrimaryKey,
    DataType,
    ForeignKey,
    BelongsTo,
    BeforeCreate,
} from "sequelize-typescript";
import { Role } from "./Role";

@Table({ tableName: "user" })
export class User extends Model {
    @PrimaryKey
    @Column(DataType.STRING)
    user_id!: string;

    @ForeignKey(() => Role)
    @Column(DataType.STRING)
    role_id!: string;

    @BelongsTo(() => Role)
    role!: Role;

    @Column(DataType.STRING)
    username!: string;

    @Column(DataType.STRING)
    password!: string;

    @Column(DataType.STRING)
    fullname!: string;

    @BeforeCreate
    static async generateUserId(instance: User) {
        const count = await User.count();
        instance.user_id = `U${(count + 1).toString().padStart(3, "0")}`;
    }
}
