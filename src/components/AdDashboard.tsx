import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Eye, Edit, Trash2, BarChart3, Clock, CheckCircle, AlertCircle, Search, Filter } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { formatDate, formatDateForInput } from "@/lib/utils";

const AdDashboard = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pageFilter, setPageFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [agentFilter, setAgentFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [ads, setAds] = useState<any[]>([]);

  // Load ads from localStorage on component mount
  useEffect(() => {
    const savedAds = JSON.parse(localStorage.getItem('newsprint-ads') || '[]');
    const defaultAds = [
      {
        id: 1,
        title: "Beautiful Downtown Apartment for Rent",
        category: "Real Estate",
        page: "front",
        status: "published",
        columns: "3",
        centimeters: "12",
        words: "",
        instructions: "Include property photos in layout",
        clientName: "John Smith",
        clientType: "individual",
        clientContact: "+1-555-0101",
        agentName: "Mike Wilson",
        agentContact: "mike@newsagency.com",
        publishDates: ["2024-01-15", "2024-01-22", "2024-01-29"]
      },
      {
        id: 2,
        title: "Professional Web Design Services", 
        category: "Services",
        page: "inner-color",
        status: "pending",
        columns: "2",
        centimeters: "8",
        words: "",
        instructions: "",
        clientName: "ABC Digital Agency",
        clientType: "agency",
        clientContact: "+1-555-0102",
        agentName: "",
        agentContact: "",
        publishDates: ["2024-02-01", "2024-02-08"]
      },
      {
        id: 3,
        title: "2019 Honda Civic - Excellent Condition",
        category: "Automotive", 
        page: "back",
        status: "published",
        columns: "4",
        centimeters: "15",
        words: "",
        instructions: "Use bold headers for price",
        clientName: "Sarah Johnson",
        clientType: "individual",
        clientContact: "+1-555-0103",
        agentName: "Lisa Chen",
        agentContact: "lisa@adpartners.com",
        publishDates: ["2024-01-12", "2024-01-19"]
      },
      {
        id: 4,
        title: "Marketing Manager Position Available",
        category: "Jobs",
        page: "inner-bw",
        status: "cancelled",
        columns: "5",
        centimeters: "20",
        words: "",
        instructions: "Rush placement needed",
        clientName: "Prime Motors Ltd",
        clientType: "agency",
        clientContact: "+1-555-0104",
        agentName: "David Brown",
        agentContact: "david@mediagroup.com",
        publishDates: ["2024-01-01", "2024-01-08", "2024-01-15"]
      },
      {
        id: 5,
        title: "Lost Cat - Reward Offered",
        category: "Personal",
        page: "classifieds",
        status: "published",
        columns: "",
        centimeters: "",
        words: "25",
        instructions: "",
        clientName: "Maria Garcia",
        clientType: "individual",
        clientContact: "+1-555-0105",
        agentName: "",
        agentContact: "",
        publishDates: ["2024-01-20", "2024-01-21", "2024-01-22"]
      },
      {
        id: 6,
        title: "Garage Sale - Everything Must Go",
        category: "Personal",
        page: "classifieds",
        status: "published",
        columns: "",
        centimeters: "",
        words: "15",
        instructions: "Bold the date and address",
        clientName: "Robert Wilson",
        clientType: "individual",
        clientContact: "+1-555-0106",
        agentName: "",
        agentContact: "",
        publishDates: ["2024-01-25"]
      }
    ];
    
    // Merge saved ads with default ads (prioritize saved ads)
    const allAds = [...defaultAds, ...savedAds];
    setAds(allAds);
  }, []);

  // Extract unique categories and agents for filters
  const uniqueCategories = [...new Set(ads.map(ad => ad.category))];
  const uniqueAgents = [...new Set(ads.map(ad => ad.agentName).filter(name => name))];

  // Filter logic
  const filteredAds = ads.filter((ad) => {
    const matchesSearch = ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ad.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ad.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || ad.status === statusFilter;
    const matchesPage = pageFilter === "all" || ad.page === pageFilter;
    const matchesCategory = categoryFilter === "all" || ad.category === categoryFilter;
    const matchesAgent = agentFilter === "all" || 
                        (agentFilter === "no-agent" && !ad.agentName) ||
                        ad.agentName === agentFilter;
    const matchesDate = (!fromDate && !toDate) || ad.publishDates.some(date => {
      const adDate = new Date(date);
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;
      
      if (from && to) {
        // Both dates selected - range filter
        return adDate >= from && adDate <= to;
      } else if (from && !to) {
        // Only from date selected - exact date match
        return formatDateForInput(adDate) === formatDateForInput(from);
      } else if (to && !from) {
        // Only to date selected - filter for dates up to this date
        return adDate <= to;
      }
      return true;
    });
    
    return matchesSearch && matchesStatus && matchesPage && matchesCategory && matchesAgent && matchesDate;
  });

  const getPageBadge = (page: string) => {
    const pageLabels: { [key: string]: string } = {
      "front": "Front Page",
      "back": "Back Page", 
      "inner-color": "Inner Color",
      "inner-bw": "Inner B&W",
      "classifieds": "Classifieds"
    };
    
    const colors: { [key: string]: string } = {
      "front": "bg-red-100 text-red-800",
      "back": "bg-blue-100 text-blue-800",
      "inner-color": "bg-green-100 text-green-800",
      "inner-bw": "bg-gray-100 text-gray-800",
      "classifieds": "bg-yellow-100 text-yellow-800"
    };

    return (
      <Badge className={`text-xs ${colors[page] || "bg-gray-100 text-gray-800"}`}>
        {pageLabels[page] || page}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-success text-success-foreground"><CheckCircle className="h-3 w-3 mr-1" />Published</Badge>;
      case "pending":
        return <Badge className="bg-warning text-warning-foreground"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case "cancelled":
        return <Badge variant="secondary"><AlertCircle className="h-3 w-3 mr-1" />Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const stats = [
    { label: "Total Ads", value: "12", icon: BarChart3, color: "text-primary" },
    { label: "Active", value: "8", icon: CheckCircle, color: "text-success" },
    { label: "Pending", value: "2", icon: Clock, color: "text-warning" },
    { label: "Cancelled", value: "2", icon: AlertCircle, color: "text-destructive" }
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

      {/* Search and Filter Section */}
      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, client, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <div className="flex gap-1 items-center">
                <Input
                  placeholder="From date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-36"
                  type="date"
                  title="From date"
                />
                <span className="text-muted-foreground text-sm">to</span>
                <Input
                  placeholder="To date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-36"
                  type="date"
                  title="To date"
                />
                {(fromDate || toDate) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setFromDate("");
                      setToDate("");
                    }}
                    className="text-xs px-2"
                    title="Clear date filter"
                  >
                    Clear
                  </Button>
                )}
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {uniqueCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={agentFilter} onValueChange={setAgentFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Agent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Agents</SelectItem>
                  <SelectItem value="no-agent">No Agent</SelectItem>
                  {uniqueAgents.map((agent) => (
                    <SelectItem key={agent} value={agent}>
                      {agent}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={pageFilter} onValueChange={setPageFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Pages</SelectItem>
                  <SelectItem value="front">Front</SelectItem>
                  <SelectItem value="back">Back</SelectItem>
                  <SelectItem value="inner-color">Inner Color</SelectItem>
                  <SelectItem value="inner-bw">Inner B&W</SelectItem>
                  <SelectItem value="classifieds">Classifieds</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ads Table */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <span>Your Advertisements</span>
            </CardTitle>
            <div className="text-sm text-muted-foreground">
              Showing {filteredAds.length} of {ads.length} ads
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium text-foreground">Title & Page</th>
                  <th className="text-left p-4 font-medium text-foreground">Client</th>
                  <th className="text-left p-4 font-medium text-foreground">Category</th>
                  <th className="text-left p-4 font-medium text-foreground">Status</th>
                  <th className="text-left p-4 font-medium text-foreground">Size</th>
                  <th className="text-left p-4 font-medium text-foreground">Agent</th>
                  <th className="text-left p-4 font-medium text-foreground">Publication Dates</th>
                  <th className="text-right p-4 font-medium text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAds.map((ad) => (
                  <tr key={ad.id} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-foreground truncate max-w-48">{ad.title}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          {getPageBadge(ad.page)}
                          {ad.instructions && (
                            <Badge variant="outline" className="text-xs" title={ad.instructions}>
                              Instructions
                            </Badge>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-foreground">{ad.clientName}</p>
                        <div className="flex items-center space-x-1 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {ad.clientType === "individual" ? "Individual" : "Agency"}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{ad.clientContact}</span>
                        </div>
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
                        {ad.page === "classifieds" ? (
                          <span className="text-sm">{ad.words} words</span>
                        ) : ad.columns && ad.centimeters ? (
                          <span>{ad.columns}×{ad.centimeters}cm</span>
                        ) : (
                          <span className="text-xs text-muted-foreground">Auto</span>
                        )}
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
                            {formatDate(date)}
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
                        <Button variant="ghost" size="sm" title="View Details">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Edit Advertisement">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" title="Delete Advertisement">
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