import io from "socket.io-client";

const API_URL = "http://localhost:5000";

class WebSocketService {
  socket = null;

  async createConversation(members) {
    try {
      debugger;
      if (!members || members.length !== 2 || !members[0] || !members[1]) {
        throw new Error(
          "Invalid members array. Need exactly 2 valid member IDs"
        );
      }

      console.log("Creating conversation with members:", members);
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No authentication token found");
      }

      console.log("Making request to:", `${API_URL}/conversation`);
      console.log("Request payload:", { members });
      console.log("Request headers:", {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      });

      const response = await fetch(`${API_URL}/conversation`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ members }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Conversation API response:", data);
      return data;
    } catch (error) {
      console.error("Full error object:", error);
      if (error.response) {
        console.error("Error response:", error.response);
      }
      throw error;
    }
  }

  async sendMessage(conversationId, sender, text) {
    try {
      if (!conversationId) {
        throw new Error("No conversation ID provided");
      }

      console.log("Sending message:", { conversationId, sender, text });
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/message/send`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId,
          sender,
          text,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Message sent successfully:", data);
      return data;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }

  async getMessages(conversationId, userId) {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_URL}/message/${conversationId}/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching messages:", error);
      throw error;
    }
  }

  // Socket methods
  connect(userId) {
    this.socket = io(API_URL, {
      query: { userId },
    });

    this.socket.on("connect", () => {
      console.log("WebSocket connected");
    });
  }

  onNewMessage(callback) {
    if (this.socket) {
      this.socket.on("newMessage", callback);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

export default new WebSocketService();
