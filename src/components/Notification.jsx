import React from 'react';
import { useNotification } from '../context/NotificationContext';
import './Notification.css';

const Notification = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="notification-container">
      {notifications.map((n) => (
        <div key={n.id} className={`notification-item ${n.type}`}>
          <div className="notification-content">
            <span className="notification-message">{n.message}</span>
            <button
              className="notification-close"
              onClick={() => removeNotification(n.id)}
              aria-label="Close notification"
            >
              &times;
            </button>
          </div>
          <div className="notification-progress"></div>
        </div>
      ))}
    </div>
  );
};

export default Notification;
