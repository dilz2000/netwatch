import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import routes from "tempo-routes";
import NetworkConfigPanel from "./components/network/NetworkConfigPanel";
import PacketAnalysisPanel from "./components/packet/PacketAnalysisPanel";
import AlertManagementPanel from "./components/alerts/AlertManagementPanel";
import RuleConfigPanel from "./components/rules/RuleConfigPanel";
import Dashboard from "./components/dashboard/Dashboard";
import Settings from "./components/settings/Settings";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route path="/" element={<Home />}>
            <Route index element={<Dashboard />} />
            <Route path="network" element={<NetworkConfigPanel />} />
            <Route path="packet" element={<PacketAnalysisPanel />} />
            <Route path="alerts" element={<AlertManagementPanel />} />
            <Route path="rules" element={<RuleConfigPanel />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
