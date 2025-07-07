import { useEffect, useState } from "react";
import MainPage from "../../component/layout/MainPage";
import { request } from "../../util/helper";
import {
  Button,
  Input,
  Modal,
  Space,
  Table,
  message,
  Pagination,
} from "antd";
import dayjs from "dayjs";

const PurchaseList = () => {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const [searchText, setSearchText] = useState("");
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Fetch purchase list with filters
  const fetchList = async (page = 1, limit = 10, txt_search = "") => {
    setLoading(true);
    const res = await request("purchase", "get", {
      page,
      limit,
      txt_search,
    });
    setLoading(false);
    if (res && !res.error) {
      setList(res.list || []);
      setPagination({
        page,
        limit,
        total: res.pagination?.total || 0,
      });
    } else {
      message.error("Failed to fetch purchase list");
    }
  };

  useEffect(() => {
    fetchList(pagination.page, pagination.limit, searchText);
  }, []);

  const onSearch = () => {
    fetchList(1, pagination.limit, searchText);
  };

  const onPageChange = (page, pageSize) => {
    fetchList(page, pageSize, searchText);
  };

  // Open modal & fetch purchase detail by id
  const openDetailModal = async (id) => {
    setDetailLoading(true);
    setDetailModalVisible(true);
    const res = await request(`purchase/${id}`, "get", {});
    setDetailLoading(false);
    if (res && !res.error) {
      setDetailData(res);
    } else {
      message.error("Failed to load purchase detail");
      setDetailModalVisible(false);
    }
  };

  const closeDetailModal = () => {
    setDetailModalVisible(false);
    setDetailData(null);
  };

  // Columns for purchase list table
  const columns = [
    { title: "Ref", dataIndex: "ref", key: "ref" },
    { title: "Supplier", dataIndex: "supplier_name", key: "supplier_name" },
    { title: "Shipping Company", dataIndex: "shipp_company", key: "shipp_company" },
    {
      title: "Paid Amount",
      dataIndex: "paid_amount",
      key: "paid_amount",
      render: (v) => (v ? `$${v}` : "-"),
    },
    {
      title: "Paid Date",
      dataIndex: "paid_date",
      key: "paid_date",
      render: (v) => (v ? dayjs(v).format("DD-MMM-YYYY") : "-"),
    },
    {
      title: "Created At",
      dataIndex: "create_at",
      key: "create_at",
      render: (v) => (v ? dayjs(v).format("DD-MMM-YYYY HH:mm") : "-"),
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Button size="small" onClick={() => openDetailModal(record.id)}>
          View Details
        </Button>
      ),
    },
  ];

  return (
    <MainPage loading={loading}>
      <h1 className="text-2xl font-bold mb-4">Purchase List</h1>
      <Space className="mb-4">
        <Input.Search
          placeholder="Search by ref or supplier"
          allowClear
          enterButton="Search"
          onSearch={onSearch}
          onChange={(e) => setSearchText(e.target.value)}
          value={searchText}
          style={{ width: 300 }}
        />
      </Space>
      <Table
        columns={columns}
        dataSource={list.map((item) => ({ ...item, key: item.id }))}
        pagination={false}
        loading={loading}
        rowKey="id"
      />
      <Pagination
        current={pagination.page}
        pageSize={pagination.limit}
        total={pagination.total}
        onChange={onPageChange}
        className="mt-4"
        showSizeChanger={false}
      />

      {/* Modal for purchase detail */}
      <Modal
        title={detailData?.purchase?.ref || "Purchase Detail"}
        visible={detailModalVisible}
        onCancel={closeDetailModal}
        footer={null}
        width={800}
        confirmLoading={detailLoading}
      >
        {detailLoading ? (
          <p>Loading...</p>
        ) : detailData ? (
          <>
            <p>
              <b>Supplier:</b> {detailData.purchase.supplier_name}
            </p>
            <p>
              <b>Shipping Company:</b> {detailData.purchase.shipp_company || "-"}
            </p>
            <p>
              <b>Shipping Cost:</b> ${detailData.purchase.shipp_cost || 0}
            </p>
            <p>
              <b>Paid Amount:</b> ${detailData.purchase.paid_amount || 0}
            </p>
            <p>
              <b>Paid Date:</b>{" "}
              {detailData.purchase.paid_date
                ? dayjs(detailData.purchase.paid_date).format("DD-MMM-YYYY")
                : "-"}
            </p>

            <h3>Products</h3>
            <Table
              size="small"
              pagination={false}
              dataSource={detailData.products.map((p) => ({
                ...p,
                key: p.id,
              }))}
              columns={[
                {
                  title: "Product",
                  dataIndex: "product_name",
                  key: "product_name",
                },
                {
                  title: "Qty",
                  dataIndex: "qty",
                  key: "qty",
                },
                {
                  title: "Cost",
                  dataIndex: "cost",
                  key: "cost",
                  render: (v) => `$${v}`,
                },
                {
                  title: "Discount",
                  dataIndex: "discount",
                  key: "discount",
                  render: (v) => `$${v}`,
                },
                {
                  title: "Retail Price",
                  dataIndex: "retail_price",
                  key: "retail_price",
                  render: (v) => `$${v}`,
                },
                {
                  title: "Remark",
                  dataIndex: "remark",
                  key: "remark",
                },
              ]}
            />
          </>
        ) : (
          <p>No details found</p>
        )}
      </Modal>
    </MainPage>
  );
};

export default PurchaseList;
