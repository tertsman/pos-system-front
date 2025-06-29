import { useEffect, useState } from "react";
import { request } from "../../util/helper.js";
import { Button, Form, Input, message, Modal, Space, Table } from "antd";

const RolePage = () => {
  const [state, setState] = useState({
    data: [],
    loading: false,
    visible :false
  });

  const [form] = Form.useForm();
  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    const res = await request("role", "get");
    if (res && !res.error) {
      // setState({
      //   ...state,
      //   data: res.list,
      // });
      setState((pre)=> ({
        ...pre,
        data:res.list
      }))
    }
  };

  const onfinish = async (item) => {
    var data = {
      id:form.getFieldValue("id"),
      name: item.name,
      code: item.code,
    };
    var method = "post";
    if(form.getFieldValue("id")){
      method = "put";
    }
    const res = await request("role", method, data);
    if (res && !res.error) {
      message.success(res.message);
      getList();
      handleCloseModal();
    } else {
      message.warning(res.message);
    }
  };
   const handleOpenModal = () =>{
    setState({
      ...state,
      visible:true
    })
   }
   const handleCloseModal = () =>{
    
    setState((pre)=>({
      ...pre,
      visible:false
    }))
    form.resetFields();
   }
  const handleEdit = (item) => {
    form.setFieldsValue({

      ...item,
      // id:item.id,
      // name:item.name,
      // code:item.code,
    })
    handleOpenModal();
  };
  const handleDelete = (item) => {

    Modal.confirm({
      title:"Delete",
      content:"Are you sure remove data",
      onOk:async () =>{
        const res = await request("role","delete",{
          id: item.id
        });
        if(res && !res.error){
          const newList = state.data.filter((item1) => item1.id != item.id);
          setState((pre)=>({
            ...pre,
            data:newList
          }))
          message.success(res.message);
        }
      }
    })
  };
  return (
    <div className="h-[80vh]">
      <div className="container flex items-center justify-between px-2 py-3">
        <div className="flex w-[500px] items-center ">
          <div className="w-[150px] ">
            <h2 className="text-2xl font-semibold uppercase ">List role</h2>
          </div>
          <div className="w-[300px] capitalize">
            <Input.Search placeholder="Search ..." className="w-full" />
          </div>
        </div>
        <div className=" flex">
          <Button type="primary" className="" onClick={handleOpenModal}>
            New
          </Button>
        </div>
      </div>
      <Modal title={form.getFieldValue('id')? "Update Role":"New Role" }
       open={state.visible} onCancel={handleCloseModal} footer={null}>
        <Form form={form} layout="vertical" onFinish={onfinish}>
          <Form.Item name="name" label="Role Name">
            <Input placeholder="Role Name" />
          </Form.Item>
          <Form.Item name="code" label="Role Code">
            <Input placeholder="Role Code" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
              {form.getFieldValue("id") ? "Update":"Save"}
              </Button>
              <Button onClick={handleCloseModal}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Table
        dataSource={state.data}
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
            key: "role",
            title: "Role",
            align: "center",
            dataIndex: "code",
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

export default RolePage;
