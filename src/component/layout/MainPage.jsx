import { Button, Result, Spin } from "antd";
import { getServerStatus } from "../../Store/server.Store";

const info = {
  404: {
    message: "404 rout not found !",
    subtitle:
      "404 rout not found !,Please confirm your current rout that request to server",
  },
  403: {
    message: "403-Authorized !",
    subtitle: "Sorry ,you are not authorized to access this page",
  },
  500: {
    message: "500-internal server error!",
    subtitle: "Please connect administrator",
  },
  error:{
    message: "Can't connect to server",
    subtitle: "Please connect administrator",
  },
};
const MainPage = ({ children, loading }) => {
  var server_status = getServerStatus();
  // && info[server_status]
  const isServerError = server_status == "403" || server_status == "404" || server_status == "500" || server_status == "error";
  if (isServerError ) {
    return (
      <Result
        status={server_status + ""}
        title={info[server_status].message}
        subTitle={info[server_status].subtitle}
        extra={<Button type="primary">Back Home</Button>}
      />
    );
  }
  return (
    <div>
      <Spin spinning={loading}> {children}</Spin>
    </div>
  );
};

export default MainPage;
