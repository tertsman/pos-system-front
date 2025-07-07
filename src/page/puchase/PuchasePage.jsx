// import { useEffect, useState } from "react";
// import MainPage from "../../component/layout/MainPage";
// import { request } from "../../util/helper";
// import {
//   Button,
//   DatePicker,
//   Form,
//   Input,
//   InputNumber,
//   Modal,
//   Select,
//   Space,
//   Table,
//   message,
// } from "antd";
// import dayjs from "dayjs";
// import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

// const PurchasePage = () => {
//   const [form] = Form.useForm();
//   const [productList, setProductList] = useState([]);
//   const [supplierList, setSupplierList] = useState([]);
//   const [rows, setRows] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const addRow = () => {
//     setRows((prev) => [
//       ...prev,
//       {
//         key: Date.now(),
//         product_id: null,
//         qty: 1,
//         cost: 0,
//         discount: 0,
//         retail_price: 0,
//         remark: "",
//       },
//     ]);
//   };

//   const removeRow = (key) => {
//     setRows((prev) => prev.filter((r) => r.key !== key));
//   };

//   const updateRow = (key, field, value) => {
//     setRows((prev) =>
//       prev.map((r) => (r.key === key ? { ...r, [field]: value } : r))
//     );
//   };

//   const loadSuppliers = async () => {
//     const res = await request("supplier", "get", {});
//     if (res && res.list) setSupplierList(res.list);
//   };

//   const loadProducts = async () => {
//     const res = await request("product", "get", { isListAll: true });
//     if (res && res.data) setProductList(res.data);
//   };

//   useEffect(() => {
//     loadSuppliers();
//     loadProducts();
//   }, []);

//   const onFinish = async (values) => {
//     if (rows.length === 0) return message.warning("Please add at least one product");

//     const payload = {
//       ...values,
//       paid_date: values.paid_date?.format("YYYY-MM-DD"),
//       products: rows,
//     };

//     const res = await request("purchase", "post", payload);
//     if (res && res.success) {
//       message.success(res.message);
//       form.resetFields();
//       setRows([]);
//     } else {
//       message.error(res.message || "Create failed");
//     }
//   };

//   return (
//     <MainPage loading={loading}>
//       <h1 className="text-2xl font-bold mb-4">New Purchase</h1>
//       <Form layout="vertical" form={form} onFinish={onFinish}>
//         <div className="grid grid-cols-3 gap-4">
//           <Form.Item label="Supplier" name="supplier_id" rules={[{ required: true }]}>
//             <Select placeholder="Select supplier">
//               {supplierList.map((sup) => (
//                 <Select.Option key={sup.id} value={sup.id}>
//                   {sup.name}
//                 </Select.Option>
//               ))}
//             </Select>
//           </Form.Item>
//           <Form.Item label="Reference" name="ref">
//             <Input placeholder="PO reference" />
//           </Form.Item>
//           <Form.Item label="Shipping Company" name="shipp_company">
//             <Input />
//           </Form.Item>

//           <Form.Item label="Shipping Cost" name="shipp_cost">
//             <InputNumber min={0} className="w-full" />
//           </Form.Item>
//           <Form.Item label="Paid Amount" name="paid_amount">
//             <InputNumber min={0} className="w-full" />
//           </Form.Item>
//           <Form.Item label="Paid Date" name="paid_date">
//             <DatePicker className="w-full" />
//           </Form.Item>
//         </div>

//         <h2 className="text-lg font-semibold mt-6 mb-2">Products</h2>
//         <Table
//           dataSource={rows}
//           pagination={false}
//           rowKey="key"
//           columns={[
//             {
//               title: "Product",
//               dataIndex: "product_id",
//               render: (value, row) => (
//                 <Select
//                   value={value}
//                   onChange={(val) => updateRow(row.key, "product_id", val)}
//                   className="w-full"
//                 >
//                   {productList.map((prod) => (
//                     <Select.Option key={prod.id} value={prod.id}>
//                       {prod.name}
//                     </Select.Option>
//                   ))}
//                 </Select>
//               ),
//             },
//             {
//               title: "Qty",
//               dataIndex: "qty",
//               render: (value, row) => (
//                 <InputNumber
//                   min={1}
//                   value={value}
//                   onChange={(val) => updateRow(row.key, "qty", val)}
//                 />
//               ),
//             },
//             {
//               title: "Cost",
//               dataIndex: "cost",
//               render: (value, row) => (
//                 <InputNumber
//                   min={0}
//                   value={value}
//                   onChange={(val) => updateRow(row.key, "cost", val)}
//                 />
//               ),
//             },
//             {
//               title: "Discount",
//               dataIndex: "discount",
//               render: (value, row) => (
//                 <InputNumber
//                   min={0}
//                   value={value}
//                   onChange={(val) => updateRow(row.key, "discount", val)}
//                 />
//               ),
//             },
//             {
//               title: "Retail Price",
//               dataIndex: "retail_price",
//               render: (value, row) => (
//                 <InputNumber
//                   min={0}
//                   value={value}
//                   onChange={(val) => updateRow(row.key, "retail_price", val)}
//                 />
//               ),
//             },
//             {
//               title: "Remark",
//               dataIndex: "remark",
//               render: (value, row) => (
//                 <Input
//                   value={value}
//                   onChange={(e) => updateRow(row.key, "remark", e.target.value)}
//                 />
//               ),
//             },
//             {
//               title: "",
//               render: (_, row) => (
//                 <Button
//                   type="text"
//                   icon={<DeleteOutlined />}
//                   danger
//                   onClick={() => removeRow(row.key)}
//                 />
//               ),
//             },
//           ]}
//         />

//         <Button
//           className="mt-4"
//           icon={<PlusOutlined />}
//           onClick={addRow}
//         >
//           Add Product
//         </Button>

//         <div className="mt-6 text-right">
//           <Button type="primary" htmlType="submit" className="bg-green-500 text-white">
//             Save Purchase
//           </Button>
//         </div>
//       </Form>
//     </MainPage>
//   );
// };

// export default PurchasePage;


import { useEffect, useState } from "react";
import MainPage from "../../component/layout/MainPage";
import { request } from "../../util/helper";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Table,
  message,
} from "antd";
// import dayjs from "dayjs";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

const PurchasePage = () => {
  const [form] = Form.useForm();
  const [productList, setProductList] = useState([]);
  const [supplierList, setSupplierList] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  // បន្ថែមជួរថ្មីមួយ
  const addRow = () => {
    setRows((prev) => [
      ...prev,
      {
        key: Date.now(),
        product_id: null,
        qty: 1,
        cost: 0,
        discount: 0,
        retail_price: 0,
        remark: "",
      },
    ]);
  };

  // លុបជួរដោយ key
  const removeRow = (key) => {
    setRows((prev) => prev.filter((r) => r.key !== key));
  };

  // អាប់ដេតជួរដោយ key, field, value
  const updateRow = (key, field, value) => {
    setRows((prev) =>
      prev.map((r) => (r.key === key ? { ...r, [field]: value } : r))
    );
  };

  // ទាញsupplier និង product ពីbackend
  const loadSuppliers = async () => {
    const res = await request("supplier", "get", {});
    if (res && res.list) setSupplierList(res.list);
  };

  const loadProducts = async () => {
    const res = await request("product", "get", { isListAll: true });
    if (res && res.data) setProductList(res.data);
  };

  useEffect(() => {
    loadSuppliers();
    loadProducts();
  }, []);

  const onFinish = async (values) => {
    if (rows.length === 0) return message.warning("Please add at least one product");

    const payload = {
      ...values,
      paid_date: values.paid_date?.format("YYYY-MM-DD"),
      products: rows,
    };

    setLoading(true);
    const res = await request("purchase", "post", payload);
    setLoading(false);

    if (res && res.success) {
      message.success(res.message);
      form.resetFields();
      setRows([]);
    } else {
      message.error(res.message || "Create failed");
    }
  };

  return (
    <MainPage loading={loading}>
      <h1 className="text-2xl font-bold mb-4">New Purchase</h1>
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <div className="grid grid-cols-3 gap-4">
          <Form.Item label="Supplier" name="supplier_id" rules={[{ required: true }]}>
            <Select placeholder="Select supplier">
              {supplierList.map((sup) => (
                <Select.Option key={sup.id} value={sup.id}>
                  {sup.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Reference (auto-generated)" name="ref">
            <Input disabled placeholder="Reference will be generated by system" />
          </Form.Item>
          <Form.Item label="Shipping Company" name="shipp_company">
            <Input />
          </Form.Item>

          <Form.Item label="Shipping Cost" name="shipp_cost">
            <InputNumber min={0} className="w-full" />
          </Form.Item>
          <Form.Item label="Paid Amount" name="paid_amount">
            <InputNumber min={0} className="w-full" />
          </Form.Item>
          <Form.Item label="Paid Date" name="paid_date">
            <DatePicker className="w-full" />
          </Form.Item>
        </div>

        <h2 className="text-lg font-semibold mt-6 mb-2">Products</h2>
        <Table
          dataSource={rows}
          pagination={false}
          rowKey="key"
          columns={[
            {
              title: "Product",
              dataIndex: "product_id",
              render: (value, row) => (
                <Select
                  value={value}
                  onChange={(val) => updateRow(row.key, "product_id", val)}
                  className="w-full"
                >
                  {productList.map((prod) => (
                    <Select.Option key={prod.id} value={prod.id}>
                      {prod.name}
                    </Select.Option>
                  ))}
                </Select>
              ),
            },
            {
              title: "Qty",
              dataIndex: "qty",
              render: (value, row) => (
                <InputNumber
                  min={1}
                  value={value}
                  onChange={(val) => updateRow(row.key, "qty", val)}
                />
              ),
            },
            {
              title: "Cost",
              dataIndex: "cost",
              render: (value, row) => (
                <InputNumber
                  min={0}
                  value={value}
                  onChange={(val) => updateRow(row.key, "cost", val)}
                />
              ),
            },
            {
              title: "Discount",
              dataIndex: "discount",
              render: (value, row) => (
                <InputNumber
                  min={0}
                  value={value}
                  onChange={(val) => updateRow(row.key, "discount", val)}
                />
              ),
            },
            {
              title: "Retail Price",
              dataIndex: "retail_price",
              render: (value, row) => (
                <InputNumber
                  min={0}
                  value={value}
                  onChange={(val) => updateRow(row.key, "retail_price", val)}
                />
              ),
            },
            {
              title: "Remark",
              dataIndex: "remark",
              render: (value, row) => (
                <Input
                  value={value}
                  onChange={(e) => updateRow(row.key, "remark", e.target.value)}
                />
              ),
            },
            {
              title: "",
              render: (_, row) => (
                <Button
                  type="text"
                  icon={<DeleteOutlined />}
                  danger
                  onClick={() => removeRow(row.key)}
                />
              ),
            },
          ]}
        />

        <Button className="mt-4" icon={<PlusOutlined />} onClick={addRow}>
          Add Product
        </Button>

        <div className="mt-6 text-right">
          <Button type="primary" htmlType="submit" className="bg-green-500 text-white">
            Save Purchase
          </Button>
        </div>
      </Form>
    </MainPage>
  );
};

export default PurchasePage;
