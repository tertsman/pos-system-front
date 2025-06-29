
import { Outlet } from 'react-router-dom'

const MainLayoutLogin = () => {
  return (
    <div>
    {/* header */}
    <div className='bg-red-300 p-4'>
        <h1>POS-TT</h1>
        
    </div>
    <div>
        <Outlet/>
    </div>

</div>
  )
}

export default MainLayoutLogin