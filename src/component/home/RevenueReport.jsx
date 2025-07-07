import  { useEffect, useState } from "react";
import { DatePicker, Button } from "antd";
import { request } from "../../util/helper";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const RevenueReport = () => {
  const [range, setRange] = useState([]);
 
  const [data, setData] = useState([]);

  const fetchData = async () => {
    const res = await request("dashboard/revenue", "get", {
      start_date: range?.[0]?.format("YYYY-MM-DD"),
      end_date: range?.[1]?.format("YYYY-MM-DD"),
    });
    if (res && !res.error) {
      setData(res.data || []);
    }
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Revenue");
    XLSX.writeFile(wb, "revenue_report.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [["Date", "Total"]],
      body: data.map((item) => [item.date, item.total]),
    });
    doc.save("revenue_report.pdf");
  };

  useEffect(() => {
    fetchData();
  }, [range]);

  return (
    <div className="bg-white p-4 shadow-md rounded-md mt-4">
      <h2 className="text-xl font-semibold mb-4">revenue report</h2>
      <div className="flex flex-wrap gap-3 mb-4 justify-between">
        <RangePicker onChange={(dates) => setRange(dates)} />
       
        <div className="space-x-2">
          <Button onClick={exportToExcel}>Export Excel</Button>
          <Button onClick={exportToPDF} danger>
            Export PDF
          </Button>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34d399" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={(value) => dayjs(value).format('DD-MMM-YYYY')} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total" fill="url(#gradient)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueReport;