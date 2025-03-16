import { useEffect, useState } from "react";
import io from "socket.io-client";

const useSocket = (currentUser) => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const socket = io("http://localhost:8000", {
    query: { userId: currentUser._id }
  });

  useEffect(() => {
    socket.on("newMessage", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    socket.on("messageStatus", ({ messageId, status }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, status } : msg
        )
      );
    });

    socket.on("userTyping", () => setIsTyping(true));
    socket.on("userStopTyping", () => setIsTyping(false));

    return () => {
      socket.off("newMessage");
      socket.off("messageStatus");
      socket.off("userTyping");
      socket.off("userStopTyping");
    };
  }, []);

  const sendMessage = (message, selectedPatient) => {
    socket.emit("sendMessage", {
      senderId: currentUser._id,
      receiverId: selectedPatient._id,
      message,
    });

    setMessages((prev) => [
      ...prev,
      { senderId: currentUser._id, message, status: "sent" }
    ]);
    socket.emit("stopTyping", { receiverId: selectedPatient._id });
  };

  const emitTyping = (receiverId) => {
    socket.emit("typing", { receiverId });
  };

  return { messages, isTyping, sendMessage, emitTyping };
};

export default useSocket;
