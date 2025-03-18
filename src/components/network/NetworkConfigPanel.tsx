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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Wifi,
  Shield,
  Settings,
  Save,
  Plus,
  Trash2,
  Edit,
  Server,
  Globe,
  Activity,
} from "lucide-react";

interface NetworkConfig {
  id: string;
  name: string;
  type: string;
  ipRange: string;
  gateway: string;
  dns: string;
  securityLevel: string;
  status: "active" | "inactive";
}

interface NetworkConfigPanelProps {
  networks?: NetworkConfig[];
  onSave?: (network: NetworkConfig) => void;
  onDelete?: (networkId: string) => void;
}

const NetworkConfigPanel = ({
  networks = [
    {
      id: "1",
      name: "Main Office Network",
      type: "LAN",
      ipRange: "192.168.1.0/24",
      gateway: "192.168.1.1",
      dns: "8.8.8.8, 8.8.4.4",
      securityLevel: "High",
      status: "active",
    },
    {
      id: "2",
      name: "Guest Network",
      type: "WLAN",
      ipRange: "192.168.2.0/24",
      gateway: "192.168.2.1",
      dns: "1.1.1.1, 1.0.0.1",
      securityLevel: "Medium",
      status: "active",
    },
    {
      id: "3",
      name: "Development Network",
      type: "VLAN",
      ipRange: "10.0.0.0/24",
      gateway: "10.0.0.1",
      dns: "9.9.9.9",
      securityLevel: "High",
      status: "inactive",
    },
  ],
  onSave = () => {},
  onDelete = () => {},
}: NetworkConfigPanelProps) => {
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkConfig | null>(
    null,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<NetworkConfig>({
    id: "",
    name: "",
    type: "LAN",
    ipRange: "",
    gateway: "",
    dns: "",
    securityLevel: "Medium",
    status: "inactive",
  });

  // Reset dialog state when component mounts (page navigation)
  useEffect(() => {
    setIsDialogOpen(false);
  }, []);

  const handleNetworkSelect = (network: NetworkConfig) => {
    setSelectedNetwork(network);
    setFormData(network);
    setEditMode(false);
  };

  const handleCreateNew = () => {
    setFormData({
      id: Date.now().toString(),
      name: "",
      type: "LAN",
      ipRange: "",
      gateway: "",
      dns: "",
      securityLevel: "Medium",
      status: "inactive",
    });
    setSelectedNetwork(null);
    setEditMode(true);
    setIsDialogOpen(true);
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = () => {
    onSave(formData);
    setEditMode(false);
    setIsDialogOpen(false);
  };

  const handleDelete = () => {
    if (selectedNetwork) {
      onDelete(selectedNetwork.id);
      setSelectedNetwork(null);
      setIsDialogOpen(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-6 bg-background w-full h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Network Configuration</h1>
          <p className="text-muted-foreground">
            Manage and configure your network settings
          </p>
        </div>
        {/* Add Network button removed as per requirements */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="mr-2 h-5 w-5" />
                Networks
              </CardTitle>
              <CardDescription>Select a network to configure</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {networks.map((network) => (
                  <div
                    key={network.id}
                    className={`p-3 rounded-md cursor-pointer flex justify-between items-center ${selectedNetwork?.id === network.id ? "bg-accent" : "hover:bg-muted"}`}
                    onClick={() => handleNetworkSelect(network)}
                  >
                    <div className="flex items-center">
                      {network.type === "LAN" && (
                        <Server className="mr-2 h-4 w-4" />
                      )}
                      {network.type === "WLAN" && (
                        <Wifi className="mr-2 h-4 w-4" />
                      )}
                      {network.type === "VLAN" && (
                        <Activity className="mr-2 h-4 w-4" />
                      )}
                      <div>
                        <p className="font-medium">{network.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {network.ipRange}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`px-2 py-1 rounded-full text-xs ${network.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                    >
                      {network.status}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          {selectedNetwork ? (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>
                    {editMode ? "Edit Network" : selectedNetwork.name}
                  </CardTitle>
                  <CardDescription>
                    {editMode
                      ? "Modify network configuration settings"
                      : `${selectedNetwork.type} - ${selectedNetwork.ipRange}`}
                  </CardDescription>
                </div>
                {/* Edit and Delete buttons removed as per requirements */}
              </CardHeader>
              <CardContent>
                {editMode ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                          Network Name
                        </label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter network name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="type" className="text-sm font-medium">
                          Network Type
                        </label>
                        <Select
                          value={formData.type}
                          onValueChange={(value) =>
                            handleSelectChange("type", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="LAN">LAN</SelectItem>
                            <SelectItem value="WLAN">WLAN</SelectItem>
                            <SelectItem value="VLAN">VLAN</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label
                          htmlFor="ipRange"
                          className="text-sm font-medium"
                        >
                          IP Range
                        </label>
                        <Input
                          id="ipRange"
                          name="ipRange"
                          value={formData.ipRange}
                          onChange={handleInputChange}
                          placeholder="e.g. 192.168.1.0/24"
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="gateway"
                          className="text-sm font-medium"
                        >
                          Gateway
                        </label>
                        <Input
                          id="gateway"
                          name="gateway"
                          value={formData.gateway}
                          onChange={handleInputChange}
                          placeholder="e.g. 192.168.1.1"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="dns" className="text-sm font-medium">
                          DNS Servers
                        </label>
                        <Input
                          id="dns"
                          name="dns"
                          value={formData.dns}
                          onChange={handleInputChange}
                          placeholder="e.g. 8.8.8.8, 8.8.4.4"
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="securityLevel"
                          className="text-sm font-medium"
                        >
                          Security Level
                        </label>
                        <Select
                          value={formData.securityLevel}
                          onValueChange={(value) =>
                            handleSelectChange("securityLevel", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select security level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="status" className="text-sm font-medium">
                        Status
                      </label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) =>
                          handleSelectChange(
                            "status",
                            value as "active" | "inactive",
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ) : (
                  <Tabs defaultValue="details">
                    <TabsList className="mb-4">
                      <TabsTrigger value="details">Details</TabsTrigger>
                      <TabsTrigger value="security">Security</TabsTrigger>
                      <TabsTrigger value="advanced">Advanced</TabsTrigger>
                    </TabsList>
                    <TabsContent value="details" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Network Type</p>
                          <p className="text-sm">{selectedNetwork.type}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Status</p>
                          <div
                            className={`inline-flex px-2 py-1 rounded-full text-xs ${selectedNetwork.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                          >
                            {selectedNetwork.status}
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">IP Range</p>
                          <p className="text-sm">{selectedNetwork.ipRange}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Gateway</p>
                          <p className="text-sm">{selectedNetwork.gateway}</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">DNS Servers</p>
                        <p className="text-sm">{selectedNetwork.dns}</p>
                      </div>
                    </TabsContent>
                    <TabsContent value="security" className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <Shield className="h-8 w-8 text-primary" />
                        <div>
                          <p className="font-medium">Security Level</p>
                          <p className="text-sm text-muted-foreground">
                            {selectedNetwork.securityLevel}
                          </p>
                        </div>
                      </div>
                      <div className="rounded-md bg-muted p-4">
                        <p className="text-sm font-medium mb-2">
                          Security Features
                        </p>
                        <ul className="text-sm space-y-1">
                          <li>
                            • Firewall:{" "}
                            {selectedNetwork.securityLevel === "High"
                              ? "Strict"
                              : selectedNetwork.securityLevel === "Medium"
                                ? "Standard"
                                : "Basic"}
                          </li>
                          <li>
                            • Intrusion Prevention:{" "}
                            {selectedNetwork.securityLevel === "Low"
                              ? "Disabled"
                              : "Enabled"}
                          </li>
                          <li>
                            • Deep Packet Inspection:{" "}
                            {selectedNetwork.securityLevel === "High"
                              ? "Enabled"
                              : "Disabled"}
                          </li>
                          <li>
                            • Threat Intelligence:{" "}
                            {selectedNetwork.securityLevel !== "Low"
                              ? "Enabled"
                              : "Disabled"}
                          </li>
                        </ul>
                      </div>
                    </TabsContent>
                    <TabsContent value="advanced" className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <Settings className="h-8 w-8 text-primary" />
                        <div>
                          <p className="font-medium">Advanced Configuration</p>
                          <p className="text-sm text-muted-foreground">
                            Additional network settings
                          </p>
                        </div>
                      </div>
                      <div className="rounded-md bg-muted p-4">
                        <p className="text-sm font-medium mb-2">
                          Network Services
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center justify-between p-2 rounded bg-background">
                            <span>DHCP</span>
                            <span className="text-green-600">Enabled</span>
                          </div>
                          <div className="flex items-center justify-between p-2 rounded bg-background">
                            <span>NAT</span>
                            <span className="text-green-600">Enabled</span>
                          </div>
                          <div className="flex items-center justify-between p-2 rounded bg-background">
                            <span>QoS</span>
                            <span className="text-red-600">Disabled</span>
                          </div>
                          <div className="flex items-center justify-between p-2 rounded bg-background">
                            <span>VPN Passthrough</span>
                            <span className="text-green-600">Enabled</span>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                )}
              </CardContent>
              {editMode && (
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setEditMode(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" /> Save Changes
                  </Button>
                </CardFooter>
              )}
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center min-h-[400px]">
                <Globe className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">
                  No Network Selected
                </h3>
                <p className="text-muted-foreground text-center mb-4">
                  Select a network from the list or create a new one to
                  configure it.
                </p>
                <Button onClick={handleCreateNew}>
                  <Plus className="mr-2 h-4 w-4" /> Add Network
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Confirmation Dialog for Delete */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this network? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NetworkConfigPanel;
