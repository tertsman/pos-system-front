import { useEffect, useState } from "react";
import { request } from "../../util/helper";
import {
  Button,
  Col,
  Empty,
  Input,
  message,
  notification,
  Row,
  Select,
  Space,
} from "antd";
import { MdOutlineShoppingCartCheckout } from "react-icons/md";
import MainPage from "../../component/layout/MainPage";
import { configStore } from "../../Store/configStore";

import ProductItem from "../../component/pos/ProductItem";
import BillListItem from "./BillListItem";
import { useReactToPrint } from "react-to-print";
import React from "react";
import PrintInvoice from "../../component/pos/PrintInvoice";

const PosPage = () => {
  const { config } = configStore();
  const refInvoice = React.useRef(null);
  const [state, setState] = useState({
    visibleModal: false,
    list: [],
    pagination: {
      total: 0,
      page: 1,
      limit: 5,
      isListAll: true,
    },
    cartList: [],
  });

  const [ObjSummary, setObjSummary] = useState({
    subTotal: 0,
    totalQty: 0,
    save_discount: 0,
    tax: 0.1,
    total: 0,
    total_paid: 0,
    invoiceNo: null,
    orderDate: null,
    amount_received: 0,
    change: 0,
  });

  // filter
  const [filter, setFilter] = useState({
    txt_search: "",
    category_id: "",
    brand: "",
  });

  useEffect(() => {
    getList(1, state.pagination.limit, state.pagination.isListAll);
    const fetchConfig = async () => {
      const res = await request("config", "get");
      if (res && !res.error) {
        configStore.getState().setConfig(res);
      }
    };
    fetchConfig();

    let totalQty = 0,
      subTotal = 0,
      save_discount = 0,
      total = 0,
      originalTotal = 0;
    const taxRate = 0.1;
    state.cartList.forEach((item) => {
      const originalPrice = item.price;
      const discount = item.discount || 0;
      const finalPrice = +(
        originalPrice -
        (originalPrice * discount) / 100
      ).toFixed(2);

      totalQty += item.cart_qty;
      subTotal += item.cart_qty * finalPrice;
      originalTotal += item.cart_qty * originalPrice;
    });

    // total = subTotal;
    const tax = +(subTotal * taxRate).toFixed(2);
    total = subTotal + tax;
    save_discount = +(originalTotal - subTotal).toFixed(2);

    setObjSummary({
      subTotal: +subTotal.toFixed(2),
      totalQty,
      save_discount,
      tax,
      total: +total.toFixed(2),
    });
  }, [filter, state.pagination.isListAll, state.cartList]); // ✅ Dependency added

  const getList = async (page = 1, limit = 5, isListAll = true) => {
    var params = {
      page,
      limit,
      ...filter,
      isListAll: isListAll ? "1" : "0",
    };
    const res = await request("product", "get", params);

    // alert(JSON.stringify(res))
    if (res && !res.error) {
      if (res.data.length === 1) {
        handleAdd(res.data[0]);
        setState((pre) => ({
          ...pre,
        }));
      }
      setState((p) => ({
        ...p,
        list: res.data,
        pagination: {
          ...p.pagination,
          total: res.pagination?.total || 0,
          page,
          limit,
          isListAll,
        },
      }));
    }
  };

  // =================

  // const handleChangeOptional = ({ fileList: newFileList }) =>
  //   setimageOptional(newFileList);

  const onFilter = () => {
    getList(1, state.pagination.limit);
  };

  const handleAdd = (item) => {
    const cart_tmp = [...state.cartList];
    const findIndex = cart_tmp.findIndex((row) => row.id === item.id);

    let currentCartQty = findIndex !== -1 ? cart_tmp[findIndex].cart_qty : 0;
    let newCartQty = currentCartQty + 1;

    // ✅ check stock before modifying cart
    if (newCartQty > item.qty) {
      notification.error({
        message: "Warning",
        description: `No Stock! Currently only ${item.qty} in stock.`,
        placement: "top",
        style: {
          background: "hsl(359,100%,98%)",
          boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
          borderRadius: "15px",
        },
      });
      return;
    }

    // ✅ update cart normally
    if (findIndex === -1) {
      cart_tmp.push({
        ...item,
        cart_qty: 1,
      });
    } else {
      cart_tmp[findIndex] = {
        ...cart_tmp[findIndex],
        cart_qty: newCartQty,
      };
    }

    setState((pre) => ({
      ...pre,
      cartList: cart_tmp,
    }));
  };

  // const handleAdd = (item) => {
  //   const cart_tmp = [...state.cartList];
  //   //find is exist
  //   var findIndex = cart_tmp.findIndex((row) => row.id === item.id);
  //   var isNoStock = false;
  //   if (findIndex == -1) {
  //     if (item.qty > 0 ){

  //       cart_tmp.push({
  //         ...item,
  //         cart_qty: 1,
  //       });
  //     }else{
  //       isNoStock = true;
  //     }
  //   } else {
  //     cart_tmp[findIndex] = {
  //       ...cart_tmp[findIndex],
  //       cart_qty: cart_tmp[findIndex].cart_qty + 1,
  //     };
  //     if(!(cart_tmp[findIndex].cart_qty <= item.qty)){
  //       isNoStock = true;
  //     }
  //   }

  //   //check stock
  //   if(isNoStock){

  //     notification.error({
  //       message:"Warning",
  //       description:"No Stock!,Currently quantity in stock available "+item.qty,
  //       placement:"top",
  //       style:{
  //         background:"hsl(359,100%,98%)",
  //         boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
  //         borderRadius:"15px"
  //       }
  //     })
  //     return
  //   }
  //   setState((pre) => ({
  //     ...pre,
  //     cartList: cart_tmp,
  //   }));
  // };
  const updateCartQty = (id, newQty) => {
    const updatedCart = state.cartList.map((item) => {
      if (item.id === id) {
        return { ...item, cart_qty: newQty };
      }
      return item;
    });

    setState((prev) => ({
      ...prev,
      cartList: updatedCart,
    }));
  };
  const handleRemove = (id) => {
    const updatedCart = state.cartList.filter((item) => item.id !== id);
    setState((prev) => ({
      ...prev,
      cartList: updatedCart,
    }));
  };
  const ClearAll = () => {
    setState((prev) => ({
      ...prev,
      cartList: [],
    }));
    setObjSummary((p) => ({
      ...p,
      payment_method: [],
      customer_id: [],
      remark: "",
    }));
  };

  const handleCheckout = async () => {
    try {
      var product_details = [];
      state.cartList.forEach((item) => {
        let total = item.price * item.cart_qty;

        // apply discount if any
        if (item.discount != null && item.discount != 0) {
          total = total - (total * item.discount) / 100; // assume discount is %
        }
        const objItem = {
          product_id: item.id,
          qty: item.cart_qty,
          price: item.price,
          discount: item.discount,
          total: total,
        };
        product_details.push(objItem);
      });
      const params = {
        order: {
          customer_id: ObjSummary.customer_id,
          total_amount: ObjSummary.total,
          paid_amount: ObjSummary.total_paid ?? ObjSummary.total,
          payment_method: ObjSummary.payment_method,
          remark: ObjSummary.remark,
        },
        order_details: product_details,
      };
      if (
        !params.order.payment_method ||
        params.order.payment_method.trim?.() === ""
      ) {
        message.warning("Please select payment method");
        return;
      }

      console.log(params.order);
      const res = await request("order", "post", params);
      if (res && !res.error) {
        message.success(res.message);
        setObjSummary((pre) => ({
          ...pre,
          invoiceNo: res.order?.order_no,
          orderDate: res.order?.create_at,
        }));
        setTimeout(() => {
          ClearAll();
          handlePrintInvoice();
        }, 1000);
      } else {
        message.warning("Orders Not complete❗");
      }
    } catch (err) {
      console.error("Checkout failed:", err);
      message.error("Checkout process failed!");
    }
  };

  const onBeforePrint = React.useCallback(() => {
    console.log("`onBeforePrint ` called");
    return Promise.resolve();
  }, []);
  const onAfterPrint = React.useCallback(() => {
    console.log("`onAfterPrint` called");
  }, []);
  const onPrintError = React.useCallback(() => {
    console.log("`onPrintError` called");
  }, []);
  const handlePrintInvoice = useReactToPrint({
    contentRef: refInvoice,
    onBeforePrint: onBeforePrint,
    onAfterPrint: onAfterPrint,
    onPrintError: onPrintError,
  });

  return (
    <MainPage loading={false}>
      <div className=" hidden ">
        <PrintInvoice
          ref={refInvoice}
          cartList={state.cartList}
          ObjSummary={ObjSummary}
        />
      </div>
      <Row>
        <Col span={16} className="border">
          <div className="flex flex-wrap justify-between items-center px-2 py-2 shadow-sm mb-2 ">
            <Space size={[8, 16]} wrap>
              <h1 className="text-2xl font-bold">Point Of Sale</h1>
              <Input.Search
                placeholder="Search hear..."
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
          </div>
          {/* <Button type='primary' icon={<MdAdd /> } onClick={handlAddbtn} className='mb-3'>New</Button> */}
          <div className="pos-form w-full p-1">
            <Row gutter={12}>
              {state.list.map((item, index) => (
                <Col
                  key={index}
                  xs={{ flex: "100%" }}
                  sm={{ flex: "50%" }}
                  md={{ flex: "40%" }}
                  lg={{ flex: "20%" }}
                  xl={{ flex: "20%" }}
                >
                  <ProductItem {...item} AdToCart={() => handleAdd(item)} />
                </Col>
              ))}
            </Row>
          </div>
        </Col>
        <Col span={8}>
          <div className="billList">
            <div className="bilList_main shadow rounded-sm">
              <div className="billHead flex items-center justify-between p-2 ">
                <h1>Check Out</h1>
                <button onClick={ClearAll} className="clearAll">
                  Clear
                </button>
              </div>
              <hr className="mb-1" />
              <div className="table">
                <table>
                  <thead>
                    <tr>
                      <th>item</th>
                      <th>Qty</th>
                      <th>Price</th>
                      <th>Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.cartList?.map((item, index) => (
                      <BillListItem
                        key={index}
                        {...item}
                        updateCartQty={updateCartQty}
                        onRemove={() => handleRemove(item.id)}
                      />
                    ))}
                    {state.cartList.length === 0 && (
                      <tr>
                        <td colSpan={4}>
                          <div className="flex justify-center items-center">
                            <Empty />
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="billListFooter">
                <div className="card shadow mt-2 cardDetails">
                  <h4>cart totals</h4>
                  <div className=" flex items-center p-2  ">
                    <span className="text-gray font-semibold ">Total Qty</span>
                    <span className="text-brand ml-auto">
                      {ObjSummary.totalQty}
                    </span>
                  </div>
                  <div className=" flex items-center p-2  ">
                    <span className="text-gray font-semibold ">Subtotal</span>
                    <span className="text-brand ml-auto">
                      ${ObjSummary.subTotal}
                    </span>
                  </div>
                  <div className="flex items-center p-2">
                    <span className="font-semibold">Discount</span>
                    <span className="ml-auto">
                      <b>${ObjSummary.save_discount}</b>
                    </span>
                  </div>
                  <div className="flex items-center p-2">
                    <span className="text-gray font-semibold">Tax(10%)</span>
                    <span className=" ml-auto ">
                      <b>{ObjSummary.tax}$</b>
                    </span>
                  </div>
                  <hr />
                  <div className="flex items-center p-2">
                    <span className="font-bold text-xl text-cyan-400 ">
                      Total
                    </span>
                    <span className="ml-auto font-bold text-xl text-cyan-500 ">
                      ${ObjSummary.total}
                    </span>
                  </div>
                  <div className="check_container">
                    <Row gutter={10}>
                      <Col span={12}>
                        <Select
                          placeholder="Select customer"
                          value={ObjSummary.customer_id ?? null}
                          options={config.customer?.map((item) => ({
                            label: item.name,
                            value: item.id,
                          }))}
                          className="w-full"
                          onChange={(value) => {
                            setObjSummary((pre) => ({
                              ...pre,
                              customer_id: value,
                            }));
                          }}
                        />
                      </Col>
                      <Col span={12}>
                        <Select
                          placeholder="Select payment"
                          value={ObjSummary.payment_method ?? null}
                          className="w-full"
                          options={[
                            {
                              label: "Cash",
                              value: "Cash",
                            },
                            {
                              label: "Wing bank",
                              value: "Wing bank",
                            },
                            {
                              label: "ABA",
                              value: "ABA",
                            },
                            {
                              label: "AC bank",
                              value: "AC bank",
                            },
                          ]}
                          onChange={(value) => {
                            setObjSummary((p) => ({
                              ...p,
                              payment_method: value,
                            }));
                          }}
                        />
                      </Col>
                    </Row>
                    <div className="remark">
                      <textarea
                        type="text"
                        placeholder="remark"
                        value={ObjSummary.remark}
                        onChange={(e) => {
                          setObjSummary((pre) => ({
                            ...pre,
                            remark: e.target.value,
                          }));
                        }}
                      />
                    </div>
                    <Row gutter={12} className="mt-2">
                      {/* <Col span={12}>
                        <div className="paidContainer">
                          <p>Piad : </p>
                          <input
                            type="number"
                            placeholder="input paid"
                            className="paid"
                            value={ObjSummary.total}
                            onChange={(e) => {
                              setObjSummary((pre) => ({
                                ...pre,
                                total_paid: e.target.value,
                              }));
                            }}
                          />
                        </div>
                      </Col> */}
                      <Col span={24}>
                        <Row>
                          <Col span={12}>
                            <div className="paidContainer">
                              <p>Total (USD):</p>
                              <span>
                                {ObjSummary.total?.toFixed(2) ?? "0.00"} USD
                              </span>
                            </div>
                          </Col>
                          <Col span={12}>
                            <div className="paidContainer">
                              <p>Total (KHR):</p>
                              <span>
                                {(ObjSummary.total * 4100).toLocaleString()} ៛
                              </span>
                            </div>
                          </Col>

                          <Col span={24}>
                            <div className="paidContainer mt-3">
                              <p>Received Amount (USD):</p>
                              <input
                                type="number"
                                placeholder="Received"
                                className="paid"
                                value={ObjSummary.amount_received ?? ""}
                                onChange={(e) => {
                                  const received =
                                    parseFloat(e.target.value) || 0;
                                  const total =
                                    parseFloat(ObjSummary.total) || 0;
                                  const change = received - total;
                                  setObjSummary((pre) => ({
                                    ...pre,
                                    amount_received: received,
                                    change: change > 0 ? change : 0,
                                  }));
                                }}
                              />
                            </div>
                          </Col>
                          <Col span={12}>
                            <div className="paidContainer mt-3">
                              <p>Change (USD):</p>
                              <span>
                                {(ObjSummary.change ?? 0).toFixed(2)} USD
                              </span>
                            </div>
                          </Col>
                          <Col span={12}>
                            <div className="paidContainer mt-3">
                              <p>Change (KHR):</p>
                              <span>
                                {(
                                  (ObjSummary.change ?? 0) * 4100
                                ).toLocaleString()}{" "}
                                ៛
                              </span>
                            </div>
                          </Col>
                        </Row>
                      </Col>
                      <Col span={24}>
                        <button
                          disabled={state.cartList.length == 0}
                          className="checkOut mt-2"
                          onClick={handleCheckout}
                        >
                          Checkout <MdOutlineShoppingCartCheckout />
                        </button>
                      </Col>
                    </Row>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </MainPage>
  );
};

export default PosPage;
