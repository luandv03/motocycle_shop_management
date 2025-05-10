import {
    Table,
    Column,
    Model,
    PrimaryKey,
    DataType,
    ForeignKey,
    BeforeCreate,
    BeforeBulkCreate,
    BelongsTo,
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

    @BelongsTo(() => Invoice) // Thêm quan hệ belongsTo
    invoice!: Invoice;

    @ForeignKey(() => MotocycleColor)
    @Column(DataType.STRING)
    motorcycle_color_id!: string;

    @BelongsTo(() => MotocycleColor) // Thêm quan hệ belongsTo
    motocycleColor!: MotocycleColor;

    @Column(DataType.INTEGER)
    quantity!: number;

    @Column(DataType.DOUBLE)
    unit_price!: number;

    @BeforeCreate
    static async generateInvoiceMotocycleDetailId(
        instance: InvoiceMotocycleDetail
    ) {
        const maxId = await InvoiceMotocycleDetail.max(
            "invoiceMotocycleDetail_id"
        );
        const currentId =
            typeof maxId === "string" ? parseInt(maxId.slice(3)) : 0; // Kiểm tra maxId là chuỗi và lấy phần số
        const nextId = `IMD${(currentId + 1).toString().padStart(3, "0")}`; // Tăng giá trị lên 1
        instance.invoiceMotocycleDetail_id = nextId;
    }

    @BeforeBulkCreate
    static async generateInvoiceMotocycleDetailIds(
        instances: InvoiceMotocycleDetail[]
    ) {
        const maxId = await InvoiceMotocycleDetail.max(
            "invoiceMotocycleDetail_id"
        );
        let currentId =
            typeof maxId === "string" ? parseInt(maxId.slice(3)) : 0; // Kiểm tra maxId là chuỗi và lấy phần số

        for (const instance of instances) {
            currentId += 1;
            instance.invoiceMotocycleDetail_id = `IMD${currentId
                .toString()
                .padStart(3, "0")}`; // Tăng giá trị lên 1
        }
    }
}
