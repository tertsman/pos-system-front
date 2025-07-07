
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { format, parseISO } from "date-fns";

const HomeSaleCharts = ({ data = [] }) => {
  return (
    <div className=" h-[320px] border p-2 pb-8 card shadow-md rounded-md">
    <h3 className="text-xl font-bold mb-4">Daily Sale (Last 7 Days)</h3>
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="rgba(74, 222, 128, 0.8)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="rgba(74, 222, 128, 0)" stopOpacity={0} />
          </linearGradient>
        </defs>

        <XAxis
          dataKey="date"
          tickFormatter={(str) => {
            const date = parseISO(str);
            return format(date, "MMM d");
          }}
        />
        <YAxis />
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              const date = parseISO(label);
              return (
                <div style={{ backgroundColor: "white", padding: 10, border: "1px solid #ccc" }}>
                  <p>{`Date: ${format(date, "PPP")}`}</p>
                  <p>{`Total Sales: $${payload[0].value}`}</p>
                </div>
              );
            }
            return null;
          }}
        />
        <CartesianGrid strokeDasharray="3 3" />
        <Area
          type="monotone"
          dataKey="total"
          stroke="#4ade80"
          fill="url(#colorFill)"
          fillOpacity={1}
          strokeWidth={3}
          activeDot={{ r: 8 }}
        />
      </AreaChart>
    </ResponsiveContainer>
    </div>
  );
};

export default HomeSaleCharts;

