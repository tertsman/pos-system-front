import { useEffect, useState } from "react";
import { request } from "../../util/helper";
import HomeGrid from "./HomeGrid";
import HomeSaleCharts from "../../component/home/HomeSaleCharts";
import TopProducts from "./TopProducts";
import LowStockList from "../../component/home/LowStockList";
import SaleSummary from "../../component/home/SaleSummay";
import RecentOrders from "../../component/home/RecentOrder";
import RevenueReport from "../../component/home/RevenueReport";
// import { getPermission } from "../../Store/profile.store";

const HomePage = () => {
  
  const [dashboard,setDashboard] = useState([]);
  const [chartData, setChartData] = useState([]);


 

 useEffect(() => {
  getlist();
 },[])
  const getlist = async () => {
    const res = await request("dashboard","get");

     if(res && !res.error){
      setDashboard(res.dashboard);
      setChartData(res.sale_chart || []); // ← set chart data
     }
  }
  // const permission = getPermission();
  return (
    <>
      {/* <div>
      {permission?.map((item,index)=>(
        <div key={index}>{item.name} || {item.group}</div>
      ))}
      </div> */}
      <HomeGrid data={dashboard}/>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-1 lg:grid-cols-2   ">

      <HomeSaleCharts data={chartData} />
      <SaleSummary/>
      </div>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-1 lg:grid-cols-2   ">

      <TopProducts/>
      <LowStockList/>
      </div>

      <div className="grid grid-cols-1 gap-2 md:grid-cols-1 lg:grid-cols-2   ">

      <RecentOrders/>
      <RevenueReport/>
      </div>
     
    </>
  )
}

export default HomePage