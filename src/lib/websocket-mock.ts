/**
 * This file provides a mock WebSocket server for development purposes.
 * It simulates network events, alerts, and packet data that would normally
 * come from a real WebSocket server.
 */

// Types for our mock data
export type NetworkStatus = {
  id: string;
  name: string;
  status: "online" | "offline" | "warning";
  trafficRate: number; // Mbps
  packetLoss: number; // percentage
  latency: number; // ms
  timestamp: string;
};

export type Alert = {
  id: string;
  type: "intrusion" | "anomaly" | "error" | "warning";
  severity: "critical" | "high" | "medium" | "low";
  source: string;
  destination?: string;
  message: string;
  timestamp: string;
};

export type PacketData = {
  id: string;
  source: string;
  destination: string;
  protocol: "TCP" | "UDP" | "ICMP" | "HTTP" | "HTTPS";
  size: number; // bytes
  timestamp: string;
  flags?: string[];
  payload?: string;
};

export type AttackData = {
  id: string;
  type: "DDoS" | "PortScan" | "BruteForce" | "Malware" | "Phishing";
  severity: "critical" | "high" | "medium" | "low";
  source: string;
  target: string;
  timestamp: string;
  status: "active" | "mitigated" | "investigating";
  details: string;
};

// Generate random IP address
const randomIP = () => {
  return `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
};

// Generate random MAC address
const randomMAC = () => {
  const hexDigits = "0123456789ABCDEF";
  let mac = "";
  for (let i = 0; i < 6; i++) {
    mac += hexDigits.charAt(Math.floor(Math.random() * 16));
    mac += hexDigits.charAt(Math.floor(Math.random() * 16));
    if (i < 5) mac += ":";
  }
  return mac;
};

// Generate a timestamp
const getTimestamp = () => {
  return new Date().toISOString();
};

// Generate random network status
export const generateNetworkStatus = (): NetworkStatus => {
  const statuses = ["online", "offline", "warning"] as const;
  return {
    id: `net-${Math.floor(Math.random() * 10000)}`,
    name: `Network-${Math.floor(Math.random() * 100)}`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    trafficRate: Math.random() * 1000,
    packetLoss: Math.random() * 5,
    latency: Math.random() * 100,
    timestamp: getTimestamp(),
  };
};

// Generate random alert
export const generateAlert = (): Alert => {
  const types = ["intrusion", "anomaly", "error", "warning"] as const;
  const severities = ["critical", "high", "medium", "low"] as const;

  return {
    id: `alert-${Math.floor(Math.random() * 10000)}`,
    type: types[Math.floor(Math.random() * types.length)],
    severity: severities[Math.floor(Math.random() * severities.length)],
    source: randomIP(),
    destination: Math.random() > 0.3 ? randomIP() : undefined,
    message: `Suspicious activity detected from ${randomIP()}`,
    timestamp: getTimestamp(),
  };
};

// Generate random packet data
export const generatePacketData = (): PacketData => {
  const protocols = ["TCP", "UDP", "ICMP", "HTTP", "HTTPS"] as const;
  const flags = ["SYN", "ACK", "FIN", "RST", "PSH", "URG"];

  return {
    id: `pkt-${Math.floor(Math.random() * 10000)}`,
    source: randomIP(),
    destination: randomIP(),
    protocol: protocols[Math.floor(Math.random() * protocols.length)],
    size: Math.floor(Math.random() * 1500),
    timestamp: getTimestamp(),
    flags:
      Math.random() > 0.5
        ? [flags[Math.floor(Math.random() * flags.length)]]
        : undefined,
    payload: Math.random() > 0.7 ? "Encrypted data" : undefined,
  };
};

// Generate random attack data
export const generateAttackData = (): AttackData => {
  const types = [
    "DDoS",
    "PortScan",
    "BruteForce",
    "Malware",
    "Phishing",
  ] as const;
  const severities = ["critical", "high", "medium", "low"] as const;
  const statuses = ["active", "mitigated", "investigating"] as const;

  return {
    id: `attack-${Math.floor(Math.random() * 10000)}`,
    type: types[Math.floor(Math.random() * types.length)],
    severity: severities[Math.floor(Math.random() * severities.length)],
    source: randomIP(),
    target: randomIP(),
    timestamp: getTimestamp(),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    details: `Attack detected from ${randomIP()} targeting multiple systems`,
  };
};

// Mock WebSocket server class
export class MockWebSocketServer {
  private callbacks: { [key: string]: ((data: any) => void)[] } = {};
  private intervalIds: NodeJS.Timeout[] = [];

  constructor() {
    // Start sending periodic updates
    this.startNetworkStatusUpdates();
    this.startAlertUpdates();
    this.startPacketDataUpdates();
    this.startAttackDataUpdates();
  }

  // Register a callback for a specific event type
  on(event: string, callback: (data: any) => void) {
    if (!this.callbacks[event]) {
      this.callbacks[event] = [];
    }
    this.callbacks[event].push(callback);
  }

  // Emit an event with data
  emit(event: string, data: any) {
    if (this.callbacks[event]) {
      this.callbacks[event].forEach((callback) => callback(data));
    }
  }

  // Start sending network status updates
  startNetworkStatusUpdates() {
    const intervalId = setInterval(() => {
      this.emit("networkStatus", generateNetworkStatus());
    }, 5000); // Every 5 seconds
    this.intervalIds.push(intervalId);
  }

  // Start sending alert updates
  startAlertUpdates() {
    const intervalId = setInterval(() => {
      if (Math.random() > 0.7) {
        // 30% chance of alert
        this.emit("alert", generateAlert());
      }
    }, 8000); // Every 8 seconds
    this.intervalIds.push(intervalId);
  }

  // Start sending packet data updates
  startPacketDataUpdates() {
    const intervalId = setInterval(() => {
      this.emit("packetData", generatePacketData());
    }, 1000); // Every second
    this.intervalIds.push(intervalId);
  }

  // Start sending attack data updates
  startAttackDataUpdates() {
    const intervalId = setInterval(() => {
      if (Math.random() > 0.8) {
        // 20% chance of attack
        this.emit("attackData", generateAttackData());
      }
    }, 15000); // Every 15 seconds
    this.intervalIds.push(intervalId);
  }

  // Clean up all intervals
  cleanup() {
    this.intervalIds.forEach((id) => clearInterval(id));
    this.intervalIds = [];
  }
}

// Create and export a singleton instance
export const mockWebSocketServer = new MockWebSocketServer();
