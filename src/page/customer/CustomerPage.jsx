import { useEffect, useState } from "react";
import MainPage from "../../component/layout/MainPage";
import { checkPermission, request } from "../../util/helper";
import { Button, Form, Input, message, Modal, Space, Table } from "antd";
import dayjs from "dayjs";

const CustomerPage = () => {

  const [filter, setFilter] = useState({
    txt_search: "",
  });
  const [state, setState] = useState({
    list: [],
    visible: false,
    loading: false,
    pagination: {
      total: 0,
      page: 1,
      limit: 10,
    },
  });
  const [form] = Form.useForm();
  useEffect(() => {
    getList(1, state.pagination.limit);
  }, [filter]);
  const getList = async (page = 1, limit = 10) => {
    setState((pre) => ({
      ...pre,
      loading: true,
    }));
    var params = {
      ...filter,
      page,
      limit,
    };
    const res = await request("customer", "get", params);
    if (res && !res.error) {
      setState((pre) => ({
        ...pre,
        list: res.list,
        loading: false,
        pagination: {
          total: res.pagination?.total || 0,
          page,
          limit,
        },
      }));
    }
    console.log(res);
  };

  const handleOpenModal = () => {
    setState((p) => ({
      ...p,
      visible: true,
    }));
  };
  const handleCloseModal = () => {
    setState((p) => ({
      ...p,
      visible: false,
    }));
    form.resetFields();
  };
  const onFinish = async (item) => {
    var data = {
      ...item,
      id: form.getFieldValue("id"),
    };
    var method = "post";
    if (form.getFieldValue("id")) {
      method = "put";
    }

    const res = await request("customer", method, data);
    if (res && !res.error) {
      message.success(res.message);
      getList();
      handleCloseModal();
    } else {
      message.warning(res.message);
    }
  };

  const handleDelete = (item) => {
    Modal.confirm({
      title: "Delete",
      content: "Are you sure remove data",
      onOk: async () => {
        const res = await request("customer", "delete", {
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
  const handleEdit = (item) => {
    form.setFieldsValue({
      ...item,
      // id:item.id,
      // name:item.name,
      // code:item.code,
    });
    handleOpenModal();
  };
  // const onFieldClear =(value)=>{
  //   setState((p) => ({ ...p, txtSearch: value.target.value }));
  //   getList();
  // }

  const onSearch = () => {
    getList();
  };
  return (
    <MainPage loading={state.loading}>
      <div className="flex justify-between items-center px-2 py-2 ">
        <Space>
          <h1 className="text-2xl font-bold uppercase">customer</h1>
          <Input.Search
            placeholder="Search supplier"
            onChange={(event) =>
              setFilter((p) => ({ ...p, txt_search: event.target.value }))
            }
            allowClear
            onSearch={onSearch}
          />
        </Space>
        {checkPermission("customer.create") &&
        <Button
          className=" bg-green-300 text-white font-semibold "
          onClick={handleOpenModal}
        >
          New
        </Button>
        }
      </div>
      <Modal
        title={form.getFieldValue("id") ? "Update Supplier" : "New Supplier"}
        onCancel={handleCloseModal}
        open={state.visible}
        footer={null}
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Name required",
              },
            ]}
          >
            <Input placeholder="Customer name" />
          </Form.Item>
          <Form.Item
            label="Tel"
            name="tel"
            rules={[
              {
                required: true,
                message: "tel required",
              },
            ]}
          >
            <Input placeholder="Customer tel" />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input placeholder="customer email" />
          </Form.Item>
          <Form.Item label="Address" name="address">
            <Input placeholder="customer address" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button onClick={handleCloseModal}>Cancel</Button>
              <Button
                className="bg-green-300 text-white font-semibold"
                htmlType="submit"
              >
                {form.getFieldValue("id") ? "Update" : "Save"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      <Table
        dataSource={
          state.list && state.list.length > 0
            ? state.list.map((item) => ({ ...item, key: item.id }))
            : []
        }
        pagination={{
          current: state.pagination.page,
          pageSize: state.pagination.limit,
          total: state.pagination.total,
          onChange: (page, pageSize) => {
            getList(page, pageSize);
          },
        }}
        columns={[
          {
            key: "no",
            title: "NO",
            render: (item, date, index) => index + 1,
          },
          {
            key: "name",
            title: "Name",
            dataIndex: "name",
          },
          {
            key: "tel",
            title: "tel",
            dataIndex: "tel",
          },
          {
            key: "email",
            title: "email",
            dataIndex: "email",
          },
          {
            key: "address",
            title: "address",
            dataIndex: "address",
          },

          {
            key: "create_by",
            title: "Create By",
            dataIndex: "create_by",
          },
          {
            align: "right",
            key: "create_at",
            title: "Create At",
            dataIndex: "create_at",
            render: (value) => dayjs(value).format("DD-MMM-YY"),
          },
          {
            key: "action",
            title: "Action",
            align: "right",
            render: (item, data) => (
              <Space>
                {/* <details className="relative">
                  <summary className="list-none cursor-pointer">
                    <BsThreeDots />
                  </summary>
                  <ul className=" absolute top-0 right-[100%] w-[150px] px-3 py-2 bg-slate-100 z-10 border rounded-md">
                    <li>
                      <Button
                        onClick={() => handleEdit(data)}
                        className="text-sm text-green-500 bg-slate-100 border-none w-full"
                      >
                        Edit
                      </Button>
                    </li>
                    <li>
                      <Button
                        onClick={() => handleDelete(data)}
                        className="text-sm text-red-600 border-none bg-slate-100 w-full"
                      >
                        Delete
                      </Button>
                    </li>
                  </ul>
                </details> */}
                {checkPermission("customer.update") &&
                <Button
                  onClick={() => handleEdit(data)}
                  type="dashed"
                  className="text-sm text-green-500 bg-green-200 border-green-200"
                >
                  Edit
                </Button>
          }
          {checkPermission("customer.rem") &&
                <Button
                  onClick={() => handleDelete(data)}
                  type="dashed"
                  className="text-sm text-red-600 border-red-200"
                >
                  Del
                </Button>
          }
              </Space>
            ),
          },
        ]}
      />
    </MainPage>
  );
};

export default CustomerPage;
