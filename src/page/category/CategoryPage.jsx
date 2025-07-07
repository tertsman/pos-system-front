import { useEffect, useState } from "react";
import { checkPermission, request } from "../../util/helper";
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
import { CiEdit } from "react-icons/ci";
import { MdOutlineDelete, MdAdd } from "react-icons/md";
import MainPage from "../../component/layout/MainPage";

const CategoryPage = () => {
  const [formRef] = Form.useForm();
  const [list, setGetlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    visibaleModal: false,
    Id: null,
    name: "",
    description: "",
    status: "",
    parent_id: null,
    txtSearch: "",
  });
  useEffect(() => {
    getList();
  }, []); // ✅ Dependency added

  const getList = async () => {
    const res_config = await request("config", "get");
    console.log(res_config);
    setLoading(true);
    const res = await request("category");
    setLoading(false);
    if (res && Array.isArray(res.list)) {
      setGetlist(res.list);
    } else {
      setGetlist([]); // ប្រសិនបើទិន្នន័យមិនមែនជា array
    }
  };

  const handlEdit = (data) => {
    setState({
      ...state,
      visibaleModal: true,
    });
    formRef.setFieldsValue({
      id: data.id,
      Name: data.name,
      Description: data.description,
      Status: data.status,
    });
  };
  const handlDelete = async (data) => {
    Modal.confirm({
      title: "Are you sure remove data",
      onOk: async () => {
        const res = await request("category", "delete", {
          id: data.id,
        });
        if (res && !res.error) {
          const newList = list.filter((item) => item.id != data.id);
          setGetlist(newList);
          message.success(res.message);
        }
      },
    });
  };
  const handlAddbtn = () => {
    setState({
      ...state,
      visibaleModal: true,
    });
  };
  const handlCloseModal = () => {
    formRef.resetFields();
    setState({
      ...state,
      visibaleModal: false,
      Id: null,
    });
  };

  const onFinish = async (items) => {
    var data = {
      id: formRef.getFieldValue("id"),
      name: items.Name,
      description: items.Description,
      status: items.Status,
    };
    var method = "post";
    if (formRef.getFieldValue("id")) {
      // case update
      method = "put";
    }
    const res = await request("category", method, data);
    if (res && !res.error) {
      message.success(res.message);
      getList();
      handlCloseModal();
    }
  };

  return (
    <MainPage loading={loading}>
      <div className="flex justify-between items-center px-2 py-2 ">
        <Space>
          <h1 className="text-2xl font-bold">SUPPLIER</h1>
          <Input.Search
            placeholder="Search supplier"
            onChange={(value) =>
              setState((p) => ({ ...p, txtSearch: value.target.value }))
            }
            allowClear
            onSearch={getList}
          />
        </Space>
        {checkPermission("category.create") && (
          <Button
            icon={<MdAdd />}
            className=" bg-green-300 text-white font-semibold "
            onClick={handlAddbtn}
          >
            New
          </Button>
        )}
      </div>
      {/* <Button type='primary' icon={<MdAdd /> } onClick={handlAddbtn} className='mb-3'>New</Button> */}
      <Modal
        open={state.visibaleModal}
        title={formRef.getFieldValue("id") ? "Update category" : "New category"}
        footer={null}
        onCancel={handlCloseModal}
      >
        <Form layout="vertical" onFinish={onFinish} form={formRef}>
          <Form.Item name={"Name"} label={"Category Name"}>
            <Input placeholder="input category Name" />
          </Form.Item>
          <Form.Item name={"Description"} label={"Description"}>
            <Input.TextArea placeholder="Description" />
          </Form.Item>
          <Form.Item name={"Status"} label={"Status"}>
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
          <Space className="mt-3">
            <Button>Cancel</Button>
            <Button type="primary" htmlType="submit">
              {formRef.getFieldValue("id") ? "Update" : "Save"}
            </Button>
          </Space>
        </Form>
      </Modal>
      <Table
        dataSource={list ? list.map((item) => ({ ...item, key: item.id })) : []}
        columns={[
          {
            key: "no",
            title: "NO",
            render: (item, date, index) => index + 1,
          },
          {
            key: "name",
            title: "name",
            dataIndex: "name",
          },
          {
            key: "description",
            title: "Description",
            dataIndex: "description",
          },
          {
            key: "status",
            title: "Status",
            dataIndex: "status",
            align: "right",
            render: (item) =>
              item == 1 ? (
                <Tag color="green">Active</Tag>
              ) : (
                <Tag color="red">InActive</Tag>
              ),
          },
          {
            key: "action",
            title: "Action",
            align: "center",
            render: (item, data, index) => (
              <Space>
                {checkPermission("category.update") && (
                  <Button
                    type="dashed"
                    icon={<CiEdit />}
                    onClick={() => handlEdit(data, index)}
                  />
                )}
                {checkPermission("category.remove") && (
                  <Button
                    type="dashed"
                    icon={<MdOutlineDelete />}
                    onClick={() => handlDelete(data, index)}
                  />
                )}
              </Space>
            ),
          },
        ]}
      />
    </MainPage>
  );
};

export default CategoryPage;
