import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import AdForm from "@/components/AdForm";
import AdDashboard from "@/components/AdDashboard";
import Analytics from "@/components/Analytics";
import Billing from "@/components/Billing";
import Schedule from "@/components/Schedule";
import Settings from "@/components/Settings";

const Index = () => {
  const [activeView, setActiveView] = useState("dashboard");

  const handleViewChange = (view: string) => {
    console.log('Changing view to:', view);
    setActiveView(view);
  };

  const renderContent = () => {
    switch (activeView) {
      case "create-ad":
        return <AdForm />;
      case "analytics":
        return <Analytics />;
      case "billing":
        return <Billing />;
      case "schedule":
        return <Schedule />;
      case "settings":
        return <Settings />;
      case "all-ads":
        return <AdDashboard showAllAds={true} />;
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
        <Sidebar activeView={activeView} onViewChange={handleViewChange} />
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
