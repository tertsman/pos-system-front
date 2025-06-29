// 📁 pages/payroll/index.jsx
import { useEffect, useState } from "react";
import MainPage from "../../component/layout/MainPage";
import { request } from "../../util/helper";
import {
  Button,
  Form,
  Input,
  Modal,
  Space,
  Table,
  DatePicker,
  Tag,
  Image,
} from "antd";
import { BsEye } from "react-icons/bs";
import dayjs from "dayjs";
import { configStore } from "../../Store/configStore";
import { config } from "../../util/config";
const OrderPage = () => {
  const [orderDetails, setOrderDetails] = useState([]);
  const [state, setState] = useState({
    list: [],
    visible: false,
    loading: false,
    pagination: {
      total: 0,
      page: 1,
      limit: 10,
    },
    start_date: null,
    end_date: null,
  });
  const [filter, setFilter] = useState({
    txt_search: "",
    start_date: state.start_date,
    end_date: state.end_dat,
  });

  const [form] = Form.useForm();

  useEffect(() => {
    getList(1, state.pagination.limit);
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
    const res = await request("order", "get", {
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

  const ViewDetails = async (item, data) => {
    
    setState((pre) => ({
      ...pre,
      loading: true,
    }));

    const res = await request("order_details/" + data.id, "get");
    console.log(res);

    if (res) {
      setOrderDetails(res.list);
      handleOpenModal();
      setState((pre) => ({
        ...pre,
        loading: false,
      }));
    }
  };

  return (
    <MainPage loading={state.loading}>
      <div className="flex justify-between items-center px-2 py-2">
        <Space wrap>
          <h1 className="text-2xl font-medium uppercase">order</h1>
          <Input.Search
            placeholder="Search here..."
            onChange={(e) =>
              setFilter((p) => ({ ...p, txt_search: e.target.value }))
            }
            allowClear
            onSearch={getList}
          />

          <DatePicker.RangePicker
            format="YYYY-MM-DD"
            allowClear
            onChange={(value) => {
              if (!value || !value[0] || !value[1]) {
                // 👉 Clear date when user removes selection
                setState((pre) => ({
                  ...pre,
                  start_date: null,
                  end_date: null,
                }));

                setFilter((prev) => ({
                  ...prev,
                  start_date: null,
                  end_date: null,
                }));
              } else {
                // 👉 Set date when both are selected
                const start_date = dayjs(value[0]).format("YYYY-MM-DD");
                const end_date = dayjs(value[1]).format("YYYY-MM-DD");

                setState((pre) => ({
                  ...pre,
                  start_date,
                  end_date,
                }));

                setFilter((prev) => ({
                  ...prev,
                  start_date,
                  end_date,
                }));
              }
            }}
          />
        </Space>
      </div>

      <Modal
        title={"Order Details"}
        onCancel={handleCloseModal}
        open={state.visible}
        footer={null}
        width={800}
      >
        <Table
          dataSource={orderDetails}
          pagination={false}
          columns={[
            {
              key: "image",
              title: "Image",
              dataIndex: "image",
              render: (value) =>
                value ? (
                  <Image
                    src={config.image_part + value}
                    style={{ width: 50,height:50,objectFit:"cover",backgroundPosition:"",borderRadius:10, }}
                  />
                ) : (
                  <div
                    style={{ backgroundColor: "#eee", width: 50, height: 50 }}
                  />
                ),
            },
            {
              key: "p_name",
              title: "Product",
              dataIndex: "p_name",
            },
            {
              key: "brand_name",
              title: "Brand",
              dataIndex: "brand_name",
            },
            {
              key: "category_name",
              title: "Category",
              dataIndex: "category_name",
            },
            {
              key: "qty",
              title: "Qty",
              dataIndex: "qty",
            },
            {
              key: "price",
              title: "Price",
              dataIndex: "price",
              render: (value) => <Tag color="green">{value}$</Tag>,
            },
            {
              key: "discount",
              title: "discount",
              dataIndex: "discount",
              render: (value) => <Tag color="red">{value}%</Tag>,
            },
            {
              key: "total",
              title: "Total",
              dataIndex: "total",
              render: (value) => <Tag color="green">{value}$</Tag>,
            },
          ]}
        />

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
          { key: "order_no", title: "Order NO", dataIndex: "order_no" },
          { key: "customer", title: "Customer", dataIndex: "customer" },
          {
            key: "total_amount",
            title: "Total Amount",
            dataIndex: "total_amount",
            align: "right",
            render: (value) => {
              // បម្លែង value ទៅ Number ទោះបីជា string ឬ decimal ក៏ដោយ
              const num = parseFloat(value);
              if (isNaN(num)) return "0.00"; // បើ value មិនមែនលេខទេ
              return num.toFixed(2); // បង្ហាញលេខជាទ្រង់ទ្រាយ 2 ទសភាគ
            },
          },
          {
            key: "paid_amount",
            title: "Paid Amount",
            dataIndex: "paid_amount",
            align: "right",
          },
          { key: "remark", title: "Remark", dataIndex: "remark" },
          {
            key: "create_at",
            title: "Create At",
            dataIndex: "create_at",
            render: (v) => dayjs(v).format("DD-MMM-YYYY"),
          },
          { key: "create_by", title: "Create By", dataIndex: "create_by" },

          {
            key: "action",
            title: "Action",
            render: (item, data) => (
              <Space>
                <Button
                  onClick={() => ViewDetails(item, data)}
                  type="dashed"
                  className="text-green-700 bg-green-100 border-green-300"
                >
                  <BsEye />
                </Button>
              </Space>
            ),
          },
        ]}
      />
    </MainPage>
  );
};

export default OrderPage;
