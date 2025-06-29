import React from "react";
import dayjs from "dayjs";
import QR from "../../assets/user/scanPay.jpeg"
const PrintInvoice = React.forwardRef((props, ref) => {
  return (
    <div ref={ref} className="invoice">
      <div className="headInvoice">
        <h1>Codinet</h1>
        <h2>Sralop, Tbong khmom,Tbong khmom</h2>
        <h2>Phone: 0974260963</h2>
      </div>
      <div className="bodyInvoice">
        <div className="itemRef">
          <h2>Bill No:{props.ObjSummary?.invoiceNo}</h2>
          <h2>Date:{dayjs(props.ObjSummary?.orderDate).format('DD/MM/YYYY h:mm A')}</h2>
        </div>
        <table className="invoiceList">
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Amt</th>
            </tr>
          </thead>
          <tbody>
            {props.cartList?.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.cart_qty}</td>
                <td>${item.price}</td>
                <td>${(item.cart_qty * item.price).toFixed(2)}</td>
              </tr>
            ))}
            <tr className="subtotal">
              <td>SubTotal</td>
              <td colSpan={2}>{props.ObjSummary.totalQty}</td>
              <td>${props.ObjSummary.subTotal.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="footInvoice">
      
        <div className="flex items-center p-1">
          <span className="">Discount</span>
          <span className="ml-auto">
            <b>${props.ObjSummary.save_discount}</b>
          </span>
        </div>
        <div className="flex items-center p-1">
          <span className="text-gray">Tax(10%)</span>
          <span className=" ml-auto ">
            <b>{props.ObjSummary.tax}$</b>
          </span>
        </div>
        <hr />
        <div className="flex items-center p-1">
          <span className="font-bold text-xl text-cyan-400 ">Total</span>
          <span className="ml-auto font-bold text-xl text-cyan-500 ">
            ${props.ObjSummary.total}
          </span>
        </div>


        <div className="qrCode">
          <p>Scan Pay Don.</p>
          <div className="imageWrapper">

          <img src={QR} alt="qr" />
          </div>
          <p>Thanks you for purches</p>
        </div>
      </div>
    </div>
  );
});

export default PrintInvoice;
