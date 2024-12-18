import React, { useState, useEffect } from "react";
import {
  Layout,
  Menu,
  Input,
  Button,
  List,
  Avatar,
  Space,
  Typography,
} from "antd";
import { SendOutlined } from "@ant-design/icons";
import { Svgs } from "../components/Svgs/svg-icons";
import { fetchAllUserAsync } from "../store/user/userSlice";
import { useDispatch, useSelector } from "react-redux";

const { Header, Sider, Content, Footer } = Layout;
const { Text } = Typography;

const patientsData = [
  {
    id: 1,
    name: "Hafsa Shakeel",
    messages: [
      {
        sender: "Hafsa Shakeel",
        content: "Hey, how's it going?",
        time: "10:15 AM",
      },
      { sender: "You", content: "I'm good, thanks!", time: "10:16 AM" },
    ],
  },
  {
    id: 2,
    name: "yusra",
    messages: [
      { sender: "yusra", content: "Let's catch up soon!", time: "10:05 AM" },
      { sender: "You", content: "Definitely!", time: "10:06 AM" },
    ],
  },
];

export default function Chat() {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [message, setMessage] = useState("");

  const getAllUsers = useSelector((state) =>
    state.user ? state.user.users : []
  );

  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    if (getAllUsers) {
      const filtered = getAllUsers.filter((user) => user.role === "Patient");
      setFilteredUsers(filtered);
    }
  }, [getAllUsers]);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllUserAsync());
  }, [dispatch]);

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
  };

  const handleSendMessage = () => {
    if (message.trim() && selectedPatient) {
      const newMessage = {
        sender: "You",
        content: message,
        time: new Date().toLocaleTimeString(),
      };
      setSelectedPatient({
        ...selectedPatient,
        messages: [...selectedPatient.messages, newMessage],
      });
      setMessage("");
    }
  };

  console.log(getAllUsers,'================getAllUsers============')
  console.log(filteredUsers,'============filteredUsers================')

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        width={300}
        style={{ background: "#fff", borderRight: "1px solid #ddd" }}
      >
        <div
          style={{
            padding: "10px",
            fontSize: "20px",
            fontWeight: "bold",
            color: "#0b3c95",
          }}
        >
          Patients
        </div>
        <Menu mode="inline" style={{ height: "100%", borderRight: 0 }}>
          <Input
            placeholder="Search Patient"
            prefix={Svgs.search}
            style={{ marginLeft: "10px" }}
          />
          <List
            dataSource={filteredUsers}
            style={{ paddingLeft: "10px", marginTop: "10px" }}
            renderItem={(patient) => (
              <List.Item onClick={() => handleSelectPatient(patient)}>
                <List.Item.Meta
                  avatar={
                    <Avatar style={{ backgroundColor: "#0b3c95" }}>
                      <Text style={{ color: "#fff", fontWeight: "bold" }}>
                        P
                      </Text>
                    </Avatar>
                  }
                  title={patient.name}
                />
              </List.Item>
            )}
          />
        </Menu>
      </Sider>
      <Layout>
        {selectedPatient ? (
          <>
            <Header
              style={{
                background: "#fff",
                paddingLeft: "20px",
                borderBottom: "1px solid #ddd",
                position: "fixed",
                top: 0,
                width: "100%",
                zIndex: 10,
                paddingRight: "320px",
              }}
            >
              <Space>
                <Avatar style={{ backgroundColor: "#0b3c95" }}>
                  <Text style={{ color: "#fff", fontWeight: "bold" }}>P</Text>
                </Avatar>
                <Text>{selectedPatient.name}</Text>
              </Space>
            </Header>
            <Content
              style={{
                padding: "20px",
                background: "#fff",
                height: "calc(100vh - 124px)",
                marginTop: "64px",
                marginBottom: "60px",
                overflowY: "auto",
              }}
            >
              <div>
                {patientsData[0].messages.map((msg, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      justifyContent:
                        msg.sender === "You" ? "flex-end" : "flex-start",
                      marginBottom: "10px",
                    }}
                  >
                    <div
                      style={{
                        background: "#89898930",
                        padding: "10px",
                        borderRadius: "10px",
                        maxWidth: "60%",
                      }}
                    >
                      <Text>{msg.content}</Text>
                    </div>
                  </div>
                ))}
              </div>
            </Content>
            <Footer
              style={{
                background: "#fff",
                padding: "10px 20px",
                position: "fixed",
                bottom: 0,
                width: "100%",
                borderTop: "1px solid #ddd",
                paddingRight: "320px",
              }}
            >
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onPressEnter={handleSendMessage}
                placeholder="Type a message..."
                suffix={
                  <Button
                    type="primary"
                    icon={<SendOutlined />}
                    onClick={handleSendMessage}
                    style={{ backgroundColor: "#0b3c95" }}
                  />
                }
              />
            </Footer>
          </>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
            }}
          >
            <Text style={{ fontSize: "15px", color: "#0b3c95" }}>
              Select Patient to start chatting
            </Text>
          </div>
        )}
      </Layout>
    </Layout>
  );
}
