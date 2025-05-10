import React, { useState, useEffect } from "react";
import {
    Modal,
    Form,
    Input,
    InputNumber,
    Select,
    Button,
    Row,
    Col,
    DatePicker,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import moment from "moment"; // Import moment để định dạng ngày giờ

const { Option } = Select;

interface EditRepairProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (values: any) => void;
    editingRepair: any;
    customers: string[];
    accessories: { name: string; price: number }[];
}

const EditRepair: React.FC<EditRepairProps> = ({
    visible,
    onClose,
    onSubmit,
    editingRepair,
    customers,
    accessories,
}) => {
    const [form] = Form.useForm();
    const [selectedAccessories, setSelectedAccessories] = useState<
        { name: string; price: number; quantity: number }[]
    >([]);
    const [accessoryCost, setAccessoryCost] = useState(0);

    useEffect(() => {
        if (editingRepair) {
            console.log(editingRepair);
            form.setFieldsValue({
                ...editingRepair,
                customer: editingRepair.customer.fullname,
                laborCost: parseInt(
                    editingRepair?.laborCost?.replace(/[^0-9]/g, "") || "0"
                ),
                accessoryCost: parseInt(
                    editingRepair?.accessoryCost?.replace(/[^0-9]/g, "") || "0"
                ),
                repairTime: editingRepair.repairTime
                    ? moment(editingRepair.repairTime)
                    : null,
                accessories: editingRepair?.accessoriesUsed.map(
                    (accessory: any) => ({
                        accessoryId: accessory?.accessory_id,
                        accessory: accessory?.accessory_name,
                        quantity: accessory?.quantity || 1,
                    })
                ),
            });
            setAccessoryCost(
                parseInt(
                    editingRepair?.accessoryCost?.replace(/[^0-9]/g, "") || "0"
                )
            );
            setSelectedAccessories(
                editingRepair.accessoriesUsed.map((accessory: any) => ({
                    id: accessory.accessory_id,
                    name: accessory.accessory_name,
                    price: accessory.price || 0,
                    quantity: accessory?.quantity || 1,
                }))
            );
        }
    }, [editingRepair, form]);

    const handleAccessoryQuantityChange = (index: number, quantity: number) => {
        const updatedAccessories = [...selectedAccessories];
        const accessory = updatedAccessories[index];
        const oldCost = accessory.price * accessory.quantity;
        accessory.quantity = quantity;
        const newCost = accessory.price * quantity;
        setSelectedAccessories(updatedAccessories);
        setAccessoryCost(accessoryCost - oldCost + newCost);
    };

    const handleFormValuesChange = (_: any, allValues: any) => {
        const laborCost = allValues.laborCost || 0;
        const totalCost = accessoryCost + laborCost;
        form.setFieldsValue({ totalCost });
    };

    const handleRemoveAccessory = (name: string) => {
        const index = selectedAccessories.findIndex(
            (item) => item.name === name
        );
        if (index !== -1) {
            const accessory = selectedAccessories[index];
            setAccessoryCost(
                (prev) => prev - accessory.price * accessory.quantity
            );
            setSelectedAccessories((prev) =>
                prev.filter((item) => item.name !== name)
            );
        }
    };

    const handleSubmit = () => {
        form.validateFields().then((values) => {
            onSubmit({
                ...editingRepair,
                ...values,
                accessoriesUsed: selectedAccessories,
                laborCost: `${values.laborCost} VND`,
                accessoryCost: `${accessoryCost} VND`,
                totalCost: `${values.totalCost} VND`,
            });
            form.resetFields();
            setSelectedAccessories([]);
            setAccessoryCost(0);
        });
    };

    return (
        <Modal
            title="Chỉnh sửa sửa chữa"
            visible={visible}
            onOk={handleSubmit}
            onCancel={() => {
                onClose();
                form.resetFields();
                setSelectedAccessories([]);
                setAccessoryCost(0);
            }}
            okText="Lưu"
            cancelText="Hủy"
        >
            <Form
                form={form}
                layout="vertical"
                onValuesChange={handleFormValuesChange}
            >
                <Form.Item
                    label="Tên xe"
                    name="vehicle"
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng nhập tên xe!",
                        },
                    ]}
                >
                    <Input placeholder="Nhập tên xe" />
                </Form.Item>

                <Form.Item
                    label="Thông tin khách hàng"
                    name="customer"
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng chọn khách hàng!",
                        },
                    ]}
                >
                    <Select
                        showSearch
                        placeholder="Chọn khách hàng"
                        filterOption={(input, option) =>
                            (option?.label ?? "")
                                .toLowerCase()
                                .includes(input.toLowerCase())
                        }
                        options={customers.map((customer) => ({
                            value: customer,
                            label: customer,
                        }))}
                    />
                </Form.Item>

                <Form.Item
                    label="Tình trạng sửa chữa"
                    name="repairDetails"
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng nhập tình trạng sửa chữa!",
                        },
                    ]}
                >
                    <Input.TextArea placeholder="Nhập tình trạng sửa chữa" />
                </Form.Item>

                <Form.List name="accessories">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(
                                ({ key, name, fieldKey, ...restField }) => (
                                    <Row key={key} gutter={16} align="middle">
                                        <Col span={10}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, "accessory"]}
                                                fieldKey={[
                                                    fieldKey,
                                                    "accessory",
                                                ]}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            "Vui lòng chọn phụ kiện!",
                                                    },
                                                ]}
                                            >
                                                <Select
                                                    placeholder="Chọn phụ kiện"
                                                    onChange={(value) => {
                                                        const selectedAccessory =
                                                            accessories.find(
                                                                (item) =>
                                                                    item.name ===
                                                                    value
                                                            );
                                                        if (selectedAccessory) {
                                                            setSelectedAccessories(
                                                                (prev) => [
                                                                    ...prev,
                                                                    {
                                                                        id: selectedAccessory.id,
                                                                        name: selectedAccessory.name,
                                                                        price: selectedAccessory.price,
                                                                        quantity: 1,
                                                                    },
                                                                ]
                                                            );
                                                            setAccessoryCost(
                                                                (prev) =>
                                                                    prev +
                                                                    selectedAccessory.price
                                                            );
                                                        }
                                                    }}
                                                >
                                                    {accessories
                                                        .filter(
                                                            (item) =>
                                                                !selectedAccessories.some(
                                                                    (
                                                                        selected
                                                                    ) =>
                                                                        selected.name ===
                                                                        item.name
                                                                )
                                                        )
                                                        .map((item) => (
                                                            <Option
                                                                key={item.id}
                                                                value={
                                                                    item.name
                                                                }
                                                            >
                                                                {item.name} -{" "}
                                                                {item.price} VND
                                                            </Option>
                                                        ))}
                                                </Select>
                                            </Form.Item>
                                        </Col>

                                        <Col span={10}>
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
                                                <InputNumber
                                                    placeholder="Nhập số lượng"
                                                    min={1}
                                                    style={{ width: "100%" }}
                                                    onChange={(value) => {
                                                        const index =
                                                            selectedAccessories.findIndex(
                                                                (item) =>
                                                                    item.name ===
                                                                    form.getFieldValue(
                                                                        [
                                                                            "accessories",
                                                                            name,
                                                                            "accessory",
                                                                        ]
                                                                    )
                                                            );
                                                        if (index !== -1) {
                                                            handleAccessoryQuantityChange(
                                                                index,
                                                                value || 1
                                                            );
                                                        }
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>

                                        <Col span={4}>
                                            <Button
                                                type="text"
                                                danger
                                                onClick={() => {
                                                    const accessoryName =
                                                        form.getFieldValue([
                                                            "accessories",
                                                            name,
                                                            "accessory",
                                                        ]);
                                                    handleRemoveAccessory(
                                                        accessoryName
                                                    );
                                                    remove(name);
                                                }}
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
                                    Thêm phụ kiện
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>

                <Form.Item label="Chi phí phụ tùng">
                    <InputNumber
                        value={accessoryCost}
                        disabled
                        style={{ width: "100%" }}
                    />
                </Form.Item>

                <Form.Item
                    label="Tiền công"
                    name="laborCost"
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng nhập tiền công!",
                        },
                    ]}
                >
                    <InputNumber
                        placeholder="Nhập tiền công"
                        style={{ width: "100%" }}
                        min={0}
                    />
                </Form.Item>

                <Form.Item label="Tổng chi phí" name="totalCost">
                    <InputNumber disabled style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                    label="Trạng thái sửa chữa"
                    name="status"
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng chọn trạng thái!",
                        },
                    ]}
                >
                    <Select
                        placeholder="Chọn trạng thái"
                        options={[
                            { value: "Chưa sửa", label: "Chưa sửa" },
                            { value: "Đang sửa", label: "Đang sửa" },
                            { value: "Hoàn thành", label: "Hoàn thành" },
                        ]}
                    />
                </Form.Item>

                <Form.Item
                    label="Thời gian sửa chữa"
                    name="repairTime"
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng chọn thời gian sửa chữa!",
                        },
                    ]}
                >
                    <DatePicker
                        showTime
                        format="YYYY-MM-DDTHH:mm:ss[Z]" // Định dạng đầu ra
                        style={{ width: "100%" }}
                        onChange={(value) => {
                            form.setFieldsValue({
                                repairTime: value
                                    ? moment(value.toDate()).format(
                                          "YYYY-MM-DDTHH:mm:ss[Z]"
                                      )
                                    : null,
                            });
                        }}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditRepair;
