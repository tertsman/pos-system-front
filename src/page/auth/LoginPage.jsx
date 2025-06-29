import { Form, Button, message, Input, Space } from "antd";
import { request } from "../../util/helper";
import {
  setAccessToken,
  setProfile,
} from "../../Store/profile.store";
import {useNavigate} from "react-router-dom"

const LoginPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onLogin = async (item) => {
  const param = { username: item.username, password: item.password };
  const res = await request("auth/login", "post", param);
  console.log("Response:", res);
  if (res && !res.error) {

     console.log("Access Token:", res.access_token); // ⬅️ check if token exists
    setAccessToken(res.access_token);
    setProfile(JSON.stringify(res.profile));
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
      <div className=" flex justify-center items-center ">
        <div className="w-[400px]  flex flex-col bg-slate-100 rounded-md shadow-sm p-3 mt-6 ">
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
