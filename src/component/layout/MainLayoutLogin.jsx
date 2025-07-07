
import { Outlet } from 'react-router-dom'

const MainLayoutLogin = () => {
  return (
    <div>
    {/* header */}
    <div className=' flex justify-center items-center '>
        <Outlet/>
    </div>

</div>
  )
}

export default MainLayoutLogin