import React, { useState } from "react";
import StatusCards from "./StatusCards";
import ActivityCharts from "./ActivityCharts";
import AttackDetectionList from "./AttackDetectionList";

const Dashboard = () => {
  const [selectedAttack, setSelectedAttack] = useState(null);

  // Function to handle attack selection
  const handleAttackSelect = (attack: any) => {
    setSelectedAttack(attack);
    // Could trigger a modal or panel to show attack details
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>

      {/* Status Cards */}
      <StatusCards />

      {/* Activity Charts */}
      <ActivityCharts />

      {/* Attack Detection List */}
      <AttackDetectionList onSelectAttack={handleAttackSelect} />
    </div>
  );
};

export default Dashboard;
