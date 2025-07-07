import { useEffect, useState } from "react";
import { request } from "../../util/helper.js";
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Select,
  Space,
  Table,
  Tag,
} from "antd";

const UserPage = () => {
  const [form] = Form.useForm();
  const [state, setState] = useState({
    list: [],
    role: [],
    laoding: false,
    visible: false,
  });
  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    const res = await request("auth/get-list", "get");
    if (res && !res.error) {
      setState((pre) => ({
        ...pre,
        list: res.list,
        role: res.role,
      }));
    }
  };

  const onFinish = async (item) => {
    if (item.password !== item.confirm_password) {
      message.warning("Password and confirm Password Not Match!");
      return;
    }
    var data = {
      ...item,
      id: form.getFieldValue("id"),
    };
    var method = "post";
    if (form.getFieldValue("id")) {
      method = "put";
    }
    const res = await request("auth", method, data);
    if (res && !res.error) {
      message.success(res.message);
      getList();
      handleCloseModal();
    } else {
      message.warning(res.message);
    }
  };

  const handleEdit = (item) => {
    form.setFieldsValue({
      ...item,
      // id:item.id,
      // name:item.name,
      // code:item.code,
    });
    handleOpenModal();
  };
  const handleDelete = (item) => {
    Modal.confirm({
      title: "Delete",
      content: "Are you sure remove data",
      onOk: async () => {
        const res = await request("auth", "delete", {
          id: item.id,
        });
        if (res && !res.error) {
          const newList = state.list.filter((item1) => item1.id != item.id);
          setState((pre) => ({
            ...pre,
            list: newList,
          }));
          message.success(res.message);
        }
      },
    });
  };

  const handleCloseModal = () => {
    setState((pre) => ({
      ...pre,
      visible: false,
    }));
    form.resetFields();
  };
  const handleOpenModal = () => {
    setState((pre) => ({
      ...pre,
      visible: true,
    }));
  };
  return (
    <div className="h-[80vh]">
      <div className="container flex items-center justify-between px-2 py-3">
        <div className="flex w-[500px] items-center ">
          <div className="w-[150px] ">
            <h2 className="text-2xl font-semibold uppercase ">User List</h2>
          </div>
          <div className="w-[300px] capitalize">
            <Input.Search placeholder="Search ..." className="w-full" />
          </div>
        </div>
        <div className=" flex">
          <Button type="primary" onClick={() => handleOpenModal()}>
            New
          </Button>
        </div>
      </div>
      <Modal
        title={form.getFieldValue("id") ? "Update User" : "New User"}
        open={state.visible}
        onCancel={handleCloseModal}
        footer={null}
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item
            name="name"
            label="Name"
            rules={[
              {
                required: true,
                message: "Please Fill in name",
              },
            ]}
          >
            <Input placeholder="Name" />
          </Form.Item>
          <Form.Item
            name="username"
            label="Username Or Email"
            rules={[
              {
                required: true,
                message: "Please Fill in username or email",
              },
            ]}
          >
            <Input placeholder="Username Or Email" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: "Please Fill in Password",
              },
            ]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item
            name="confirm_password"
            label="Confirm Password"
            rules={[
              {
                required: true,
                message: "Please Fill in Password",
              },
            ]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
          {/* <Form.Item
            name="role_id"
            label="Role"
            rules={[
              {
                required: true,
                message: "Please Select Role",
              },
            ]}
          >
            <Select placeholder="Select role" options={state.role} />
          </Form.Item> */}

          <Form.Item
            name="role_ids"
            label="Roles"
            rules={[
              {
                required: true,
                message: "Please Select Role(s)",
              },
            ]}
          >
            <Select
              mode="multiple"
              options={state.role}
              placeholder="Select roles"
            />
          </Form.Item>

          <Form.Item
            name="is_active"
            label="Status"
            rules={[
              {
                required: true,
                message: "Please Select Status",
              },
            ]}
          >
            <Select
              placeholder="Select status"
              options={[
                {
                  label: "Active",
                  value: 1,
                },
                {
                  label: "InActive",
                  value: 0,
                },
              ]}
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {form.getFieldValue("id") ? "Update" : "Save"}
              </Button>
              <Button onClick={handleCloseModal}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      <Table
        dataSource={state.list}
        columns={[
          {
            key: "no",
            title: "No",
            render: (value, data, index) => index + 1,
          },
          {
            className: "capitalize text-sm",
            key: "name",
            title: "Name",
            dataIndex: "name",
          },
          {
            key: "username",
            title: "UserName",
            dataIndex: "username",
          },

          // {
          //   key: "role",
          //   title: "Role",
          //   align: "center",
          //   dataIndex: "role_name",
          // },
          {
            title: "Roles",
            dataIndex: "role_names",
            render: (text) => (
              <div className="text-green-600">{text || "No roles"}</div>
            ),
          },

          {
            key: "active",
            title: "Status",
            align: "center",
            dataIndex: "is_active",
            render: (item) =>
              item == 1 ? (
                <Tag color="green">Active</Tag>
              ) : (
                <Tag color="red">InActive</Tag>
              ),
          },
          {
            key: "createby",
            title: "Create By",
            align: "center",
            dataIndex: "create_by",
          },
          {
            key: "create_at",
            title: "Create_at",
            align: "right",
            dataIndex: "create_at",
          },

          {
            key: "action",
            title: "Action",
            align: "right",
            render: (item, data) => (
              <Space>
                <Button
                  onClick={() => handleEdit(data)}
                  type="dashed"
                  className="text-sm text-green-500 bg-green-200 border-green-200"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(data)}
                  type="dashed"
                  className="text-sm text-white bg-red-400 border-red-200"
                >
                  Delete
                </Button>
              </Space>
            ),
          },
        ]}
      />
    </div>
  );
};

export default UserPage;
