import React, { useState, useEffect } from "react";
import {
    Table,
    Button,
    Space,
    Tooltip,
    Popconfirm,
    Modal,
    Form,
    Input,
    InputNumber,
    notification,
    Row,
    Col,
    message,
} from "antd";
import {
    PlusOutlined,
    EyeOutlined,
    EditOutlined,
    DeleteOutlined,
} from "@ant-design/icons";
import {
    getAllPointRules,
    updatePointRuleById,
    deletePointRuleById,
    addPointRule,
} from "../services/point.service"; // Import các API
import { render } from "react-dom";

const { Search } = Input;

const PointManagementPage: React.FC = () => {
    const [data, setData] = useState<any[]>([]); // Dữ liệu point rules
    const [filteredData, setFilteredData] = useState<any[]>([]); // Dữ liệu sau khi tìm kiếm
    const [isAddModalVisible, setIsAddModalVisible] = useState(false); // Modal thêm mới
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isViewModalVisible, setIsViewModalVisible] = useState(false); // Modal Xem
    const [editingRule, setEditingRule] = useState<any>(null);
    const [viewingRule, setViewingRule] = useState<any>(null); // Quy tắc đang xem
    const [loading, setLoading] = useState(false);

    const [form] = Form.useForm();

    // Gọi API để lấy danh sách point rules
    const fetchPointRules = async () => {
        try {
            setLoading(true);
            const response = await getAllPointRules();
            setLoading(false);
            const formattedData = response.points.map((rule: any) => ({
                key: rule.point_rule_id,
                ruleId: rule.point_rule_id,
                ruleName: rule.rule_name,
                conversionValue: rule.conversion_value,
                unit: rule.unit,
                points: rule.point_value,
            }));
            setData(formattedData);
            setFilteredData(formattedData); // Khởi tạo dữ liệu hiển thị
        } catch (error: any) {
            setLoading(false);
            message.error(
                error.message || "Không thể lấy danh sách point rules!"
            );
        }
    };

    useEffect(() => {
        fetchPointRules(); // Gọi API khi component được mount
    }, []);

    // Xử lý tìm kiếm
    const handleSearch = (value: string) => {
        const filtered = data.filter((item) =>
            item.ruleName.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredData(filtered);
    };

    // Xử lý sửa point rule
    const handleEditRule = async (values: any) => {
        try {
            const updatedRule = await updatePointRuleById(
                editingRule.ruleId,
                values.ruleName,
                values.conversionValue,
                values.unit,
                values.points
            );
            const updatedData = data.map((item) =>
                item.ruleId === updatedRule.point_rule_id
                    ? {
                          ...item,
                          ruleName: updatedRule.rule_name,
                          conversionValue: updatedRule.conversion_value,
                          unit: updatedRule.unit,
                          points: updatedRule.point_value,
                      }
                    : item
            );
            setData(updatedData);
            setFilteredData(updatedData);
            setIsEditModalVisible(false);
            form.resetFields();
            notification.success({
                message: "Chỉnh sửa quy tắc điểm thành công!",
                placement: "topRight",
            });
        } catch (error: any) {
            message.error(error.message || "Không thể chỉnh sửa quy tắc điểm!");
        }
    };

    // Xử lý xóa point rule
    const handleDelete = async (ruleId: string) => {
        try {
            await deletePointRuleById(ruleId);
            const updatedData = data.filter((item) => item.ruleId !== ruleId);
            setData(updatedData);
            setFilteredData(updatedData);
            notification.success({
                message: "Xóa quy tắc điểm thành công!",
                placement: "topRight",
            });
        } catch (error: any) {
            message.error(error.message || "Không thể xóa quy tắc điểm!");
        }
    };

    // Xử lý thêm point rule
    const handleAddRule = async (values: any) => {
        try {
            const newRule = await addPointRule(
                values.ruleName,
                values.conversionValue,
                values.unit,
                values.points
            );
            const formattedRule = {
                key: newRule.point_rule_id,
                ruleId: newRule.point_rule_id,
                ruleName: newRule.rule_name,
                conversionValue: newRule.conversion_value,
                unit: newRule.unit,
                points: newRule.point_value,
            };
            setData([...data, formattedRule]);
            setFilteredData([...filteredData, formattedRule]);
            setIsAddModalVisible(false);
            form.resetFields();
            notification.success({
                message: "Thêm quy tắc điểm thành công!",
                placement: "topRight",
            });
        } catch (error: any) {
            message.error(error.message || "Không thể thêm quy tắc điểm!");
        }
    };

    const columns = [
        {
            title: "Mã quy tắc",
            dataIndex: "ruleId",
            key: "ruleId",
        },
        {
            title: "Tên quy tắc",
            dataIndex: "ruleName",
            key: "ruleName",
        },
        {
            title: "Giá trị quy đổi",
            dataIndex: "conversionValue",
            key: "conversionValue",
            render: (value: string) => `${Number(value).toLocaleString()}`,
        },
        {
            title: "Đơn vị",
            dataIndex: "unit",
            key: "unit",
        },
        {
            title: "Điểm quy đổi",
            dataIndex: "points",
            key: "points",
        },
        {
            title: "Hành động",
            key: "actions",
            render: (_: any, record: any) => (
                <Space size="middle">
                    <Tooltip title="Xem">
                        <EyeOutlined
                            style={{ color: "#1890ff", cursor: "pointer" }}
                            onClick={() => {
                                setViewingRule(record);
                                setIsViewModalVisible(true);
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Sửa">
                        <EditOutlined
                            style={{ color: "#52c41a", cursor: "pointer" }}
                            onClick={() => {
                                setEditingRule(record);
                                setIsEditModalVisible(true);
                                form.setFieldsValue(record);
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Popconfirm
                            title="Bạn có chắc chắn muốn xóa quy tắc này?"
                            onConfirm={() => handleDelete(record.ruleId)}
                            okText="Xóa"
                            cancelText="Hủy"
                        >
                            <DeleteOutlined
                                style={{ color: "#ff4d4f", cursor: "pointer" }}
                            />
                        </Popconfirm>
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            {/* Thanh tìm kiếm và nút Thêm quy tắc điểm */}
            <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                <Col>
                    <Search
                        placeholder="Tìm kiếm theo tên quy tắc"
                        enterButton
                        allowClear
                        onSearch={handleSearch}
                        style={{ width: "300px" }}
                    />
                </Col>
                <Col flex="auto" style={{ textAlign: "right" }}>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setIsAddModalVisible(true)}
                    >
                        Thêm quy tắc điểm
                    </Button>
                </Col>
            </Row>
            {/* Bảng danh sách quy tắc điểm */}
            <Table
                columns={columns}
                loading={loading}
                dataSource={filteredData}
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    pageSizeOptions: ["10", "20", "50"],
                }}
                bordered
            />

            {/* Modal Sửa quy tắc điểm */}
            <Modal
                title="Sửa quy tắc điểm"
                visible={isEditModalVisible}
                onCancel={() => {
                    setIsEditModalVisible(false);
                    form.resetFields();
                }}
                onOk={() => {
                    form.validateFields().then((values) => {
                        handleEditRule(values);
                    });
                }}
                okText="Lưu"
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Tên quy tắc"
                        name="ruleName"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tên quy tắc!",
                            },
                        ]}
                    >
                        <Input placeholder="Nhập tên quy tắc" />
                    </Form.Item>
                    <Form.Item
                        label="Giá trị quy đổi"
                        name="conversionValue"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập giá trị quy đổi!",
                            },
                        ]}
                    >
                        <Input placeholder="Nhập giá trị quy đổi (VD: 10,000 VND)" />
                    </Form.Item>
                    <Form.Item
                        label="Đơn vị"
                        name="unit"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập đơn vị!",
                            },
                        ]}
                    >
                        <Input placeholder="Nhập đơn vị (VD: VND)" />
                    </Form.Item>
                    <Form.Item
                        label="Điểm quy đổi"
                        name="points"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập điểm quy đổi!",
                            },
                            {
                                type: "number",
                                min: 1,
                                message: "Điểm phải lớn hơn 0!",
                            },
                        ]}
                    >
                        <InputNumber
                            placeholder="Nhập điểm quy đổi"
                            style={{ width: "100%" }}
                        />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal Thêm quy tắc điểm */}
            <Modal
                title="Thêm quy tắc điểm"
                visible={isAddModalVisible}
                onCancel={() => {
                    setIsAddModalVisible(false);
                    form.resetFields();
                }}
                onOk={() => {
                    form.validateFields().then((values) => {
                        handleAddRule(values);
                    });
                }}
                okText="Lưu"
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Tên quy tắc"
                        name="ruleName"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tên quy tắc!",
                            },
                        ]}
                    >
                        <Input placeholder="Nhập tên quy tắc" />
                    </Form.Item>
                    <Form.Item
                        label="Giá trị quy đổi"
                        name="conversionValue"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập giá trị quy đổi!",
                            },
                        ]}
                    >
                        <Input placeholder="Nhập giá trị quy đổi (VD: 10,000 VND)" />
                    </Form.Item>
                    <Form.Item
                        label="Đơn vị"
                        name="unit"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập đơn vị!",
                            },
                        ]}
                    >
                        <Input placeholder="Nhập đơn vị (VD: VND)" />
                    </Form.Item>
                    <Form.Item
                        label="Điểm quy đổi"
                        name="points"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập điểm quy đổi!",
                            },
                            {
                                type: "number",
                                min: 1,
                                message: "Điểm phải lớn hơn 0!",
                            },
                        ]}
                    >
                        <InputNumber
                            placeholder="Nhập điểm quy đổi"
                            style={{ width: "100%" }}
                        />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal Xem chi tiết quy tắc điểm */}
            <Modal
                title="Chi tiết quy tắc điểm"
                visible={isViewModalVisible}
                onCancel={() => setIsViewModalVisible(false)}
                footer={[
                    <Button
                        key="close"
                        onClick={() => setIsViewModalVisible(false)}
                    >
                        Đóng
                    </Button>,
                ]}
            >
                {viewingRule && (
                    <div>
                        <p>
                            <strong>Mã quy tắc:</strong> {viewingRule.ruleId}
                        </p>
                        <p>
                            <strong>Tên quy tắc:</strong> {viewingRule.ruleName}
                        </p>
                        <p>
                            <strong>Giá trị quy đổi:</strong>{" "}
                            {viewingRule.conversionValue} {viewingRule.unit}
                        </p>
                        <p>
                            <strong>Điểm quy đổi:</strong> {viewingRule.points}
                        </p>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default PointManagementPage;
