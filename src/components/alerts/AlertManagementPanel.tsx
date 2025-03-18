import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Bell,
  Filter,
  Search,
  BarChart2,
  AlertCircle,
  Clock,
  Shield,
  ChevronDown,
  ChevronRight,
  Eye,
} from "lucide-react";

interface Alert {
  id: string;
  title: string;
  source: string;
  destination: string;
  timestamp: string;
  severity: "critical" | "high" | "medium" | "low";
  type: string;
  status: "new" | "investigating" | "resolved";
}

interface AlertManagementPanelProps {
  alerts?: Alert[];
  onAlertSelect?: (alert: Alert) => void;
  onFilterChange?: (filters: any) => void;
}

const AlertManagementPanel: React.FC<AlertManagementPanelProps> = ({
  alerts = [
    {
      id: "1",
      title: "Suspicious Login Attempt",
      source: "192.168.1.105",
      destination: "10.0.0.1",
      timestamp: "2023-06-15T14:30:00",
      severity: "critical",
      type: "Authentication",
      status: "new",
    },
    {
      id: "2",
      title: "Port Scanning Activity",
      source: "45.33.22.156",
      destination: "192.168.1.1",
      timestamp: "2023-06-15T13:45:00",
      severity: "high",
      type: "Reconnaissance",
      status: "investigating",
    },
    {
      id: "3",
      title: "Malware Communication Detected",
      source: "192.168.1.34",
      destination: "91.234.56.78",
      timestamp: "2023-06-15T12:15:00",
      severity: "high",
      type: "Malware",
      status: "new",
    },
    {
      id: "4",
      title: "Unusual Data Transfer",
      source: "192.168.1.22",
      destination: "65.61.137.117",
      timestamp: "2023-06-15T10:20:00",
      severity: "medium",
      type: "Data Exfiltration",
      status: "resolved",
    },
    {
      id: "5",
      title: "Failed Admin Access",
      source: "192.168.1.15",
      destination: "192.168.1.1",
      timestamp: "2023-06-15T09:05:00",
      severity: "medium",
      type: "Authentication",
      status: "resolved",
    },
    {
      id: "6",
      title: "Firewall Rule Violation",
      source: "172.16.0.45",
      destination: "192.168.1.100",
      timestamp: "2023-06-15T08:30:00",
      severity: "low",
      type: "Policy Violation",
      status: "new",
    },
  ],
  onAlertSelect = () => {},
  onFilterChange = () => {},
}) => {
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  const handleAlertSelect = (alert: Alert) => {
    setSelectedAlert(alert);
    onAlertSelect(alert);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "destructive";
      case "high":
        return "destructive";
      case "medium":
        return "secondary";
      case "low":
        return "default";
      default:
        return "default";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "destructive";
      case "investigating":
        return "secondary";
      case "resolved":
        return "default";
      default:
        return "default";
    }
  };

  const filteredAlerts = alerts.filter((alert) => {
    // Filter by tab
    if (selectedTab !== "all" && alert.status !== selectedTab) {
      return false;
    }

    // Filter by search query
    if (
      searchQuery &&
      !(
        alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    ) {
      return false;
    }

    return true;
  });

  return (
    <div className="w-full h-full bg-background p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Alert Management</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filters
          </Button>
          <Button variant="outline" size="sm">
            <BarChart2 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Alert List */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Security Alerts</CardTitle>
                <div className="flex items-center space-x-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Severities</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center space-x-4 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search alerts..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <Tabs
                defaultValue="all"
                className="mt-4"
                onValueChange={setSelectedTab}
              >
                <TabsList className="w-full">
                  <TabsTrigger value="all" className="flex-1">
                    All
                  </TabsTrigger>
                  <TabsTrigger value="new" className="flex-1">
                    New
                  </TabsTrigger>
                  <TabsTrigger value="investigating" className="flex-1">
                    Investigating
                  </TabsTrigger>
                  <TabsTrigger value="resolved" className="flex-1">
                    Resolved
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                {filteredAlerts.length > 0 ? (
                  filteredAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedAlert?.id === alert.id ? "bg-accent" : "hover:bg-accent/50"}`}
                      onClick={() => handleAlertSelect(alert)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center space-x-2">
                            <AlertCircle
                              className={`h-5 w-5 ${alert.severity === "critical" || alert.severity === "high" ? "text-destructive" : "text-muted-foreground"}`}
                            />
                            <h3 className="font-medium">{alert.title}</h3>
                          </div>
                          <div className="mt-2 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-4">
                              <span>Source: {alert.source}</span>
                              <ChevronRight className="h-3 w-3" />
                              <span>Destination: {alert.destination}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <Badge variant={getSeverityColor(alert.severity)}>
                            {alert.severity.charAt(0).toUpperCase() +
                              alert.severity.slice(1)}
                          </Badge>
                          <div className="text-xs text-muted-foreground flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {new Date(alert.timestamp).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-3">
                        <Badge variant="outline">{alert.type}</Badge>
                        <Badge variant={getStatusColor(alert.status)}>
                          {alert.status.charAt(0).toUpperCase() +
                            alert.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bell className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <p>No alerts match your current filters</p>
                    <Button
                      variant="link"
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedTab("all");
                      }}
                    >
                      Clear filters
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Alert Details */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Alert Details</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedAlert ? (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">
                      {selectedAlert.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <Badge variant={getSeverityColor(selectedAlert.severity)}>
                        {selectedAlert.severity.charAt(0).toUpperCase() +
                          selectedAlert.severity.slice(1)}
                      </Badge>
                      <Badge variant={getStatusColor(selectedAlert.status)}>
                        {selectedAlert.status.charAt(0).toUpperCase() +
                          selectedAlert.status.slice(1)}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          Alert ID
                        </p>
                        <p className="font-medium">{selectedAlert.id}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Type</p>
                        <p className="font-medium">{selectedAlert.type}</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Source</p>
                      <p className="font-medium">{selectedAlert.source}</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        Destination
                      </p>
                      <p className="font-medium">{selectedAlert.destination}</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Timestamp</p>
                      <p className="font-medium">
                        {new Date(selectedAlert.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t space-y-4">
                    <h4 className="font-medium">Recommended Actions</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <Shield className="h-5 w-5 mr-2 text-primary" />
                        <span>
                          Investigate source IP for suspicious activity patterns
                        </span>
                      </li>
                      <li className="flex items-start">
                        <Shield className="h-5 w-5 mr-2 text-primary" />
                        <span>Check system logs for additional context</span>
                      </li>
                      <li className="flex items-start">
                        <Shield className="h-5 w-5 mr-2 text-primary" />
                        <span>
                          Consider temporary IP blocking if activity persists
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="flex space-x-2">
                    <Button className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      Investigate
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Mark as Resolved
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>Select an alert to view details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Threat Pattern Visualization */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Threat Pattern Visualization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full bg-accent/30 rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">
              Interactive threat visualization would appear here
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlertManagementPanel;
