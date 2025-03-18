import React from "react";
import { Card, CardContent } from "../ui/card";
import { Shield, Wifi, Activity, Server } from "lucide-react";

interface StatusCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: "up" | "down" | "stable";
  trendValue?: string;
  bgColor?: string;
}

const StatusCard = ({
  title = "Status",
  value = "0",
  icon = <Activity className="h-6 w-6" />,
  trend = "stable",
  trendValue = "0%",
  bgColor = "bg-card",
}: StatusCardProps) => {
  return (
    <Card className={`${bgColor} border shadow-sm`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
            {trend && (
              <p className="text-xs mt-1">
                <span
                  className={`inline-flex items-center ${trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-gray-500"}`}
                >
                  {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}{" "}
                  {trendValue}
                </span>
              </p>
            )}
          </div>
          <div className="rounded-full p-2 bg-primary/10">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
};

interface StatusCardsProps {
  cards?: StatusCardProps[];
}

const StatusCards = ({ cards = [] }: StatusCardsProps) => {
  // Default cards if none provided
  const defaultCards: StatusCardProps[] = [
    {
      title: "Total Devices",
      value: "124",
      icon: <Wifi className="h-6 w-6 text-blue-500" />,
      trend: "up",
      trendValue: "12% from last week",
    },
    {
      title: "Active Connections",
      value: "1,893",
      icon: <Activity className="h-6 w-6 text-green-500" />,
      trend: "up",
      trendValue: "7% from yesterday",
    },
    {
      title: "Threat Level",
      value: "Medium",
      icon: <Shield className="h-6 w-6 text-amber-500" />,
      trend: "down",
      trendValue: "3% improvement",
    },
    {
      title: "System Status",
      value: "Operational",
      icon: <Server className="h-6 w-6 text-indigo-500" />,
      trend: "stable",
      trendValue: "No changes",
    },
  ];

  const displayCards = cards.length > 0 ? cards : defaultCards;

  return (
    <div className="w-full bg-background p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayCards.map((card, index) => (
          <StatusCard key={index} {...card} />
        ))}
      </div>
    </div>
  );
};

export default StatusCards;
