import { Image } from "antd";
import React from "react";
import { config } from "../../util/config";

const ProductItem = ({ id, name,barcode, image, description, brand_name,category_name, discount, price,AdToCart, }) => {

 let finalPrice = price;

if (discount !== 0 && discount !== null && discount !== undefined) {
  const numericDiscount = Number(discount);
  finalPrice = price - (price * numericDiscount / 100);
  finalPrice = parseFloat(finalPrice.toFixed(2)); // keep it as number
}

  return (
    <div className=" w-full h-auto  shadow-md p-1 rounded-md cursor-pointer " onClick={AdToCart}>
      <div className="image w-full overflow-hidden  h-[100px] flex justify-center items-center mb-2 object-cover ">
        <Image src={config.image_part + image} alt="name" className=" w-full h-full rounded-sm" style={{objectFit:"cover",borderRadius:10}} />
      </div>
      <div className="info">
        <h1>{name}</h1>
        <p className="brand_category">{brand_name} | {category_name} | {barcode}</p>
        {/* <p>{description}</p> */}
        {discount != 0 && discount !=null &&discount != undefined ?
          <div className="price-info flex items-center text-center justify-center gap-1 ">
          <h6 className = "price">${price}</h6>
          <h6 className="discount">{discount}%</h6>
          <h6 className = "price-final">${finalPrice}</h6>
        </div>
        :
         <h6 className = "price-final text-center">${price}</h6>
        }
        
      </div>
    </div>
  );
};

export default ProductItem;
