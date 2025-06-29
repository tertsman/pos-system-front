// 📁 pages/payroll/index.jsx
import { useEffect, useState } from "react";
import MainPage from "../../component/layout/MainPage";
import { request } from "../../util/helper";
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Select,
  Space,
  Table,
  DatePicker,
} from "antd";
import dayjs from "dayjs";
import { configStore } from "../../Store/configStore";
const PayrollPage = () => {
  const [filter, setFilter] = useState({ txt_search: "" });
  const { config } = configStore();
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

  const employeeOptions = config.employee.map((em) => ({
    value: em.id,
    label: em.full_name,
  }));

  const [form] = Form.useForm();

  useEffect(() => {
    getList(1, state.pagination.limit);
    // const fetchEmployees = async () => {
    //   const res = await request("employee", "get", { page: 1, limit: 1000 });
    //   if (res && !res.error) {
    //     setState((p) => ({ ...p, listEmployee: res.list }));
    //   }
    // };
    // fetchEmployees();
    const fetchConfig = async () => {
      const res = await request("config", "get");
      if (res && !res.error) {
        configStore.getState().setConfig(res);
      }
    };
    fetchConfig();
  }, [filter]);

  const getList = async (page = 1, limit = 10) => {
    setState((p) => ({ ...p, loading: true }));
    const res = await request("payroll", "get", {
      ...filter,
      page,
      limit,
    });
    if (res && !res.error) {
      setState((p) => ({
        ...p,
        list: res.list,
        loading: false,
        pagination: {
          total: res.pagination?.total || 0,
          page,
          limit,
        },
      }));
    }
  };

  const handleOpenModal = () => {
    setState((p) => ({ ...p, visible: true }));
  };
  const handleCloseModal = () => {
    setState((p) => ({ ...p, visible: false }));
    form.resetFields();
  };

  // const onFinish = async (item) => {
  //   const data = { ...item, id: form.getFieldValue("id") };

  //   if (data.payment_date)
  //     data.payment_date = dayjs(data.payment_date).format("YYYY-MM-DD");

  //   data.net_salary =
  //     parseFloat(data.base_salary || 0) +
  //     parseFloat(data.bonus || 0) -
  //     parseFloat(data.deduction || 0);

  //   const method = form.getFieldValue("id") ? "put" : "post";

  //   const res = await request("payroll", method, data);
  //   if (res && !res.error) {
  //     message.success(res.message);
  //     getList();
  //     handleCloseModal();
  //   } else {
  //     message.warning(res.message);
  //   }
  // };
  const onFinish = async (item) => {
    const data = { ...item, id: form.getFieldValue("id") };

    if (data.payment_date) {
      const dateObj = dayjs(data.payment_date);
      data.payment_date = dateObj.isValid()
        ? dateObj.format("YYYY-MM-DD")
        : null;
    }

    data.net_salary =
      parseFloat(data.base_salary || 0) +
      parseFloat(data.bonus || 0) -
      parseFloat(data.deduction || 0);

    const method = form.getFieldValue("id") ? "put" : "post";

    const res = await request("payroll", method, data);
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
      content: "Are you sure you want to remove this payroll record?",
      onOk: async () => {
        const res = await request("payroll", "delete", { id: item.id });
        if (res && !res.error) {
          message.success(res.message);
          getList();
        }
      },
    });
  };

  const handleEdit = (item) => {
   
    form.setFieldsValue({
      ...item,
      payment_date:dayjs(item.payment_date),
    });
    

    handleOpenModal();
  };

  return (
    <MainPage loading={state.loading}>
      <div className="flex justify-between items-center px-2 py-2">
        <Space>
          <h1 className="text-2xl font-bold uppercase">Payroll</h1>
          <Input.Search
            placeholder="Search payroll"
            onChange={(e) =>
              setFilter((p) => ({ ...p, txt_search: e.target.value }))
            }
            allowClear
            onSearch={getList}
          />
        </Space>
        <Button
          className="bg-green-300 text-white font-semibold"
          onClick={handleOpenModal}
        >
          New
        </Button>
      </div>

      <Modal
        title={form.getFieldValue("id") ? "Update Payroll" : "New Payroll"}
        onCancel={handleCloseModal}
        open={state.visible}
        footer={null}
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item
            name="employee_id"
            label="Employee"
            rules={[{ required: true, message: "Please select an employee" }]}
          >
            <Select
              allowClear
              placeholder="ជ្រើសរើសប្រេន"
              options={employeeOptions}
            />
          </Form.Item>

          <Form.Item
            name="pay_period"
            label="Pay Period"
            rules={[{ required: true, message: "Please enter pay period" }]}
          >
            <Input placeholder="Ex: May 2025" />
          </Form.Item>

          <Form.Item
            name="base_salary"
            label="Base Salary"
            rules={[{ required: true, message: "Please enter base salary" }]}
          >
            <Input type="number" min={0} />
          </Form.Item>

          <Form.Item name="bonus" label="Bonus">
            <Input type="number" min={0} />
          </Form.Item>

          <Form.Item name="deduction" label="Deduction">
            <Input type="number" min={0} />
          </Form.Item>

          <Form.Item name="net_salary" label="Net Salary">
            <Input type="number" disabled />
          </Form.Item>

          <Form.Item
            name="payment_date"
            label="Payment Date"
            rules={[{ required: true, message: "Please select payment date" }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>

          <Form.Item name="note" label="Note">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button onClick={handleCloseModal}>Cancel</Button>
              <Button className="bg-green-300 text-white" htmlType="submit">
                {form.getFieldValue("id") ? "Update" : "Save"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Table
        dataSource={
          state.list?.map((item) => ({ ...item, key: item.id })) || []
        }
        pagination={{
          current: state.pagination.page,
          pageSize: state.pagination.limit,
          total: state.pagination.total,
          onChange: (page, pageSize) => getList(page, pageSize),
        }}
        columns={[
          { key: "no", title: "No", render: (_, __, index) => index + 1 },
          { key: "employee", title: "Employee", dataIndex: "full_name" },
          { key: "pay_period", title: "Pay Period", dataIndex: "pay_period" },
          {
            key: "base_salary",
            title: "Base Salary",
            dataIndex: "base_salary",
          },
          { key: "bonus", title: "Bonus", dataIndex: "bonus" },
          { key: "deduction", title: "Deduction", dataIndex: "deduction" },
          { key: "net_salary", title: "Net Salary", dataIndex: "net_salary" },
          {
            key: "payment_date",
            title: "Payment Date",
            dataIndex: "payment_date",
            render: (v) => dayjs(v).format("DD-MMM-YYYY"),
          },
          { key: "note", title: "Note", dataIndex: "note" },
          {
            key: "action",
            title: "Action",
            render: (item) => (
              <Space>
                <Button
                  onClick={() => handleEdit(item)}
                  type="dashed"
                  className="text-green-500 bg-green-200 border-green-200"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(item)}
                  type="dashed"
                  className="text-red-600 bg-red-100 border-red-200"
                >
                  Del
                </Button>
              </Space>
            ),
          },
        ]}
      />
    </MainPage>
  );
};

export default PayrollPage;
