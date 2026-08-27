import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { Table, Button, Form, Input, Select, Tag, Space, Card, Modal } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const { Option } = Select;

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTodo, setEditingTodo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  const todosCollectionRef = collection(db, "todos");

  // Read: Real-time listener using useEffect
  useEffect(() => {
    const unsubscribe = onSnapshot(todosCollectionRef, (snapshot) => {
      const todoList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTodos(todoList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Create: Add new Todo
  const handleAddTodo = async (values) => {
    await addDoc(todosCollectionRef, {
      title: values.title,
      description: values.description,
      status: values.status || "Pending",
    });
    form.resetFields();
  };

  // Delete: Remove Todo
  const handleDelete = async (id) => {
    const todoDoc = doc(db, "todos", id);
    await deleteDoc(todoDoc);
  };

  // Open Edit Modal & Load Data into Form
  const openEditModal = (record) => {
    setEditingTodo(record);
    editForm.setFieldsValue(record);
    setIsModalOpen(true);
  };

  // Update: Save changes to Firebase
  const handleUpdateTodo = async (values) => {
    if (!editingTodo) return;
    const todoDoc = doc(db, "todos", editingTodo.id);
    await updateDoc(todoDoc, values);
    setIsModalOpen(false);
    setEditingTodo(null);
  };

  // Table Columns Definition
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Completed" ? "green" : "volcano"}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
          />
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: "0 20px" }}>
      {/* Add Todo Form */}
      <Card title="Add New Todo" style={{ marginBottom: 20 }}>
        <Form form={form} layout="vertical" onFinish={handleAddTodo}>
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please input the title!" }]}
          >
            <Input placeholder="Todo Title" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea placeholder="Todo Description" rows={2} />
          </Form.Item>
          <Form.Item name="status" label="Status" initialValue="Pending">
            <Select>
              <Option value="Pending">Pending</Option>
              <Option value="Completed">Completed</Option>
            </Select>
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Add Todo
          </Button>
        </Form>
      </Card>

      {/* Todo List Table */}
      <Table
        dataSource={todos}
        columns={columns}
        rowKey="id"
        loading={loading}
      />

      {/* Edit Todo Modal */}
      <Modal
        title="Edit Todo"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => editForm.submit()}
      >
        <Form form={editForm} layout="vertical" onFinish={handleUpdateTodo}>
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please input the title!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="status" label="Status">
            <Select>
              <Option value="Pending">Pending</Option>
              <Option value="Completed">Completed</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}