import { useEffect, useState } from "react";
import { checkPermission, request } from "../../util/helper";
import {
  Button,
  Col,
  DatePicker,
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
import { MdAdd } from "react-icons/md";
import MainPage from "../../component/layout/MainPage";
import dayjs from "dayjs";
import * as XLSX from "https://unpkg.com/xlsx/xlsx.mjs";
import { saveAs } from "file-saver";
import { config } from "../../util/config";
import AttendanceEmployee from "./AttendanceEmployee";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
const ProductPage = () => {
  const [form] = Form.useForm();
  const [state, setState] = useState({
    visibleModal: false,
    list: [],
    pagination: {
      total: 0,
      page: 1,
      limit: 5,
    },
  });

  // filter
  const [filter, setFilter] = useState({
    txt_search: "",
    category_id: "",
    brand: "",
  });
  const [imageDefault, setimageDefault] = useState([]);
  useEffect(() => {
    getList(1, state.pagination.limit);
  }, [filter]); // ✅ Dependency added

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Handle open attendance
  const handleOpenAttendance = (employee) => {
    setSelectedEmployee(employee);
    setShowAttendanceModal(true);
  };

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

  const getList = async (page = 1, limit = 5) => {
    var params = {
      page,
      limit,
      ...filter,
    };
    const res = await request("employee", "get", params);
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

  // id	category_id	barcode	name	brands	description	qty	price	discount	status	image	create_by	create_at
  const onFinish = async (items) => {
    try {
      var params = new FormData();
      params.append("full_name", items.full_name);
      params.append("gender", items.gender);
      params.append("date_of_birth", items.date_of_birth.format("YYYY-MM-DD"));
      params.append("email", items.email);
      params.append("phone", items.phone);
      params.append("position", items.position);
      params.append("salary_type", items.salary_type);
      params.append("salary_amount", items.salary_amount);
      params.append("start_date", items.start_date.format("YYYY-MM-DD"));
      params.append("status", items.status);
      params.append("photo", form.getFieldValue("photo"));
      const id = form.getFieldValue("id");
      if (id) {
        params.append("id", id);
      }
      if (items.image_default) {
        const file = items.image_default.file;
        if (file.status === "removed") {
          params.append("image_remove", "1"); // បញ្ជូនសម្រាប់លុបរូបភាពចាស់
        } else {
          params.append("upload_image", file.originFileObj, file.name); // បញ្ជូនរូបភាពថ្មី
        }
      }

      console.log(items.image_default);
      const method = id ? "put" : "post";
      const res = await request("employee", method, params);
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

  // const onFinish = async (items) => {
  //   try {

  //     const params = new FormData();

  //     params.append("full_name", items.full_name);
  //     params.append("gender", items.gender);
  //     params.append("date_of_birth", items.date_of_birth.format("YYYY-MM-DD"));
  //     params.append("email", items.email);
  //     params.append("phone", items.phone);
  //     params.append("position", items.position);
  //     params.append("salary_type", items.salary_type);
  //     params.append("salary_amount", items.salary_amount);
  //     params.append("start_date", items.start_date.format("YYYY-MM-DD"));
  //     params.append("status", items.status);

  //   //   if (imageDefault.length === 0) {
  //   //   params.append("image_remove", "1"); // user ចង់លុបរូប
  //   // } else {
  //   //   const file = imageDefault[0];
  //   //   if (file.originFileObj) {
  //   //     params.append("upload_image", file.originFileObj, file.name); // user upload រូបថ្មី
  //   //   }
  //   // }

  // if (items.image_default) {
  //         const file = items.image_default.file;
  //         if (file.status === "removed") {
  //           params.append("image_remove", "1"); // បញ្ជូនសម្រាប់លុបរូបភាពចាស់
  //         } else {
  //           params.append("upload_image", file.originFileObj, file.name); // បញ្ជូនរូបភាពថ្មី
  //         }
  //       }

  //   // Append id if editing
  //   const id = form.getFieldValue("id");
  //   if (id) {
  //     params.append("id", id);
  //   }

  //     const method = id ? "put" : "post";
  //     const res = await request("employee", method, params);

  //     if (res && !res.error) {
  //       message.success(res.message);
  //       getList();
  //       handleCloseModal();
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     message.error("Error during update.");
  //   }
  // };

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
    setState((p) => ({
      ...p,
      visibleModal: true,
    }));
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChangeDefault = ({ fileList: newFileList }) => {
    console.log("handleChangeDefault newFileList:", newFileList);
    if (newFileList.length > 1) {
      message.error("Only one image is allowed.");
    } else {
      setimageDefault(newFileList);
    }
  };
  // const handleChangeDefault = ({ fileList: newFileList }) => {
  //   console.log("handleChangeDefault newFileList:", newFileList);
  //   setimageDefault(newFileList);
  // };

  const onFilter = () => {
    getList();
  };
  const onSearch = () => {
    getList();
  };
  const handleDelete = (item) => {
    Modal.confirm({
      title: "Remove data",
      content: "Are you sure to delete empolyee?",
      onOk: async () => {
        const res = await request("employee", "delete", item);
        if (res && !res.error) {
          message.success(res.message);
          getList();
        }
      },
    });
  };
  const exportToExcel = () => {
    // const dataExcel = [
    //   {id:1,name:"tert",age:20,city:"tbong khmung"},
    //   {id:1,name:"sokha",age:20,city:"tbong khmung"},
    // ]
    const dataExcel = state.list.map((item) => ({
      ...item,
      date_of_birth: dayjs(item.date_of_birth).format("YYYY-MM-DD"),
      start_date: dayjs(item.start_date).format("YYYY-MM-DD"),
      created_at: dayjs(item.created_at).format("YYYY-MM-DD"),
    }));

    const ws = XLSX.utils.json_to_sheet(dataExcel);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Empolyee"); // ✅ correct order

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelBuffer]), "Empolyee.xlsx");
  };

  const handleEdit = (items) => {
    if (items.photo && items.photo !== "") {
      setimageDefault([
        {
          uid: "-1",
          name: items.photo,
          status: "done",
          url: config.image_part + items.photo,
        },
      ]);
    } else {
      setimageDefault([]);
    }

    form.setFieldsValue({
      ...items,
      date_of_birth: dayjs(items.date_of_birth),
      start_date: dayjs(items.start_date),
      status: items.status === 1 ? 1 : 0,
    });

    setState((pre) => ({ ...pre, visibleModal: true }));
  };

  // const handleEdit = (items) => {
  //   form.setFieldsValue({
  //     ...items,
  //     date_of_birth: dayjs(items.date_of_birth),
  //     start_date: dayjs(items.start_date),
  //     status: items.status === 1 ? 1 : 0,
  //   });

  //   // ✅ កំណត់រូបភាពទៅ state imageDefault
  //   if (items.photo) {
  //     setimageDefault([
  //       {
  //         uid: "-1",
  //         name: items.photo,
  //         status: "done",
  //         url: config.image_part + items.photo,
  //       },
  //     ]);
  //   } else {
  //     setimageDefault([]);
  //   }

  //   setState((prev) => ({ ...prev, visibleModal: true }));
  // };

  return (
    <MainPage loading={false}>
      <div className="flex justify-between items-center px-2 py-2 ">
        <Space>
          <h1 className="text-2xl font-bold">EMPLOYEE</h1>
          <Input.Search
            placeholder="Search supplier"
            onChange={(event) =>
              setFilter((p) => ({ ...p, txt_search: event.target.value }))
            }
            allowClear
            onSearch={onSearch}
          />
          <Button
            onClick={onFilter}
            // icon={<MdAdd />}
            className=" bg-green-300 text-white font-semibold "
          >
            Filter
          </Button>
          <Button
            onClick={exportToExcel}
            className=" border-green-500 text-green-500"
          >
            Export
          </Button>
        </Space>
        {checkPermission("employee.create") && (
          <Button
            icon={<MdAdd />}
            className=" bg-green-300 text-white font-semibold "
            onClick={handleAddbtn}
          >
            New
          </Button>
        )}
      </div>

      <Modal
        open={showAttendanceModal}
        onCancel={() => setShowAttendanceModal(false)}
        footer={null}
        width={600}
        destroyOnClose
      >
        {selectedEmployee && <AttendanceEmployee employee={selectedEmployee} />}
      </Modal>
      {/* <Button type='primary' icon={<MdAdd /> } onClick={handlAddbtn} className='mb-3'>New</Button> */}
      <Modal
        open={state.visibleModal}
        title={form.getFieldValue("id") ? "Update Employee" : "New Employee"}
        footer={null}
        onCancel={handleCloseModal}
        width={700}
      >
        <Form layout="vertical" onFinish={onFinish} form={form}>
          <Row gutter={8}>
            <Col span={12}>
              <Form.Item
                name={"full_name"}
                label={"Employee Name"}
                rules={[
                  {
                    required: true,
                    message: "please fill in name",
                  },
                ]}
              >
                <Input placeholder="input full name" />
              </Form.Item>

              <Form.Item name="gender" label="Gender">
                <Select
                  options={[
                    { label: "Male", value: "male" },
                    { label: "Female", value: "female" },
                    { label: "Other", value: "other" },
                  ]}
                  placeholder="Select Gender"
                />
              </Form.Item>
              <Form.Item
                name="position"
                label="Position"
                rules={[{ required: true }]}
              >
                <Select
                  options={[
                    { label: "Owner", value: "Owner" },
                    { label: "Cashier", value: "Cashier" },
                    { label: "Sales Staff", value: "sales_staff" },
                    { label: "Stock Keeper", value: "stock_keeper" },
                    { label: "Accountant", value: "Accountant" },
                    { label: "Cleaner", value: "Cleaner" },
                    { label: "Security", value: "Security" },
                  ]}
                  placeholder="Select Gender"
                />
              </Form.Item>
              <Form.Item
                name="salary_type"
                label="Salary Type"
                rules={[{ required: true }]}
              >
                <Select
                  options={[
                    { label: "Monthly", value: "monthly" },
                    { label: "Hourly", value: "hourly" },
                  ]}
                  placeholder="Select salary type"
                />
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
                name="date_of_birth"
                label="Date of Birth"
                rules={[{ required: true }]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true, type: "email" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="phone"
                label="Phone"
                rules={[{ required: true }]}
              >
                <Input placeholder="phone number" />
              </Form.Item>
              <Form.Item
                name="salary_amount"
                label="Salary Amount"
                rules={[{ required: true }]}
              >
                <InputNumber style={{ width: "100%" }} min={0} />
              </Form.Item>
              <Form.Item
                name="start_date"
                label="Start Date"
                rules={[{ required: true }]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name={"image_default"} label={"Picture"}>
            <Upload
              listType="picture-card"
              fileList={imageDefault}
              maxCount={1}
              onPreview={handlePreview}
              onChange={handleChangeDefault}
              customRequest={(options) => {
                options.onSuccess();
              }}
            >
              {/* {uploadButton}  */}
              {imageDefault.length >= 1 ? null : uploadButton}
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
            key: "photo",
            title: "Image",
            listType: "picture-circle",
            dataIndex: "photo",
            render: (value) =>
              value ? (
                <Image
                  src={"http://localhost:81/full-stack/image/" + value}
                  style={{ width: 50 }}
                />
              ) : (
                <div
                  style={{ backgroundColor: "#eee", width: 50, height: 50 }}
                />
              ),
          },
          {
            key: "full_name",
            title: "Full Name",
            dataIndex: "full_name",
          },
          {
            key: "gender",
            title: "Gender",
            dataIndex: "gender",
          },
          {
            key: "date_of_birth",
            title: "DOB",
            dataIndex: "date_of_birth",
            render: (value) => dayjs(value).format("DD-MMM-YY"),
          },
          {
            key: "email",
            title: "Email",
            dataIndex: "email",
          },
          {
            key: "phone",
            title: "Phone",
            dataIndex: "phone",
          },
          {
            key: "position",
            title: "Position",
            dataIndex: "position",
          },
          {
            key: "salary_type",
            title: "salary type",
            dataIndex: "salary_type",
          },
          {
            key: "salary_amount",
            title: "salary_amount",
            dataIndex: "salary_amount",
          },
          {
            key: "start_date",
            title: "start_date",
            dataIndex: "start_date",
            render: (value) => dayjs(value).format("DD-MMM-YY"),
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
          // {
          //   key: "create_at",
          //   title: "Create At",
          //   dataIndex: "create_at",
          //   render: (value) => dayjs(value).format("DD-MMM-YY"),
          // },
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
                    {checkPermission("employee.update") && (
                      <li>
                        <Button
                          onClick={() => handleEdit(data)}
                          className="text-sm text-green-500 bg-slate-100 border-none w-full"
                        >
                          Edit
                        </Button>
                      </li>
                    )}
                    {checkPermission("employee.remove") && (
                      <li>
                        <Button
                          onClick={() => handleDelete(data)}
                          className="text-sm text-red-600 border-none bg-slate-100 w-full"
                        >
                          Delete
                        </Button>
                      </li>
                    )}
                    <li>
                      <Button
                        type="link"
                        className="text-sm text-blue-600 w-full p-0"
                        onClick={() => handleOpenAttendance(data)}
                      >
                        Attendance
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
        pagination={{
          current: state.pagination.page,
          pageSize: state.pagination.limit,
          total: state.pagination.total,
          onChange: (page, pageSize) => {
            getList(page, pageSize);
          },
        }}
      />
    </MainPage>
  );
};

export default ProductPage;
