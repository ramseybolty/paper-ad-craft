import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Filter, 
  Search, 
  Plus, 
  Edit, 
  Trash2,
  Eye,
  CheckCircle,
  AlertCircle,
  XCircle,
  MapPin,
  User,
  FileText
} from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const Schedule = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pageFilter, setPageFilter] = useState("all");

  // Date formatting utility
  const formatDate = (date: string | Date) => {
    return format(new Date(date), "dd/MM/yyyy");
  };

  // Mock scheduled ads data
  const scheduledAds = [
    {
      id: 1,
      title: "Beautiful Downtown Apartment for Rent",
      clientName: "John Smith",
      agentName: "Raj Kumar",
      page: "front",
      size: "3x12",
      publishDate: "2024-02-15",
      publishTime: "08:00",
      status: "scheduled",
      category: "real-estate",
      priority: "high",
      notes: "Premium location, highlight contact info",
      adContent: "Spacious 3BHK apartment with modern amenities..."
    },
    {
      id: 2,
      title: "Web Design Services - Special Offer",
      clientName: "ABC Digital Agency",
      agentName: "Priya Sharma",
      page: "inner-color",
      size: "2x8",
      publishDate: "2024-02-15",
      publishTime: "09:30",
      status: "ready",
      category: "services",
      priority: "medium",
      notes: "Include company logo, colorful design",
      adContent: "Professional web design at affordable prices..."
    },
    {
      id: 3,
      title: "2019 Honda Civic - Excellent Condition",
      clientName: "Sarah Johnson",
      agentName: "Amit Singh",
      page: "classifieds",
      size: "4x6",
      publishDate: "2024-02-16",
      publishTime: "10:15",
      status: "pending-approval",
      category: "automotive",
      priority: "medium",
      notes: "Include high-quality car images",
      adContent: "Well-maintained Honda Civic, single owner..."
    },
    {
      id: 4,
      title: "Marketing Manager Position",
      clientName: "Prime Motors Ltd",
      agentName: "Suresh Patel",
      page: "back",
      size: "5x10",
      publishDate: "2024-02-16",
      publishTime: "11:00",
      status: "published",
      category: "jobs",
      priority: "high",
      notes: "Urgent hiring, bold formatting needed",
      adContent: "Experienced marketing manager required..."
    },
    {
      id: 5,
      title: "Lost Cat - Reward Offered",
      clientName: "Maria Garcia",
      agentName: "Raj Kumar",
      page: "classifieds",
      size: "25 words",
      publishDate: "2024-02-17",
      publishTime: "07:00",
      status: "scheduled",
      category: "personal",
      priority: "urgent",
      notes: "Include cat photo, emergency contact",
      adContent: "Missing tabby cat, last seen near Central Park..."
    }
  ];

  // Filter logic
  const filteredAds = scheduledAds.filter((ad) => {
    const matchesSearch = ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ad.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ad.agentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || ad.status === statusFilter;
    const matchesPage = pageFilter === "all" || ad.page === pageFilter;
    
    // Date filter based on selected date
    let matchesDate = true;
    if (selectedDate) {
      const adDate = new Date(ad.publishDate);
      const selectedDateOnly = format(selectedDate, "yyyy-MM-dd");
      const adDateOnly = format(adDate, "yyyy-MM-dd");
      matchesDate = selectedDateOnly === adDateOnly;
    }
    
    return matchesSearch && matchesStatus && matchesPage && matchesDate;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Badge className="bg-blue-100 text-blue-800"><Clock className="h-3 w-3 mr-1" />Scheduled</Badge>;
      case "ready":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Ready</Badge>;
      case "pending-approval":
        return <Badge className="bg-yellow-100 text-yellow-800"><AlertCircle className="h-3 w-3 mr-1" />Pending</Badge>;
      case "published":
        return <Badge className="bg-success text-success-foreground"><CheckCircle className="h-3 w-3 mr-1" />Published</Badge>;
      case "cancelled":
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      urgent: "bg-red-100 text-red-800",
      high: "bg-orange-100 text-orange-800",
      medium: "bg-blue-100 text-blue-800",
      low: "bg-gray-100 text-gray-800"
    };
    return (
      <Badge className={`text-xs ${colors[priority as keyof typeof colors] || "bg-gray-100 text-gray-800"}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    );
  };

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

  // Summary calculations for selected date
  const todayStats = filteredAds.reduce((acc, ad) => {
    acc.total++;
    if (ad.status === "scheduled") acc.scheduled++;
    if (ad.status === "ready") acc.ready++;
    if (ad.status === "published") acc.published++;
    if (ad.priority === "urgent") acc.urgent++;
    return acc;
  }, { total: 0, scheduled: 0, ready: 0, published: 0, urgent: 0 });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <CalendarIcon className="h-6 w-6 text-primary" />
            Advertisement Schedule
          </h1>
          <p className="text-muted-foreground">Plan and manage advertisement publishing schedule</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Print Schedule
          </Button>
          <Button variant="default" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Schedule New Ad
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Ads</p>
                <p className="text-2xl font-bold text-foreground">{todayStats.total}</p>
                <p className="text-xs text-muted-foreground">Selected date</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Scheduled</p>
                <p className="text-2xl font-bold text-blue-600">{todayStats.scheduled}</p>
                <p className="text-xs text-muted-foreground">Waiting</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ready</p>
                <p className="text-2xl font-bold text-success">{todayStats.ready}</p>
                <p className="text-xs text-muted-foreground">To publish</p>
              </div>
              <div className="p-2 bg-success/10 rounded-lg">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Published</p>
                <p className="text-2xl font-bold text-green-600">{todayStats.published}</p>
                <p className="text-xs text-muted-foreground">Live</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Urgent</p>
                <p className="text-2xl font-bold text-destructive">{todayStats.urgent}</p>
                <p className="text-xs text-muted-foreground">Priority</p>
              </div>
              <div className="p-2 bg-destructive/10 rounded-lg">
                <AlertCircle className="h-5 w-5 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, client, or agent..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-48 justify-start text-left">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? formatDate(selectedDate) : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="ready">Ready</SelectItem>
                  <SelectItem value="pending-approval">Pending</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={pageFilter} onValueChange={setPageFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Pages</SelectItem>
                  <SelectItem value="front">Front Page</SelectItem>
                  <SelectItem value="back">Back Page</SelectItem>
                  <SelectItem value="inner-color">Inner Color</SelectItem>
                  <SelectItem value="inner-bw">Inner B&W</SelectItem>
                  <SelectItem value="classifieds">Classifieds</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Table */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5 text-primary" />
              <span>Advertisement Schedule</span>
            </CardTitle>
            <div className="text-sm text-muted-foreground">
              Showing {filteredAds.length} ads for {selectedDate ? formatDate(selectedDate) : "selected date"}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium text-foreground">Time</th>
                  <th className="text-left p-4 font-medium text-foreground">Advertisement</th>
                  <th className="text-left p-4 font-medium text-foreground">Client & Agent</th>
                  <th className="text-left p-4 font-medium text-foreground">Page & Size</th>
                  <th className="text-left p-4 font-medium text-foreground">Status</th>
                  <th className="text-left p-4 font-medium text-foreground">Priority</th>
                  <th className="text-right p-4 font-medium text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAds.map((ad) => (
                  <tr key={ad.id} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{ad.publishTime}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(ad.publishDate)}
                      </p>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-foreground truncate max-w-48">{ad.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{ad.category}</p>
                        {ad.notes && (
                          <p className="text-xs text-muted-foreground italic mt-1">"{ad.notes}"</p>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm font-medium">{ad.clientName}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{ad.agentName}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-2">
                        {getPageBadge(ad.page)}
                        <p className="text-xs text-muted-foreground">{ad.size}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(ad.status)}
                    </td>
                    <td className="p-4">
                      {getPriorityBadge(ad.priority)}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="ghost" size="sm" title="View Details">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Edit Schedule">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Cancel" className="text-destructive hover:text-destructive">
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

export default Schedule;