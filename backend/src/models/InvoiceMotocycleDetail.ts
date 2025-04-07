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
import { MotocycleColor } from "./MotocycleColor";

@Table({ tableName: "invoiceMotocycleDetail" })
export class InvoiceMotocycleDetail extends Model {
    @PrimaryKey
    @Column(DataType.STRING)
    invoiceMotocycleDetail_id!: string;

    @ForeignKey(() => Invoice)
    @Column(DataType.STRING)
    invoice_id!: string;

    @ForeignKey(() => MotocycleColor)
    @Column(DataType.STRING)
    motorbike_color_id!: string;

    @Column(DataType.INTEGER)
    quantity!: number;

    @Column(DataType.DOUBLE)
    unit_price!: number;

    @BeforeCreate
    static async generateInvoiceMotocycleDetailId(
        instance: InvoiceMotocycleDetail
    ) {
        const count = await InvoiceMotocycleDetail.count();
        instance.invoiceMotocycleDetail_id = `IMD${(count + 1)
            .toString()
            .padStart(3, "0")}`;
    }
}
