import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { connectSocket, disconnectSocket, getSocket } from '../services/socket';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { token, isAuthenticated } = useContext(AuthContext);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let socket = null;
    if (isAuthenticated && token) {
      socket = connectSocket(token);
      
      const onConnect = () => setConnected(true);
      const onDisconnect = () => setConnected(false);

      socket.on('connect', onConnect);
      socket.on('disconnect', onDisconnect);

      // Check initial state
      if (socket.connected) setConnected(true);
    }

    return () => {
      if (socket) {
        socket.off('connect');
        socket.off('disconnect');
      }
      if (!isAuthenticated) {
        disconnectSocket();
        setConnected(false);
      }
    };
  }, [token, isAuthenticated]);

  return (
    <SocketContext.Provider value={{ socket: getSocket(), connected }}>
      {children}
    </SocketContext.Provider>
  );
};
