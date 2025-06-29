import { useEffect, useState } from "react";
import { request } from "../../util/helper";
import {
  Button,
  Col,
  Form,
  Image,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Upload,
} from "antd";
import { BsThreeDots } from "react-icons/bs";
// import { useForm } from "antd/es/form/Form";
import { PlusOutlined } from "@ant-design/icons";
import { CiEdit, CiGlass } from "react-icons/ci";
import { MdOutlineDelete, MdAdd } from "react-icons/md";
import MainPage from "../../component/layout/MainPage";
import { configStore } from "../../Store/configStore";
import dayjs from "dayjs";
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
const ProductPage = () => {
  const [form] = Form.useForm();
  const { config } = configStore();
  const [state, setState] = useState({
    visibleModal: false,
    list: [],
  });

  const categoryOptions = config.category.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }));
  const brandOptions = config.brand.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }));
  // filter
  const [filter, setFilter] = useState({
    txt_search: "",
    category_id: "",
    brand: "",
  });

  useEffect(() => {
    getList();
    const fetchConfig = async () => {
      const res = await request("config", "get");
      if (res && !res.error) {
        configStore.getState().setConfig(res);
      }
    };
    fetchConfig();
  }, []); // ✅ Dependency added

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [imageDefault, setimageDefault] = useState([]);
  const [imageOptional, setimageOptional] = useState([]);
  const [isImageRemoved, setIsImageRemoved] = useState(false);

  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );

  const getList = async () => {
    var params = {
      ...filter,
    };
    const res = await request("product", "get", params);
    // alert(JSON.stringify(res))
    if (res && !res.error) {
      setState((p) => ({
        ...p,
        list: res.list,
      }));
    }
  };

  // id	category_id	barcode	name	brands	description	qty	price	discount	status	image	create_by	create_at
  const onFinish = async (items) => {
    try {
      var params = new FormData();
      params.append("name", items.name);
      params.append("category_id", items.category_id);
      params.append("barcode", items.barcode);
      params.append("brands", items.brands);
      params.append("description", items.description);
      params.append("qty", items.qty);
      params.append("price", items.price);
      params.append("discount", items.discount);
      params.append("status", items.status);

      params.append("image", form.getFieldValue("image"));
      // params.append("upload_image", items.image_default.file.originFileObj, items.image_default.file.name);
      params.append("id", form.getFieldValue("id"));

      if (items.image_default) {
        const file = items.image_default.file;
        if (file.status === "removed") {
          params.append("image_remove", "1"); // បញ្ជូនសម្រាប់លុបរូបភាពចាស់
        } else {
          params.append("upload_image", file.originFileObj, file.name); // បញ្ជូនរូបភាពថ្មី
        }
      }

      
      console.log(items.image_default.file.status);
      var method = "post";
      if (form.getFieldValue("id")) {
        method = "put";
      }
      const res = await request("product", method, params);
      console.log(res);
      if (res && !res.error) {
        message.success(res.message);
        getList();
        handleCloseModal();
      }
    } catch (error) {
      console.log(error);
      message.error("Error during the update process. Please try again.");
    }
  };



  // =========================

  
  // =================
  const handleCloseModal = () => {
    setState((p) => ({
      ...p,
      visibleModal: false,
    }));
    form.resetFields();
    setimageDefault([]);
  };

  const handleAddbtn = async () => {
    const res = await request("new_barcode", "post");
    // alert(JSON.stringify(res))
    if (res && !res.error) {
      form.setFieldValue("barcode", res.barcode);
      setState((p) => ({
        ...p,
        visibleModal: true,
      }));
    }
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };
  // const handleChangeDefault = ({ fileList: newFileList }) =>
  //   setimageDefault(newFileList);

  const handleChangeDefault = ({ fileList: newFileList }) => {
    console.log("New File List: ", newFileList);

    // ពិនិត្យតើ fileList មានរូបភាពទេ
    if (newFileList.length > 1) {
      message.error("Only one image is allowed.");
    } else if (newFileList.length === 0) {
      // ការផ្តល់ការជូនដំណឹងបើមិនមានរូបភាពណាមួយ
      setimageDefault([]);
    } else {
      // កែប្រែរូបភាពតាមបញ្ជីថ្មី
      setimageDefault(newFileList);
    }
  };

  // បើ upload រូបថ្មី
  // if (file.status === "done" && file.originFileObj) {
  //   setIsImageRemoved(false); // ដើម្បីប្រាប់ថា user កំពុងប្តូររូប
  // }

  // // បើ user លុបរូបចេញ
  // if (newFileList.length === 0) {
  //   setIsImageRemoved(true);
  // }

  const handleChangeOptional = ({ fileList: newFileList }) =>
    setimageOptional(newFileList);
  const onFilter = () => {
    getList();
  };
  const onSearch = () => {
    getList();
  };
  const handleDelete = (item, data) => {
    Modal.confirm({
      title: "Remove data",
      content: "Are you sure to delete product?",
      onOk: async () => {
        const res = await request("product", "delete", item);
        if (res && !res.error) {
          message.success(res.message);
          getList();
        }
      },
    });
  };
  // const handleEdit = (item, index) => {
  //   form.setFieldsValue({
  //     ...item,
  //   });
  //   setState((pre) => ({ ...pre, visibleModal: true }));

  //   if (item.image != "" && item.image != null) {
  //     const imageProduct = [
  //       {
  //         uid: "-1",
  //         name: item.image,
  //         status: "done",
  //         url: "http://localhost:8080/full-stack/image/" + item.image,
  //       },
  //     ];
  //     setimageDefault(imageProduct);
  //   }
  // };

  const handleEdit = (items) => {
    form.setFieldsValue({
      ...items,
      // brands: item.brand ? item.brand.id : null,
      brands: items.brand,
      category_id: items.category_id,
      status: items.status === 1 ? "active" : "inactive",
    });

    setState((pre) => ({ ...pre, visibleModal: true }));

    if (items.image != "" && items.image != null) {
      const imageProduct = [
        {
          uid: "-1",
          name: items.image,
          status: "done",
          url: "http://localhost:8888/full-stack/image/" + items.image,
        },
      ];
      setimageDefault(imageProduct);
    }
  };

  return (
    <MainPage loading={false}>
      <div className="flex justify-between items-center px-2 py-2 ">
        <Space>
          <h1 className="text-2xl font-bold">PRODUCT</h1>
          <Input.Search
            placeholder="Search supplier"
            onChange={(event) =>
              setFilter((p) => ({ ...p, txt_search: event.target.value }))
            }
            allowClear
            onSearch={onSearch}
          />
          <Select
            allowClear
            placeholder="Select Category"
            style={{ width: 120 }}
            options={config.category?.map((item) => ({
              label: item.name,
              value: item.id,
            }))}
            onChange={(id) => {
              setFilter((pre) => ({ ...pre, category_id: id }));
            }}
          />
          <Select
            allowClear
            placeholder="Select brand"
            style={{ width: 120 }}
            options={config.brand?.map((item) => ({
              label: item.name,
              value: item.id,
            }))}
            onChange={(value) => {
              setFilter((pre) => ({ ...pre, brand: value }));
            }}
          />
          <Button
            onClick={onFilter}
            // icon={<MdAdd />}
            className=" bg-green-300 text-white font-semibold "
          >
            Filter
          </Button>
        </Space>
        <Button
          icon={<MdAdd />}
          className=" bg-green-300 text-white font-semibold "
          onClick={handleAddbtn}
        >
          New
        </Button>
      </div>
      {/* <Button type='primary' icon={<MdAdd /> } onClick={handlAddbtn} className='mb-3'>New</Button> */}
      <Modal
        open={state.visibleModal}
        title={form.getFieldValue("id") ? "Update Product" : "New Product"}
        footer={null}
        onCancel={handleCloseModal}
        width={700}
      >
        <Form layout="vertical" onFinish={onFinish} form={form}>
          <Row gutter={8}>
            <Col span={12}>
              <Form.Item
                name={"name"}
                label={"Product Name"}
                rules={[
                  {
                    required: true,
                    message: "please fill in name",
                  },
                ]}
              >
                <Input placeholder="input product name" />
              </Form.Item>
              <Form.Item
                name={"brands"}
                label={"Brands"}
                rules={[
                  {
                    required: true,
                    message: "please select brands",
                  },
                ]}
              >
                <Select
                  allowClear
                  placeholder="ជ្រើសរើសប្រេន"
                  options={brandOptions}
                />
              </Form.Item>
              <Form.Item name={"price"} label={"Price"}>
                <InputNumber placeholder="input Price " className="w-full" />
              </Form.Item>
              <Form.Item name={"status"} label={"Status"}>
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
            </Col>

            <Col span={12}>
              
              <Form.Item
                name="category_id"
                label="Category"
                rules={[{ required: true }]}
              >
                <Select
                  options={categoryOptions}
                  placeholder="ជ្រើសរើសប្រភេទផលិតផល"
                />
              </Form.Item>
              <Form.Item name={"qty"} label={"Quantity"}>
                <InputNumber placeholder="input Quantity " className="w-full" />
              </Form.Item>
              <Form.Item name={"discount"} label={"Discount"}>
                <InputNumber placeholder="input Quantity " className="w-full" />
              </Form.Item>
              <Form.Item name={"barcode"} label={"Barcode"}>
                <Input disabled placeholder="Barcode " className="w-full" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name={"Description"} label={"Description"}>
            <Input.TextArea placeholder="Description" />
          </Form.Item>

          <Form.Item
            name={"image_default"}
            label={"Picture"}
            // getValueFromEvent={(e) => {
            //   console.log("🟢 Upload Event:", e);
            //   return e?.fileList || [];
            // }}
          >
            <Upload
              listType="picture-card"
              fileList={imageDefault}
              maxCount={1}
              onPreview={handlePreview}
              onChange={handleChangeDefault}
              multiple={true}
              customRequest={(options) => {
                options.onSuccess();
              }}
            >
              {/* {uploadButton} */}
              {imageDefault.length >= 1 ? null : uploadButton}
            </Upload>
          </Form.Item>

          <Form.Item name={"image_optional"} label={"(Optional)"}>
            <Upload
              listType="picture-card"
              fileList={imageOptional}
              onPreview={handlePreview}
              onChange={handleChangeOptional}
              multiple={true}
              customRequest={(options) => {
                options.onSuccess();
              }}
            >
              {imageOptional.length >= 5 ? null : uploadButton}
            </Upload>
          </Form.Item>
          {previewImage && (
            <Image
              wrapperStyle={{
                display: "none",
              }}
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible) => setPreviewOpen(visible),
                afterOpenChange: (visible) => !visible && setPreviewImage(""),
              }}
              src={previewImage}
            />
          )}
          <Space className="mt-3 w-full  justify-end">
            <Button onClick={handleCloseModal}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              {form.getFieldValue("id") ? "Update" : "Save"}
            </Button>
          </Space>
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
            key: "image",
            title: "Image",
            dataIndex: "image",
            // render:(value)=>"http://localhost:8080/full-stack/image/" + value
            render: (value) =>
              value ? (
                <Image
                  src={"http://localhost:8888/full-stack/image/" + value}
                  style={{ width: 50 }}
                />
              ) : (
                <div
                  style={{ backgroundColor: "#eee", width: 50, height: 50 }}
                />
              ),
          },
          {
            key: "name",
            title: "name",
            dataIndex: "name",
          },
          {
            key: "barcode",
            title: "Barcode",
            dataIndex: "barcode",
          },
          {
            key: "category_name",
            title: "Category",
            dataIndex: "category_name",
          },
          {
            key: "brand_name",
            title: "Brand",
            dataIndex: "brand_name",
          },
          {
            key: "qty",
            title: "Quantity",
            dataIndex: "qty",
          },
          {
            key: "price",
            title: "Price",
            dataIndex: "price",
          },
          {
            key: "discount",
            title: "Discount",
            dataIndex: "discount",
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
            key: "create_at",
            title: "Create At",
            dataIndex: "create_at",
            render: (value) => dayjs(value).format("DD-MMM-YY"),
          },
          {
            key: "action",
            title: "Action",
            align: "center",
            render: (item, data) => (
              <Space>
                <details className="relative">
                  <summary className="list-none cursor-pointer">
                    <BsThreeDots />
                  </summary>
                  <ul className=" absolute top-0 right-[100%] w-[100px] px-3 py-2 bg-slate-100 z-10 border rounded-md">
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
                    {/* <Button
                               onClick={() => handleEdit(data)}
                               type="dashed"
                               className="text-sm text-green-500 bg-green-200 border-green-200"
                             >
                               Edit
                             </Button>
                             <Button
                               onClick={() => handleDelete(data)}
                               type="dashed"
                               className="text-sm text-red-600 border-red-200"
                             >
                               Del
                             </Button> */}
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

export default ProductPage;
