import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { 
  Receipt, 
  Download, 
  CalendarIcon,
  IndianRupee,
  AlertCircle,
  CheckCircle,
  Clock,
  Edit,
  Eye,
  Percent,
  Calculator,
  FileText,
  Search,
  Filter,
  Users,
  User
} from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import PaymentHistory from "./PaymentHistory";
import { format } from "date-fns";
import { formatDate } from "@/lib/utils";
import { dataService } from "@/utils/dataService";

const Billing = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [clientFilter, setClientFilter] = useState("all");
  const [clientSearchOpen, setClientSearchOpen] = useState(false);
  const [agentFilter, setAgentFilter] = useState("all");
  const [agentSearchOpen, setAgentSearchOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [selectedAd, setSelectedAd] = useState<any>(null);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [paymentUpdateAd, setPaymentUpdateAd] = useState<any>(null);
  const [newPaymentStatus, setNewPaymentStatus] = useState("");
  const [receiptNumber, setReceiptNumber] = useState("");
  const [paymentHistoryAd, setPaymentHistoryAd] = useState<any>(null);
  const [realAds, setRealAds] = useState<any[]>([]);
  
  // Mock user role - in real implementation this would come from auth context
  const currentUserRole = "admin"; // admin, staff, accountant, manager
  
  // Load real ads from data service
  useEffect(() => {
    const ads = dataService.getAds();
    setRealAds(ads);
    
    const unsubscribe = dataService.subscribe('ads', (updatedAds) => {
      setRealAds(updatedAds);
    });
    
    return unsubscribe;
  }, []);

  const availableAgents = [
    { name: "Raj Kumar", contact: "+91 98765 43210" },
    { name: "Priya Sharma", contact: "+91 87654 32109" },
    { name: "Amit Singh", contact: "+91 76543 21098" },
    { name: "Suresh Patel", contact: "+91 65432 10987" }
  ];
  
  // Extract unique clients from billing data with contact info
  const availableClients = [
    { name: "John Smith", contact: "+91 98765 11111", type: "individual" },
    { name: "ABC Digital Agency", contact: "+91 87654 22222", type: "agency" },
    { name: "Sarah Johnson", contact: "+91 76543 33333", type: "individual" },
    { name: "Prime Motors Ltd", contact: "+91 65432 44444", type: "agency" },
    { name: "Maria Garcia", contact: "+91 54321 55555", type: "individual" }
  ];

  // Convert real ads to billing format and merge with mock data
  const convertToBillingData = (ad: any) => {
    const currentDate = new Date().toISOString().split('T')[0];
    const startDate = ad.startDate || currentDate;
    const totalCost = parseFloat(ad.totalCost || 0);
    
    return {
      id: ad.id,
      title: ad.title,
      clientName: ad.clientName || "Unknown Client",
      clientType: "individual",
      agentName: "System Agent",
      page: ad.page,
      size: ad.size,
      publishDates: ad.publishDates || [startDate],
      baseAmount: totalCost,
      discount: 0,
      subtotal: totalCost,
      gst: totalCost * 0.05,
      totalAmount: totalCost * 1.05,
      paymentStatus: ad.paymentStatus || "pending",
      invoiceNumber: `INV-${ad.id}`,
      dueDate: startDate,
      payments: ad.payments || []
    };
  };

  // Mock ads with billing information and enhanced payment structure
  const mockBillingData = [
    {
      id: 1,
      title: "Beautiful Downtown Apartment for Rent",
      clientName: "John Smith",
      clientType: "individual",
      agentName: "Raj Kumar",
      page: "front",
      size: "3x12",
      publishDates: ["2024-01-15", "2024-01-22", "2024-01-29"],
      baseAmount: 120000.00, // INR
      discount: 0,
      subtotal: 120000.00,
      gst: 6000.00, // 5% GST
      totalAmount: 126000.00,
      paymentStatus: "paid",
      invoiceNumber: "INV-2024-001",
      dueDate: "2024-01-10",
      payments: [
        {
          id: 1,
          amount: 126000.00,
          date: "2024-01-09",
          receiptNumber: "RCP-001",
          utrNumber: "UTR123456789",
          method: "bank_transfer",
          addedBy: "Admin User",
          addedByRole: "admin",
          notes: "Full payment received"
        }
      ]
    },
    {
      id: 2,
      title: "Professional Web Design Services",
      clientName: "ABC Digital Agency",
      clientType: "agency",
      agentName: "Priya Sharma",
      page: "inner-color",
      size: "2x8",
      publishDates: ["2024-02-01", "2024-02-08"],
      baseAmount: 80000.00,
      discount: 8000.00,
      subtotal: 72000.00,
      gst: 3600.00,
      totalAmount: 75600.00,
      paymentStatus: "pending",
      invoiceNumber: "INV-2024-002",
      dueDate: "2024-02-15",
      payments: []
    },
    {
      id: 3,
      clientName: "Sarah Johnson",
      title: "2019 Honda Civic - Excellent Condition",
      clientType: "individual",
      agentName: "Amit Singh",
      page: "back",
      size: "4x15",
      publishDates: ["2024-01-12", "2024-01-19"],
      baseAmount: 150000.00,
      discount: 15000.00,
      subtotal: 135000.00,
      gst: 6750.00,
      totalAmount: 141750.00,
      paymentStatus: "partial",
      invoiceNumber: "INV-2024-003",
      dueDate: "2024-01-25",
      payments: [
        {
          id: 2,
          amount: 50000.00,
          date: "2024-01-20",
          receiptNumber: "RCP-002",
          method: "cash",
          addedBy: "Staff User",
          addedByRole: "staff",
          notes: "Partial payment"
        },
        {
          id: 3,
          amount: 30000.00,
          date: "2024-01-22",
          receiptNumber: "RCP-003",
          utrNumber: "UTR987654321",
          method: "upi",
          addedBy: "Accountant User",
          addedByRole: "accountant",
          notes: "Second installment"
        }
      ]
    },
    {
      id: 4,
      title: "Marketing Manager Position Available",
      clientName: "Prime Motors Ltd",
      clientType: "agency",
      agentName: "Suresh Patel",
      page: "inner-bw",
      size: "5x20",
      publishDates: ["2024-01-01", "2024-01-08", "2024-01-15"],
      baseAmount: 90000.00,
      discount: 0,
      subtotal: 90000.00,
      gst: 4500.00,
      totalAmount: 94500.00,
      paymentStatus: "overdue",
      invoiceNumber: "INV-2024-004",
      dueDate: "2024-01-20",
      payments: []
    },
    {
      id: 5,
      title: "Lost Cat - Reward Offered",
      clientName: "Maria Garcia",
      clientType: "individual",
      agentName: "Raj Kumar",
      page: "classifieds",
      size: "25 words",
      publishDates: ["2024-01-20", "2024-01-21", "2024-01-22"],
      baseAmount: 4500.00,
      discount: 0,
      subtotal: 4500.00,
      gst: 225.00,
      totalAmount: 4725.00,
      paymentStatus: "paid",
      invoiceNumber: "INV-2024-005",
      dueDate: "2024-01-18",
      payments: [
        {
          id: 4,
          amount: 4725.00,
          date: "2024-01-17",
          receiptNumber: "RCP-004",
          method: "cash",
          addedBy: "Staff User",
          addedByRole: "staff"
        }
      ]
    }
  ];

  // Combine real ads and mock data
  const adBillingData = [
    ...realAds.map(convertToBillingData),
    ...mockBillingData
  ];

  // Filter logic with enhanced filters
  const filteredAds = adBillingData.filter((ad) => {
    const matchesSearch = ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ad.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ad.agentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ad.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || ad.paymentStatus === statusFilter;
    const matchesClient = clientFilter === "all" || ad.clientName === clientFilter;
    const matchesAgent = agentFilter === "all" || ad.agentName === agentFilter;
    
    // Date filter logic
    let matchesDate = true;
    if (dateRange.from || dateRange.to) {
      const adDate = new Date(ad.publishDates[0]);
      if (dateRange.from && adDate < dateRange.from) matchesDate = false;
      if (dateRange.to && adDate > dateRange.to) matchesDate = false;
    }
    
    return matchesSearch && matchesStatus && matchesClient && matchesAgent && matchesDate;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-success text-success-foreground"><CheckCircle className="h-3 w-3 mr-1" />Paid</Badge>;
      case "pending":
        return <Badge className="bg-warning text-warning-foreground"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case "partial":
        return <Badge className="bg-blue-100 text-blue-800"><AlertCircle className="h-3 w-3 mr-1" />Partial</Badge>;
      case "overdue":
        return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Overdue</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
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

  const calculateDiscount = (baseAmount: number, percent: number, fixedAmount: number) => {
    if (fixedAmount > 0) return fixedAmount;
    return (baseAmount * percent) / 100;
  };

  const updateAdDiscount = (adId: number, discountType: 'percent' | 'amount', value: number) => {
    // Check if user has permission to apply discount
    const adDate = new Date(adBillingData.find(ad => ad.id === adId)?.publishDates[0] || '');
    const daysDifference = Math.floor((new Date().getTime() - adDate.getTime()) / (1000 * 3600 * 24));
    
    if (daysDifference > 3 && currentUserRole !== "admin") {
      toast({
        title: "Permission Denied",
        description: "Only admin can modify discounts for ads older than 3 days",
        variant: "destructive",
      });
      return;
    }
    
    // In real implementation, this would update the backend
    console.log(`Updating ad ${adId} with ${discountType} discount: ${value}`);
    toast({
      title: "Discount Applied",
      description: `${discountType === 'percent' ? value + '%' : '$' + value} discount applied successfully`,
    });
  };

  const updatePaymentStatus = (adId: number, status: string, receipt?: string) => {
    const ad = adBillingData.find(a => a.id === adId);
    if (!ad) return;

    // Check permissions
    if (ad.paymentStatus === "paid" && status !== "paid" && currentUserRole !== "admin") {
      toast({
        title: "Permission Denied",
        description: "Only admin can change status from paid to unpaid",
        variant: "destructive",
      });
      return;
    }

    if (status === "paid" && !receipt) {
      toast({
        title: "Receipt Required",
        description: "Receipt/UTR number is required when marking as paid",
        variant: "destructive",
      });
      return;
    }

    // In real implementation, this would update the backend
    console.log(`Updating payment status for ad ${adId} to ${status}`, receipt ? `Receipt: ${receipt}` : '');
    toast({
      title: "Payment Status Updated",
      description: `Payment status changed to ${status}`,
    });
    
    // Reset form
    setPaymentUpdateAd(null);
    setNewPaymentStatus("");
    setReceiptNumber("");
  };

  const downloadInvoice = (ad: any) => {
    // In real implementation, this would generate and download PDF
    console.log(`Downloading invoice for ${ad.invoiceNumber}`);
    toast({
      title: "Download Started",
      description: `Invoice ${ad.invoiceNumber} is being downloaded`,
    });
  };

  const viewInvoice = (ad: any) => {
    // In real implementation, this would open invoice in a new tab or modal
    console.log(`Viewing invoice for ${ad.invoiceNumber}`);
    toast({
      title: "Invoice Opened",
      description: `Viewing invoice ${ad.invoiceNumber}`,
    });
  };

  // Helper function to calculate paid amount from payments array
  const calculatePaidAmount = (payments: any[]) => {
    return payments.reduce((sum, payment) => sum + payment.amount, 0);
  };

  // Summary calculations
  const totalInvoiced = filteredAds.reduce((sum, ad) => sum + ad.totalAmount, 0);
  const totalPaid = filteredAds.reduce((sum, ad) => sum + calculatePaidAmount(ad.payments), 0);
  const totalOutstanding = totalInvoiced - totalPaid;
  const totalOverdue = filteredAds
    .filter(ad => ad.paymentStatus === "overdue")
    .reduce((sum, ad) => sum + (ad.totalAmount - calculatePaidAmount(ad.payments)), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Receipt className="h-6 w-6 text-primary" />
            Ad Billing & Payment Management
          </h1>
          <p className="text-muted-foreground">Manage invoices, payments, and discounts for published advertisements</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="default" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Generate Invoice
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Invoiced</p>
                <p className="text-2xl font-bold text-foreground">₹{totalInvoiced.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">Inc. 5% GST</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg">
                <IndianRupee className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Paid</p>
                <p className="text-2xl font-bold text-success">₹{totalPaid.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">Received</p>
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
                <p className="text-sm text-muted-foreground">Outstanding</p>
                <p className="text-2xl font-bold text-warning">₹{totalOutstanding.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
              <div className="p-2 bg-warning/10 rounded-lg">
                <Clock className="h-5 w-5 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold text-destructive">₹{totalOverdue.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">Action needed</p>
              </div>
              <div className="p-2 bg-destructive/10 rounded-lg">
                <AlertCircle className="h-5 w-5 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Section */}
      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, client, or invoice number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Popover open={clientSearchOpen} onOpenChange={setClientSearchOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={clientSearchOpen}
                    className="w-36 justify-between bg-background"
                  >
                    {clientFilter === "all"
                      ? "All Clients"
                      : availableClients.find(c => c.name === clientFilter)?.name || clientFilter}
                    <Users className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-0 bg-background border shadow-md z-50">
                  <Command className="bg-background">
                    <CommandInput placeholder="Search clients..." className="h-9" />
                    <CommandList>
                      <CommandEmpty>No client found.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          value="all"
                          onSelect={() => {
                            setClientFilter("all");
                            setClientSearchOpen(false);
                          }}
                          className="cursor-pointer hover:bg-muted"
                        >
                          All Clients
                        </CommandItem>
                        {availableClients.map((client) => (
                          <CommandItem
                            key={client.name}
                            value={`${client.name} ${client.contact}`}
                            onSelect={() => {
                              setClientFilter(client.name);
                              setClientSearchOpen(false);
                            }}
                            className="cursor-pointer hover:bg-muted"
                          >
                            <div className="flex flex-col">
                              <span>{client.name}</span>
                              <span className="text-xs text-muted-foreground">{client.contact}</span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              <Popover open={agentSearchOpen} onOpenChange={setAgentSearchOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={agentSearchOpen}
                    className="w-36 justify-between bg-background"
                  >
                    {agentFilter === "all"
                      ? "All Agents"
                      : agentFilter}
                    <User className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-36 p-0 bg-background border shadow-md z-50">
                  <Command className="bg-background">
                    <CommandInput placeholder="Search agents..." className="h-9" />
                    <CommandList>
                      <CommandEmpty>No agent found.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          value="all"
                          onSelect={() => {
                            setAgentFilter("all");
                            setAgentSearchOpen(false);
                          }}
                          className="cursor-pointer hover:bg-muted"
                        >
                          All Agents
                        </CommandItem>
                        {availableAgents.map((agent) => (
                          <CommandItem
                            key={agent.name}
                            value={`${agent.name} ${agent.contact}`}
                            onSelect={() => {
                              setAgentFilter(agent.name);
                              setAgentSearchOpen(false);
                            }}
                            className="cursor-pointer hover:bg-muted"
                          >
                            <div className="flex flex-col">
                              <span>{agent.name}</span>
                              <span className="text-xs text-muted-foreground">{agent.contact}</span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Payment Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-48 justify-start text-left">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {formatDate(dateRange.from)} - {formatDate(dateRange.to)}
                        </>
                      ) : (
                        formatDate(dateRange.from)
                      )
                    ) : (
                      "Pick date range"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange.from}
                    selected={dateRange}
                    onSelect={(range) => setDateRange(range as any)}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Billing Table */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Receipt className="h-5 w-5 text-primary" />
              <span>Advertisement Billing</span>
            </CardTitle>
            <div className="text-sm text-muted-foreground">
              Showing {filteredAds.length} of {adBillingData.length} ads
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium text-foreground">Ad Details</th>
                  <th className="text-left p-4 font-medium text-foreground">Client</th>
                  <th className="text-right p-4 font-medium text-foreground">Base Amount</th>
                  <th className="text-right p-4 font-medium text-foreground">Discount</th>
                  <th className="text-right p-4 font-medium text-foreground">GST (5%)</th>
                  <th className="text-right p-4 font-medium text-foreground">Total</th>
                  <th className="text-left p-4 font-medium text-foreground">Payment Status</th>
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
                          <span className="text-xs text-muted-foreground">{ad.size}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {ad.invoiceNumber} | {ad.publishDates.length} publication{ad.publishDates.length > 1 ? 's' : ''}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-foreground">{ad.clientName}</p>
                        <p className="text-xs text-muted-foreground capitalize">{ad.clientType}</p>
                      </div>
                    </td>
                    <td className="p-4 text-right text-foreground">₹{ad.baseAmount.toFixed(2)}</td>
                    <td className="p-4 text-right">
                      {ad.discount > 0 ? (
                        <span className="text-success">-₹{ad.discount.toFixed(2)}</span>
                      ) : (
                        <span className="text-muted-foreground">₹0.00</span>
                      )}
                    </td>
                    <td className="p-4 text-right text-foreground">₹{ad.gst.toFixed(2)}</td>
                    <td className="p-4 text-right font-medium text-foreground">₹{ad.totalAmount.toFixed(2)}</td>
                    <td className="p-4">
                      <div className="space-y-1">
                        {getStatusBadge(ad.paymentStatus)}
                        {ad.paymentStatus === "partial" && (
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">
                              Paid: ₹{calculatePaidAmount(ad.payments).toFixed(2)} / ₹{ad.totalAmount.toFixed(2)}
                            </p>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-xs h-6 px-2"
                              onClick={() => setPaymentHistoryAd(ad)}
                            >
                              View Payments
                            </Button>
                          </div>
                        )}
                         <p className="text-xs text-muted-foreground">
                           Due: {formatDate(ad.dueDate)}
                         </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" title="Apply Discount" onClick={() => setSelectedAd(ad)}>
                              <Percent className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Apply Discount - {ad.invoiceNumber}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>Base Amount: ₹{ad.baseAmount.toFixed(2)}</Label>
                              </div>
                              <div className="space-y-2">
                                <Label>Discount Type</Label>
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <Label htmlFor="discount-percent">Percentage (%)</Label>
                                    <Input
                                      id="discount-percent"
                                      type="number"
                                      placeholder="0"
                                      value={discountPercent}
                                      onChange={(e) => {
                                        setDiscountPercent(Number(e.target.value));
                                        setDiscountAmount(0);
                                      }}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="discount-amount">Fixed Amount (₹)</Label>
                                    <Input
                                      id="discount-amount"
                                      type="number"
                                      placeholder="0.00"
                                      value={discountAmount}
                                      onChange={(e) => {
                                        setDiscountAmount(Number(e.target.value));
                                        setDiscountPercent(0);
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-2 p-3 bg-muted/30 rounded">
                                <div className="flex justify-between text-sm">
                                  <span>Base Amount:</span>
                                  <span>₹{ad.baseAmount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span>Discount:</span>
                                  <span className="text-success">
                                    -₹{calculateDiscount(ad.baseAmount, discountPercent, discountAmount).toFixed(2)}
                                  </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span>Subtotal:</span>
                                  <span>
                                    ₹{(ad.baseAmount - calculateDiscount(ad.baseAmount, discountPercent, discountAmount)).toFixed(2)}
                                  </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span>GST (5%):</span>
                                  <span>
                                    ₹{((ad.baseAmount - calculateDiscount(ad.baseAmount, discountPercent, discountAmount)) * 0.05).toFixed(2)}
                                  </span>
                                </div>
                                <div className="flex justify-between font-medium border-t pt-2">
                                  <span>Total Amount:</span>
                                  <span>
                                    ₹{((ad.baseAmount - calculateDiscount(ad.baseAmount, discountPercent, discountAmount)) * 1.05).toFixed(2)}
                                  </span>
                                </div>
                              </div>
                              <Button 
                                className="w-full" 
                                onClick={() => updateAdDiscount(ad.id, discountAmount > 0 ? 'amount' : 'percent', discountAmount > 0 ? discountAmount : discountPercent)}
                              >
                                Apply Discount
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" title="Update Payment" onClick={() => setPaymentUpdateAd(ad)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Update Payment Status - {ad.invoiceNumber}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>Current Status: {getStatusBadge(ad.paymentStatus)}</Label>
                                <p className="text-sm text-muted-foreground mt-1">
                                   Total Amount: ₹{ad.totalAmount.toFixed(2)} | Paid: ₹{calculatePaidAmount(ad.payments).toFixed(2)}
                                 </p>
                              </div>
                              
                              <div className="space-y-2">
                                <Label>New Payment Status</Label>
                                <Select value={newPaymentStatus} onValueChange={setNewPaymentStatus}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select new status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="paid">Paid</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="partial">Partial</SelectItem>
                                    <SelectItem value="overdue">Overdue</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              {newPaymentStatus === "paid" && (
                                <div className="space-y-2">
                                  <Label htmlFor="receipt-number">Receipt/UTR Number *</Label>
                                  <Input
                                    id="receipt-number"
                                    placeholder="Enter receipt or UTR number"
                                    value={receiptNumber}
                                    onChange={(e) => setReceiptNumber(e.target.value)}
                                  />
                                </div>
                              )}

                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  className="flex-1"
                                  onClick={() => {
                                    setPaymentUpdateAd(null);
                                    setNewPaymentStatus("");
                                    setReceiptNumber("");
                                  }}
                                >
                                  Cancel
                                </Button>
                                <Button 
                                  className="flex-1" 
                                  onClick={() => updatePaymentStatus(ad.id, newPaymentStatus, receiptNumber)}
                                  disabled={!newPaymentStatus}
                                >
                                  Update Status
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        
                        <Button variant="ghost" size="sm" title="View Invoice" onClick={() => viewInvoice(ad)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Download Invoice" onClick={() => downloadInvoice(ad)}>
                          <Download className="h-4 w-4" />
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

      {/* Payment History Modal/Section */}
      {paymentHistoryAd && (
        <Dialog open={!!paymentHistoryAd} onOpenChange={() => setPaymentHistoryAd(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Payment Details - {paymentHistoryAd.invoiceNumber}</DialogTitle>
            </DialogHeader>
            <PaymentHistory
              adId={paymentHistoryAd.id}
              invoiceNumber={paymentHistoryAd.invoiceNumber}
              totalAmount={paymentHistoryAd.totalAmount}
              payments={paymentHistoryAd.payments}
              onAddPayment={(payment) => {
                // In real implementation, this would add payment to backend
                console.log('Adding payment:', payment);
                toast({
                  title: "Payment Added",
                  description: `Payment of ₹${payment.amount.toFixed(2)} added successfully`,
                });
                // Close dialog after adding payment
                setPaymentHistoryAd(null);
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Billing;