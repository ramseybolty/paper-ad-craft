import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, BarChart3, Clock, CheckCircle, AlertCircle } from "lucide-react";

const AdDashboard = () => {
  const mockAds = [
    {
      id: 1,
      title: "Beautiful Downtown Apartment for Rent",
      category: "Real Estate",
      status: "published",
      views: 234,
      columns: "3",
      centimeters: "12",
      clientName: "John Smith",
      clientType: "individual",
      agentName: "Mike Wilson",
      agentContact: "mike@newsagency.com",
      publishDates: ["2024-01-15", "2024-01-22", "2024-01-29"]
    },
    {
      id: 2,
      title: "Professional Web Design Services", 
      category: "Services",
      status: "pending",
      views: 0,
      columns: "2",
      centimeters: "8",
      clientName: "ABC Digital Agency",
      clientType: "agency",
      agentName: "",
      agentContact: "",
      publishDates: ["2024-02-01", "2024-02-08"]
    },
    {
      id: 3,
      title: "2019 Honda Civic - Excellent Condition",
      category: "Automotive", 
      status: "published",
      views: 156,
      columns: "4",
      centimeters: "15",
      clientName: "Sarah Johnson",
      clientType: "individual",
      agentName: "Lisa Chen",
      agentContact: "lisa@adpartners.com",
      publishDates: ["2024-01-12", "2024-01-19"]
    },
    {
      id: 4,
      title: "Marketing Manager Position Available",
      category: "Jobs",
      status: "expired",
      views: 89,
      columns: "5",
      centimeters: "20",
      clientName: "Prime Motors Ltd",
      clientType: "agency",
      agentName: "David Brown",
      agentContact: "david@mediagroup.com",
      publishDates: ["2024-01-01", "2024-01-08", "2024-01-15"]
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-success text-success-foreground"><CheckCircle className="h-3 w-3 mr-1" />Published</Badge>;
      case "pending":
        return <Badge className="bg-warning text-warning-foreground"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case "expired":
        return <Badge variant="secondary"><AlertCircle className="h-3 w-3 mr-1" />Expired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const stats = [
    { label: "Total Ads", value: "12", icon: BarChart3, color: "text-primary" },
    { label: "Active", value: "8", icon: CheckCircle, color: "text-success" },
    { label: "Pending", value: "2", icon: Clock, color: "text-warning" },
    { label: "Total Views", value: "1,234", icon: Eye, color: "text-accent" }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Ads Table */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <span>Your Advertisements</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium text-foreground">Title</th>
                  <th className="text-left p-4 font-medium text-foreground">Client</th>
                  <th className="text-left p-4 font-medium text-foreground">Category</th>
                  <th className="text-left p-4 font-medium text-foreground">Status</th>
                  <th className="text-left p-4 font-medium text-foreground">Size</th>
                  <th className="text-left p-4 font-medium text-foreground">Views</th>
                  <th className="text-left p-4 font-medium text-foreground">Agent</th>
                  <th className="text-left p-4 font-medium text-foreground">Publication Dates</th>
                  <th className="text-right p-4 font-medium text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockAds.map((ad) => (
                  <tr key={ad.id} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-foreground truncate max-w-48">{ad.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {ad.publishDates.length} publication{ad.publishDates.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-foreground">{ad.clientName}</p>
                        <Badge variant="outline" className="text-xs">
                          {ad.clientType === "individual" ? "Individual" : "Agency"}
                        </Badge>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline">{ad.category}</Badge>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(ad.status)}
                    </td>
                    <td className="p-4">
                      <div className="text-muted-foreground">
                        {ad.columns && ad.centimeters ? (
                          <span>{ad.columns}×{ad.centimeters}cm</span>
                        ) : (
                          <span className="text-xs text-muted-foreground">Auto</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">{ad.views}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        {ad.agentName ? (
                          <div>
                            <p className="font-medium text-foreground">{ad.agentName}</p>
                            <p className="text-xs text-muted-foreground">{ad.agentContact}</p>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">No agent</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        {ad.publishDates.slice(0, 2).map((date, index) => (
                          <div key={index} className="text-xs text-muted-foreground">
                            {new Date(date).toLocaleDateString()}
                          </div>
                        ))}
                        {ad.publishDates.length > 2 && (
                          <div className="text-xs text-primary">
                            +{ad.publishDates.length - 2} more
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdDashboard;