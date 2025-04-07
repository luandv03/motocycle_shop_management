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
import { Repairs } from "./Repairs";

@Table({ tableName: "invoiceRepairDetail" })
export class InvoiceRepairDetail extends Model {
    @PrimaryKey
    @Column(DataType.STRING)
    invoiceRepairDetail_id!: string;

    @ForeignKey(() => Invoice)
    @Column(DataType.STRING)
    invoice_id!: string;

    @ForeignKey(() => Repairs)
    @Column(DataType.STRING)
    repairlID!: string;

    @BeforeCreate
    static async generateInvoiceRepairDetailId(instance: InvoiceRepairDetail) {
        const count = await InvoiceRepairDetail.count();
        instance.invoiceRepairDetail_id = `IRD${(count + 1)
            .toString()
            .padStart(3, "0")}`;
    }
}
