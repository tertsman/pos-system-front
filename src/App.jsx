
import './App.css'
import {BrowserRouter,Routes,Route} from "react-router-dom"
import HomePage from './page/home/HomePage'
import LoginPage from './page/auth/LoginPage'
import RegisterPage from './page/auth/RegisterPage'
import MainLayout from './component/layout/MainLayout'
import MainLayoutLogin from './component/layout/MainLayoutLogin'
import CategoryPage from "./page/category/CategoryPage"
import RolePage from './page/role/RolePage'
import UserPage from './page/user/UserPage'
import SupplierPage from './page/puchase/SupplierPage'
import ProductPage from './page/product/ProductPage'
import BrandPage from './page/brand/BrandPage'
import CustomerPage from './page/customer/CustomerPage'
import ExpanseTypePage from './page/expense/ExpanseTypePage'
import ExpansePage from './page/expense/ExpansePage'
import EmployeePage from './page/employee/EmployeePage'
import PayrollPage from './page/employee/PayrollPage'
import PosPage from './page/pos/PosPage'
import OrderPage from './page/pos/OrderPage'
import PurchasePage from './page/puchase/PuchasePage'
import PurchaseList from './page/puchase/PurchaseList'
import RolePermissionPage from './page/user/RolePermissionPage'

function App() {
 

  return (
    
    <BrowserRouter>

    <Routes>
      {/* Main layout */}
      <Route element={<MainLayout/>}>
      <Route path="/" element={  <HomePage/> } />
      <Route path="/pos" element={<PosPage/>} />
      <Route path="/order" element={<OrderPage/>} />
      <Route path="/customer" element={<CustomerPage/>} />
      <Route path="/product_list" element={<ProductPage/>} />
      <Route path="/category/category" element={<CategoryPage/>} />
      <Route path="/brands" element={<BrandPage/>} />
      <Route path="/employee" element={<EmployeePage/>} />
      <Route path="/payroll" element={<PayrollPage/>} />
      <Route path="/expanse_type" element={<ExpanseTypePage/>} />
      <Route path="/expanse_list" element={<ExpansePage/>} />
      <Route path="/role" element={<RolePage/>} />
      <Route path="/role/permission" element={<RolePermissionPage/>} />
      <Route path="/user_list" element={<UserPage/>} />
      <Route path="/supplier" element={<SupplierPage/>} />
      <Route path="/purchaseProduct" element={<PurchasePage/>} />
      <Route path="/purchaseList" element={<PurchaseList/>} />
      {/* <Route path="/attendance" element={<AttendanceEmployee/>} /> */}
      <Route path="*" element={<h1>404 Route Not Found</h1>} />
      </Route>
      {/* Main Layout login */}
      <Route element={<MainLayoutLogin/>}>
      <Route path="/login" element={<LoginPage/>} />
      <Route path="/register" element={<RegisterPage/>} />
      <Route path="*" element={<h1>404 Route Not Found</h1>} />
      
      </Route>
    </Routes>
   </BrowserRouter>
      
    
    
  )
}

export default App
