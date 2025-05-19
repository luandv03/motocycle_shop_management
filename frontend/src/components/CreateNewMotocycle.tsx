import React, { useState, useEffect } from "react";
import {
    Modal,
    Form,
    Input,
    Select,
    Upload,
    Button,
    Row,
    Col,
    message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import QRCode from "react-qr-code";

import { uploadPhoto } from "../services/upload.service";
import {
    getAllBrands,
    getMotocycleModelsByBrand,
} from "../services/product.service";
import {
    getAllColors,
    getAllSpecifications,
    createMotocycle,
} from "../services/motocycle.service";

const { Option } = Select;

interface CreateNewMotocycleProps {
    visible: boolean;
    onCancel: () => void;
    onSave: (data: {
        key: string;
        id: string;
        name: string;
        brand: string;
        model: string;
        status: string;
        stock: number;
    }) => void;
}

const CreateNewMotocycle: React.FC<CreateNewMotocycleProps> = ({
    visible,
    onCancel,
    onSave,
}) => {
    const [form] = Form.useForm();
    const [brands, setBrands] = useState<any[]>([]);
    const [models, setModels] = useState<any[]>([]);
    const [colors, setColors] = useState<any[]>([]);
    const [specifications, setSpecifications] = useState<any[]>([]);
    const [selectedBrand, setSelectedBrand] = useState<string | undefined>(
        undefined
    );
    const [photos, setPhotos] = useState<string[]>([]); // State lưu URL ảnh đã upload
    const [qrCodeValue, setQrCodeValue] = useState<string | null>(null);

    // Lấy danh sách brands từ API
    const fetchBrands = async () => {
        try {
            const response = await getAllBrands();
            setBrands(response.brands);
        } catch (error: any) {
            message.error(error.message || "Không thể lấy danh sách hãng xe!");
        }
    };

    // Lấy danh sách models theo brand từ API
    const fetchModels = async (brandId: string) => {
        try {
            const response = await getMotocycleModelsByBrand(brandId);
            setModels(response);
        } catch (error: any) {
            message.error(error.message || "Không thể lấy danh sách dòng xe!");
        }
    };

    // Lấy danh sách màu sắc từ API
    const fetchColors = async () => {
        try {
            const response = await getAllColors();
            setColors(response);
        } catch (error: any) {
            message.error(error.message || "Không thể lấy danh sách màu sắc!");
        }
    };

    // Lấy danh sách thông số từ API
    const fetchSpecifications = async () => {
        try {
            const response = await getAllSpecifications();
            setSpecifications(response);
        } catch (error: any) {
            message.error(error.message || "Không thể lấy danh sách thông số!");
        }
    };

    // Xử lý upload ảnh
    const handleUpload = async ({ file }: any) => {
        try {
            const uploadedPhoto = await uploadPhoto(file); // Gọi API upload ảnh
            setPhotos((prevPhotos) => [...prevPhotos, uploadedPhoto.url]); // Lưu URL ảnh vào state
            message.success("Ảnh đã được upload thành công!");
        } catch (error: any) {
            message.error(error.message || "Không thể upload ảnh!");
        }
    };

    // Xử lý khi lưu form
    const handleSave = async (values: any) => {
        try {
            const payload = {
                ...values,
                photos,
                specifications: values.attributes.map((attr: any) => ({
                    specification_id: attr.attribute,
                    specification_value: attr.value,
                })),
                colors: values.colors.map((color: any) => ({
                    color_id: color.color,
                    quantity: color.quantity,
                    price: color.price,
                })),
            };
            const res = await createMotocycle(payload); // Gọi API tạo motocycle
            console.log(res);
            message.success("Tạo xe máy mới thành công!");
            onSave({
                key: res?.motocycle_id,
                id: res?.motocycle_id,
                name: res?.motocycle_name,
                brand: brands.find((b) => b.brand_id === values.brand)
                    ?.brand_name,
                model: models.find(
                    (m) => m.motocycle_model_id === values.motocycle_model_id
                )?.motocycle_model_name,
                status: res?.status,
                stock: values.colors.reduce(
                    (acc: number, color: any) => acc + Number(color.quantity),
                    0
                ),
            });
            form.resetFields();
            setPhotos([]);
        } catch (error: any) {
            message.error(error.message || "Không thể tạo xe máy mới!");
        }
    };

    // Gọi API khi component được mount
    useEffect(() => {
        fetchBrands();
        fetchColors();
        fetchSpecifications();
    }, []);

    // Gọi API lấy models khi brand thay đổi
    useEffect(() => {
        if (selectedBrand) {
            fetchModels(selectedBrand);
        } else {
            setModels([]);
        }
    }, [selectedBrand]);

    return (
        <Modal
            title="Thêm xe mới"
            visible={visible}
            onCancel={() => {
                onCancel();
                form.resetFields(); // Reset form khi đóng modal
                setPhotos([]);
            }}
            footer={null}
            width={800}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSave}
                initialValues={{
                    brand: undefined,
                    model: undefined,
                    colors: [],
                    attributes: [],
                }}
            >
                <Form.Item label="Ảnh sản phẩm">
                    <Upload
                        listType="picture-card"
                        multiple
                        customRequest={({ file, onSuccess }) => {
                            handleUpload({ file });
                            setTimeout(() => {
                                onSuccess?.("ok");
                            }, 0);
                        }}
                        onRemove={(file) => {
                            setPhotos((prevPhotos) =>
                                prevPhotos.filter(
                                    (url) => url !== file.url // Xóa URL khỏi state khi xóa ảnh
                                )
                            );
                        }}
                    >
                        <div>
                            <PlusOutlined />
                            <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
                        </div>
                    </Upload>
                </Form.Item>

                <Form.Item
                    label="Tên sản phẩm"
                    name="motocycle_name"
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng nhập tên sản phẩm!",
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item label="Mô tả" name="description">
                    <Input.TextArea rows={4} />
                </Form.Item>
                <Form.Item
                    label="Hãng xe"
                    name="brand"
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng chọn hãng xe!",
                        },
                    ]}
                >
                    <Select
                        placeholder="Chọn hãng xe"
                        onChange={(value) => setSelectedBrand(value)}
                    >
                        {brands.map((brand) => (
                            <Option key={brand.brand_id} value={brand.brand_id}>
                                {brand.brand_name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Dòng xe"
                    name="motocycle_model_id"
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng chọn dòng xe!",
                        },
                    ]}
                >
                    <Select
                        placeholder="Chọn dòng xe"
                        disabled={!selectedBrand}
                    >
                        {models.map((model) => (
                            <Option
                                key={model.motocycle_model_id}
                                value={model.motocycle_model_id}
                            >
                                {model.motocycle_model_name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Tình trạng"
                    name="status"
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng chọn tình trạng xe!",
                        },
                    ]}
                >
                    <Select placeholder="Chọn tình trạng">
                        <Option value="Xe mới">Xe mới</Option>
                        <Option value="Xe cũ">Xe cũ</Option>
                    </Select>
                </Form.Item>

                {/* Danh sách màu sắc */}
                <Form.List name="colors">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(
                                ({ key, name, fieldKey, ...restField }) => (
                                    <Row key={key} gutter={16}>
                                        <Col span={4}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, "color"]}
                                                fieldKey={[fieldKey, "color"]}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            "Vui lòng chọn màu!",
                                                    },
                                                ]}
                                            >
                                                <Select placeholder="Chọn màu">
                                                    {colors.map((color) => (
                                                        <Option
                                                            key={color.color_id}
                                                            value={
                                                                color.color_id
                                                            }
                                                        >
                                                            {color.color_name}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col span={4}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, "quantity"]}
                                                fieldKey={[
                                                    fieldKey,
                                                    "quantity",
                                                ]}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            "Vui lòng nhập số lượng!",
                                                    },
                                                ]}
                                            >
                                                <Input placeholder="Nhập số lượng" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, "price"]}
                                                fieldKey={[fieldKey, "price"]}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            "Vui lòng nhập giá!",
                                                    },
                                                ]}
                                            >
                                                <Input placeholder="Nhập giá" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={4}>
                                            <Button
                                                type="text"
                                                danger
                                                onClick={() => remove(name)}
                                            >
                                                Xóa
                                            </Button>
                                        </Col>
                                    </Row>
                                )
                            )}
                            <Form.Item>
                                <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    block
                                    icon={<PlusOutlined />}
                                >
                                    Thêm màu
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>

                {/* Danh sách thông số */}
                <Form.List name="attributes">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(
                                ({ key, name, fieldKey, ...restField }) => (
                                    <Row key={key} gutter={16} align="middle">
                                        <Col span={10}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, "attribute"]}
                                                fieldKey={[
                                                    fieldKey,
                                                    "attribute",
                                                ]}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            "Vui lòng chọn thuộc tính!",
                                                    },
                                                ]}
                                            >
                                                <Select placeholder="Chọn thuộc tính">
                                                    {specifications.map(
                                                        (spec) => (
                                                            <Option
                                                                key={
                                                                    spec.specification_id
                                                                }
                                                                value={
                                                                    spec.specification_id
                                                                }
                                                            >
                                                                {
                                                                    spec.specification_name
                                                                }
                                                            </Option>
                                                        )
                                                    )}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col span={10}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, "value"]}
                                                fieldKey={[fieldKey, "value"]}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            "Vui lòng nhập giá trị!",
                                                    },
                                                ]}
                                            >
                                                <Input placeholder="Nhập giá trị" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={4}>
                                            <Button
                                                type="text"
                                                danger
                                                onClick={() => remove(name)}
                                            >
                                                Xóa
                                            </Button>
                                        </Col>
                                    </Row>
                                )
                            )}
                            <Form.Item>
                                <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    block
                                    icon={<PlusOutlined />}
                                >
                                    Thêm thuộc tính
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>

                {/* Nút tạo mã QR */}
                <Row justify="start" style={{ marginBottom: 16 }}>
                    <Button
                        type="primary"
                        onClick={() =>
                            setQrCodeValue(
                                JSON.stringify(form.getFieldsValue())
                            )
                        }
                    >
                        Tạo mã QR
                    </Button>
                </Row>

                {/* Hiển thị mã QR */}
                {qrCodeValue && (
                    <Row justify="center" style={{ marginBottom: 16 }}>
                        <QRCode value={qrCodeValue} size={200} />
                    </Row>
                )}

                <Row justify="end" gutter={16}>
                    <Col>
                        <Button onClick={onCancel}>Hủy</Button>
                    </Col>
                    <Col>
                        <Button type="primary" htmlType="submit">
                            Lưu
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default CreateNewMotocycle;
