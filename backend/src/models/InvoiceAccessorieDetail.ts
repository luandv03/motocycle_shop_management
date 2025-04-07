import {
    Table,
    Column,
    Model,
    PrimaryKey,
    DataType,
    ForeignKey,
    BeforeCreate,
} from "sequelize-typescript";
import { Invoice } from "./Invoice";
import { Accessorie } from "./Accessorie";

@Table({ tableName: "invoiceAccessorieDetail" })
export class InvoiceAccessorieDetail extends Model {
    @PrimaryKey
    @Column(DataType.STRING)
    invoiceAccessorieDetail_id!: string;

    @ForeignKey(() => Invoice)
    @Column(DataType.STRING)
    invoice_id!: string;

    @ForeignKey(() => Accessorie)
    @Column(DataType.STRING)
    accessory_id!: string;

    @Column(DataType.INTEGER)
    quantity!: number;

    @Column(DataType.DOUBLE)
    unit_price!: number;

    @BeforeCreate
    static async generateInvoiceAccessorieDetailId(
        instance: InvoiceAccessorieDetail
    ) {
        const count = await InvoiceAccessorieDetail.count();
        instance.invoiceAccessorieDetail_id = `IAD${(count + 1)
            .toString()
            .padStart(3, "0")}`;
    }
}
