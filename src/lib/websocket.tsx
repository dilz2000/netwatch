import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
  ReactNode,
} from "react";

// Define types for different message types
type InterfaceData = {
  id: string;
  name: string;
  description?: string;
  status?: string;
  [key: string]: any;
};

type PacketData = {
  src_ip: string;
  dst_ip: string;
  src_port: string | number;
  dst_port: string | number;
  protocol: string;
  length: string | number;
  timestamp: string;
  pcap_stats?: {
    received: number;
    dropped_kernel: number;
    dropped_interface: number;
  };
  avg_stats?: {
    avg_packet_size: number;
    packets_per_second: number;
  };
  [key: string]: any;
};

type RuleViolationData = {
  rule_id: string;
  rule_name: string;
  src_ip: string;
  dst_ip: string;
  timestamp: string;
  packet_size: string | number;
  details: string;
  [key: string]: any;
};

type PacketMetrics = {
  packet_rate: number;
  avg_size: number;
  total_packets: number;
  dropped_kernel: number;
  dropped_interface: number;
  timestamp: number;
};

// Define types for WebSocket context
type WebSocketContextType = {
  messages: any[];
  isConnected: boolean;
  error: Error | null;
  sendMessage: (message: string | object) => void;
  clearMessages: () => void;
  interfaces: InterfaceData[];
  latestPacket: PacketData | null;
  packetMetrics: PacketMetrics | null;
  ruleViolations: RuleViolationData[];
};

// Create the context with default values
const WebSocketContext = createContext<WebSocketContextType | null>(null);

// Custom hook to access WebSocket context
export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};

interface WebSocketProviderProps {
  children: ReactNode;
  url?: string;
}

// WebSocket provider component
export const WebSocketProvider = ({
  children,
  url = "ws://localhost:8080", // Default URL, should be replaced with your actual WebSocket server URL
}: WebSocketProviderProps) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  // State for specific message types
  const [interfaces, setInterfaces] = useState<InterfaceData[]>([]);
  const [latestPacket, setLatestPacket] = useState<PacketData | null>(null);
  const [packetMetrics, setPacketMetrics] = useState<PacketMetrics | null>(
    null,
  );
  const [ruleViolations, setRuleViolations] = useState<RuleViolationData[]>([]);

  // Open WebSocket connection
  useEffect(() => {
    let ws: WebSocket;

    try {
      ws = new WebSocket(url);

      ws.onopen = () => {
        setIsConnected(true);
        console.log("WebSocket connected to", url);
      };

      ws.onmessage = (event) => {
        try {
          // Try to parse as JSON first
          let parsedData: any;

          if (typeof event.data === "string") {
            parsedData = JSON.parse(event.data);
          } else {
            parsedData = event.data;
          }

          // Add to general messages
          setMessages((prevMessages) => [...prevMessages, parsedData]);

          // Handle specific message types
          const msgType = parsedData.type;

          if (msgType === "interfaces") {
            // Handle interfaces data
            const interfacesData = parsedData.interfaces || [];
            setInterfaces(interfacesData);
            console.log(`Received ${interfacesData.length} interface details`);
          } else if (msgType === "packet_update") {
            // Handle packet update
            let packetInfo: PacketData;

            if (typeof parsedData.packet_info === "string") {
              packetInfo = JSON.parse(parsedData.packet_info);
            } else {
              packetInfo = parsedData.packet_info || {};
            }

            setLatestPacket(packetInfo);

            // Extract and update metrics
            const pcapStats = packetInfo.pcap_stats || {
              received: 0,
              dropped_kernel: 0,
              dropped_interface: 0,
            };
            const avgStats = packetInfo.avg_stats || {
              packets_per_second: 0,
              avg_packet_size: 0,
            };

            const metricsUpdate: PacketMetrics = {
              packet_rate: Number(avgStats.packets_per_second || 0).toFixed(
                2,
              ) as unknown as number,
              avg_size: Number(avgStats.avg_packet_size || 0).toFixed(
                2,
              ) as unknown as number,
              total_packets: pcapStats.received || 0,
              dropped_kernel: pcapStats.dropped_kernel || 0,
              dropped_interface: pcapStats.dropped_interface || 0,
              timestamp: Date.now(),
            };

            setPacketMetrics(metricsUpdate);

            // Log packet details
            const {
              src_ip,
              dst_ip,
              src_port,
              dst_port,
              protocol,
              length,
              timestamp,
            } = packetInfo;
            console.log(
              `Packet from ${src_ip}:${src_port} to ${dst_ip}:${dst_port} (${protocol}) | Length: ${length} | Timestamp: ${timestamp}`,
            );
          } else if (msgType === "rule_violation") {
            // Handle rule violation
            const violationInfo = parsedData.rule_violation || {};

            setRuleViolations((prev) => [...prev, violationInfo]);

            // Log violation details
            const { rule_id, rule_name, src_ip, dst_ip, timestamp, details } =
              violationInfo;
            console.log(
              `Rule Violation: ${rule_name} (${rule_id}) | Source: ${src_ip} | Destination: ${dst_ip} | Time: ${timestamp}`,
            );
            console.log(`Details: ${details}`);
          }
        } catch (e) {
          // If not JSON or processing error, store as string
          console.error("Error processing WebSocket message:", e);
          setMessages((prevMessages) => [...prevMessages, event.data]);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        console.log("WebSocket closed");
      };

      ws.onerror = (e) => {
        const error = new Error("WebSocket error");
        setError(error);
        console.error("WebSocket error:", e);
      };

      // Set the socket reference
      setSocket(ws);
    } catch (e) {
      if (e instanceof Error) {
        setError(e);
      } else {
        setError(new Error("Failed to connect to WebSocket"));
      }
      console.error("Error creating WebSocket:", e);
    }

    // Cleanup the WebSocket connection on component unmount
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [url]);

  // Function to send a message through WebSocket
  const sendMessage = useCallback(
    (message: string | object) => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        const messageToSend =
          typeof message === "string" ? message : JSON.stringify(message);
        socket.send(messageToSend);
      } else {
        console.warn("WebSocket is not open. Cannot send message.");
      }
    },
    [socket],
  );

  // Function to clear all messages
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return (
    <WebSocketContext.Provider
      value={{
        messages,
        isConnected,
        error,
        sendMessage,
        clearMessages,
        interfaces,
        latestPacket,
        packetMetrics,
        ruleViolations,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};
