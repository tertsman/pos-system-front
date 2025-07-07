import  { useEffect, useState } from "react";
import { request } from "../../util/helper";
import { config } from "../../util/config";

const TopProducts = () => {
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    getTop();
  }, []);

  const getTop = async () => {
    const res = await request("dashboard/top-products", "get");
    if (res && !res.error) {
      setTopProducts(res.top_products);
    }
  };

  return (
    <div className="mt-6 bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold mb-3 text-gray-700">Top 5 Selling Products (7 Days)</h2>
      <ul>
        {topProducts.map((item, index) => (
    <li key={index} className="flex items-center justify-between border-b py-3">
      <div className="flex items-center gap-3">
        <img 
          src={config.image_part + item.image_url} 
          alt={item.product_name} 
          className="w-12 h-12 object-cover rounded border border-gray-200" 
        />
        <span className="text-gray-700 font-medium">{item.product_name}</span>
      </div>
      <span className="font-bold text-green-600">{item.total_sold} sold</span>
    </li>
  ))}
      </ul>
    </div>
  );
};

export default TopProducts;
