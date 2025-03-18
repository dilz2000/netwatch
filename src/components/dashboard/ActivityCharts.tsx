import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts";
import {
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Wifi,
  Database,
} from "lucide-react";

interface ActivityChartsProps {
  data?: {
    traffic: Array<{
      time: string;
      inbound: number;
      outbound: number;
    }>;
    bandwidth: Array<{
      time: string;
      usage: number;
      limit: number;
    }>;
    packets: Array<{
      time: string;
      tcp: number;
      udp: number;
      icmp: number;
    }>;
  };
}

const defaultData = {
  traffic: Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    inbound: Math.floor(Math.random() * 1000) + 500,
    outbound: Math.floor(Math.random() * 800) + 300,
  })),
  bandwidth: Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    usage: Math.floor(Math.random() * 80) + 20,
    limit: 100,
  })),
  packets: Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    tcp: Math.floor(Math.random() * 500) + 200,
    udp: Math.floor(Math.random() * 300) + 100,
    icmp: Math.floor(Math.random() * 50) + 10,
  })),
};

const ActivityCharts: React.FC<ActivityChartsProps> = ({
  data = defaultData,
}) => {
  const [timeRange, setTimeRange] = useState("24h");

  // Calculate traffic trends
  const lastTrafficPoint = data.traffic[data.traffic.length - 1];
  const prevTrafficPoint = data.traffic[data.traffic.length - 2];
  const inboundTrend = lastTrafficPoint.inbound > prevTrafficPoint.inbound;
  const outboundTrend = lastTrafficPoint.outbound > prevTrafficPoint.outbound;

  return (
    <div className="w-full space-y-4 bg-background">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Network Activity</h2>
        <Select defaultValue={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1h">Last Hour</SelectItem>
            <SelectItem value="6h">Last 6 Hours</SelectItem>
            <SelectItem value="24h">Last 24 Hours</SelectItem>
            <SelectItem value="7d">Last 7 Days</SelectItem>
            <SelectItem value="30d">Last 30 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="traffic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="traffic" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Traffic Flow
          </TabsTrigger>
          <TabsTrigger value="bandwidth" className="flex items-center gap-2">
            <Wifi className="h-4 w-4" />
            Bandwidth Usage
          </TabsTrigger>
          <TabsTrigger value="packets" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Packet Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="traffic" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Inbound Traffic
                </CardTitle>
                <div
                  className={`flex items-center ${inboundTrend ? "text-green-500" : "text-red-500"}`}
                >
                  {inboundTrend ? (
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                  )}
                  <span className="text-xs">
                    {inboundTrend ? "+" : "-"}12.5%
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {lastTrafficPoint.inbound.toLocaleString()} Kbps
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Outbound Traffic
                </CardTitle>
                <div
                  className={`flex items-center ${outboundTrend ? "text-green-500" : "text-red-500"}`}
                >
                  {outboundTrend ? (
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                  )}
                  <span className="text-xs">
                    {outboundTrend ? "+" : "-"}8.3%
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {lastTrafficPoint.outbound.toLocaleString()} Kbps
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Network Traffic Flow</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.traffic}>
                    <defs>
                      <linearGradient
                        id="inboundGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#0ea5e9"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#0ea5e9"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="outboundGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#f43f5e"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#f43f5e"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="inbound"
                      stroke="#0ea5e9"
                      fillOpacity={1}
                      fill="url(#inboundGradient)"
                      name="Inbound"
                    />
                    <Area
                      type="monotone"
                      dataKey="outbound"
                      stroke="#f43f5e"
                      fillOpacity={1}
                      fill="url(#outboundGradient)"
                      name="Outbound"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bandwidth" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bandwidth Utilization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.bandwidth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="usage"
                      stroke="#0ea5e9"
                      name="Usage (%)"
                    />
                    <Line
                      type="monotone"
                      dataKey="limit"
                      stroke="#f43f5e"
                      strokeDasharray="5 5"
                      name="Limit (%)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="packets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Packet Distribution by Protocol</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.packets}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="tcp" fill="#0ea5e9" name="TCP" />
                    <Bar dataKey="udp" fill="#f43f5e" name="UDP" />
                    <Bar dataKey="icmp" fill="#84cc16" name="ICMP" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ActivityCharts;
