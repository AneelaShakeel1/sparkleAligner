import React, { useState, useEffect } from "react";
import websocketService from "../../services/websocketService";

function ChatWindow({ selectedUser, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  let typingTimeout = null;

  useEffect(() => {
    console.log("Selected User:", selectedUser); // Debug log
    console.log("Current User:", currentUser); // Debug log

    if (currentUser && selectedUser) {
      websocketService.connect(currentUser._id);

      // Listen for new messages
      websocketService.onMessageReceived((message) => {
        console.log("Received message:", message); // Debug log
        setMessages((prev) => [...prev, message]);
      });

      // Listen for typing events
      websocketService.onTyping(({ userId }) => {
        console.log("Typing event from:", userId); // Debug log
        if (userId === selectedUser._id) {
          setIsTyping(true);
        }
      });

      websocketService.onStopTyping(({ userId }) => {
        if (userId === selectedUser._id) {
          setIsTyping(false);
        }
      });

      return () => {
        websocketService.disconnect();
      };
    }
  }, [currentUser, selectedUser]);

  const handleTyping = () => {
    if (selectedUser && currentUser) {
      websocketService.emitTyping(selectedUser._id);

      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }

      typingTimeout = setTimeout(() => {
        websocketService.emitStopTyping(selectedUser._id);
      }, 1000);
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedUser || !currentUser) return;

    const messageData = {
      senderId: currentUser._id,
      receiverId: selectedUser._id,
      content: newMessage,
      timestamp: new Date(),
      senderName: currentUser.name,
    };

    console.log("Sending message:", messageData); // Debug log
    websocketService.sendMessage(messageData);
    setNewMessage("");
    websocketService.emitStopTyping(selectedUser._id);
  };

  // Return your existing chat UI here
  return (
    <div>
      {/* Use your existing chat UI structure here */}
      <div className="messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${
              msg.senderId === currentUser._id ? "sent" : "received"
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      {isTyping && (
        <div className="typing-indicator">{selectedUser.name} is typing...</div>
      )}

      <div className="message-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
            handleTyping();
          }}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatWindow;
