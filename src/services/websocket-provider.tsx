import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";

// Create the context
const WebSocketContext = createContext(null);

// Custom hook to access WebSocket context
export const useWebSocket = () => {
  return useContext(WebSocketContext);
};

// WebSocket provider component
export const WebSocketProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);

  // Open WebSocket connection
  useEffect(() => {
    const ws = new WebSocket("ws://example.com/socket"); // Replace with your WebSocket URL

    ws.onopen = () => {
      setIsConnected(true);
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };

    ws.onclose = () => {
      setIsConnected(false);
      console.log("WebSocket closed");
    };

    ws.onerror = (e) => {
      setError(e);
      console.error("WebSocket error:", e);
    };

    // Set the socket reference
    setSocket(ws);

    // Cleanup the WebSocket connection on component unmount
    return () => {
      ws.close();
    };
  }, []);

  // Function to send a message through WebSocket
  const sendMessage = useCallback(
    (message) => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(message);
      } else {
        console.warn("WebSocket is not open. Cannot send message.");
      }
    },
    [socket],
  );

  return (
    <WebSocketContext.Provider
      value={{ messages, isConnected, error, sendMessage }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};
