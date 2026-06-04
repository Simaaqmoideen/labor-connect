import { useState, useEffect, useContext } from 'react';
import { SocketContext } from '../context/SocketContext';

const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    };

    socket.on('notification:new', handleNewNotification);

    return () => {
      socket.off('notification:new', handleNewNotification);
    };
  }, [socket]);

  const markRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    // Ideally call API to persist
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return { notifications, markRead, clearAll };
};

export default useNotifications;
