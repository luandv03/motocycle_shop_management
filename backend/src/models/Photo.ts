import {
    Table,
    Column,
    Model,
    PrimaryKey,
    DataType,
    ForeignKey,
    BelongsTo,
    BeforeCreate,
    BeforeBulkCreate,
} from "sequelize-typescript";
import { Motocycle } from "./Motocycle";

@Table({ tableName: "photo" })
export class Photo extends Model {
    @PrimaryKey
    @Column(DataType.STRING)
    photo_id!: string;

    @ForeignKey(() => Motocycle)
    @Column(DataType.STRING)
    motocycle_id!: string;

    @BelongsTo(() => Motocycle)
    motocycle!: Motocycle;

    @Column(DataType.TEXT)
    photo_url!: string;

    // Tạo photo_id duy nhất trước khi tạo một bản ghi
    @BeforeCreate
    static async generatePhotoId(instance: Photo) {
        const maxId = await Photo.max("photo_id");
        const currentId =
            typeof maxId === "string" ? parseInt(maxId.slice(2)) : 0; // Kiểm tra maxId là chuỗi
        const nextId = `PT${(currentId + 1).toString().padStart(3, "0")}`; // Tăng giá trị lên 1
        instance.photo_id = nextId;
    }

    // Tạo photo_id duy nhất trước khi tạo nhiều bản ghi
    @BeforeBulkCreate
    static async generatePhotoIds(instances: Photo[]) {
        const maxId = await Photo.max("photo_id");
        let currentId =
            typeof maxId === "string" ? parseInt(maxId.slice(2)) : 0; // Kiểm tra maxId là chuỗi

        for (const instance of instances) {
            currentId += 1;
            instance.photo_id = `PT${currentId.toString().padStart(3, "0")}`; // Tăng giá trị lên 1
        }
    }
}
