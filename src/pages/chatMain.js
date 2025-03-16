import { useState, useEffect } from "react";
import { Input, Button, List, Avatar, Spin } from "antd";
import { CheckOutlined, CheckCircleOutlined } from "@ant-design/icons";
import io from "socket.io-client";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllUserAsync } from "../store/user/userSlice";

let USER_ID = localStorage.getItem("userId");
const socket = io("http://localhost:8000", { query: { userId: USER_ID } });

const ChatMain = () => {
  const dispatch = useDispatch();
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const [typingUserId, setTypingUserId] = useState(null);
  const { currentUser } = useSelector((state) => state.auth);
  const users = useSelector((state) => (state.user ? state.user.users : []));
  const [isOnlineUsers, setIsOnlineUsers] = useState([]);

  useEffect(() => {
    dispatch(fetchAllUserAsync());
  }, [dispatch]);

  useEffect(() => {
    if (!USER_ID) {
      USER_ID = currentUser._id;
    }

    socket.on("newMessage", (message) =>
      setMessages((prev) => [...prev, message])
    );

    socket.on("userTyping", ({ userId }) => {
      setTypingUserId(userId);
      if (selectedUser?._id === userId) setTyping(true);
    });

    socket.on("userStopTyping", ({ userId }) => {
      if (selectedUser?._id === userId) setTyping(false);
      setTypingUserId(null);
    });

    socket.on("messageStatus", ({ messageId, status }) => {
      setMessages((prev) =>
        prev.map((msg) => (msg._id === messageId ? { ...msg, status } : msg))
      );
    });
    // // Listen for updates to the list of online users
    // socket.on("updateOnlineUsers", (onlineUserIds) => {
    //   setIsOnlineUsers(onlineUserIds);
    // });
  }, [selectedUser]);

  useEffect(() => {
    if (selectedUser) {
      const fetchMessages = () => {
        socket.emit("getMessages", { receiverId: selectedUser._id });
        socket.on("loadMessages", (messages) => {
          console.log("Received messages:", messages);
          setMessages(messages);
        });
      };

      fetchMessages();

      // Cleanup to avoid multiple listeners
      return () => {
        socket.off("loadMessages");
      };
    }
  });

  const filteredMessages =
    selectedUser && USER_ID
      ? messages.filter(
          (msg) =>
            [msg.senderId, msg.receiverId].includes(USER_ID) &&
            [msg.senderId, msg.receiverId].includes(selectedUser._id)
        )
      : [];

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const messageData = {
      message: newMessage,
      senderId: USER_ID,
      receiverId: selectedUser._id,
    };

    socket.emit("sendMessage", messageData);
    setNewMessage("");
  };

  const handleTyping = () =>
    socket.emit("typing", { receiverId: selectedUser?._id });
  const handleStopTyping = () =>
    socket.emit("stopTyping", { receiverId: selectedUser?._id });
  console.log(messages, "=========");
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && newMessage.trim()) {
      sendMessage();
    }
  };
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 border-r p-4 overflow-y-auto">
        <List
          dataSource={users}
          renderItem={(user) => (
            <List.Item
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`cursor-pointer ${
                selectedUser?._id === user._id ? "bg-blue-100" : ""
              }`}
            >
              <Avatar src={user.avatar} />
              <span className="ml-2">{user.name}</span>
              {isOnlineUsers.includes(user._id) ? (
                <span className="ml-2 text-green-500">●</span>
              ) : (
                <span className="ml-2 text-gray-500">●</span>
              )}
            </List.Item>
          )}
        />
      </div>

      {/* Chat Area */}
      <div className="flex-1 p-4 flex flex-col">
        {selectedUser ? (
          <>
            <div className="flex-1 overflow-y-auto">
              {filteredMessages.map((msg) => (
                <div
                  key={msg._id}
                  className={`flex ${
                    msg.senderId === USER_ID ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg my-2 max-w-xs ${
                      msg.senderId === USER_ID
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-black"
                    }`}
                  >
                    <p>{msg.message}</p>
                    <span className="text-xs">
                      {msg.status === "sent" && <CheckOutlined />}
                      {msg.status === "delivered" && <CheckCircleOutlined />}
                      {msg.status === "seen" && (
                        <CheckCircleOutlined className="text-blue-500" />
                      )}
                    </span>
                  </div>
                </div>
              ))}
              {typing && typingUserId === selectedUser._id && (
                <div className="text-sm text-gray-500 mt-2">Typing...</div>
              )}
            </div>

            {/* Input Area */}
            <div className="flex items-center p-2 border-t">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleTyping}
                onKeyUp={handleStopTyping}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button type="primary" onClick={sendMessage} className="ml-2">
                Send
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500 p-4">
            Select a user to start chatting.
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMain;
