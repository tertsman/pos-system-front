
import QuantityBox from "../../component/Quantity/QuantityBox";
import { FaRegTrashAlt } from "react-icons/fa";
import { config } from "../../util/config";
const BillListItem = ({ id, name, image, discount, price,cart_qty,onRemove,updateCartQty ,qty}) => {
  var finalPrice = price;
  if (discount !== 0 && discount !== null && discount !== undefined) {
    const numericDiscount = Number(discount);
    finalPrice = price - (price * numericDiscount) / 100;
    finalPrice = parseFloat(finalPrice.toFixed(2)); // keep it as number
  }

  return (
    <>
      <tr>
        <td>
          <div className="imageWrapperItem flex items-center justify-start">
            <div className="imageWrapper">
              <img
                src={config.image_part + image}
                alt="img"
                className="w-100"
              />
            </div>
            <p className="itemName">{name}</p>
          </div>
        </td>
        <td>
          <QuantityBox qty={cart_qty} onQtyChange={(newQty) => updateCartQty(id, newQty)} maxStock={qty}/>
        </td>
        <td className="text-center">
         <span className="items-center cartPrice ">${finalPrice.toFixed(2)} ${(finalPrice * cart_qty).toFixed(2)}</span>
        
        </td>
        {/* { discount !== 0 && discount !== null && discount !== undefined ? (
          <td className="items-center cartPrice ">${finalPrice}</td>
        ) : (
          <td className="items-center cartPrice ">${finalPrice}</td>
        ) } */}
        
        <td>
          <div className="remove" onClick={onRemove}>
            <FaRegTrashAlt />
          </div>
        </td>
      </tr>
    </>
  );
};

export default BillListItem;
