import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Play,
  Pause,
  Download,
  Filter,
  RefreshCw,
  Clock,
  Activity,
  Layers,
  Shield,
} from "lucide-react";

interface PacketAnalysisPanelProps {
  isCapturing?: boolean;
  captureTime?: number;
  packetCount?: number;
  networkInterface?: string;
  packets?: PacketData[];
}

interface PacketData {
  id: string;
  timestamp: string;
  source: string;
  destination: string;
  protocol: string;
  length: number;
  info: string;
}

const PacketAnalysisPanel: React.FC<PacketAnalysisPanelProps> = ({
  isCapturing: initialIsCapturing = false,
  captureTime: initialCaptureTime = 0,
  packetCount: initialPacketCount = 0,
  networkInterface: initialNetworkInterface = "eth0",
  packets = [
    {
      id: "1",
      timestamp: "2023-07-15 14:32:45",
      source: "192.168.1.105",
      destination: "192.168.1.1",
      protocol: "TCP",
      length: 64,
      info: "SYN, Seq=0 Win=64240 Len=0 MSS=1460 SACK_PERM=1",
    },
    {
      id: "2",
      timestamp: "2023-07-15 14:32:45",
      source: "192.168.1.1",
      destination: "192.168.1.105",
      protocol: "TCP",
      length: 64,
      info: "SYN, ACK Seq=0 Ack=1 Win=65535 Len=0",
    },
    {
      id: "3",
      timestamp: "2023-07-15 14:32:46",
      source: "192.168.1.105",
      destination: "8.8.8.8",
      protocol: "DNS",
      length: 87,
      info: "Standard query 0x1a2b A example.com",
    },
    {
      id: "4",
      timestamp: "2023-07-15 14:32:47",
      source: "8.8.8.8",
      destination: "192.168.1.105",
      protocol: "DNS",
      length: 103,
      info: "Standard query response 0x1a2b A example.com A 93.184.216.34",
    },
    {
      id: "5",
      timestamp: "2023-07-15 14:32:48",
      source: "192.168.1.105",
      destination: "93.184.216.34",
      protocol: "HTTP",
      length: 124,
      info: "GET / HTTP/1.1",
    },
  ],
}) => {
  const [selectedPacket, setSelectedPacket] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("packets");
  const [protocolFilter, setProtocolFilter] = useState<string>("all");
  const [isCapturing, setIsCapturing] = useState(initialIsCapturing);
  const [captureTime, setCaptureTime] = useState(initialCaptureTime);
  const [packetCount, setPacketCount] = useState(initialPacketCount);
  const [networkInterface, setNetworkInterface] = useState(
    initialNetworkInterface,
  );
  const [availableNetworks, setAvailableNetworks] = useState([
    { id: "1", name: "Main Office Network", interface: "eth0" },
    { id: "2", name: "Guest Network", interface: "wlan0" },
    { id: "3", name: "Development Network", interface: "usb0" },
  ]);
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  // Filter packets based on selected protocol
  const filteredPackets =
    protocolFilter === "all"
      ? packets
      : packets.filter(
          (packet) =>
            packet.protocol.toLowerCase() === protocolFilter.toLowerCase(),
        );

  // Get unique protocols for filter dropdown
  const uniqueProtocols = Array.from(
    new Set(packets.map((packet) => packet.protocol)),
  );

  // Format capture time in minutes and seconds
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Start or stop packet capture
  const toggleCapture = () => {
    if (isCapturing) {
      // Stop capture
      if (timer) {
        clearInterval(timer);
        setTimer(null);
      }
      setIsCapturing(false);
    } else {
      // Start capture
      if (!selectedNetwork) {
        // Alert user to select a network first
        alert("Please select a network before starting capture");
        return;
      }

      setIsCapturing(true);
      const interval = setInterval(() => {
        setCaptureTime((prev) => prev + 1);
        // Simulate packet capture by incrementing count
        setPacketCount((prev) => prev + Math.floor(Math.random() * 3) + 1);
      }, 1000);
      setTimer(interval);
    }
  };

  // Reset capture data
  const resetCapture = () => {
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
    setIsCapturing(false);
    setCaptureTime(0);
    setPacketCount(0);
  };

  // Handle network selection
  const handleNetworkSelect = (networkId: string, networkInterface: string) => {
    setSelectedNetwork(networkId);
    setNetworkInterface(networkInterface);
    resetCapture();
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [timer]);

  return (
    <div className="w-full h-full p-4 bg-background">
      <div className="flex flex-col space-y-4">
        {/* Capture Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant={isCapturing ? "destructive" : "default"}
              onClick={toggleCapture}
            >
              {isCapturing ? (
                <Pause className="mr-2 h-4 w-4" />
              ) : (
                <Play className="mr-2 h-4 w-4" />
              )}
              {isCapturing ? "Stop Capture" : "Start Capture"}
            </Button>
            <Button
              variant="outline"
              onClick={resetCapture}
              disabled={isCapturing}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Save Capture
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Network:</span>
            <Select
              value={selectedNetwork || ""}
              onValueChange={(value) => {
                const network = availableNetworks.find((n) => n.id === value);
                if (network) {
                  handleNetworkSelect(network.id, network.interface);
                }
              }}
              disabled={isCapturing}
            >
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Select network to capture" />
              </SelectTrigger>
              <SelectContent>
                {availableNetworks.map((network) => (
                  <SelectItem key={network.id} value={network.id}>
                    {network.name} ({network.interface})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Statistical Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Capture Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-2xl font-bold">
                  {formatTime(captureTime)}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Packets Captured
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Layers className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-2xl font-bold">{packetCount}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Traffic Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Activity className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-2xl font-bold">1.2 Mbps</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Security Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-2xl font-bold">0</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Packet Analysis Tabs */}
        <Tabs
          defaultValue="packets"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="packets">Packets</TabsTrigger>
              <TabsTrigger value="statistics">Statistics</TabsTrigger>
              <TabsTrigger value="details">Packet Details</TabsTrigger>
            </TabsList>

            {activeTab === "packets" && (
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Protocol:</span>
                <Select
                  value={protocolFilter}
                  onValueChange={setProtocolFilter}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {uniqueProtocols.map((protocol) => (
                      <SelectItem key={protocol} value={protocol.toLowerCase()}>
                        {protocol}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <TabsContent value="packets" className="border rounded-md mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">No.</TableHead>
                  <TableHead className="w-[180px]">Time</TableHead>
                  <TableHead className="w-[150px]">Source</TableHead>
                  <TableHead className="w-[150px]">Destination</TableHead>
                  <TableHead className="w-[100px]">Protocol</TableHead>
                  <TableHead className="w-[80px]">Length</TableHead>
                  <TableHead>Info</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPackets.map((packet) => (
                  <TableRow
                    key={packet.id}
                    onClick={() => setSelectedPacket(packet.id)}
                    className={selectedPacket === packet.id ? "bg-muted" : ""}
                    style={{ cursor: "pointer" }}
                  >
                    <TableCell>{packet.id}</TableCell>
                    <TableCell>{packet.timestamp}</TableCell>
                    <TableCell>{packet.source}</TableCell>
                    <TableCell>{packet.destination}</TableCell>
                    <TableCell>{packet.protocol}</TableCell>
                    <TableCell>{packet.length}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {packet.info}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent
            value="statistics"
            className="border rounded-md p-4 mt-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Protocol Distribution</CardTitle>
                  <CardDescription>
                    Breakdown of protocols in captured packets
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <p>Protocol chart visualization would appear here</p>
                    <p className="text-sm mt-2">
                      (Using chart library like Recharts)
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Traffic Over Time</CardTitle>
                  <CardDescription>
                    Packet rate during capture period
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <p>Traffic timeline visualization would appear here</p>
                    <p className="text-sm mt-2">
                      (Using chart library like Recharts)
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="details" className="border rounded-md p-4 mt-4">
            {selectedPacket ? (
              <div>
                <h3 className="text-lg font-medium mb-4">
                  Packet #{selectedPacket} Details
                </h3>
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Frame Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <pre className="text-xs font-mono bg-muted p-4 rounded-md overflow-auto">
                        {`Frame ${selectedPacket}: ${packets.find((p) => p.id === selectedPacket)?.length} bytes on wire
  Arrival Time: ${packets.find((p) => p.id === selectedPacket)?.timestamp}
  Frame Number: ${selectedPacket}
  Protocols in frame: Ethernet:IPv4:TCP`}
                      </pre>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Ethernet Header</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <pre className="text-xs font-mono bg-muted p-4 rounded-md overflow-auto">
                        {`Ethernet II, Src: 00:1a:2b:3c:4d:5e, Dst: 00:5e:4d:3c:2b:1a
  Destination: 00:5e:4d:3c:2b:1a
  Source: 00:1a:2b:3c:4d:5e
  Type: IPv4 (0x0800)`}
                      </pre>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>IP Header</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <pre className="text-xs font-mono bg-muted p-4 rounded-md overflow-auto">
                        {`Internet Protocol Version 4, Src: ${packets.find((p) => p.id === selectedPacket)?.source}, Dst: ${packets.find((p) => p.id === selectedPacket)?.destination}
  Version: 4
  Header Length: 20 bytes
  Total Length: ${packets.find((p) => p.id === selectedPacket)?.length}
  TTL: 64
  Protocol: ${packets.find((p) => p.id === selectedPacket)?.protocol} (6)`}
                      </pre>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Protocol Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <pre className="text-xs font-mono bg-muted p-4 rounded-md overflow-auto">
                        {`${packets.find((p) => p.id === selectedPacket)?.protocol} Segment
  ${packets.find((p) => p.id === selectedPacket)?.info}
  [Stream index: 0]
  [TCP Segment Len: 0]
  Sequence Number: 0
  Acknowledgment Number: 0
  Flags: 0x002 (SYN)`}
                      </pre>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>
                  Select a packet from the Packets tab to view detailed
                  information
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PacketAnalysisPanel;
