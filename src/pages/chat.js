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
  Tabs,
} from "antd";
import { SendOutlined } from "@ant-design/icons";
import { Svgs } from "../components/Svgs/svg-icons";
import { fetchAllUserAsync } from "../store/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import websocketService from "../services/websocketService";
import { setToken } from "../store/auth/authSlice";

const { Header, Sider, Content, Footer } = Layout;
const { Text } = Typography;
const { TabPane } = Tabs;

export default function Chat() {
  const [selectedPatient, setSelectedPatient] = useState({ messages: [] });
  const [message, setMessage] = useState("");
  const [currentConversation, setCurrentConversation] = useState(null);
  const currentUser = useSelector((state) => state.auth.user);
  const [activeTab, setActiveTab] = useState(
    currentUser?.role === "Doctor" || currentUser?.role === "Manufacturer"
      ? "agent"
      : "patient"
  );

  const getAllUsers = useSelector((state) =>
    state.user ? state.user.users : []
  );

  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    if (getAllUsers) {
      const filtered = getAllUsers.filter(
        (user) => user.role === capitalizeFirstLetter(activeTab)
      );
      setFilteredUsers(filtered);
    }
  }, [getAllUsers, activeTab]);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllUserAsync());
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !currentUser) {
      dispatch(setToken(token));
    }
  }, [dispatch, currentUser]);

  useEffect(() => {
    console.log("Current user from Redux:", currentUser);
    console.log("Token from localStorage:", localStorage.getItem("token"));

    if (!currentUser || !localStorage.getItem("token")) {
      console.log("User not properly logged in");
      return;
    }

    if (currentUser) {
      websocketService.connect(currentUser._id);

      websocketService.onNewMessage((newMessage) => {
        if (
          currentConversation &&
          newMessage.conversationId === currentConversation._id
        ) {
          setSelectedPatient((prev) => ({
            ...prev,
            messages: [
              ...prev.messages,
              {
                sender:
                  newMessage.senderId === currentUser._id
                    ? "You"
                    : selectedPatient.name,
                content: newMessage.text,
                time: new Date(newMessage.createdAt).toLocaleTimeString(),
              },
            ],
          }));
        }
      });

      return () => websocketService.disconnect();
    }
  }, [currentUser, currentConversation]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (currentConversation?._id) {
        try {
          const messages = await websocketService.getMessages(
            currentConversation._id,
            currentUser._id
          );

          if (messages && messages.length > 0) {
            const formattedMessages = messages.map((msg) => ({
              sender: msg.senderId === currentUser._id ? "You" : selectedPatient.name,
              content: msg.text,
              time: new Date(msg.createdAt).toLocaleTimeString(),
            }));

            setSelectedPatient((prev) => ({
              ...prev,
              messages: formattedMessages,
            }));
          }
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      }
    };

    fetchMessages();
  }, [currentConversation, selectedPatient, currentUser]);


  const handleSelectPatient = async (patient) => {
    console.log("Selecting patient:", patient);

    if (!currentUser) {
      console.log("Please login first");
      return;
    }

    try {
      // Create conversation
      const members = [currentUser._id, patient._id];
      console.log("Creating conversation between members:", members);

      // Set selected patient first with full patient data
      setSelectedPatient({
        _id: patient._id, // Make sure we have the ID
        name: patient.name,
        messages: [],
        ...patient, // Include all other patient data
      });

      const conversation = await websocketService.createConversation(members);
      console.log("Conversation created/retrieved:", conversation);

      // Set conversation after successful creation
      setCurrentConversation(conversation);

      // Then fetch messages if conversation exists
      if (conversation._id) {
        const messages = await websocketService.getMessages(
          conversation._id,
          currentUser._id
        );

        console.log("Retrieved messages:", messages);

        if (messages && messages.length > 0) {
          const formattedMessages = messages.map((msg) => ({
            sender: msg.senderId === currentUser._id ? "You" : patient.name,
            content: msg.text,
            time: new Date(msg.createdAt).toLocaleTimeString(),
          }));

          setSelectedPatient((prev) => ({
            ...prev,
            messages: formattedMessages,
          }));
        }
      }
    } catch (error) {
      console.error("Error in handleSelectPatient:", error);
    }
  };

  const handleSendMessage = async () => {
    console.log("Send Message Data:", {
      currentUser,
      selectedPatient,
      currentConversation,
      message,
    });

    if (!message.trim()) {
      console.log("Message is empty");
      return;
    }

    if (!selectedPatient?._id) {
      console.log("No patient selected");
      return;
    }

    if (!currentConversation?._id) {
      console.log("No active conversation, creating new one...");
      try {
        const members = [currentUser._id, selectedPatient._id];
        console.log("Creating conversation with members:", members);
        const conversation = await websocketService.createConversation(members);
        console.log("New conversation created:", conversation);
        setCurrentConversation(conversation);
      } catch (error) {
        console.error("Error creating conversation:", error);
        return;
      }
    }

    try {
      const sentMessage = await websocketService.sendMessage(
        currentConversation._id,
        currentUser._id,
        message
      );

      console.log("Message sent successfully:", sentMessage);

      const newMessage = {
        sender: "You",
        content: message,
        time: new Date().toLocaleTimeString(),
      };

      setSelectedPatient((prev) => ({
        ...prev,
        messages: [...(prev.messages || []), newMessage],
      }));

      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  console.log(getAllUsers, "================getAllUsers============");
  console.log(filteredUsers, "============filteredUsers================");

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const siderContent = (
    <Sider
      width={300}
      style={{ background: "#fff", borderRight: "1px solid #ddd" }}
    >
      <Tabs
        defaultActiveKey="patient"
        onChange={setActiveTab}
        style={{ marginBottom: 16, marginLeft: 20 }}
      >
        {currentUser.role === "SuperAdmin" && (
          <>
            <TabPane tab="Patients" key="patient" />
            <TabPane tab="Doctors" key="doctor" />
            <TabPane tab="Manufacturers" key="manufacturer" />
            <TabPane tab="Agents" key="agent" />
          </>
        )}
        {currentUser.role === "Agent" && (
          <>
            <TabPane tab="SuperAdmin" key="superAdmin" />
            <TabPane tab="Patients" key="patient" />
            <TabPane tab="Doctors" key="doctor" />
            <TabPane tab="Manufacturers" key="manufacturer" />
          </>
        )}
        {(currentUser.role === "Manufacturer" ||
          currentUser.role === "Doctor") && (
          <>
            <TabPane tab="Agents" key="agent" />
            <TabPane tab="SuperAdmin" key="superAdmin" />
          </>
        )}
      </Tabs>

      <Menu mode="inline" style={{ height: "100%", borderRight: 0 }}>
        <Input
          placeholder={`Search ${capitalizeFirstLetter(activeTab)}`}
          prefix={Svgs.search}
          style={{ margin: "0 10px 16px", width: "calc(100% - 20px)" }}
        />
        <List
          dataSource={filteredUsers}
          style={{ paddingLeft: "10px" }}
          renderItem={(user) => (
            <List.Item
              onClick={() => handleSelectPatient(user)}
              style={{ cursor: "pointer" }}
            >
              <List.Item.Meta
                avatar={
                  <Avatar style={{ backgroundColor: "#0b3c95" }}>
                    {user.name[0].toUpperCase()}
                  </Avatar>
                }
                title={user.name}
              />
            </List.Item>
          )}
        />
      </Menu>
    </Sider>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {siderContent}
      <Layout>
        {selectedPatient._id ? (
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
                  <Text style={{ color: "#fff", fontWeight: "bold" }}>
                    {selectedPatient.name[0].toUpperCase()}
                  </Text>
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
                {selectedPatient.messages.map((msg, idx) => (
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
                        background:
                          msg.sender === "You" ? "#0b3c95" : "#89898930",
                        color: msg.sender === "You" ? "white" : "black",
                        padding: "10px",
                        borderRadius: "10px",
                        maxWidth: "60%",
                      }}
                    >
                      <Text
                        style={{
                          color: msg.sender === "You" ? "white" : "inherit",
                        }}
                      >
                        {msg.content}
                      </Text>
                      <div
                        style={{
                          fontSize: "12px",
                          marginTop: "4px",
                          opacity: 0.7,
                        }}
                      >
                        {msg.time}
                      </div>
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
