import { Modal, Table,  Button } from "antd";
import { useEffect, useState } from "react";
import { request } from "../../util/helper";
import dayjs from "dayjs";

const RecentOrders = () => {
  const [orders, setOrders] = useState([]);
  const [visible, setVisible] = useState(false);
  const [orderDetail, setOrderDetail] = useState(null);

  useEffect(() => {
    getOrders();
  }, []);

  const getOrders = async () => {
    const res = await request("dashboard/recent-orders", "get");
    if (res && !res.error) {
      setOrders(res);
    }
  };

  const showDetail = async (id) => {
    const res = await request(`order/${id}`, "get");
    if (res && !res.error) {
      setOrderDetail(res);
      setVisible(true);
    }
  };

  return (
    <>
      <div className="mt-6 bg-white rounded-lg shadow-md p-4 overflow-y-scroll ">
        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
        <Table dataSource={orders} rowKey="id" pagination={false} width="100%">
          <Table.Column title="Order ID" dataIndex="id" />
          <Table.Column title="Customer" dataIndex="customer_name" />
          <Table.Column
            title="Date"
            dataIndex="create_at"
            render={(date) => dayjs(date).format("DD MMM YYYY")}
          />
          <Table.Column title="Total ($)" dataIndex="total_amount" />
         
          <Table.Column
            title="Action"
            render={(_, record) => (
              <Button size="small" onClick={() => showDetail(record.id)}>
                View
              </Button>
            )}
          />
        </Table>
      </div>

      {/* Modal */}
      <Modal
        title={`Order Details #${orderDetail?.order?.id}`}
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        width={700}
      >
        {orderDetail && (
          <div>
            <p>
              <strong>Customer:</strong> {orderDetail.order.customer_name}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {dayjs(orderDetail.order.create_at).format("DD/MM/YYYY")}
            </p>
            <p>
              <strong>Total:</strong> ${orderDetail.order.total_amount}
            </p>
            <Table
              dataSource={orderDetail.items}
              rowKey={(item) => item.name + item.qty}
              pagination={false}
              size="small"
              className="mt-4"
            >
              <Table.Column title="Product" dataIndex="name" />
              <Table.Column title="Qty" dataIndex="qty" />
              <Table.Column title="Price ($)" dataIndex="price" />
              <Table.Column title="Total ($)" dataIndex="total" />
            </Table>
          </div>
        )}
      </Modal>
    </>
  );
};

export default RecentOrders;
