import { useState, useEffect } from "react";
import {
  Button,
  Modal,
  message,
  Image,
  List,
  Card,
  Typography,
  Divider,
  Spin,
} from "antd";
import QrScanner from "react-qr-scanner";
import { request } from "../../util/helper";

const { Title, Text } = Typography;

const AttendanceEmployee = ({ employee }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    fetchAttendanceHistory();
  }, []);

  const fetchAttendanceHistory = async () => {
    setLoading(true);
    const res = await request(`attendance/${employee.id}`, "get");
    if (res.success) {
      setAttendanceHistory(res.data);
    }
    setLoading(false);
  };

  const handleScan = async (data) => {
    if (data && !scanned) {
      setScanned(true);
      try {
        const res = await request("attendance", "post", {
          qr_code: data.text || data,
        });
        if (res.success) {
          message.success(res.message);
          fetchAttendanceHistory();
        } else {
          message.error(res.message);
        }
      } catch {
        message.error("Error during QR scan.");
      }
      setModalVisible(false);
      setTimeout(() => setScanned(false), 1500);
    }
  };

  const handleError = (err) => {
    console.error(err);
    message.error("QR Reader Error");
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <Card bordered className="shadow rounded-xl">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Title level={3}>Welcome, {employee?.full_name}</Title>
            <Text type="secondary">Position: {employee?.position}</Text>
          </div>

          <div className="flex flex-col items-center">
            <Text strong>Your QR Code</Text>
            <Image
              width={150}
              src={`https://api.qrserver.com/v1/create-qr-code/?data=${employee?.qr_code}&size=150x150`}
              alt="Employee QR Code"
              preview={false}
              className="mt-2"
            />
            <Button
              type="primary"
              className="mt-3"
              onClick={() => setModalVisible(true)}
            >
              Scan QR to Check-in / Check-out
            </Button>
          </div>
        </div>
      </Card>

      <Divider orientation="left">📅 Attendance History</Divider>

      {loading ? (
        <div className="flex justify-center items-center p-6">
          <Spin size="large" />
        </div>
      ) : (
        <List
          bordered
          dataSource={attendanceHistory}
          renderItem={(item) => (
            <List.Item>
              <div className="w-full">
                <Text strong>
                  {new Date(item.date).toLocaleDateString()}
                </Text>{" "}
                - Check-in:{" "}
                {item.check_in
                  ? new Date(item.check_in).toLocaleTimeString()
                  : "-"}{" "}
                - Check-out:{" "}
                {item.check_out
                  ? new Date(item.check_out).toLocaleTimeString()
                  : "-"}
              </div>
            </List.Item>
          )}
        />
      )}

      <Modal
        title="📷 Scan QR Code"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        centered
        width={360}
       styles={{
    body: { padding: 0, borderRadius: "8px", overflow: "hidden" }
  }}
      >
        <QrScanner
          delay={300}
          style={{ width: "100%" }}
          onError={handleError}
          onScan={handleScan}
        />
      </Modal>
    </div>
  );
};

export default AttendanceEmployee;
