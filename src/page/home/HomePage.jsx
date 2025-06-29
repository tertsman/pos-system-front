import { useEffect, useState } from "react";
import { request } from "../../util/helper";
import HomeGrid from "./HomeGrid";
import HomeSaleCharts from "../../component/home/HomeSaleCharts";
const HomePage = () => {
  
  const [dashboard,setDashboard] = useState([]);


 

 useEffect(() => {
  getlist();
 },[])
  const getlist = async () => {
    const res = await request("dashboard","get");

     if(res && !res.error){
      setDashboard(res.dashboard)
     }
  }
  
  return (
    <div>
      <HomeGrid data={dashboard}/>
      <HomeSaleCharts/>
     
    </div>
  )
}

export default HomePage