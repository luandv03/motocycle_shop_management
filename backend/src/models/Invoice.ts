import {
    Table,
    Column,
    Model,
    PrimaryKey,
    DataType,
    BeforeCreate,
    ForeignKey,
    BelongsTo,
    HasMany,
} from "sequelize-typescript";
import { Customer } from "./Customer";
import { PointRule } from "./PointRule";
import { InvoiceMotocycleDetail } from "./InvoiceMotocycleDetail";
import { InvoiceRepairDetail } from "./InvoiceRepairDetail";
import { InvoiceAccessorieDetail } from "./InvoiceAccessorieDetail";

@Table({ tableName: "invoice" })
export class Invoice extends Model {
    @PrimaryKey
    @Column(DataType.STRING)
    invoice_id!: string;

    @ForeignKey(() => Customer)
    @Column(DataType.STRING)
    customer_id!: string;

    @BelongsTo(() => Customer)
    customer!: Customer;

    @ForeignKey(() => PointRule)
    @Column(DataType.STRING)
    point_rule_id!: string;

    @BelongsTo(() => PointRule)
    pointRule!: PointRule;

    @Column(DataType.INTEGER)
    vat!: number;

    @Column(DataType.INTEGER)
    discount!: number;

    @Column(DataType.DOUBLE)
    total_amount!: number;

    @Column(DataType.STRING)
    payment_method!: string;

    @Column(DataType.STRING)
    status!: string;

    @Column(DataType.DATE)
    invoice_date!: Date;

    @Column(DataType.STRING)
    invoice_type!: string;

    @HasMany(() => InvoiceMotocycleDetail) // Thêm quan hệ hasMany
    invoiceMotocycleDetails!: InvoiceMotocycleDetail[];

    @HasMany(() => InvoiceRepairDetail) // Thêm quan hệ hasMany với InvoiceRepairDetail
    invoiceRepairDetails!: InvoiceRepairDetail[];

    @HasMany(() => InvoiceAccessorieDetail) // Thêm quan hệ hasMany với InvoiceAccessorieDetail
    invoiceAccessorieDetails!: InvoiceAccessorieDetail[];

    @BeforeCreate
    static async generateInvoiceId(instance: Invoice) {
        const count = await Invoice.count();
        instance.invoice_id = `I${(count + 1).toString().padStart(3, "0")}`;
    }
}
