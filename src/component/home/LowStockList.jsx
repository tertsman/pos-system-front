import { useEffect, useState } from "react";
import { request } from "../../util/helper";
import { config } from "../../util/config";

const LowStockList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getLowStock();
  }, []);

  const getLowStock = async () => {
    const res = await request("dashboard/low-stock", "get");
    if (res && !res.error) {
      setProducts(res.lowStock);
    }
  };

  return (
    <div className="mt-6 p-3 shadow-md rounded-md">
      <h3 className="text-xl font-bold mb-2 text-red-600">Low Stock Products</h3>
      <div className="grid md:grid-cols-3 gap-4">
        {products.map((item) => (
          <div key={item.id} className="border p-3 rounded shadow-md flex items-center gap-3">
            <img
              src={`${config.image_part}${item.image}`}
              alt={item.name}
              className="w-[60px] h-[60px] object-cover rounded"
            />
            <div>
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-red-500">Stock: {item.qty}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LowStockList;
