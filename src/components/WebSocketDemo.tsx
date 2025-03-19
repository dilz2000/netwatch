import React, { useState } from "react";
import { useWebSocket } from "../lib/websocket";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export default function WebSocketDemo() {
  const {
    messages,
    isConnected,
    error,
    sendMessage,
    clearMessages,
    interfaces,
    latestPacket,
    packetMetrics,
    ruleViolations,
  } = useWebSocket();
  const [messageInput, setMessageInput] = useState("");
  const [activeTab, setActiveTab] = useState("messages");

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      sendMessage(messageInput);
      setMessageInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  // Function to send a test message
  const sendTestMessage = () => {
    sendMessage({
      type: "request_interfaces",
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          WebSocket Connection
          <Badge variant={isConnected ? "success" : "destructive"}>
            {isConnected ? "Connected" : "Disconnected"}
          </Badge>
        </CardTitle>
        <CardDescription>
          {error ? (
            <span className="text-red-500">Error: {error.message}</span>
          ) : (
            "Send and receive real-time messages"
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="interfaces">Interfaces</TabsTrigger>
            <TabsTrigger value="packets">Packets</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="violations">Violations</TabsTrigger>
          </TabsList>

          <TabsContent value="messages">
            <ScrollArea className="h-[200px] w-full border rounded-md p-4 mb-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  No messages yet
                </div>
              ) : (
                <div className="space-y-2">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className="p-2 rounded-md bg-gray-100 break-words"
                    >
                      {typeof msg === "object" ? JSON.stringify(msg) : msg}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
            <div className="flex space-x-2">
              <Input
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                disabled={!isConnected}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!isConnected || !messageInput.trim()}
              >
                Send
              </Button>
              <Button onClick={sendTestMessage} disabled={!isConnected}>
                Request Interfaces
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="interfaces">
            <ScrollArea className="h-[200px] w-full border rounded-md p-4 mb-4">
              {interfaces.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  No interfaces data yet
                </div>
              ) : (
                <div className="space-y-2">
                  {interfaces.map((iface, index) => (
                    <div
                      key={iface.id || index}
                      className="p-2 rounded-md bg-gray-100"
                    >
                      <div className="font-medium">{iface.name}</div>
                      <div className="text-sm text-gray-500">
                        {iface.description || "No description"}
                      </div>
                      <Badge
                        variant={
                          iface.status === "up" ? "success" : "secondary"
                        }
                      >
                        {iface.status || "Unknown"}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="packets">
            <ScrollArea className="h-[200px] w-full border rounded-md p-4 mb-4">
              {!latestPacket ? (
                <div className="text-center text-gray-400 py-8">
                  No packet data yet
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="text-sm font-medium">Source</div>
                      <div>
                        {latestPacket.src_ip}:{latestPacket.src_port}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Destination</div>
                      <div>
                        {latestPacket.dst_ip}:{latestPacket.dst_port}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <div className="text-sm font-medium">Protocol</div>
                      <div>{latestPacket.protocol}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Length</div>
                      <div>{latestPacket.length} bytes</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Timestamp</div>
                      <div>{latestPacket.timestamp}</div>
                    </div>
                  </div>
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="metrics">
            <ScrollArea className="h-[200px] w-full border rounded-md p-4 mb-4">
              {!packetMetrics ? (
                <div className="text-center text-gray-400 py-8">
                  No metrics data yet
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 border rounded-md">
                    <div className="text-sm font-medium">Packet Rate</div>
                    <div className="text-xl font-bold">
                      {packetMetrics.packet_rate}
                    </div>
                    <div className="text-xs text-gray-500">packets/second</div>
                  </div>
                  <div className="p-3 border rounded-md">
                    <div className="text-sm font-medium">Average Size</div>
                    <div className="text-xl font-bold">
                      {packetMetrics.avg_size}
                    </div>
                    <div className="text-xs text-gray-500">bytes</div>
                  </div>
                  <div className="p-3 border rounded-md">
                    <div className="text-sm font-medium">Total Packets</div>
                    <div className="text-xl font-bold">
                      {packetMetrics.total_packets}
                    </div>
                  </div>
                  <div className="p-3 border rounded-md">
                    <div className="text-sm font-medium">Dropped Packets</div>
                    <div className="text-xl font-bold">
                      {packetMetrics.dropped_kernel +
                        packetMetrics.dropped_interface}
                    </div>
                    <div className="text-xs text-gray-500">
                      Kernel: {packetMetrics.dropped_kernel}, Interface:{" "}
                      {packetMetrics.dropped_interface}
                    </div>
                  </div>
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="violations">
            <ScrollArea className="h-[200px] w-full border rounded-md p-4 mb-4">
              {ruleViolations.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  No rule violations detected yet
                </div>
              ) : (
                <div className="space-y-2">
                  {ruleViolations.map((violation, index) => (
                    <div
                      key={index}
                      className="p-2 rounded-md bg-red-50 border-l-4 border-red-500"
                    >
                      <div className="font-medium">{violation.rule_name}</div>
                      <div className="text-sm">
                        {violation.src_ip} → {violation.dst_ip}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {violation.details}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {violation.timestamp}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={clearMessages}
          disabled={messages.length === 0}
        >
          Clear Messages
        </Button>
        <div className="text-sm text-gray-500">
          {messages.length} message{messages.length !== 1 ? "s" : ""}
        </div>
      </CardFooter>
    </Card>
  );
}
