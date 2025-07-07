import { useEffect, useState } from "react";
import { Button, Form, Input, InputNumber, Modal, Select, Space, Table, DatePicker, message } from "antd";
import dayjs from "dayjs";
import MainPage from "../../component/layout/MainPage";
import { checkPermission, request } from "../../util/helper";

const ExpansePage = () => {
  const [form] = Form.useForm();
  const [state, setState] = useState({
    list: [],
    loading: false,
    visible: false,
    expanseTypes: [],
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
    },
  });
  const [filter, setFilter] = useState({ txt_search: "" });

  useEffect(() => {
    fetchData();
    fetchExpanseTypes();
  }, [filter, state.pagination.current]);

  const fetchData = async () => {
    setState((s) => ({ ...s, loading: true }));
    const res = await request("expanse", "get", {
      ...filter,
      page: state.pagination.current,
      limit: state.pagination.pageSize,
    });
    if (res && !res.error) {
      setState((s) => ({
        ...s,
        list: res.list,
        pagination: res.pagination,
        loading: false,
      }));
    }
  };

  const fetchExpanseTypes = async () => {
    const res = await request("expanse-type", "get", {});
    if (res && !res.error) {
      setState((s) => ({ ...s, expanseTypes: res.list }));
    }
  };

  const handleOpen = () => {
    form.resetFields();
    setState((s) => ({ ...s, visible: true }));
  };

  const handleEdit = (item) => {
    form.setFieldsValue({ ...item, expanse_date: dayjs(item.expanse_date) });
    setState((s) => ({ ...s, visible: true }));
  };

  const handleClose = () => {
    setState((s) => ({ ...s, visible: false }));
    form.resetFields();
  };

  const onFinish = async (values) => {
    const data = {
      ...values,
      expanse_date: values.expanse_date.format("YYYY-MM-DD"),
      id: form.getFieldValue("id"),
    };
    const method = data.id ? "put" : "post";
    const res = await request("expanse", method, data);
    if (!res.error) {
      message.success(res.message);
      handleClose();
      fetchData();
    } else {
      message.warning(res.message);
    }
  };

  const handleDelete = (item) => {
    Modal.confirm({
      title: "Delete",
      content: "Are you sure?",
      onOk: async () => {
        const res = await request("expanse", "delete", { id: item.id });
        if (!res.error) {
          message.success(res.message);
          fetchData();
        }
      },
    });
  };

  const onSearch = (value) => {
    setFilter({ txt_search: value });
  };

  const handleTableChange = (pagination) => {
    setState((s) => ({
      ...s,
      pagination: {
        ...s.pagination,
        current: pagination.current,
      },
    }));
  };

  return (
    <MainPage loading={state.loading}>
      <div className="flex justify-between items-center mb-4 px-2">
        <Space>
          <h2 className="text-xl font-semibold">Expanse</h2>
          <Input.Search placeholder="Search" onSearch={onSearch} allowClear />
        </Space>
       {checkPermission("expanse.create") && <Button onClick={handleOpen} type="primary">New</Button>}
      </div>

      <Table
        rowKey="id"
        dataSource={state.list}
        pagination={state.pagination}
        onChange={handleTableChange}
        columns={[
          { title: "No", render: (_, __, i) => (state.pagination.current - 1) * state.pagination.pageSize + i + 1 },
          { title: "Ref No", dataIndex: "ref_no" },
          { title: "Name", dataIndex: "name" },
          { title: "Amount", dataIndex: "amount" },
          { title: "Type", dataIndex: "expanse_type_name" },
          { title: "Create By", dataIndex: "create_by" },
          { title: "Remark", dataIndex: "remark" },
          { title: "Date", dataIndex: "expanse_date", render: (d) => dayjs(d).format("DD-MM-YYYY") },
          {
            title: "Actions",
            render: (item) => (
              <Space>
               {checkPermission("expanse.update") && <Button onClick={() => handleEdit(item)} type="link">Edit</Button>}
               {checkPermission("expanse.remove") && <Button danger type="link" onClick={() => handleDelete(item)}>Delete</Button>}
              </Space>
            ),
          },
        ]}
      />

      <Modal
        title={form.getFieldValue("id") ? "Edit Expanse" : "New Expanse"}
        open={state.visible}
        onCancel={handleClose}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="id" hidden><Input /></Form.Item>
          <Form.Item name="ref_no" label="Ref No"><Input /></Form.Item>
          <Form.Item name="name" label="Name" rules={[{ required: true, message: "Required" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="amount" label="Amount" rules={[{ required: true }]}>
            <InputNumber className="w-full" />
          </Form.Item>
          <Form.Item name="expanse_type_id" label="Type" rules={[{ required: true }]}>
            <Select placeholder="Select type">
              {state.expanseTypes.map((type) => (
                <Select.Option key={type.id} value={type.id}>
                  {type.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="remark" label="Remark">
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="expanse_date" label="Date" rules={[{ required: true }]}>
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="primary" htmlType="submit">Save</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </MainPage>
  );
};

export default ExpansePage;
