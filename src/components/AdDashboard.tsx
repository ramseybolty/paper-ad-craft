import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Eye, Edit, Trash2, BarChart3, Clock, CheckCircle, AlertCircle, Search, Filter } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { formatDate, formatDateForInput } from "@/lib/utils";
import EditAdModal from "./EditAdModal";
import DateSpecificStatusModal from "./DateSpecificStatusModal";
import { Advertisement } from "@/types/ad";
import { getAdOverallStatus, getAdPublishDates, hasEditablePublications } from "@/utils/adDataMigration";
import { dataService } from "@/utils/dataService";

interface AdDashboardProps {
  showAllAds?: boolean;
}

const AdDashboard = ({ showAllAds = false }: AdDashboardProps) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pageFilter, setPageFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [agentFilter, setAgentFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDateSpecificStatusModalOpen, setIsDateSpecificStatusModalOpen] = useState(false);

  // Load ads from localStorage on component mount
  useEffect(() => {
    // Clean up old data and get current ads
    dataService.cleanupOldData();
    const migratedAds = dataService.getAds();
    const defaultAds: Advertisement[] = [
      {
        id: 1,
        title: "Beautiful Downtown Apartment for Rent",
        category: "Real Estate",
        page: "front",
        columns: "3",
        centimeters: "12",
        words: "",
        instructions: "Include property photos in layout",
        clientName: "John Smith",
        clientType: "individual" as const,
        clientContact: "+1-555-0101",
        agentName: "Mike Wilson",
        agentContact: "mike@newsagency.com",
        createdAt: "2024-01-01T00:00:00Z",
        publications: [
          { date: "2024-01-15", status: "published" as const, publishedAt: "2024-01-15T10:00:00Z" },
          { date: "2024-01-22", status: "published" as const, publishedAt: "2024-01-22T10:00:00Z" },
          { date: "2024-01-29", status: "scheduled" as const }
        ]
      },
      {
        id: 2,
        title: "Professional Web Design Services", 
        category: "Services",
        page: "inner-color",
        columns: "2",
        centimeters: "8",
        words: "",
        instructions: "",
        clientName: "ABC Digital Agency",
        clientType: "agency" as const,
        clientContact: "+1-555-0102",
        agentName: "",
        agentContact: "",
        createdAt: "2024-01-02T00:00:00Z",
        publications: [
          { date: "2024-02-01", status: "scheduled" as const },
          { date: "2024-02-08", status: "scheduled" as const }
        ]
      },
      {
        id: 3,
        title: "2019 Honda Civic - Excellent Condition",
        category: "Automotive", 
        page: "back",
        columns: "4",
        centimeters: "15",
        words: "",
        instructions: "Use bold headers for price",
        clientName: "Sarah Johnson",
        clientType: "individual" as const,
        clientContact: "+1-555-0103",
        agentName: "Lisa Chen",
        agentContact: "lisa@adpartners.com",
        createdAt: "2024-01-03T00:00:00Z",
        publications: [
          { date: "2024-01-12", status: "published" as const, publishedAt: "2024-01-12T10:00:00Z" },
          { date: "2024-01-19", status: "published" as const, publishedAt: "2024-01-19T10:00:00Z" }
        ]
      },
      {
        id: 4,
        title: "Marketing Manager Position Available",
        category: "Jobs",
        page: "inner-bw",
        columns: "5",
        centimeters: "20",
        words: "",
        instructions: "Rush placement needed",
        clientName: "Prime Motors Ltd",
        clientType: "agency" as const,
        clientContact: "+1-555-0104",
        agentName: "David Brown",
        agentContact: "david@mediagroup.com",
        createdAt: "2024-01-04T00:00:00Z",
        publications: [
          { date: "2024-01-01", status: "cancelled" as const, cancelledAt: "2024-01-01T09:00:00Z", reason: "Client requested cancellation" },
          { date: "2024-01-08", status: "cancelled" as const, cancelledAt: "2024-01-08T09:00:00Z", reason: "Client requested cancellation" },
          { date: "2024-01-15", status: "cancelled" as const, cancelledAt: "2024-01-15T09:00:00Z", reason: "Client requested cancellation" }
        ]
      },
      {
        id: 5,
        title: "Lost Cat - Reward Offered",
        category: "Personal",
        page: "classifieds",
        columns: "",
        centimeters: "",
        words: "25",
        instructions: "",
        clientName: "Maria Garcia",
        clientType: "individual" as const,
        clientContact: "+1-555-0105",
        agentName: "",
        agentContact: "",
        createdAt: "2024-01-05T00:00:00Z",
        publications: [
          { date: "2024-01-20", status: "published" as const, publishedAt: "2024-01-20T10:00:00Z" },
          { date: "2024-01-21", status: "published" as const, publishedAt: "2024-01-21T10:00:00Z" },
          { date: "2024-01-22", status: "published" as const, publishedAt: "2024-01-22T10:00:00Z" }
        ]
      },
      {
        id: 6,
        title: "Garage Sale - Everything Must Go",
        category: "Personal",
        page: "classifieds",
        columns: "",
        centimeters: "",
        words: "15",
        instructions: "Bold the date and address",
        clientName: "Robert Wilson",
        clientType: "individual" as const,
        clientContact: "+1-555-0106",
        agentName: "",
        agentContact: "",
        createdAt: "2024-01-06T00:00:00Z",
        publications: [
          { date: "2024-01-25", status: "published" as const, publishedAt: "2024-01-25T10:00:00Z" }
        ]
      }
    ];
    
    // Combine with user ads
    const allAds = [...defaultAds, ...migratedAds.filter((ad: Advertisement) => !defaultAds.some(da => da.id === ad.id))];
    
    setAds(allAds);

    // Subscribe to data changes
    const unsubscribe = dataService.subscribe('ads', (updatedAds: Advertisement[]) => {
      const newAllAds = [...defaultAds, ...updatedAds.filter((ad: Advertisement) => !defaultAds.some(da => da.id === ad.id))];
      setAds(newAllAds);
    });

    return unsubscribe;
  }, []);

  // Extract unique categories and agents for filters
  const uniqueCategories = [...new Set(ads.map(ad => ad.category))];
  const uniqueAgents = [...new Set(ads.map(ad => ad.agentName).filter(name => name))];

  // Filter logic
  const filteredAds = ads.filter((ad) => {
    const matchesSearch = ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ad.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ad.category.toLowerCase().includes(searchTerm.toLowerCase());
    const adOverallStatus = getAdOverallStatus(ad);
    const adPublishDates = getAdPublishDates(ad);
    const matchesStatus = statusFilter === "all" || adOverallStatus === statusFilter;
    const matchesPage = pageFilter === "all" || ad.page === pageFilter;
    const matchesCategory = categoryFilter === "all" || ad.category === categoryFilter;
    const matchesAgent = agentFilter === "all" || 
                        (agentFilter === "no-agent" && !ad.agentName) ||
                        ad.agentName === agentFilter;
    const matchesDate = (!fromDate && !toDate) || adPublishDates.some(date => {
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
      case "scheduled":
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Scheduled</Badge>;
      case "cancelled":
        return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Cancelled</Badge>;
      case "mixed":
        return <Badge variant="outline" className="border-orange-300 text-orange-700"><AlertCircle className="h-3 w-3 mr-1" />Mixed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const pageTitle = showAllAds ? "All Advertisements" : "My Advertisements";

  // Action handlers
  const handleViewAd = (adId: number) => {
    console.log('Viewing ad:', adId);
    toast({
      title: "View Advertisement",
      description: `Opening details for advertisement ID: ${adId}`,
    });
  };

  const handleEditAd = (adId: number) => {
    console.log('Editing ad:', adId);
    const adToEdit = ads.find(ad => ad.id === adId);
    if (adToEdit) {
      setEditingAd(adToEdit);
      if (showAllAds) {
        // Full edit modal for All Ads page
        setIsEditModalOpen(true);
      } else {
        // Date-specific status modal for My Ads page
        setIsDateSpecificStatusModalOpen(true);
      }
    }
  };

  const handleDeleteAd = (adId: number) => {
    dataService.deleteAd(adId);
    
    toast({
      title: "Advertisement Deleted",
      description: `Advertisement ID: ${adId} has been deleted successfully.`,
      variant: "destructive"
    });
  };

  const confirmDeleteAd = (adId: number) => {
    handleDeleteAd(adId);
  };

  const handleSaveEditedAd = (updatedAd: any) => {
    dataService.updateAd(updatedAd.id, updatedAd);
    
    setEditingAd(null);
    setIsEditModalOpen(false);
  };

  const handleCloseEditModal = () => {
    setEditingAd(null);
    setIsEditModalOpen(false);
  };

  const handleCloseDateSpecificStatusModal = () => {
    setEditingAd(null);
    setIsDateSpecificStatusModalOpen(false);
  };

  // Check if current user is admin (for demo purposes, this could come from auth context)
  const isAdmin = true; // In real app, this would come from authentication context

  const stats = [
    { label: "Total Ads", value: "12", icon: BarChart3, color: "text-primary" },
    { label: "Active", value: "8", icon: CheckCircle, color: "text-success" },
    { label: "Pending", value: "2", icon: Clock, color: "text-warning" },
    { label: "Cancelled", value: "2", icon: AlertCircle, color: "text-destructive" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{pageTitle}</h1>
        <Badge variant="outline" className="text-sm">
          {filteredAds.length} {filteredAds.length === 1 ? 'ad' : 'ads'}
        </Badge>
      </div>
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
                   <SelectItem value="scheduled">Scheduled</SelectItem>
                   <SelectItem value="published">Published</SelectItem>
                   <SelectItem value="cancelled">Cancelled</SelectItem>
                   <SelectItem value="mixed">Mixed</SelectItem>
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
                {filteredAds.map((ad) => {
                  const hasEditableDates = hasEditablePublications(ad);
                  const isPastAd = !hasEditableDates;
                  
                  return (
                  <tr key={ad.id} className={`border-b transition-colors ${
                    isPastAd ? 'opacity-50 bg-muted/20' : 'hover:bg-muted/30'
                  }`}>
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
                      {getStatusBadge(getAdOverallStatus(ad))}
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
                        {getAdPublishDates(ad).slice(0, 2).map((date, index) => (
                          <div key={`${ad.id}-date-${index}`} className="text-xs text-muted-foreground">
                            {formatDate(date)}
                          </div>
                        ))}
                        {getAdPublishDates(ad).length > 2 && (
                          <div className="text-xs text-primary">
                            +{getAdPublishDates(ad).length - 2} more
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                       <div className="flex items-center justify-end space-x-2">
                         <Button 
                           variant="ghost" 
                           size="sm" 
                           title="View Details"
                           onClick={() => handleViewAd(ad.id)}
                         >
                           <Eye className="h-4 w-4" />
                         </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            title={showAllAds ? "Edit Advertisement" : isPastAd ? "Cannot edit past DOP dates" : "Edit Status"}
                            onClick={() => handleEditAd(ad.id)}
                            disabled={!showAllAds && isPastAd}
                            className={!showAllAds && isPastAd ? "cursor-not-allowed opacity-50" : ""}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                         {showAllAds && (
                           <AlertDialog>
                             <AlertDialogTrigger asChild>
                               <Button 
                                 variant="ghost" 
                                 size="sm" 
                                 className="text-destructive hover:text-destructive" 
                                 title="Delete Advertisement"
                               >
                                 <Trash2 className="h-4 w-4" />
                               </Button>
                             </AlertDialogTrigger>
                             <AlertDialogContent>
                               <AlertDialogHeader>
                                 <AlertDialogTitle>Delete Advertisement</AlertDialogTitle>
                                 <AlertDialogDescription>
                                   Are you sure you want to delete this advertisement? This action cannot be undone.
                                 </AlertDialogDescription>
                               </AlertDialogHeader>
                               <AlertDialogFooter>
                                 <AlertDialogCancel>Cancel</AlertDialogCancel>
                                 <AlertDialogAction 
                                   onClick={() => confirmDeleteAd(ad.id)}
                                   className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                 >
                                   Delete
                                 </AlertDialogAction>
                               </AlertDialogFooter>
                             </AlertDialogContent>
                           </AlertDialog>
                         )}
                       </div>
                    </td>
                   </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Modal - Full edit for All Ads page */}
      <EditAdModal
        ad={editingAd}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleSaveEditedAd}
      />

      {/* Date-Specific Status Modal - For My Ads page */}
      {editingAd && (
        <DateSpecificStatusModal
          ad={editingAd}
          isOpen={isDateSpecificStatusModalOpen}
          onClose={handleCloseDateSpecificStatusModal}
          onSave={handleSaveEditedAd}
          isAdmin={isAdmin}
        />
      )}
    </div>
  );
};

export default AdDashboard;