import { useEffect, useLayoutEffect, useState } from "react";
import { Dropdown, Layout, Menu  } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
const { Content, Sider } = Layout;
import { CiSearch } from "react-icons/ci";
import { MdAttachEmail } from "react-icons/md";
import { IoIosNotificationsOutline } from "react-icons/io";
import user from "../../assets/user/user.jpeg";
import {
  getAccessToken,
  getProfile,
  setAccessToken,
  setProfile,
} from "../../Store/profile.store";
import { configStore } from "../../Store/configStore";
import { request } from "../../util/helper";
import { MdOutlinePointOfSale } from "react-icons/md";
import { MdDashboard } from "react-icons/md";
import { FaUsers } from "react-icons/fa6";
import { FiShoppingCart } from "react-icons/fi";
import { AiOutlineProduct } from "react-icons/ai";
import { MdViewList } from "react-icons/md";
import { BiCategoryAlt } from "react-icons/bi";
import { TbBrandBootstrap } from "react-icons/tb";
import { BiPurchaseTagAlt } from "react-icons/bi";
import { MdSupport } from "react-icons/md";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { LuArrowDownWideNarrow } from "react-icons/lu";
import { FaArrowTrendDown } from "react-icons/fa6";
import { FaUserTie } from "react-icons/fa";
import { RiSecurePaymentLine } from "react-icons/ri";
import { LuCircleUserRound } from "react-icons/lu";
import { PiUserListFill } from "react-icons/pi";
import { MdOutlineSecurity } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import { LuKeyRound } from "react-icons/lu";
import { RiShieldKeyholeFill } from "react-icons/ri";
import { GrLanguage } from "react-icons/gr";
import { RiCurrencyLine } from "react-icons/ri";
import logo from "../../assets/pos1.png"
const items = [
  {
    key: "/",
    label: "Dashbord",
    icon: <MdDashboard />,
    children: null,
  },
  {
    key: "/pos",
    label: "POS",
    icon: <MdOutlinePointOfSale />,
    children: null,
  },
  {
    key: "/Customer",
    label: "Customer",
    icon: <FaUsers />,
    children: null,
  },
  {
    key: "order",
    label: "Order",
    icon: <FiShoppingCart />,
    children: null,
  },
  {
    key: "product",
    label: "Product",
    icon: <AiOutlineProduct />,
    children: [
      
      {
        key: "product_list",
        label: "Product",
        icon: <MdViewList />,
        children: null,
      },
      {
        key: "category/category",
        label: "Category",
        icon: <BiCategoryAlt/>,
        children: null,
      },
      {
        key: "brands",
        label: "Brand",
        icon: <TbBrandBootstrap />,
        children: null,
      },

    ],
  },
  {
    key: "purchase",
    label: "Purchase",
    icon: <BiPurchaseTagAlt />,
    children: [
      {
        key: "supplier",
        label: "Suppliers",
        icon: <MdSupport />,
        children: null,
      },
      {
        key: "purchase_list",
        label: "List Purchase",
        icon: <MdViewList />,
        children: null,
      },
      {
        key: "purchase_product",
        label: "Purchase Product",
        icon: <MdOutlineProductionQuantityLimits />,
        children: null,
      },
    ],
  },
  {
    key: "expanse",
    label: "Expanse",
    icon: <FaArrowTrendDown  />,
    children: [
      {
        key: "expanse_type",
        label: "Expanse Type",
        icon: <FaArrowTrendDown />,
        children: null,
      },
      {
        key: "expanse_list",
        label: "Expanse",
        icon: <LuArrowDownWideNarrow />,
        children: null,
      },
    ],
  },
  {
    key: "employee_list",
    label: "Employee",
    icon: <FaUserTie />,
    children: [
      {
        key: "employee",
        label: "employee",
        icon: <FaUserTie />,
        children: null,
      },
      {
        key: "payroll",
        label: "Payroll",
        icon: <RiSecurePaymentLine />,
        children: null,
      },
    ],
  },
  {
    key: "user",
    label: "User",
    icon: <LuCircleUserRound />,
    children: [
      {
        key: "user_list",
        label: "User List",
        icon: <PiUserListFill />,
        children: null,
      },
      {
        key: "role",
        label: "Role",
        icon: <MdOutlineSecurity />,
        children: null,
      },
      {
        key: "permission",
        label: "Permission",
        icon: <RiShieldKeyholeFill />,
        children: null,
      },
    ],
  },
  {
    key: "setting",
    label: "Setting",
    icon: <IoMdSettings />,
    children: [
      {
        key: "change_password",
        label: "Change Password",
        icon: <LuKeyRound />,
        children: null,
      },
      {
        key: "currency",
        label: "Currency",
        icon: <RiCurrencyLine  />,
        children: null,
      },
      {
        key: "language",
        label: "Language",
        icon: <GrLanguage  />,
        children: null,
      },
    ],
  },
];


const MainLayout = () => {
  const navigate = useNavigate();
  const profile = getProfile();
  const setConfig = configStore((state) => state.setConfig);
  const onclickMenu = (item) => {
    navigate(item.key);
  };

  const [collapsed, setCollapsed] = useState(false);
  // const [profile, setProfile] = useState(null);

  // useEffect(() => {
  //   getConfig();
  //   const profile = getProfile();
  //   const accessToken = getAccessToken();

  //   if (!profile || !accessToken) {
  //     navigate("/login");
  //   }
  // }, []);

  useLayoutEffect(() => {
  const accessToken = getAccessToken();
  const profile = getProfile();

  if (!accessToken || !profile) {
    navigate("/login");
  } else {
    getConfig();
  }
}, []);

  // Run whenever profile changes
const getConfig= async ()=>{
   const res = await request("config","get");
  
       if(res){
        setConfig(res)
       }
}
  const handleLogout = () => {
    setProfile(null);
    setAccessToken(null);
    navigate("/login");
  };

const ItemsDrop = [
  {
    key:1,
    label:<a>1st menu item</a>
  },
  {
    key:2,
    label:( <a>2nd menu item
       (disabled)
      </a>),
       disabled: true,
  },
    {
      key: 3,
      label: (<div>{profile && <button onClick={handleLogout}>Log out</button>}</div>) , danger: true,
    },
  ];

  if (!profile) {
    return null; // Prevent rendering if profile is null
  }
  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
      
    >
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        theme="light"
      >
        <div className="demo-logo-vertical  w-[100%]">
          <div className="logoImageWrapper">
           <img src={logo} className=" w-100 h-100 " />
          </div>
        <div className="logoWrapper">
          <span className=" text-2xl text-red-600 font-bold  ">Shop</span><span className=" text-2xl text-cyan-400 font-bold ">oint</span>
        </div>
        </div>
        <Menu
          theme="light"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
          onClick={onclickMenu}
        />
      </Sider>
      <Layout>
        <div
          className="flex w-[100%] h-[70px] relative shadow-md rounded-md bg-gray-100 mb-4 justify-between items-center px-3
       "
        >
          <div className="flex overflow-hidden w-[270px] rounded-full h-[40px] bg-white border border-indigo-50">
            <input
              type="text"
              placeholder="Search ....."
              className="flex px-4 w-[90%] h-[100] 

outline-none"
            />
            <CiSearch className="text-2xl font-semibold justify-center items-center flex mt-2" />
          </div>
          <div className="user-profile relative flex justify-center items-center">
            <MdAttachEmail className="text-3xl black mr-1" />
            <IoIosNotificationsOutline className="text-3xl black mr-1" />
           
            <div>
              <h3 className="text-s capitalize font-bold">{profile?.name}</h3>
              <p>{profile?.Role_Name}</p>
            </div>
            <div className="w-[60px]  h-[60px] rounded-full overflow-hidden ml-2  ">
              <Dropdown
                menu={{
                  items:ItemsDrop,
                }}
              >
                <a onClick={(e) => e.preventDefault()}>
                  <img
                    src={user}
                    alt="user"
                    className="w-[100%]  has-[100%] object-cover "
                  />
                </a>
              </Dropdown>
            </div>
          </div>
        </div>
        <Content className=" mt-2  ">
          <div className="w-[98%] px-3 py-3  shadow-md bg-white ml-3 overflow-auto ">
            <Outlet />
          </div>
        </Content>

      </Layout>
    </Layout>
  );
};
export default MainLayout;
