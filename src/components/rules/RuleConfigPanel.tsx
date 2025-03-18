import React, { useState, useEffect } from "react";
import {
  PlusCircle,
  Edit,
  Trash2,
  AlertTriangle,
  Check,
  X,
  Filter,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface Rule {
  id: string;
  name: string;
  description: string;
  type: string;
  severity: "low" | "medium" | "high" | "critical";
  enabled: boolean;
  conditions: string;
  createdAt: string;
  updatedAt: string;
}

const defaultRules: Rule[] = [
  {
    id: "1",
    name: "Suspicious Port Scan",
    description: "Detects rapid connection attempts to multiple ports",
    type: "traffic",
    severity: "medium",
    enabled: true,
    conditions: "connections > 20 AND timespan < 10s",
    createdAt: "2023-06-15T10:30:00Z",
    updatedAt: "2023-07-20T14:45:00Z",
  },
  {
    id: "2",
    name: "Malicious IP Access",
    description: "Detects connections from known malicious IP addresses",
    type: "security",
    severity: "high",
    enabled: true,
    conditions: "source_ip IN malicious_ip_list",
    createdAt: "2023-05-10T08:15:00Z",
    updatedAt: "2023-08-05T11:20:00Z",
  },
  {
    id: "3",
    name: "Unusual Data Transfer",
    description: "Alerts on unusually large data transfers",
    type: "data",
    severity: "medium",
    enabled: false,
    conditions: "data_size > 500MB AND time BETWEEN 00:00 AND 05:00",
    createdAt: "2023-07-22T16:40:00Z",
    updatedAt: "2023-07-22T16:40:00Z",
  },
  {
    id: "4",
    name: "Brute Force Detection",
    description: "Identifies potential brute force login attempts",
    type: "security",
    severity: "critical",
    enabled: true,
    conditions: "failed_logins > 5 AND timespan < 2m",
    createdAt: "2023-04-18T09:25:00Z",
    updatedAt: "2023-09-01T13:10:00Z",
  },
];

const RuleConfigPanel = () => {
  const [rules, setRules] = useState<Rule[]>(defaultRules);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<Rule | null>(null);
  const [newRule, setNewRule] = useState<Partial<Rule>>({
    name: "",
    description: "",
    type: "traffic",
    severity: "medium",
    enabled: true,
    conditions: "",
  });

  // Reset dialog state when component mounts (page navigation)
  useEffect(() => {
    setIsCreateDialogOpen(false);
    setIsDeleteDialogOpen(false);
  }, []);

  const filteredRules = rules.filter((rule) => {
    const matchesSearch =
      rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || rule.type === filterType;
    const matchesSeverity =
      filterSeverity === "all" || rule.severity === filterSeverity;

    return matchesSearch && matchesType && matchesSeverity;
  });

  const handleCreateRule = () => {
    // In a real app, this would include validation and API calls
    const newRuleComplete: Rule = {
      ...(newRule as Rule),
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setRules([...rules, newRuleComplete]);
    setNewRule({
      name: "",
      description: "",
      type: "traffic",
      severity: "medium",
      enabled: true,
      conditions: "",
    });
    setIsCreateDialogOpen(false);
  };

  const handleUpdateRule = () => {
    if (!selectedRule) return;

    const updatedRules = rules.map((rule) =>
      rule.id === selectedRule.id
        ? { ...selectedRule, updatedAt: new Date().toISOString() }
        : rule,
    );

    setRules(updatedRules);
    setSelectedRule(null);
    setIsCreateDialogOpen(false);
  };

  const handleDeleteRule = () => {
    if (!selectedRule) return;

    const updatedRules = rules.filter((rule) => rule.id !== selectedRule.id);
    setRules(updatedRules);
    setSelectedRule(null);
    setIsDeleteDialogOpen(false);
  };

  const toggleRuleStatus = (id: string) => {
    const updatedRules = rules.map((rule) =>
      rule.id === id
        ? {
            ...rule,
            enabled: !rule.enabled,
            updatedAt: new Date().toISOString(),
          }
        : rule,
    );

    setRules(updatedRules);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-blue-100 text-blue-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "critical":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 bg-background w-full h-full overflow-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Rule Configuration</h1>
          <p className="text-muted-foreground">
            Create and manage detection rules for network security
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedRule(null);
            setIsCreateDialogOpen(true);
          }}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Rule
        </Button>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="active">Active Rules</TabsTrigger>
          <TabsTrigger value="disabled">Disabled Rules</TabsTrigger>
          <TabsTrigger value="all">All Rules</TabsTrigger>
        </TabsList>

        {["active", "disabled", "all"].map((tab) => (
          <TabsContent key={tab} value={tab} className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle>Rule Management</CardTitle>
                  <div className="flex space-x-2">
                    <div className="relative w-64">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search rules..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="traffic">Traffic</SelectItem>
                        <SelectItem value="security">Security</SelectItem>
                        <SelectItem value="data">Data</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={filterSeverity}
                      onValueChange={setFilterSeverity}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Severities</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <CardDescription>
                  {tab === "active"
                    ? "Currently active detection rules"
                    : tab === "disabled"
                      ? "Currently disabled detection rules"
                      : "All configured detection rules"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRules
                      .filter((rule) => {
                        if (tab === "active") return rule.enabled;
                        if (tab === "disabled") return !rule.enabled;
                        return true; // 'all' tab
                      })
                      .map((rule) => (
                        <TableRow key={rule.id}>
                          <TableCell className="font-medium">
                            <div>
                              <div>{rule.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {rule.description}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{rule.type}</TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(rule.severity)}`}
                            >
                              {rule.severity.charAt(0).toUpperCase() +
                                rule.severity.slice(1)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Switch
                              checked={rule.enabled}
                              onCheckedChange={() => toggleRuleStatus(rule.id)}
                            />
                          </TableCell>
                          <TableCell>
                            {new Date(rule.updatedAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedRule(rule);
                                setIsCreateDialogOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedRule(rule);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Create/Edit Rule Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedRule ? "Edit Rule" : "Create New Rule"}
            </DialogTitle>
            <DialogDescription>
              {selectedRule
                ? "Modify the existing rule settings"
                : "Configure a new detection rule for your network"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right font-medium">
                Name
              </label>
              <Input
                id="name"
                className="col-span-3"
                value={selectedRule ? selectedRule.name : newRule.name}
                onChange={(e) =>
                  selectedRule
                    ? setSelectedRule({ ...selectedRule, name: e.target.value })
                    : setNewRule({ ...newRule, name: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="description" className="text-right font-medium">
                Description
              </label>
              <Input
                id="description"
                className="col-span-3"
                value={
                  selectedRule ? selectedRule.description : newRule.description
                }
                onChange={(e) =>
                  selectedRule
                    ? setSelectedRule({
                        ...selectedRule,
                        description: e.target.value,
                      })
                    : setNewRule({ ...newRule, description: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="type" className="text-right font-medium">
                Type
              </label>
              <Select
                value={
                  selectedRule ? selectedRule.type : (newRule.type as string)
                }
                onValueChange={(value) =>
                  selectedRule
                    ? setSelectedRule({ ...selectedRule, type: value })
                    : setNewRule({ ...newRule, type: value })
                }
              >
                <SelectTrigger id="type" className="col-span-3">
                  <SelectValue placeholder="Select rule type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="traffic">Traffic</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                  <SelectItem value="data">Data</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="severity" className="text-right font-medium">
                Severity
              </label>
              <Select
                value={
                  selectedRule
                    ? selectedRule.severity
                    : (newRule.severity as string)
                }
                onValueChange={(value: any) =>
                  selectedRule
                    ? setSelectedRule({ ...selectedRule, severity: value })
                    : setNewRule({ ...newRule, severity: value })
                }
              >
                <SelectTrigger id="severity" className="col-span-3">
                  <SelectValue placeholder="Select severity level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="conditions" className="text-right font-medium">
                Conditions
              </label>
              <Input
                id="conditions"
                className="col-span-3"
                value={
                  selectedRule ? selectedRule.conditions : newRule.conditions
                }
                onChange={(e) =>
                  selectedRule
                    ? setSelectedRule({
                        ...selectedRule,
                        conditions: e.target.value,
                      })
                    : setNewRule({ ...newRule, conditions: e.target.value })
                }
                placeholder="E.g., connections > 20 AND timespan < 10s"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="enabled" className="text-right font-medium">
                Enabled
              </label>
              <div className="col-span-3 flex items-center">
                <Switch
                  id="enabled"
                  checked={
                    selectedRule ? selectedRule.enabled : newRule.enabled
                  }
                  onCheckedChange={(checked) =>
                    selectedRule
                      ? setSelectedRule({ ...selectedRule, enabled: checked })
                      : setNewRule({ ...newRule, enabled: checked })
                  }
                />
                <span className="ml-2">
                  {(selectedRule ? selectedRule.enabled : newRule.enabled)
                    ? "Active"
                    : "Inactive"}
                </span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={selectedRule ? handleUpdateRule : handleCreateRule}
            >
              {selectedRule ? "Update Rule" : "Create Rule"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the rule "{selectedRule?.name}"?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteRule}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Rule
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RuleConfigPanel;
