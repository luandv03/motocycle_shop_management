import {
    Table,
    Column,
    Model,
    PrimaryKey,
    DataType,
    ForeignKey,
    BeforeCreate,
    BelongsTo,
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

    @BelongsTo(() => Invoice) // Thêm quan hệ belongsTo với Invoice
    invoice!: Invoice;

    @ForeignKey(() => Repairs)
    @Column(DataType.STRING)
    repair_id!: string;

    @BelongsTo(() => Repairs) // Thêm quan hệ belongsTo với Repairs
    repair!: Repairs;

    @BeforeCreate
    static async generateInvoiceRepairDetailId(instance: InvoiceRepairDetail) {
        const maxId = await InvoiceRepairDetail.max("invoiceRepairDetail_id");
        const currentId =
            typeof maxId === "string" ? parseInt(maxId.slice(3)) : 0; // Kiểm tra maxId là chuỗi và lấy phần số
        const nextId = `IRD${(currentId + 1).toString().padStart(3, "0")}`; // Tăng giá trị lên 1
        instance.invoiceRepairDetail_id = nextId;
    }
}
