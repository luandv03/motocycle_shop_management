import React, { useState, useEffect } from "react";
import { Button, Table, Tooltip, message } from "antd";
import { EditOutlined } from "@ant-design/icons";
import QRCode from "react-qr-code";
import { jsPDF } from "jspdf";
import { getMotocycleById } from "../services/motocycle.service";
import { useParams } from "react-router-dom";

const ProductDetailPage: React.FC = () => {
    const { motorcycleId } = useParams<{ motorcycleId: string }>(); // Lấy motorcycleId từ URL
    console.log(motorcycleId);
    const [product, setProduct] = useState<any>(null); // State lưu thông tin sản phẩm
    const [colors, setColors] = useState<any[]>([]); // State lưu danh sách màu sắc
    const [specifications, setSpecifications] = useState<any[]>([]); // State lưu danh sách thông số
    const [currentImage, setCurrentImage] = useState<string | null>(null); // Ảnh hiện tại

    // Gọi API để lấy thông tin sản phẩm
    const fetchProductDetails = async () => {
        try {
            const response = await getMotocycleById(motorcycleId!); // Gọi API với ID
            console.log("res", response);
            setProduct(response.motocycle); // Lưu thông tin sản phẩm vào state
            setColors(response.colors); // Lưu danh sách màu sắc vào state
            setSpecifications(response.specifications); // Lưu danh sách thông số vào state
            setCurrentImage(response.motocycle.photos[0]?.photo_url || null); // Ảnh đầu tiên
        } catch (error: any) {
            message.error(error.message || "Không thể lấy thông tin sản phẩm!");
        }
    };

    console.log(product);

    useEffect(() => {
        fetchProductDetails();
    }, [motorcycleId]);

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
            doc.text(product?.motocycle_name || "Sản phẩm", 10, 10);
            doc.addImage(imgData, "PNG", 10, 20, 50, 50);
            doc.save(`${product?.motocycle_id}_QRCode.pdf`);
        };

        img.src = url;
    };

    if (!product) {
        return <div>Đang tải thông tin sản phẩm...</div>;
    }

    return (
        <div style={{ padding: "20px" }}>
            <h1 style={{ marginBottom: "10px" }}>
                <span>{product.motocycle_id}</span>
            </h1>
            <span style={{ fontSize: "24px" }}>{product.motocycle_name}</span>

            {/* Ảnh sản phẩm */}
            <div style={{ marginBottom: "15px" }}>
                <img
                    src={currentImage || ""}
                    alt="Main Product"
                    style={{
                        width: "400px",
                        height: "auto",
                        borderRadius: "10px",
                    }}
                />
            </div>

            {/* Danh sách ảnh nhỏ */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "10px",
                }}
            >
                {product.photos.map((photo: any, index: number) => (
                    <img
                        key={index}
                        src={photo.photo_url}
                        alt={`Thumbnail ${index + 1}`}
                        onClick={() => setCurrentImage(photo.photo_url)}
                        style={{
                            width: "80px",
                            height: "auto",
                            cursor: "pointer",
                            border:
                                currentImage === photo.photo_url
                                    ? "2px solid blue"
                                    : "2px solid transparent",
                            borderRadius: "5px",
                        }}
                    />
                ))}
            </div>

            {/* Mô tả */}
            <p style={{ marginTop: "20px" }}>{product?.description}</p>

            {/* Màu sắc */}
            <div style={{ marginTop: "20px" }}>
                <h3 style={{ marginBottom: "10px" }}>Màu sắc:</h3>
                <Table
                    dataSource={colors.map((color: any, index: number) => ({
                        key: index,
                        color: (
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
                        quantity: color.quantity,
                        price: `${color.price.toLocaleString()} VND`,
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
            </div>

            {/* Thông số kỹ thuật */}
            <div style={{ marginTop: "20px" }}>
                <h3 style={{ marginBottom: "10px" }}>Thông số kỹ thuật:</h3>
                <Table
                    dataSource={specifications.map(
                        (spec: any, index: number) => ({
                            key: index,
                            attribute: spec.name,
                            value: spec.value,
                        })
                    )}
                    columns={[
                        {
                            title: "Thuộc tính",
                            dataIndex: "attribute",
                            key: "attribute",
                        },
                        { title: "Giá trị", dataIndex: "value", key: "value" },
                    ]}
                    pagination={false}
                    bordered
                />
            </div>

            {/* Mã QR */}
            <div style={{ marginTop: "30px", textAlign: "center" }}>
                <h3 style={{ marginBottom: "10px" }}>QR sản phẩm</h3>
                <QRCode
                    id="qrCode"
                    value={`${product.motocycle_id} - ${product.motocycle_name}`}
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
