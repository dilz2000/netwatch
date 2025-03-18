import React from "react";
import Sidebar from "./layout/Sidebar";
import Header from "./layout/Header";
import { Outlet } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar navigation */}
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top header */}
        <Header />

        {/* Main content area */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Home;
