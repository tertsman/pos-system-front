import  { useEffect, useState } from "react";
import { request } from "../../util/helper";
import {
   XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar
} from "recharts";

const SaleSummary = () => {
 
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    fetchSaleSummary();
  }, []);

  const fetchSaleSummary = async () => {
    const res = await request("dashboard/sale-summary", "get");
    if (res && !res.error) {
      // Prepare data for charts (optional: fill missing dates/months)
      setMonthlyData(res.monthlySale);
    }
  };

  return (
    <div className=" h-[320px] border p-2 pb-8 card shadow-md rounded-md">
     <h3 className="text-xl font-bold mb-2">Monthly Sale (Last 6 Months)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="sale_month"
            tick={{ fontSize: 12, fill: "#555" }}
            padding={{ left: 10, right: 10 }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#555" }}
          />
          <Tooltip
            contentStyle={{ backgroundColor: "#f0f0f0", borderRadius: 4, borderColor: "#ccc" }}
          />
          <Legend verticalAlign="top" height={36} />
          <Bar dataKey="total_sale" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>

  );
};

export default SaleSummary;
