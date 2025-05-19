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
    message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { getAllCustomers } from "../services/customer.service"; // API lấy danh sách khách hàng
import { getAllAccessories } from "../services/product.service"; // API lấy danh sách phụ kiện
import { createRepair } from "../services/repair.service"; // API tạo sửa chữa mới

const { Option } = Select;

interface CreateNewRepairProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: () => void; // Callback khi tạo thành công
}

const CreateNewRepair: React.FC<CreateNewRepairProps> = ({
    visible,
    onClose,
    onSubmit,
}) => {
    const [form] = Form.useForm();
    const [customers, setCustomers] = useState<any[]>([]);
    const [accessories, setAccessories] = useState<any[]>([]);
    const [selectedAccessories, setSelectedAccessories] = useState<
        {
            accessory_id: string;
            name: string;
            price: number;
            quantity: number;
        }[]
    >([]);
    const [accessoryCost, setAccessoryCost] = useState(0);

    // Lấy danh sách khách hàng
    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await getAllCustomers();
                setCustomers(response.customers || []);
            } catch (error: any) {
                message.error("Không thể tải danh sách khách hàng!");
            }
        };
        fetchCustomers();
    }, []);

    // Lấy danh sách phụ kiện
    useEffect(() => {
        const fetchAccessories = async () => {
            try {
                const response = await getAllAccessories();
                setAccessories(response.accessories || []);
            } catch (error: any) {
                message.error("Không thể tải danh sách phụ kiện!");
            }
        };
        fetchAccessories();
    }, []);

    // Xử lý thay đổi số lượng phụ kiện
    const handleAccessoryQuantityChange = (index: number, quantity: number) => {
        const updatedAccessories = [...selectedAccessories];
        const accessory = updatedAccessories[index];
        const oldCost = accessory.price * accessory.quantity;
        accessory.quantity = quantity;
        const newCost = accessory.price * quantity;
        setSelectedAccessories(updatedAccessories);
        setAccessoryCost(accessoryCost - oldCost + newCost);
    };

    // Xử lý thay đổi giá trị form
    const handleFormValuesChange = (_: any, allValues: any) => {
        const laborCost = allValues.laborCost || 0;
        const totalCost = accessoryCost + laborCost;
        form.setFieldsValue({ totalCost });
    };

    // Thêm phụ kiện vào danh sách
    const handleAddAccessory = (value: string) => {
        const selectedAccessory = accessories.find(
            (item) => item.accessory_name === value
        );
        if (selectedAccessory) {
            setSelectedAccessories((prev) => [
                ...prev,
                {
                    accessory_id: selectedAccessory.accessory_id,
                    name: selectedAccessory.accessory_name,
                    price: selectedAccessory.price,
                    quantity: 1,
                },
            ]);
            setAccessoryCost((prev) => prev + selectedAccessory.price);
        }
    };

    // Xóa phụ kiện khỏi danh sách
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

    // Xử lý gửi form
    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const repairData = {
                motocycle_name: values.vehicle,
                customer_id: values.customer,
                repair_detail: values.repairDetails,
                accessories: selectedAccessories.map((item) => ({
                    accessory_id: item.accessory_id,
                    quantity: item.quantity,
                    unit_price: item.price,
                })),
                extra_fee: values.laborCost,
                cost: accessoryCost,
                status: values.status,
                repair_time: values.repairTime,
            };
            const res = await createRepair(repairData);

            console.log("res", res);
            console.log("values", values);
            console.log("selectedAccessories", selectedAccessories);
            console.log(accessoryCost);
            values.customer = customers.find(
                (customer) => customer.customer_id === values.customer
            );
            values.id = res?.repair_id;

            if (res) {
                message.success("Tạo sửa chữa mới thành công!");
                onSubmit(values, selectedAccessories, accessoryCost); // Gọi callback với các tham số
                onClose();
                form.resetFields();
                setSelectedAccessories([]);
                setAccessoryCost(0);
            }
        } catch (error: any) {
            message.error(
                error.message || "Không thể tạo sửa chữa mới, vui lòng thử lại!"
            );
        }
    };

    return (
        <Modal
            title="Thêm sửa chữa mới"
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
                    label="Khách hàng"
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
                            value: customer.customer_id,
                            label: customer.fullname,
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
                                                    onChange={
                                                        handleAddAccessory
                                                    }
                                                >
                                                    {accessories
                                                        .filter(
                                                            (item) =>
                                                                !selectedAccessories.some(
                                                                    (
                                                                        selected
                                                                    ) =>
                                                                        selected.name ===
                                                                        item.accessory_name
                                                                )
                                                        )
                                                        .map((item) => (
                                                            <Option
                                                                key={
                                                                    item.accessory_id
                                                                }
                                                                value={
                                                                    item.accessory_name
                                                                }
                                                            >
                                                                {
                                                                    item.accessory_name
                                                                }{" "}
                                                                -{" "}
                                                                {item.price.toLocaleString()}{" "}
                                                                VND
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
                        format="YYYY-MM-DDTHH:mm:ss[Z]"
                        style={{ width: "100%" }}
                        onChange={(value) => {
                            form.setFieldsValue({
                                repairTime: value, // Truyền đối tượng dayjs trực tiếp
                            });
                        }}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateNewRepair;
