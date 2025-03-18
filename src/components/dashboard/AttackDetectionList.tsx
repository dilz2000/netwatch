import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Filter,
  MoreHorizontal,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
} from "lucide-react";

interface Attack {
  id: string;
  timestamp: string;
  source: string;
  destination: string;
  attackType: string;
  severity: "critical" | "high" | "medium" | "low";
  status: "active" | "mitigated" | "investigating";
}

interface AttackDetectionListProps {
  attacks?: Attack[];
  onSelectAttack?: (attack: Attack) => void;
  onFilterChange?: (filters: {
    severity: string[];
    attackType: string[];
  }) => void;
}

const AttackDetectionList: React.FC<AttackDetectionListProps> = ({
  attacks = mockAttacks,
  onSelectAttack = () => {},
  onFilterChange = () => {},
}) => {
  const [selectedSeverities, setSelectedSeverities] = useState<string[]>([]);
  const [selectedAttackTypes, setSelectedAttackTypes] = useState<string[]>([]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500 text-white";
      case "high":
        return "bg-orange-500 text-white";
      case "medium":
        return "bg-yellow-500 text-black";
      case "low":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-red-100 text-red-800";
      case "mitigated":
        return "bg-green-100 text-green-800";
      case "investigating":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertTriangle className="h-4 w-4 mr-1 text-red-500" />;
      case "high":
        return <AlertCircle className="h-4 w-4 mr-1 text-orange-500" />;
      case "medium":
        return <AlertCircle className="h-4 w-4 mr-1 text-yellow-500" />;
      case "low":
        return <Info className="h-4 w-4 mr-1 text-blue-500" />;
      default:
        return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <AlertCircle className="h-4 w-4 mr-1 text-red-500" />;
      case "mitigated":
        return <CheckCircle2 className="h-4 w-4 mr-1 text-green-500" />;
      case "investigating":
        return <Info className="h-4 w-4 mr-1 text-yellow-500" />;
      default:
        return null;
    }
  };

  const handleSeverityFilter = (severity: string) => {
    setSelectedSeverities((prev) => {
      const newSeverities = prev.includes(severity)
        ? prev.filter((s) => s !== severity)
        : [...prev, severity];

      onFilterChange({
        severity: newSeverities,
        attackType: selectedAttackTypes,
      });
      return newSeverities;
    });
  };

  const handleAttackTypeFilter = (attackType: string) => {
    setSelectedAttackTypes((prev) => {
      const newAttackTypes = prev.includes(attackType)
        ? prev.filter((t) => t !== attackType)
        : [...prev, attackType];

      onFilterChange({
        severity: selectedSeverities,
        attackType: newAttackTypes,
      });
      return newAttackTypes;
    });
  };

  const filteredAttacks = attacks.filter((attack) => {
    const severityMatch =
      selectedSeverities.length === 0 ||
      selectedSeverities.includes(attack.severity);
    const typeMatch =
      selectedAttackTypes.length === 0 ||
      selectedAttackTypes.includes(attack.attackType);
    return severityMatch && typeMatch;
  });

  // Get unique attack types for filter dropdown
  const uniqueAttackTypes = [
    ...new Set(attacks.map((attack) => attack.attackType)),
  ];

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Attack Detection</h2>
        <div className="flex space-x-2">
          {/* Severity Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Severity
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {["critical", "high", "medium", "low"].map((severity) => (
                <DropdownMenuItem
                  key={severity}
                  onClick={() => handleSeverityFilter(severity)}
                  className={
                    selectedSeverities.includes(severity) ? "bg-accent" : ""
                  }
                >
                  <div className="flex items-center">
                    {getSeverityIcon(severity)}
                    <span className="capitalize">{severity}</span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Attack Type Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Attack Type
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {uniqueAttackTypes.map((type) => (
                <DropdownMenuItem
                  key={type}
                  onClick={() => handleAttackTypeFilter(type)}
                  className={
                    selectedAttackTypes.includes(type) ? "bg-accent" : ""
                  }
                >
                  {type}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Attack Type</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAttacks.length > 0 ? (
              filteredAttacks.map((attack) => (
                <TableRow
                  key={attack.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => onSelectAttack(attack)}
                >
                  <TableCell>
                    {new Date(attack.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell>{attack.source}</TableCell>
                  <TableCell>{attack.destination}</TableCell>
                  <TableCell>{attack.attackType}</TableCell>
                  <TableCell>
                    <Badge className={getSeverityColor(attack.severity)}>
                      <div className="flex items-center">
                        {getSeverityIcon(attack.severity)}
                        <span className="capitalize">{attack.severity}</span>
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(attack.status)}>
                      <div className="flex items-center">
                        {getStatusIcon(attack.status)}
                        <span className="capitalize">{attack.status}</span>
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectAttack(attack);
                          }}
                        >
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                          Mark as Mitigated
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                          Investigate
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No attacks found matching the current filters
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

// Mock data for default display
const mockAttacks: Attack[] = [
  {
    id: "1",
    timestamp: "2023-06-15T08:23:45Z",
    source: "192.168.1.105",
    destination: "10.0.0.15",
    attackType: "SQL Injection",
    severity: "critical",
    status: "active",
  },
  {
    id: "2",
    timestamp: "2023-06-15T07:45:12Z",
    source: "192.168.1.110",
    destination: "10.0.0.22",
    attackType: "DDoS",
    severity: "high",
    status: "investigating",
  },
  {
    id: "3",
    timestamp: "2023-06-15T06:12:33Z",
    source: "192.168.1.115",
    destination: "10.0.0.30",
    attackType: "XSS",
    severity: "medium",
    status: "mitigated",
  },
  {
    id: "4",
    timestamp: "2023-06-15T05:55:21Z",
    source: "192.168.1.120",
    destination: "10.0.0.45",
    attackType: "Port Scanning",
    severity: "low",
    status: "mitigated",
  },
  {
    id: "5",
    timestamp: "2023-06-15T04:30:10Z",
    source: "192.168.1.125",
    destination: "10.0.0.50",
    attackType: "Brute Force",
    severity: "high",
    status: "active",
  },
  {
    id: "6",
    timestamp: "2023-06-15T03:15:05Z",
    source: "192.168.1.130",
    destination: "10.0.0.55",
    attackType: "Malware",
    severity: "critical",
    status: "investigating",
  },
];

export default AttackDetectionList;
