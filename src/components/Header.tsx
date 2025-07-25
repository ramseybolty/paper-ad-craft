import { Button } from "@/components/ui/button";
import { Newspaper, Plus, User, Settings } from "lucide-react";

const Header = () => {
  return (
    <header className="border-b bg-card shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Newspaper className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-foreground">NewsAd Manager</h1>
                <p className="text-sm text-muted-foreground">Advertisement Entry System</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="default" size="sm" className="shadow-sm">
              <Plus className="h-4 w-4 mr-2" />
              New Ad
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <User className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;