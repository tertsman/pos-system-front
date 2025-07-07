import { useEffect, useState } from "react";
import MainPage from "../../component/layout/MainPage";
import { checkPermission, request } from "../../util/helper";
import { Button, Form, Input, Modal, Space, Table, message } from "antd";

const ExpanseTypePage = () => {
  const [filter, setFilter] = useState({ txt_search: "" });
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [state, setState] = useState({
    list: [],
    visible: false,
    loading: false,
  });
  const [form] = Form.useForm();

  useEffect(() => {
    getList();
  }, [filter, pagination.current]);

  const getList = async () => {
    setState((pre) => ({ ...pre, loading: true }));
    const res = await request("expanse-type", "get", {
      txt_search: filter.txt_search,
      page: pagination.current,
      limit: pagination.pageSize,
    });
    if (res && !res.error) {
      setState((pre) => ({ ...pre, list: res.list, loading: false }));
      setPagination((p) => ({ ...p, total: res.pagination.total }));
    } else {
      setState((pre) => ({ ...pre, loading: false }));
    }
  };

  const handleOpenModal = () => setState((p) => ({ ...p, visible: true }));
  const handleCloseModal = () => {
    setState((p) => ({ ...p, visible: false }));
    form.resetFields();
  };

  const onFinish = async (values) => {
    const method = form.getFieldValue("id") ? "put" : "post";
    const res = await request("expanse-type", method, {
      ...values,
      id: form.getFieldValue("id"),
    });
    if (res && !res.error) {
      message.success(res.message);
      getList();
      handleCloseModal();
    } else {
      message.warning(res.message);
    }
  };

  const handleEdit = (item) => {
    form.setFieldsValue(item);
    handleOpenModal();
  };

  const handleDelete = (item) => {
    Modal.confirm({
      title: "Delete",
      content: "Are you sure you want to delete this item?",
      onOk: async () => {
        const res = await request("expanse-type", "delete", { id: item.id });
        if (res && !res.error) {
          message.success(res.message);
          getList();
        }
      },
    });
  };

  return (
    <MainPage loading={state.loading}>
      <div className="flex justify-between items-center px-2 py-2">
        <Space>
          <h1 className="text-2xl font-bold uppercase">Expanse Type</h1>
          <Input.Search
            placeholder="Search..."
            onChange={(e) =>
              setFilter((f) => ({ ...f, txt_search: e.target.value }))
            }
            onSearch={() => setPagination((p) => ({ ...p, current: 1 }))}
            allowClear
          />
        </Space>
        {checkPermission("expanse_type.create") && (
          <Button onClick={handleOpenModal} className="bg-green-500 text-white">
            New
          </Button>
        )}
      </div>

      <Table
        dataSource={state.list.map((item) => ({ ...item, key: item.id }))}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          onChange: (page) => setPagination((p) => ({ ...p, current: page })),
        }}
        columns={[
          { title: "No", render: (t, r, i) => i + 1 },
          { title: "Name", dataIndex: "name" },
          { title: "Code", dataIndex: "code" },
          {
            title: "Action",
            render: (item) => (
              <Space>
                {checkPermission("expanse_type.update") && (
                  <Button type="dashed" onClick={() => handleEdit(item)}>
                    Edit
                  </Button>
                )}
                {checkPermission("expanse_type.remove") && (
                  <Button danger onClick={() => handleDelete(item)}>
                    Delete
                  </Button>
                )}
              </Space>
            ),
          },
        ]}
      />

      <Modal
        title={
          form.getFieldValue("id") ? "Edit Expanse Type" : "New Expanse Type"
        }
        open={state.visible}
        onCancel={handleCloseModal}
        footer={null}
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Name is required" }]}
          >
            <Input placeholder="Enter name" />
          </Form.Item>
          <Form.Item
            label="Code"
            name="code"
            rules={[{ required: true, message: "Code is required" }]}
          >
            <Input placeholder="Enter code" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button onClick={handleCloseModal}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                {form.getFieldValue("id") ? "Update" : "Save"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </MainPage>
  );
};

export default ExpanseTypePage;
