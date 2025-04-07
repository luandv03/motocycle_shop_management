import {
    Table,
    Column,
    Model,
    PrimaryKey,
    DataType,
    BeforeCreate,
    HasMany,
} from "sequelize-typescript";
import { Repairs } from "./Repairs";
import { Invoice } from "./Invoice";

@Table({ tableName: "customer" })
export class Customer extends Model {
    @PrimaryKey
    @Column(DataType.STRING)
    customer_id!: string;

    @Column(DataType.STRING)
    fullname!: string;

    @Column(DataType.STRING)
    phonenumber!: string;

    @Column(DataType.STRING)
    address!: string;

    @Column(DataType.INTEGER)
    loyaltyPoint!: number;

    @HasMany(() => Repairs)
    repairs!: Repairs[];

    @HasMany(() => Invoice)
    invoices!: Invoice[];

    @BeforeCreate
    static async generateCustomerId(instance: Customer) {
        const count = await Customer.count();
        instance.customer_id = `C${(count + 1).toString().padStart(3, "0")}`;
    }
}
