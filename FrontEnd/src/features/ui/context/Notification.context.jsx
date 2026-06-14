// Notification.context.jsx

import {
  createContext,
  useContext,
  useState,
} from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({
  children,
}) => {
  const [notifications, setNotifications] =
    useState([]);

  const removeNotification = (id) => {
    setNotifications((prev) =>
      prev.filter((n) => n.id !== id)
    );
  };

  const addNotification = (notification) => {
    const id = Date.now();

    setNotifications((prev) => [
      ...prev,
      { id, ...notification },
    ]);

    setTimeout(() => {
      removeNotification(id);
    }, 3000);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  return useContext(NotificationContext);
};