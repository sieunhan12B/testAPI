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
  const [searchId, setSearchId] = useState("");

  // Lấy dữ liệu từ API
  useEffect(() => {
    fetchData();
  }, []);

  //Lấy danh sách người dùng
  const fetchData = async () => {
    try {
      const response = await testAPI.getListUser();
      console.log(response.data);
      setData(response.data);
      showNotification("Get data successfully!", "success");
    } catch (err) {
      console.log(err);
      showNotification("Get data failed!", "error");
    }
  };

  //Lấy người dùng bằng Id
  const handleSearch = async (id) => {
    if (!id.trim()) {
      // Kiểm tra nếu ô tìm kiếm trống hoặc chỉ chứa khoảng trắng
      fetchData();
      return;
    }

    try {
      const res = await testAPI.getUserById(id);
      if (res.data) {
        setData([res.data]); // Cập nhật bảng với kết quả tìm thấy
        showNotification("User found!", "success");
      } else {
        showNotification("User not found!", "warning");
        setData([]); // Xóa dữ liệu nếu không tìm thấy
      }
    } catch (err) {
      console.log(err);
      showNotification("Search failed!", "error");
      setData([]); // Xóa dữ liệu nếu có lỗi xảy ra
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
        await testAPI.updateUser(editingUser.id, values);
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
  const handleDelete = async (id) => {
    try {
      await testAPI.deleteUser(id);
      showNotification("Delete successfully!", "success");
      setData(data.filter((item) => item.id !== id)); // Cập nhật lại danh sách
    } catch (err) {
      console.log(err);
      showNotification("Delete failed!", "error");
    }
  };

  // Cột của bảng
  const columns = [
    {
      title: "id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên",
      dataIndex: "ten",
      key: "ten",
    },
    {
      title: "Lớp",
      dataIndex: "lop",
      key: "lop",
    },
    {
      title: "MSSV",
      dataIndex: "mssv",
      key: "mssv",
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
            onConfirm={() => handleDelete(record.id)}
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
    <div className=" my-6">
      <h1 className=" text-center text-5xl">
        Danh Sách Thành Viên Nhóm 7 Thứ 6 Ca 1
      </h1>
      <div className="text-center mb-3 flex justify-center gap-2">
        <Input
          placeholder="Enter User ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          style={{ width: "200px" }}
        />
        <Button
          type="primary"
          onClick={() => {
            handleSearch(searchId);
          }}
        >
          Tìm kiếm
        </Button>
        <Button
          // type="danger"
          danger
          onClick={() => {
            fetchData();
          }}
        >
          Lấy tất cả người dùng
        </Button>
      </div>
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
        rowKey="id"
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
            label="Tên"
            name="ten"
            rules={[{ required: true, message: "Please enter ten" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Lop"
            name="lop"
            rules={[{ required: true, message: "Please enter lop" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="MSSV"
            name="mssv"
            rules={[{ required: true, message: "Please enter mssv" }]}
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
