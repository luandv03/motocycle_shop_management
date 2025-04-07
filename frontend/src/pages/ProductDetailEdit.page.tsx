import React, { useState, useEffect } from "react";
import {
    Button,
    Table,
    Tooltip,
    Input,
    InputNumber,
    Upload,
    Modal,
    Select,
    Flex,
    message,
} from "antd";
import {
    EditOutlined,
    SaveOutlined,
    PlusOutlined,
    DeleteOutlined,
} from "@ant-design/icons"; // Import icons from Ant Design
import QRCode from "react-qr-code";
import { jsPDF } from "jspdf";
import { useParams } from "react-router-dom";
import {
    getMotocycleById,
    getAllColors,
    getAllSpecifications,
} from "../services/motocycle.service"; // Import các API

const listColor = [
    { color_id: "CL001", color_name: "Đỏ", color_code: "#FF0000" },
    { color_id: "CL002", color_name: "Xanh", color_code: "#0000FF" },
    { color_id: "CL003", color_name: "Đen", color_code: "#000000" },
    { color_id: "CL004", color_name: "Trắng", color_code: "#FFFFFF" },
    { color_id: "CL005", color_name: "Vàng", color_code: "#FFFF00" },
    { color_id: "CL006", color_name: "Xanh lá", color_code: "#00FF00" },
];

const listSpecifications = [
    { specification_id: "SP001", name: "Động cơ", value: "" },
    { specification_id: "SP002", name: "Công suất", value: "" },
    { specification_id: "SP003", name: "Trọng lượng", value: "" },
    { specification_id: "SP004", name: "Dung tích bình xăng", value: "" },
    { specification_id: "SP005", name: "Chiều cao yên", value: "" },
];

const product = {
    id: "SP001",
    motocycle_name: "Honda CBR 150R",
    images: [
        "https://xemayvietthanh.com/wp-content/uploads/2024/12/XE-GA-50CC-ESPERO-DIAMOND-ULTRA.jpg",
        "https://xemayvietthanh.com/wp-content/uploads/2024/07/xe-cub-espero-Plus-bicau-vang-kemjpg.jpg.webp",
        "https://xemayvietthanh.com/wp-content/uploads/2024/07/xe-cub-espero-Plus-bicau-trang.jpg.webp",
        "https://xemayvietthanh.com/wp-content/uploads/2024/07/xe-cub-espero-Plus-bicau-xanh-tim.jpg.webp",
    ],
    description: "Xe máy thể thao mạnh mẽ, phù hợp cho mọi địa hình.",
    colors: [
        {
            color_name: "Đỏ",
            color_code: "#FF0000",
            quantity: 10,
            price: 5000000,
        },
        {
            color_name: "Xanh",
            color_code: "#0000FF",
            quantity: 5,
            price: 6000000,
        },
        {
            color_name: "Đen",
            color_code: "#000000",
            quantity: 8,
            price: 5500000,
        },
        {
            color_name: "Trắng",
            color_code: "#FFFFFF",
            quantity: 12,
            price: 5200000,
        },
    ],
    specifications: [
        { name: "Động cơ", value: "150cc" },
        { name: "Công suất", value: "17 mã lực" },
        { name: "Trọng lượng", value: "135kg" },
        { name: "Dung tích bình xăng", value: "12 lít" },
    ],
};

const ProductDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Lấy ID từ URL
    const [currentImage, setCurrentImage] = useState(product.images[0]);
    const [isEditing, setIsEditing] = useState(false);
    const [editedProduct, setEditedProduct] = useState(product);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [fileList, setFileList] = useState(
        product.images.map((image, index) => ({
            uid: `${index}`,
            name: `Image ${index + 1}`,
            status: "done" as const, // Ensure the status is a valid UploadFileStatus
            url: image,
        }))
    );
    const [listColors, setListColors] = useState<any[]>([]); // Danh sách màu sắc có sẵn
    const [listSpecifications, setListSpecifications] = useState<any[]>([]); // Danh sách thông số kỹ thuật có sẵn
    const [selectedColor, setSelectedColor] = useState<string | null>(null); // Trạng thái lưu màu được chọn
    const [selectedSpec, setSelectedSpec] = useState<string | null>(null); // Trạng thái lưu thông số được chọn

    // Gọi API để lấy thông tin sản phẩm
    const fetchProductDetails = async () => {
        try {
            const response = await getMotocycleById(id!); // Gọi API với ID từ URL
            // setE(response.motocycle); // Lưu thông tin sản phẩm vào state
            setEditedProduct({
                ...response.motocycle,
                colors: response.colors,
                specifications: response.specifications,
                images: response.motocycle.photos.map(
                    (photo: any) => photo.photo_url
                ),
            });
            setCurrentImage(response.motocycle.photos[0].photo_url); // Đặt ảnh chính là ảnh đầu tiên trong danh sách
            setFileList(
                response.motocycle.photos.map((photo: any, index: number) => ({
                    uid: `${index}`,
                    name: `Image ${index + 1}`,
                    status: "done",
                    url: photo.photo_url,
                }))
            );
        } catch (error: any) {
            message.error(error.message || "Không thể lấy thông tin sản phẩm!");
        }
    };

    // Gọi API để lấy danh sách màu sắc và thông số kỹ thuật
    const fetchAvailableData = async () => {
        try {
            const colors = await getAllColors();
            const specifications = await getAllSpecifications();

            console.log(specifications);

            setListColors(colors); // Lưu danh sách màu sắc vào state

            const newSpecifications = specifications.map((spec) => ({
                specification_id: spec.specification_id,
                name: spec.specification_name,
                value: "",
            }));

            setListSpecifications(newSpecifications); // Lưu danh sách thông số vào state
        } catch (error: any) {
            message.error(
                error.message || "Không thể lấy dữ liệu màu sắc và thông số!"
            );
        }
    };

    useEffect(() => {
        fetchProductDetails(); // Gọi API khi component được mount
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    useEffect(() => {
        if (editedProduct) {
            fetchAvailableData(); // Gọi API để lấy danh sách màu sắc và thông số khi dữ liệu sản phẩm thay đổi
        }
    }, [editedProduct]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        setIsEditing(false);
        message.success("Chỉnh sửa thông tin xe thành công!");
        // Lưu dữ liệu đã chỉnh sửa (có thể gửi lên server tại đây)
        console.log("Saved product:", editedProduct);
    };

    const handleInputChange = (field: string, value: any) => {
        setEditedProduct({ ...editedProduct, [field]: value });
    };

    const handleColorQuantityChange = (index: number, value: number) => {
        const updatedColors = [...editedProduct.colors];
        updatedColors[index].quantity = value;
        setEditedProduct({ ...editedProduct, colors: updatedColors });
    };

    const handleUploadChange = ({ fileList: newFileList }: any) => {
        setFileList(newFileList);
        const updatedImages = newFileList.map(
            (file: any) => file.url || URL.createObjectURL(file.originFileObj)
        );
        setEditedProduct({ ...editedProduct, images: updatedImages });
    };

    const handlePreview = async (file: any) => {
        setPreviewImage(file.url || URL.createObjectURL(file.originFileObj));
        setPreviewVisible(true);
    };

    const handleCancelPreview = () => setPreviewVisible(false);

    const handlePrintQRCode = () => {
        const svgElement = document.getElementById("qrCode") as HTMLElement;
        if (!svgElement) return;

        const svgData = new XMLSerializer().serializeToString(svgElement);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const img = new Image();
        const svgBlob = new Blob([svgData], {
            type: "image/svg+xml;charset=utf-8",
        });
        const url = URL.createObjectURL(svgBlob);

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx?.drawImage(img, 0, 0);
            URL.revokeObjectURL(url);

            const imgData = canvas.toDataURL("image/png");
            const doc = new jsPDF();
            doc.text("Honda CBR 150R", 10, 10);
            doc.addImage(imgData, "PNG", 10, 20, 50, 50);
            doc.save(`${product.id}_QRCode.pdf`);
        };

        img.src = url;
    };

    return (
        <div style={{ padding: "20px" }}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <h1 style={{ marginBottom: "10px" }}>
                    <span>{id}</span>
                </h1>
                <div>
                    {isEditing && (
                        <Button
                            onClick={() => {
                                setEditedProduct(product); // Reset dữ liệu về trạng thái ban đầu
                                setIsEditing(false); // Thoát chế độ chỉnh sửa
                            }}
                            style={{ marginRight: "10px" }}
                        >
                            Hủy
                        </Button>
                    )}
                    <Button
                        onClick={isEditing ? handleSave : handleEdit}
                        type="primary"
                    >
                        {isEditing ? <SaveOutlined /> : <EditOutlined />}
                        {isEditing ? " Lưu" : " Chỉnh sửa"}
                    </Button>
                </div>
            </div>
            <span style={{ fontSize: "24px" }}>
                {isEditing ? (
                    <Input
                        value={editedProduct.motocycle_name}
                        onChange={(e) =>
                            handleInputChange("motocycle_name", e.target.value)
                        }
                        style={{ width: "300px" }}
                    />
                ) : (
                    editedProduct.motocycle_name
                )}
            </span>

            <div style={{ padding: "20px" }}>
                {/* Ảnh chính */}
                <div style={{ marginBottom: "15px" }}>
                    <img
                        src={currentImage}
                        alt="Main Product"
                        style={{
                            width: "400px",
                            height: "auto",
                            borderRadius: "10px",
                        }}
                    />
                </div>

                {/* Danh sách ảnh nhỏ */}
                <div style={{ marginBottom: "20px" }}>
                    <h3 style={{ marginBottom: "10px" }}>Danh sách ảnh:</h3>
                    {isEditing ? (
                        <Upload
                            listType="picture-card"
                            fileList={fileList}
                            onPreview={handlePreview}
                            onChange={handleUploadChange}
                            beforeUpload={() => false} // Ngăn tải lên tự động
                        >
                            {fileList.length >= 8 ? null : (
                                <div>
                                    <PlusOutlined />
                                    <div style={{ marginTop: 8 }}>Thêm ảnh</div>
                                </div>
                            )}
                        </Upload>
                    ) : (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                gap: "10px",
                            }}
                        >
                            {editedProduct.images.map((image, index) => (
                                <img
                                    key={index}
                                    src={image}
                                    alt={`Thumbnail ${index + 1}`}
                                    onClick={() => setCurrentImage(image)}
                                    style={{
                                        width: "80px",
                                        height: "auto",
                                        cursor: "pointer",
                                        border:
                                            currentImage === image
                                                ? "2px solid blue"
                                                : "2px solid transparent",
                                        borderRadius: "5px",
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Modal xem trước ảnh */}
                <Modal
                    visible={previewVisible}
                    footer={null}
                    onCancel={handleCancelPreview}
                >
                    <img
                        alt="Preview"
                        style={{ width: "100%" }}
                        src={previewImage}
                    />
                </Modal>
            </div>

            {/* Mô tả */}
            <p style={{ marginTop: "20px" }}>
                {isEditing ? (
                    <Input.TextArea
                        value={editedProduct.description}
                        onChange={(e) =>
                            handleInputChange("description", e.target.value)
                        }
                        rows={4}
                    />
                ) : (
                    editedProduct.description
                )}
            </p>

            {/* Màu sắc */}
            <div style={{ marginTop: "20px" }}>
                <h3 style={{ marginBottom: "10px" }}>Màu sắc:</h3>
                <Table
                    dataSource={editedProduct.colors.map((color, index) => ({
                        key: index,
                        color: isEditing ? (
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                }}
                            >
                                <div
                                    style={{
                                        width: "30px",
                                        height: "30px",
                                        borderRadius: "50%",
                                        backgroundColor: color.color_code,
                                    }}
                                ></div>
                                <Button
                                    type="text"
                                    icon={<DeleteOutlined />}
                                    danger
                                    onClick={() => {
                                        const updatedColors =
                                            editedProduct.colors.filter(
                                                (_, i) => i !== index
                                            );
                                        setEditedProduct({
                                            ...editedProduct,
                                            colors: updatedColors,
                                        });
                                    }}
                                />
                            </div>
                        ) : (
                            <Tooltip title={color.color_name}>
                                <div
                                    style={{
                                        width: "30px",
                                        height: "30px",
                                        borderRadius: "50%",
                                        backgroundColor: color.color_code,
                                        cursor: "pointer",
                                    }}
                                ></div>
                            </Tooltip>
                        ),
                        quantity: isEditing ? (
                            <InputNumber
                                min={0}
                                value={color.quantity}
                                onChange={(value) =>
                                    handleColorQuantityChange(index, value!)
                                }
                            />
                        ) : (
                            color.quantity
                        ),
                        price: isEditing ? (
                            <InputNumber
                                min={0}
                                value={color.price}
                                onChange={(value) =>
                                    handleColorQuantityChange(index, value!)
                                }
                            />
                        ) : (
                            color.price
                        ),
                    }))}
                    columns={[
                        {
                            title: "Màu sắc",
                            dataIndex: "color",
                            key: "color",
                        },
                        {
                            title: "Số lượng",
                            dataIndex: "quantity",
                            key: "quantity",
                        },
                        {
                            title: "Giá",
                            dataIndex: "price",
                            key: "price",
                        },
                    ]}
                    pagination={false}
                    bordered
                />
                {isEditing && (
                    <Flex style={{ marginTop: "10px" }} align="center">
                        <Select
                            placeholder="Chọn màu"
                            style={{ width: "200px", marginRight: "10px" }}
                            onChange={(value) => setSelectedColor(value)} // Lưu màu được chọn
                        >
                            {listColors
                                .filter(
                                    (color) =>
                                        !editedProduct.colors.some(
                                            (selectedColor) =>
                                                selectedColor.color_code ===
                                                color.color_code
                                        )
                                )
                                .map((color) => (
                                    <Select.Option
                                        key={color.color_code}
                                        value={color.color_code}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "10px",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: "20px",
                                                    height: "20px",
                                                    borderRadius: "50%",
                                                    backgroundColor:
                                                        color.color_code,
                                                }}
                                            ></div>
                                            {color.color_name}
                                        </div>
                                    </Select.Option>
                                ))}
                        </Select>
                        <Button
                            type="dashed"
                            icon={<PlusOutlined />}
                            onClick={() => {
                                if (selectedColor) {
                                    const selectedColorObj = listColors.find(
                                        (color) =>
                                            color.color_code === selectedColor
                                    );
                                    if (selectedColorObj) {
                                        const newColor = {
                                            color_name:
                                                selectedColorObj.color_name,
                                            color_code:
                                                selectedColorObj.color_code,
                                            quantity: 0, // Mặc định số lượng là 0
                                        };
                                        setEditedProduct({
                                            ...editedProduct,
                                            colors: [
                                                ...editedProduct.colors,
                                                newColor,
                                            ],
                                        });
                                        setSelectedColor(null); // Reset trạng thái sau khi thêm
                                    }
                                }
                            }}
                            disabled={!selectedColor} // Vô hiệu hóa nút nếu chưa chọn màu
                        >
                            Thêm màu sắc
                        </Button>
                    </Flex>
                )}
            </div>

            {/* Thông số kỹ thuật */}
            <div style={{ marginTop: "20px" }}>
                <h3 style={{ marginBottom: "10px" }}>Thông số kỹ thuật:</h3>
                <Table
                    dataSource={editedProduct.specifications.map(
                        (spec, index) => ({
                            key: index,
                            attribute: isEditing ? (
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                    }}
                                >
                                    <Input
                                        value={spec.name}
                                        onChange={(e) => {
                                            const updatedSpecs = [
                                                ...editedProduct.specifications,
                                            ];
                                            updatedSpecs[index].name =
                                                e.target.value;
                                            setEditedProduct({
                                                ...editedProduct,
                                                specifications: updatedSpecs,
                                            });
                                        }}
                                        placeholder="Thuộc tính"
                                        style={{ width: "200px" }}
                                    />
                                    <Button
                                        type="text"
                                        icon={<DeleteOutlined />}
                                        danger
                                        onClick={() => {
                                            const updatedSpecs =
                                                editedProduct.specifications.filter(
                                                    (_, i) => i !== index
                                                );
                                            setEditedProduct({
                                                ...editedProduct,
                                                specifications: updatedSpecs,
                                            });
                                        }}
                                    />
                                </div>
                            ) : (
                                spec.name
                            ),
                            value: isEditing ? (
                                <Input
                                    value={spec.value}
                                    onChange={(e) => {
                                        const updatedSpecs = [
                                            ...editedProduct.specifications,
                                        ];
                                        updatedSpecs[index].value =
                                            e.target.value;
                                        setEditedProduct({
                                            ...editedProduct,
                                            specifications: updatedSpecs,
                                        });
                                    }}
                                    placeholder="Giá trị"
                                    style={{ width: "200px" }}
                                />
                            ) : (
                                spec.value
                            ),
                        })
                    )}
                    columns={[
                        {
                            title: "Thuộc tính",
                            dataIndex: "attribute",
                            key: "attribute",
                        },
                        {
                            title: "Giá trị",
                            dataIndex: "value",
                            key: "value",
                        },
                    ]}
                    pagination={false}
                    bordered
                />
                {isEditing && (
                    <div style={{ marginTop: "10px" }}>
                        <Select
                            placeholder="Chọn thông số"
                            style={{ width: "200px", marginRight: "10px" }}
                            value={selectedSpec}
                            onChange={(value) => setSelectedSpec(value)} // Lưu thông số được chọn
                        >
                            {listSpecifications
                                .filter(
                                    (spec) =>
                                        !editedProduct.specifications.some(
                                            (selectedSpec) =>
                                                selectedSpec.name === spec.name
                                        )
                                )
                                .map((spec) => (
                                    <Select.Option
                                        key={spec.name}
                                        value={spec.name}
                                    >
                                        {spec.name}
                                    </Select.Option>
                                ))}
                        </Select>
                        <Button
                            type="dashed"
                            icon={<PlusOutlined />}
                            onClick={() => {
                                if (selectedSpec) {
                                    const newSpec = {
                                        name: selectedSpec,
                                        value: "", // Giá trị mặc định là rỗng
                                    };
                                    setEditedProduct({
                                        ...editedProduct,
                                        specifications: [
                                            ...editedProduct.specifications,
                                            newSpec,
                                        ],
                                    });
                                    setSelectedSpec(null); // Reset trạng thái sau khi thêm
                                }
                            }}
                            disabled={!selectedSpec} // Vô hiệu hóa nút nếu chưa chọn thông số
                        >
                            Thêm thông số
                        </Button>
                    </div>
                )}
            </div>

            {/* Mã QR */}
            <div style={{ marginTop: "30px", textAlign: "center" }}>
                <h3 style={{ marginBottom: "10px" }}>QR sản phẩm</h3>
                <QRCode
                    id="qrCode"
                    value={`${editedProduct.id} - ${editedProduct.motocycle_name}`}
                    size={150}
                    level="H"
                />
                <div style={{ marginTop: "10px" }}>
                    <Button type="primary" onClick={handlePrintQRCode}>
                        In mã QR
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
