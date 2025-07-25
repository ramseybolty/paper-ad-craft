import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import AdForm from "@/components/AdForm";
import AdDashboard from "@/components/AdDashboard";

const Index = () => {
  const [activeView, setActiveView] = useState("dashboard");

  const renderContent = () => {
    switch (activeView) {
      case "create-ad":
        return <AdForm />;
      case "my-ads":
      case "dashboard":
      default:
        return <AdDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar activeView={activeView} onViewChange={setActiveView} />
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
