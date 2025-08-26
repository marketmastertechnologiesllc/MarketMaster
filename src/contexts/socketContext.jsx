import { createContext, useMemo } from 'react';
import io from 'socket.io-client';

export const SocketContext = createContext();

// eslint-disable-next-line react/display-name, react/prop-types
const SocketProvider = ({ children }) => {
  // Memoize the socket instance to prevent recreation on every render
  const socket = useMemo(() => {
    return io('https://marketmasterapi.marketmaster.com', { transports: ['websocket'] });
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({ socket }), [socket]);

  return (
    <SocketContext.Provider value={contextValue}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;
