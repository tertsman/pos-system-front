
import { notification } from "antd";
import { useEffect, useState } from "react";
import { FaMinus } from "react-icons/fa6";
import { FiPlus } from "react-icons/fi";

// const QuantityBox = ({ qty = 1 }) => {
//   const [inputValue, setinputValue] = useState(qty);

//   const minus = () => {
//     if (inputValue !== 1) {
//       setinputValue(inputValue - 1);
//     }
//   };
//   const plus = () => {
//     setinputValue(inputValue + 1);
//   };
//   return (
//     <div className="quantity">
//       <button className=" quantity-btn minus" onClick={minus}>
//         <FaMinus />
//       </button>
//       <input
//         type="text"
//         value={inputValue}
//         onChange={(e) => {
//           const value = e.target.value;
//           if (!isNaN(value) && value !== "") {
//             setinputValue(parseInt(value, 10));
//           }
//         }}
//       />
//       <button className="plus quantity-btn" onClick={plus}>
//         <FiPlus />
//       </button>
//     </div>
//   );
// };

// export default QuantityBox;

const QuantityBox = ({ qty = 1, onQtyChange,maxStock }) => {
  const [inputValue, setinputValue] = useState(qty);

  useEffect(() => {
    setinputValue(qty);
  }, [qty]);

  const minus = () => {
    if (inputValue > 1) {
      const newQty = inputValue - 1;
      setinputValue(newQty);
      if (onQtyChange) onQtyChange(newQty); // 🔥 notify parent
    }
  };

  // const plus = () => {
  //   const newQty = inputValue + 1;
  //   setinputValue(newQty);
  //   if (onQtyChange) onQtyChange(newQty); // 🔥 notify parent
  // };
const plus = () => {
    if (inputValue < maxStock) {
      const newQty = inputValue + 1;
      setinputValue(newQty);
      if (onQtyChange) onQtyChange(newQty);
    } else {
     notification.error({
      message: "Warning",
      description: `No Stock! Currently only ${qty} in stock.`,
      placement: "top",
      style: {
        background: "hsl(359,100%,98%)",
        boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
        borderRadius: "15px",
      },
    });
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (!isNaN(value) && value !== "") {
      let parsed = parseInt(value, 10);
      if (parsed > maxStock) {
        parsed = maxStock;
        alert("លើសស្តុក!");
      }
      setinputValue(parsed);
      if (onQtyChange) onQtyChange(parsed);
    }
  };



  return (
    <div className="quantity">
      <button className="quantity-btn minus" onClick={minus}>
        <FaMinus />
      </button>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        // onChange={(e) => {
        //   const value = e.target.value;
        //   if (!isNaN(value) && value !== "") {
        //     const parsed = parseInt(value, 10);
        //     setinputValue(parsed);
        //     if (onQtyChange) onQtyChange(parsed);
        //   }
        // }}
      />
      <button className="plus quantity-btn" onClick={plus}>
        <FiPlus />
      </button>
    </div>
  );
};
export default QuantityBox;
