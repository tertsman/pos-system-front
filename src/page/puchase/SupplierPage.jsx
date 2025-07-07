import { useEffect, useState } from "react";
import MainPage from "../../component/layout/MainPage";
import { checkPermission, request } from "../../util/helper";
import { Button, Form, Input, message, Modal, Space, Table } from "antd";
import { BsThreeDots } from "react-icons/bs";
import dayjs from "dayjs";

const SupplierPage = () => {
  const [filter, setFilter] = useState({
    txt_search: "",
  });
  const [state, setState] = useState({
    list: [],
    visible: false,
    loading: false,
  });
  const [form] = Form.useForm();
  useEffect(() => {
    getList();
  }, []);
  const getList = async () => {
    setState((pre) => ({
      ...pre,
      loading: true,
    }));
    var params = {
      ...filter,
    };
    const res = await request("supplier", "get", params);
    if (res && !res.error) {
      setState((pre) => ({
        ...pre,
        list: res.list,
        loading: false,
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

    const res = await request("supplier", method, data);
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
        const res = await request("supplier", "delete", {
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
      
    });
    handleOpenModal();
  };



  const onSearch = ()=>{
    getList();
  }
  return (
    <MainPage loading={state.loading}>
      <div className="flex justify-between items-center px-2 py-2 ">
        <Space>
          <h1 className="text-2xl font-bold">SUPPLIER</h1>
          <Input.Search
            placeholder="Search supplier"
            onChange={(event) =>
              setFilter((p) => ({ ...p, txt_search: event.target.value }))
            }
            allowClear
            onSearch={onSearch}
          />
        </Space>
        {checkPermission("supplier.create") &&
        <Button
          className=" bg-green-300 text-white font-semibold "
          onClick={handleOpenModal}
        >
          New
        </Button>}
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
            <Input placeholder="supplier name" />
          </Form.Item>
          <Form.Item
            label="Code"
            name="code"
            rules={[
              {
                required: true,
                message: "code required",
              },
            ]}
          >
            <Input placeholder="supplier code" />
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
            <Input placeholder="supplier tel" />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input placeholder="supplier email" />
          </Form.Item>
          <Form.Item label="Address" name="address">
            <Input placeholder="supplier address" />
          </Form.Item>
          <Form.Item label="Website" name="website">
            <Input placeholder="supplier website" />
          </Form.Item>
          <Form.Item label="Note" name="note">
            <Input.TextArea placeholder="supplier note" />
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
            key: "code",
            title: "code",
            dataIndex: "code",
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
            key: "website",
            title: "website",
            dataIndex: "website",
          },
          {
            key: "note",
            title: "note",
            dataIndex: "note",
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
                <details className="relative">
                  <summary className="list-none cursor-pointer">
                    <BsThreeDots />
                  </summary>
                  <ul className=" absolute top-0 right-[100%] w-[150px] px-3 py-2 bg-slate-100 z-10 border rounded-md">
                    {checkPermission("supplier.update") &&
                    <li>

                      <Button
                        onClick={() => handleEdit(data)}
                        className="text-sm text-green-500 bg-slate-100 border-none w-full"
                      >
                        Edit
                      </Button>
                    </li>}
                    {checkPermission("supplier.remove") &&
                    <li>
                      <Button
                        onClick={() => handleDelete(data)}
                        className="text-sm text-red-600 border-none bg-slate-100 w-full"
                      >
                        Delete
                      </Button>
                    </li>}
                  </ul>
                </details>
              </Space>
            ),
          },
        ]}
      />
    </MainPage>
  );
};

export default SupplierPage;
