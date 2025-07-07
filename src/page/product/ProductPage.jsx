import { useEffect, useState } from "react";
import { checkPermission, request } from "../../util/helper";
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
import { PlusOutlined } from "@ant-design/icons";
import { MdAdd } from "react-icons/md";
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

import { IoBagHandle } from "react-icons/io5";
import { TbCategoryFilled } from "react-icons/tb";
import { TbBrandBinance } from "react-icons/tb";
const ProductPage = () => {
  const [form] = Form.useForm();
  const { config } = configStore();
  const [state, setState] = useState({
    visibleModal: false,
    list: [],
    pagination: {
      total: 0,
      page: 1,
      limit: 10,
    },
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
    getList(1, state.pagination.limit);
    const fetchConfig = async () => {
      const res = await request("config", "get");
      if (res && !res.error) {
        configStore.getState().setConfig(res);
      }
    };
    fetchConfig();
  }, [filter]); // ✅ Dependency added

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [imageDefault, setimageDefault] = useState([]);
  const [imageOptional, setimageOptional] = useState([]);
  const [ImageOptional_old, setImageOptional_old] = useState([]);

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

  const getList = async (page = 1, limit = 10) => {
    var params = {
      page,
      limit,
      ...filter,
    };
    const res = await request("product", "get", params);
    // alert(JSON.stringify(res))
    if (res && !res.error) {
      setState((p) => ({
        ...p,
        list: res.data,
        pagination: {
          total: res.pagination?.total || 0,
          page,
          limit,
        },
      }));
    }
  };

  const onFinish = async (items) => {
    try {
      const params = new FormData();
      const ImageOption = [];

      // ✅ សិក្សារូប optional ចាស់ទាំងអស់ និងបញ្ជូនឈ្មោះរូបដែលត្រូវលុប
      ImageOptional_old.forEach((oldImg) => {
        const stillExists = imageOptional.some(
          (file) => file.name === oldImg.name
        );
        if (!stillExists) {
          ImageOption.push(oldImg.name); // ⛔ ត្រូវលុប
        }
      });

      // ✅ បញ្ជូនព័ត៌មានជាចម្បង
      params.append("name", items.name);
      params.append("category_id", items.category_id);
      params.append("barcode", items.barcode);
      params.append("brands", items.brands);
      params.append("description", items.description);
      params.append("qty", items.qty);
      params.append("price", items.price);
      params.append("discount", items.discount);
      params.append("status", items.status);
      params.append("id", form.getFieldValue("id"));
      console.log(items.discount);
      // ✅ បញ្ជូនរូបភាពដែលត្រូវលុបជារូប optional
      params.append("image_optional", JSON.stringify(ImageOption));

      // ✅ រូប Default
      const defaultImage = form.getFieldValue("image");
      if (items.image_default?.file) {
        const file = items.image_default.file;

        if (file.status === "removed") {
          params.append("image_remove", "1");
          params.append("image", "");
        } else if (file.originFileObj) {
          params.append("upload_image", file.originFileObj, file.name);
          params.append("image", "");
        } else {
          params.append("image", file.name || defaultImage);
        }
      } else {
        params.append("image", defaultImage || "");
      }

      // ✅ បញ្ជូនរូប Optional ថ្មី
      imageOptional.forEach((item) => {
        if (item.originFileObj) {
          params.append("upload_image_optional", item.originFileObj, item.name);
        }
      });
      // ✅ បញ្ជូនទៅ server
      const method = form.getFieldValue("id") ? "put" : "post";
      const res = await request("product", method, params);

      if (res && !res.error) {
        message.success(res.message);
        getList();
        handleCloseModal();
      }
    } catch (error) {
      console.error(error);
      message.error("កំហុសក្នុងការផ្ញើព័ត៌មាន!");
    }
  };

  // new onfinish
  // const onFinish = async (items) => {
  //   try {
  //     var params = new FormData();
  //     params.append("name", items.name);
  //     params.append("category_id", items.category_id);
  //     params.append("barcode", items.barcode);
  //     params.append("brands", items.brands);
  //     params.append("description", items.description);
  //     params.append("qty", items.qty);
  //     params.append("price", items.price);
  //     params.append("discount", items.discount);
  //     params.append("status", items.status);
  //     params.append("id", form.getFieldValue("id"));

  // if (items.image_default) {
  //   if (items.image_default && items.image_default.file.status !== "removed") {
  //     params.append(
  //       "upload_image",
  //       items.image_default.file.originFileObj,
  //       items.image_default.file.name
  //     );
  //   }

  //    else {
  //     params.append(
  //       "upload_image",
  //       items.image_default.file.originFileObj,
  //       items.image_default.file.name
  //     );
  //   }
  // }
  //     if (items.image_default && items.image_default.file) {
  //       const file = items.image_default.file;
  //       if (file.status === "removed") {
  //         params.append("image_remove", "1"); // សម្គាល់ថាប្រាប់ back-end លុបរូប
  //       }
  //     }

  //     var method = "post";
  //     if (form.getFieldValue("id")) {
  //       method = "put";
  //     }

  //     const res = await request("product", method, params);
  //     if (res && !res.error) {
  //       message.success(res.message);
  //       getList();
  //       handleCloseModal();
  //     } else {
  //       message.error("Something went wrong. Please try again.");
  //     }
  //   } catch (error) {
  //     console.error("Error in update request:", error);
  //     message.error("Error during the update process. Please try again.");
  //   }
  // };

  // =========================

  // const onFinish = async (items) => {
  //   try {
  //     var params = new FormData();
  //     params.append("name", items.name);
  //     params.append("category_id", items.category_id);
  //     params.append("barcode", items.barcode);
  //     params.append("brands", items.brands);
  //     params.append("description", items.description);
  //     params.append("qty", items.qty);
  //     params.append("price", items.price);
  //     params.append("discount", items.discount);
  //     params.append("status", items.status);

  //     params.append("image", items.image);
  //     params.append("id", form.getFieldValue("id")); // ប្រើ id ពេលកែប្រែ

  //     if (items.image_default) {
  //       // const fileObj = items.image_default[0];
  //       if (items.image_default.file === "removed") {
  //         // ✅ រូបថ្មី
  //         params.append(
  //           "image_remove","1"
  //         );
  //       } else {
  //         params.append(
  //           "upload_image",
  //           items.image_default.originFileObj,
  //           items.image_default.name
  //         );
  //       }

  //     }

  //     // កំណត់វិធីសាស្ត្រផ្ញើទៅ server (post សម្រាប់បញ្ចូល, put សម្រាប់កែប្រែ)
  //     var method = "post";
  //     if (form.getFieldValue("id")) {
  //       method = "put"; // ប្រើ put សម្រាប់កែប្រែ
  //     }

  //     // បញ្ជូនការស្នើសុំពី frontend ទៅ backend
  //     const res = await request("product", method, params);

  //     // ប្រសិនបើការឆ្លើយតបមិនមានកំហុស
  //     if (res && !res.error) {
  //       message.success(res.message);
  //       getList(); // ទាញយកបញ្ជីផលិតផលទំនើប
  //       handleCloseModal(); // បិទ Modal
  //     } else {
  //       message.error("Something went wrong. Please try again.");
  //     }
  //   } catch (error) {
  //     console.error("Error in update request:", error);
  //     message.error("Error during the update process. Please try again.");
  //   }
  // };

  //   const onFinish = async (items) => {
  //     try {
  //       // សរសេរ FormData
  //       var params = new FormData();
  //       params.append("name", items.name);
  //       params.append("category_id", items.category_id);
  //       params.append("barcode", items.barcode);
  //       params.append("brands", items.brands);
  //       params.append("description", items.description);
  //       params.append("qty", items.qty);
  //       params.append("price", items.price);
  //       params.append("discount", items.discount);
  //       params.append("status", items.status);
  //       params.append("id", form.getFieldValue("id")); // ប្រើ id ពេលកែប្រែ

  //       // ប្រសិនបើមានរូបភាពដែលត្រូវបញ្ជូន
  //       // if (items.image_default && items.image_default.file) {
  //       //   const file = items.image_default.file;

  //       //   if (file.status === "removed") {
  //       //     // បញ្ជូនសេចក្តីប្រកាសថាលុបរូបភាព
  //       //     params.append("image_remove", "1");
  //       //   } else {
  //       //     // បញ្ជូនរូបភាពដែលបានផ្ញើទៅ
  //       //     params.append("upload_image", file.originFileObj, file.name);
  //       //   }
  //       // }

  // // imageDefault គឺជាផ្ទាំង Upload
  // const imageDefault = items.image_default;

  // // បើអត់មានរូបទេ → ត្រូវចាប់យល់ថា បានលុប
  // if (!imageDefault || imageDefault.length === 0) {
  //   params.append("image_remove", "1");
  // } else {
  //   const file = imageDefault[0];

  //   // ប្រសិនបើជារូបចាស់ (មាន url) តែគ្មាន file.originFileObj → សុំរក្សា
  //   if (!file.originFileObj && file.url) {
  //     // do nothing → ទុកដូចមុន
  //   } else if (file.originFileObj) {
  //     // បើជា រូបថ្មី
  //     params.append("upload_image", file.originFileObj, file.name);
  //   }
  // }

  //       // កំណត់វិធីសាស្ត្រផ្ញើទៅ server (post សម្រាប់បញ្ចូល, put សម្រាប់កែប្រែ)
  //       var method = "post";
  //       if (form.getFieldValue("id")) {
  //         method = "put"; // ប្រើ put សម្រាប់កែប្រែ
  //       }

  //       // បញ្ជូនការស្នើសុំពី frontend ទៅ backend
  //       const res = await request("product", method, params);

  //       // ប្រសិនបើការឆ្លើយតបមិនមានកំហុស
  //       if (res && !res.error) {
  //         message.success(res.message);
  //         getList(); // ទាញយកបញ្ជីផលិតផលទំនើប
  //         handleCloseModal(); // បិទ Modal
  //       } else {
  //         message.error("Something went wrong. Please try again.");
  //       }
  //     } catch (error) {
  //       console.error("Error in update request:", error);
  //       message.error("Error during the update process. Please try again.");
  //     }
  //   };

  // =================
  const handleCloseModal = () => {
    setState((p) => ({
      ...p,
      visibleModal: false,
    }));
    form.resetFields();
    setimageDefault([]);
    setimageOptional([]);
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

  // const handleChangeOptional = ({ fileList: newFileList }) =>
  //   setimageOptional(newFileList);

  const handleChangeOptional = ({ fileList: newFileList }) => {
    setimageOptional(newFileList);
  };

  const onFilter = () => {
    getList(1, state.pagination.limit);
  };

  const handleDelete = (item) => {
    Modal.confirm({
      title: "Delete Product",
      content: `Are you sure you want to delete "${item.name}"?`,
      okText: "Yes",
      cancelText: "Cancel",
      onOk: async () => {
        const res = await request("product", "delete", {
          id: item.id,
          image: item.image || null,
          image_optional: JSON.stringify(item.image_optional || []),
        });
        if (res && !res.error) {
          message.success(res.message);
          getList(); // Refresh product list
        } else {
          message.error(res.message || "Delete failed");
        }
      },
    });
  };

  const handleEdit = async (items) => {
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
          url: "http://localhost:81/full-stack/image/" + items.image,
        },
      ];
      setimageDefault(imageProduct);
    }
    const res_image = await request(
      "product/optional-images/" + items.id,
      "get"
    );

    if (res_image && !res_image.error) {
      if (res_image.optional_images) {
        const imageProductOptional = res_image.optional_images.map(
          (item, index) => ({
            uid: index,
            name: item,
            status: "done",
            url: "http://localhost:81/full-stack/image/" + item,
          })
        );

        setimageOptional(imageProductOptional); // <-- don't forget this!
        setImageOptional_old(imageProductOptional); // <-- don't forget this!
      }
    }
  };
  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    const isLt10M = file.size / 1024 / 1024 < 10;

    if (!isImage) {
      message.error("សូមជ្រើសរូបភាពត្រឹមត្រូវ (jpg, png, ...)!");
    }
    if (!isLt10M) {
      message.error("ទំហំរូបភាពត្រូវតិចជាង 10MB!");
    }

    return isImage && isLt10M;
  };
  return (
    <MainPage loading={false}>
      <div className="container">
        <div className="productReport grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2 mb-3">
          <div className="totalProduct card shadow-md border-sky-100 border p-7 rounded-md relative">
            <div className="totalProductHead">
              <h1 className=" text-xl text-sky-400 capitalize font-bold ">total product</h1>

              <IoBagHandle className=" text-6xl absolute top-5 right-3 text-sky-300 " />
            </div>
            

            <div className="text-3xl font-bold text-sky-600 text-left mt-2  w-full">
            {state.list.length}
            </div>
            
          </div>
          <div className="totalProduct card shadow-md border-sky-100 p-7 relative border rounded-md ">
            <div className="totalProductHead">
              <h1 className=" text-xl text-sky-400 capitalize font-bold ">
                total category
              </h1>
              <TbCategoryFilled className=" text-6xl absolute top-5 right-3 text-sky-300 "/>
            </div>
             <div className="text-3xl font-bold text-sky-600 text-left mt-2  w-full"> {config.category.length}</div>
          </div>
          <div className="totalProduct card shadow-md border-sky-100 p-7 relative">
            <div className="totalProductHead">
            <h1 className=" text-xl text-sky-400 capitalize font-bold ">
              total brands
            </h1>
            <TbBrandBinance className=" text-6xl absolute top-5 right-3 text-sky-300 "/>
            </div>
            <div className=" text-3xl font-bold text-sky-600 text-left mt-2  w-full">
              {" "}
              {config.brand.length}{" "}
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center px-2 py-2 ">
          <Space>
            <h1 className="text-2xl font-bold">PRODUCT</h1>
            <Input.Search
              placeholder="Search supplier"
              // onChange={(event) =>
              //   setFilter((p) => ({ ...p, txt_search: event.target.value }))
              // }
              // allowClear
              // onSearch={onSearch}
              value={filter.txt_search}
              onChange={(e) =>
                setFilter((p) => ({ ...p, txt_search: e.target.value }))
              }
              onSearch={() => getList(1, state.pagination.limit)}
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
          {checkPermission("product.create") && (
            <Button
              icon={<MdAdd />}
              className=" bg-green-300 text-white font-semibold "
              onClick={handleAddbtn}
            >
              New
            </Button>
          )}
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
                  <InputNumber
                    placeholder="input Quantity "
                    className="w-full"
                  />
                </Form.Item>
                <Form.Item name={"discount"} label={"Discount"}>
                  <InputNumber
                    placeholder="input Quantity "
                    className="w-full"
                  />
                </Form.Item>
                <Form.Item name={"barcode"} label={"Barcode"}>
                  <Input disabled placeholder="Barcode " className="w-full" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name={"description"} label={"Description"}>
              <Input.TextArea placeholder="Description" />
            </Form.Item>

            <Form.Item name={"image_default"} label={"Picture"}>
              <Upload
                listType="picture-card"
                fileList={imageDefault}
                maxCount={1}
                beforeUpload={beforeUpload}
                onPreview={handlePreview}
                onChange={handleChangeDefault}
                onRemove={(file) => {
                  console.log("Removing image:", file);
                  setimageDefault([]);
                  return true;
                }}
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
                beforeUpload={beforeUpload}
                onChange={handleChangeOptional}
                onRemove={(file) => {
                  const updatedList = imageOptional.filter(
                    (item) => item.uid !== file.uid
                  );
                  setimageOptional(updatedList);
                  return true;
                }}
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

              render: (value) =>
                value ? (
                  <Image
                    src={"http://localhost:81/full-stack/image/" + value}
                    style={{
                      width: 50,
                      height: 50,
                      objectFit: "cover",
                      borderRadius: 10,
                    }}
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
                    <ul className=" absolute top-0 right-[100%] w-[100px]  bg-slate-100 z-10 border rounded-md">
                      {checkPermission("product.update") && (
                        <li>
                          <Button
                            onClick={() => handleEdit(data)}
                            className="text-sm text-green-500 bg-slate-100 border-none w-full"
                          >
                            Edit
                          </Button>
                        </li>
                      )}
                      {checkPermission("product.remove") && (
                        <li>
                          <Button
                            onClick={() => handleDelete(data)}
                            className="text-sm text-red-600 border-none bg-slate-100 w-full"
                          >
                            Delete
                          </Button>
                        </li>
                      )}
                    </ul>
                  </details>
                </Space>
              ),
            },
          ]}
          pagination={{
            current: state.pagination.page,
            pageSize: state.pagination.limit,
            total: state.pagination.total,
            onChange: (page, pageSize) => {
              getList(page, pageSize);
            },
          }}
        />
      </div>
    </MainPage>
  );
};

export default ProductPage;
