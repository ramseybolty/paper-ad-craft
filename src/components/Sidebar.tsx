import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  LayoutDashboard, 
  Plus, 
  FileText, 
  BarChart3, 
  Settings, 
  CreditCard,
  Users,
  Calendar
} from "lucide-react";

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  userRole?: string;
}

const Sidebar = ({ activeView, onViewChange, userRole = "admin" }: SidebarProps) => {
  // Role-based menu items
  const getMenuItems = () => {
    const baseItems = [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["admin", "manager", "staff", "accountant"] },
    ];

    const roleBasedItems = [
      { id: "create-ad", label: "Create Ad", icon: Plus, roles: ["admin", "manager", "staff"] },
      { id: "my-ads", label: "My Ads", icon: FileText, roles: ["admin", "manager", "staff", "accountant"] },
      { id: "analytics", label: "Analytics", icon: BarChart3, roles: ["admin", "manager"] },
      { id: "billing", label: "Billing", icon: CreditCard, roles: ["admin", "manager", "accountant"] },
      { id: "schedule", label: "Schedule", icon: Calendar, roles: ["admin", "manager", "staff"] },
    ];

    return [...baseItems, ...roleBasedItems.filter(item => item.roles.includes(userRole))];
  };

  const getAdminItems = () => {
    const adminItems = [
      { id: "all-ads", label: "All Ads", icon: FileText, roles: ["admin", "manager"] },
      { id: "users", label: "Users", icon: Users, roles: ["admin"] },
      { id: "client-agent", label: "Client & Agent Data", icon: Users, roles: ["admin", "manager"] },
      { id: "settings", label: "Settings", icon: Settings, roles: ["admin", "manager"] },
    ];

    return adminItems.filter(item => item.roles.includes(userRole));
  };

  const menuItems = getMenuItems();
  const adminItems = getAdminItems();

  return (
    <div className="w-64 h-screen bg-card border-r shadow-sm">
      <div className="p-4 space-y-6">
        {/* Main Navigation */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Main Menu
          </h3>
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant={activeView === item.id ? "default" : "ghost"}
                className={`w-full justify-start transition-all duration-200 ${
                  activeView === item.id 
                    ? "shadow-sm bg-primary text-primary-foreground" 
                    : "hover:bg-muted/50"
                }`}
                onClick={() => {
                  console.log('Sidebar navigation clicked:', item.id);
                  onViewChange(item.id);
                }}
              >
                <item.icon className="h-4 w-4 mr-3" />
                {item.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Admin Section */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Administration
          </h3>
          <div className="space-y-1">
            {adminItems.map((item) => (
              <Button
                key={item.id}
                variant={activeView === item.id ? "default" : "ghost"}
                className={`w-full justify-start transition-all duration-200 ${
                  activeView === item.id 
                    ? "shadow-sm bg-primary text-primary-foreground" 
                    : "hover:bg-muted/50"
                }`}
                onClick={() => {
                  console.log('Admin navigation clicked:', item.id);
                  onViewChange(item.id);
                }}
              >
                <item.icon className="h-4 w-4 mr-3" />
                {item.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Quick Stats Card */}
        <Card className="p-4 bg-gradient-to-br from-primary/5 to-primary-glow/5 border-primary/20">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-1">8</div>
            <div className="text-sm text-muted-foreground">Active Ads</div>
            <div className="text-xs text-muted-foreground mt-2">
              2 expiring soon
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Sidebar;