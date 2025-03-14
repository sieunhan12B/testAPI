import React, { useContext, useEffect, useState } from "react";
import { Table, Button, Popconfirm, Modal, Form, Input } from "antd";
import { NotificationContext } from "../App";
import { testAPI } from "../services/testAPI.service";
import "antd/dist/reset.css";

const SimpleTable = () => {
  const { showNotification } = useContext(NotificationContext);
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false); // State để điều khiển hiển thị modal
  const [editingUser, setEditingUser] = useState(null); // Lưu thông tin người dùng đang chỉnh sửa
  const [form] = Form.useForm(); // Form của Ant Design

  // Lấy dữ liệu từ API
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await testAPI.getListUser();
      setData(response.data);
      showNotification("Get data successfully!", "success");
    } catch (err) {
      console.log(err);
      showNotification("Get data failed!", "error");
    }
  };

  // Hiển thị modal để chỉnh sửa
  const showEditModal = (user) => {
    setEditingUser(user); // Lưu thông tin người dùng đang chỉnh sửa
    form.setFieldsValue(user); // Đặt giá trị mặc định cho form
    setIsModalVisible(true); // Hiển thị modal
  };

  // Đóng modal
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields(); // Reset form
  };

  // Xử lý khi submit form (thêm/sửa)
  const handleSubmit = async (values) => {
    try {
      if (editingUser) {
        // Gọi API để cập nhật thông tin người dùng
        await testAPI.updateUser(editingUser.userId, values);
        showNotification("Update successfully!", "success");
      } else {
        // Gọi API để thêm người dùng mới
        await testAPI.addUser(values);
        showNotification("Add successfully!", "success");
      }
      fetchData(); // Tải lại dữ liệu
      setIsModalVisible(false); // Đóng modal
      form.resetFields(); // Reset form
    } catch (err) {
      console.log(err);
      showNotification("Operation failed!", "error");
    }
  };

  // Xử lý xóa người dùng
  const handleDelete = async (userId) => {
    try {
      await testAPI.deleteUser(userId);
      showNotification("Delete successfully!", "success");
      setData(data.filter((item) => item.userId !== userId)); // Cập nhật lại danh sách
    } catch (err) {
      console.log(err);
      showNotification("Delete failed!", "error");
    }
  };

  // Cột của bảng
  const columns = [
    {
      title: "User ID",
      dataIndex: "userId",
      key: "userId",
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <div>
          <Button
            className="text-3xl"
            type="primary"
            onClick={() => showEditModal(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this task?"
            onConfirm={() => handleDelete(record.userId)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              className="text-3xl"
              type="primary"
              danger
              style={{ marginLeft: 8 }}
            >
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="">
      <h1 className=" text-center text-5xl">Danh Sách Người dùng</h1>
      <div className="text-center mb-3 ">
        <Button
          type="primary"
          className="text-4xl py-5"
          onClick={() => {
            setEditingUser(null); // Đặt editingUser thành null để thêm mới
            form.resetFields(); // Reset form
            setIsModalVisible(true); // Hiển thị modal
          }}
        >
          Thêm Người Dùng
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="userId"
        pagination={{ pageSize: 7 }}
      />

      {/* Modal để thêm/sửa người dùng */}
      <Modal
        title={editingUser ? "Edit User" : "Add User"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null} // Ẩn footer mặc định
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please enter username" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please enter email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingUser ? "Save" : "Add"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SimpleTable;
