import React from "react";
import { FaUsers, FaUserTie } from "react-icons/fa";
import { FaCartArrowDown } from "react-icons/fa";
import { MdCurrencyExchange } from "react-icons/md";
const HomeGrid = ({ data = [] }) => {

  const getIcon = (title) => {
  switch (title) {
    case "Customer":
      return <FaUsers className="text-6xl text-blue-500 absolute top-[-20px] right-1 drop-shadow-md" />;
    case "Employee":
      return <FaUserTie className="text-6xl text-orange-500 absolute top-[-20px] right-1 drop-shadow-md" />;
    case "Expanse":
      return <FaCartArrowDown className="text-6xl text-red-500 absolute top-[-20px] right-1 drop-shadow-md" />;

    case "Total Sale":
      return <MdCurrencyExchange className="text-6xl text-green-500 absolute top-[-20px] right-1 drop-shadow-md" />;
    default:
      return null;

      case "Net Profit":
  return (
    <MdCurrencyExchange className="text-6xl text-yellow-500 absolute top-[-20px] right-1 drop-shadow-md" />
  );
  }
};
  return (
    <div>
      <div className=" grid lg:grid-cols-4 grid-rows-1 row-gap-4 gap-5 md:grid-cols-3 sm:grid-cols-2 relative mt-3 mb-3 ">
        {data?.map((item, index) => (
          <div
            key={index}
            className=" bg-slate-50 border w-[100%] h-[150px] rounded-lg px-3 py-3 shadow-md relative"
          >
            <div className="flex items-center justify-between">
            <div className="text-2xl font-semibold text-slate-500 ">{item.title}</div>
            {getIcon(item.title)}
            </div>
            <div
      className={`text-4xl font-semibold mt-6 ${
        item.title === "Expanse"
          ? "text-red-500"
          : item.title === "Net Profit"
          ? "text-yellow-500"
          : "text-green-400"
      }`}
    >
      {typeof item.total === "object"
        ? JSON.stringify(item.total)
        : item.total}
    </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeGrid;
