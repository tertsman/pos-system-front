import { useEffect, useState } from "react";
import { request } from "../../util/helper";
import { Button, Form, Input, message, Modal, Space, Table } from "antd";
import { CiEdit } from "react-icons/ci";
import { MdOutlineDelete, MdAdd } from "react-icons/md";
import MainPage from "../../component/layout/MainPage";

const BrandPage = () => {
  const [formRef] = Form.useForm();
  const [list, setGetlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    visibaleModal: false,
    id:null,
    name:"",
    country:"",
    
  });
  useEffect(() => {
    getList();
  }, []); // ✅ Dependency added

  const getList = async () => {
    try {
      setLoading(true);
      const res = await request("brand", "get");
      console.log("Response:", res);
      setLoading(true);
      if (res && Array.isArray(res.list)) {
        setGetlist(res.list);
        setLoading(false)
      } else {
        console.error("Invalid response structure:", res);
        setGetlist([]); // ប្រសិនបើទិន្នន័យមិនមែនជា array
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching brands:", error);
      setGetlist([]); // កុំទុក state ដែលមិនមានតម្លៃ
    }
  };

  const handlEdit = (data) => {
    setState({
      ...state,
      visibaleModal: true,
    });
    formRef.setFieldsValue({
      id: data.id,
      name: data.name,
      country:data.country
    });
  };
  const handlDelete = async (data) => {
    Modal.confirm({
      title: "Are you sure remove data",
      onOk: async () => {
        const res = await request("brand", "delete", {
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
      name: items.name,
      country:items.country
    };
    var method = "post";
    if (formRef.getFieldValue("id")) {
      // case update
      method = "put";
    }
    const res = await request("brand", method, data);
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
          <h1 className="text-2xl font-bold uppercase">brands</h1>
          <Input.Search
            placeholder="Search supplier"
            onChange={() => setState(() => ({}))}
            allowClear
            onSearch={{}}
          />
        </Space>
        <Button
          icon={<MdAdd />}
          className=" bg-green-300 text-white font-semibold "
          onClick={handlAddbtn}
        >
          New
        </Button>
      </div>
      {/* <Button type='primary' icon={<MdAdd /> } onClick={handlAddbtn} className='mb-3'>New</Button> */}
      <Modal
        open={state.visibaleModal}
        title={formRef.getFieldValue("id") ? "Update Brands" : "New Brands"}
        footer={null}
        onCancel={handlCloseModal}
      >
        <Form layout="vertical" onFinish={onFinish} form={formRef}>
          <Form.Item name={"name"} label={"Brands Name"}>
            <Input placeholder="input category Name" />
          </Form.Item>
          <Form.Item name={"country"} label={"Country"}>
            <Input.TextArea placeholder="Country" />
          </Form.Item>

          <Space className="mt-3">
            <Button onClick={handlCloseModal}>Cancel</Button>
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
            title: "Name",
            dataIndex: "name",
          },
          {
            key: "country",
            title: "Country",
            dataIndex: "country",
          },
          {
            key: "action",
            title: "Action",
            align: "center",
            render: (item, data, index) => (
              <Space>
                <Button
                  type="dashed"
                  icon={<CiEdit />}
                  onClick={() => handlEdit(data, index)}
                />
                <Button
                  type="dashed"
                  icon={<MdOutlineDelete />}
                  onClick={() => handlDelete(data, index)}
                />
              </Space>
            ),
          },
        ]}
      />
    </MainPage>
  );
};

export default BrandPage;
