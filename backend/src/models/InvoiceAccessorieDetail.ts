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
import { Accessorie } from "./Accessorie";

@Table({ tableName: "invoiceAccessorieDetail" })
export class InvoiceAccessorieDetail extends Model {
    @PrimaryKey
    @Column(DataType.STRING)
    invoiceAccessorieDetail_id!: string;

    @ForeignKey(() => Invoice)
    @Column(DataType.STRING)
    invoice_id!: string;

    @BelongsTo(() => Invoice) // Thêm quan hệ belongsTo với Invoice
    invoice!: Invoice;

    @ForeignKey(() => Accessorie)
    @Column(DataType.STRING)
    accessory_id!: string;

    @BelongsTo(() => Accessorie) // Thêm quan hệ belongsTo với Accessorie
    accessory!: Accessorie;

    @Column(DataType.INTEGER)
    quantity!: number;

    @Column(DataType.DOUBLE)
    unit_price!: number;

    @BeforeCreate
    static async generateInvoiceAccessorieDetailId(
        instance: InvoiceAccessorieDetail
    ) {
        const maxId = await InvoiceAccessorieDetail.max(
            "invoiceAccessorieDetail_id"
        );
        const currentId =
            typeof maxId === "string" ? parseInt(maxId.slice(3)) : 0; // Kiểm tra maxId là chuỗi và lấy phần số
        const nextId = `IAD${(currentId + 1).toString().padStart(3, "0")}`; // Tăng giá trị lên 1
        instance.invoiceAccessorieDetail_id = nextId;
    }

    @BeforeBulkCreate
    static async generateInvoiceAccessorieDetailIds(
        instances: InvoiceAccessorieDetail[]
    ) {
        const maxId = await InvoiceAccessorieDetail.max(
            "invoiceAccessorieDetail_id"
        );
        let currentId =
            typeof maxId === "string" ? parseInt(maxId.slice(3)) : 0; // Kiểm tra maxId là chuỗi và lấy phần số

        for (const instance of instances) {
            currentId += 1;
            instance.invoiceAccessorieDetail_id = `IAD${currentId
                .toString()
                .padStart(3, "0")}`; // Tăng giá trị lên 1
        }
    }
}
