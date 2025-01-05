import React, { useEffect, useState } from "react";
import websocketService from "../../services/websocketService";

function NotificationList({ currentUser }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (currentUser) {
      // Connect to WebSocket when component mounts
      websocketService.connect(currentUser._id);

      // Listen for notifications
      websocketService.onNewNotification((notification) => {
        setNotifications((prev) => [notification, ...prev]);
      });

      // Cleanup on unmount
      return () => {
        websocketService.disconnect();
      };
    }
  }, [currentUser]);

  return (
    <div className="notifications-list">
      {notifications.map((notification, index) => (
        <div key={index} className="notification-item">
          <p>{notification.message}</p>
          <small>{new Date(notification.timestamp).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
}

export default NotificationList;
