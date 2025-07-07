import { Form, Button, message, Input, Space } from "antd";
import { request } from "../../util/helper";
import {
  setAccessToken,
  setPermission,
  setProfile,
} from "../../Store/profile.store";
import {useNavigate} from "react-router-dom"

const LoginPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  // const permission= getPermission()

  const onLogin = async (item) => {
  const param = { username: item.username, password: item.password };
  const res = await request("auth/login", "post", param);
  if (res && !res.error) {
    setAccessToken(res.access_token);
    setProfile(JSON.stringify(res.profile));
    setPermission(JSON.stringify(res.permission))
    // if (res.permission) {
    // localStorage.setItem("permission", JSON.stringify(res.permission));
    // }
    navigate("/");
  } else if (res.error) {
    if (res.error.username) {
      message.error(res.error.username);
    } else if (res.error.password) {
      message.error(res.error.password);
    } else {
      message.error("Login failed. Please try again.");
    }
  }
};

  return (
    <>
    
      <div className=" flex justify-center items-center loginPage">
        <div className="w-[400px]  flex flex-col bg-slate-100 rounded-md shadow-sm p-3 mt-20 ">
          
          <div className="logoWrapper text-center mt-1">
          <span className=" text-2xl text-red-600 font-bold  ">Shop</span><span className=" text-2xl text-cyan-400 font-bold ">oint</span>
        </div>
        <h1 className="text-center text-xl font-semibold text-slate-700 uppercase mt-2 mb-0">sign In</h1>
        <p className=" text-sm text-slate-400 text-center mb-2 mt-0 ">Log in with existing account !</p>
          
          <hr className="h-[2px]"/>
          <Form layout="vertical" form={form} onFinish={onLogin}>
            <Form.Item name="username" label="User Name">
              <Input placeholder="User Name" />
            </Form.Item>
            <Form.Item name="password" label="Password">
              <Input.Password placeholder="password" />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  LOGIN
                  
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </div>
      </div>

    </>
  );
};

export default LoginPage;
