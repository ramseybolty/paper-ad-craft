import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Receipt, 
  Download, 
  Calendar,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  Edit,
  Eye,
  Percent,
  Calculator,
  FileText,
  Search,
  Filter
} from "lucide-react";
import { useState } from "react";

const Billing = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedAd, setSelectedAd] = useState<any>(null);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);

  // Mock ads with billing information
  const adBillingData = [
    {
      id: 1,
      title: "Beautiful Downtown Apartment for Rent",
      clientName: "John Smith",
      clientType: "individual",
      page: "front",
      size: "3x12",
      publishDates: ["2024-01-15", "2024-01-22", "2024-01-29"],
      baseAmount: 1200.00,
      discount: 0,
      subtotal: 1200.00,
      gst: 60.00,
      totalAmount: 1260.00,
      paidAmount: 1260.00,
      paymentStatus: "paid",
      invoiceNumber: "INV-2024-001",
      dueDate: "2024-01-10",
      paidDate: "2024-01-09"
    },
    {
      id: 2,
      title: "Professional Web Design Services",
      clientName: "ABC Digital Agency",
      clientType: "agency",
      page: "inner-color",
      size: "2x8",
      publishDates: ["2024-02-01", "2024-02-08"],
      baseAmount: 800.00,
      discount: 80.00,
      subtotal: 720.00,
      gst: 36.00,
      totalAmount: 756.00,
      paidAmount: 0,
      paymentStatus: "pending",
      invoiceNumber: "INV-2024-002", 
      dueDate: "2024-02-15",
      paidDate: null
    },
    {
      id: 3,
      title: "2019 Honda Civic - Excellent Condition",
      clientName: "Sarah Johnson",
      clientType: "individual",
      page: "back",
      size: "4x15",
      publishDates: ["2024-01-12", "2024-01-19"],
      baseAmount: 1500.00,
      discount: 150.00,
      subtotal: 1350.00,
      gst: 67.50,
      totalAmount: 1417.50,
      paidAmount: 500.00,
      paymentStatus: "partial",
      invoiceNumber: "INV-2024-003",
      dueDate: "2024-01-25",
      paidDate: null
    },
    {
      id: 4,
      title: "Marketing Manager Position Available",
      clientName: "Prime Motors Ltd",
      clientType: "agency",
      page: "inner-bw",
      size: "5x20",
      publishDates: ["2024-01-01", "2024-01-08", "2024-01-15"],
      baseAmount: 900.00,
      discount: 0,
      subtotal: 900.00,
      gst: 45.00,
      totalAmount: 945.00,
      paidAmount: 0,
      paymentStatus: "overdue",
      invoiceNumber: "INV-2024-004",
      dueDate: "2024-01-20",
      paidDate: null
    },
    {
      id: 5,
      title: "Lost Cat - Reward Offered",
      clientName: "Maria Garcia",
      clientType: "individual",
      page: "classifieds",
      size: "25 words",
      publishDates: ["2024-01-20", "2024-01-21", "2024-01-22"],
      baseAmount: 45.00,
      discount: 0,
      subtotal: 45.00,
      gst: 2.25,
      totalAmount: 47.25,
      paidAmount: 47.25,
      paymentStatus: "paid",
      invoiceNumber: "INV-2024-005",
      dueDate: "2024-01-18",
      paidDate: "2024-01-17"
    }
  ];

  // Filter logic
  const filteredAds = adBillingData.filter((ad) => {
    const matchesSearch = ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ad.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ad.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || ad.paymentStatus === statusFilter;
    return matchesSearch && matchesStatus;
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
    // In real implementation, this would update the backend
    console.log(`Updating ad ${adId} with ${discountType} discount: ${value}`);
  };

  // Summary calculations
  const totalInvoiced = filteredAds.reduce((sum, ad) => sum + ad.totalAmount, 0);
  const totalPaid = filteredAds.reduce((sum, ad) => sum + ad.paidAmount, 0);
  const totalOutstanding = totalInvoiced - totalPaid;
  const totalOverdue = filteredAds
    .filter(ad => ad.paymentStatus === "overdue")
    .reduce((sum, ad) => sum + (ad.totalAmount - ad.paidAmount), 0);

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
                <p className="text-2xl font-bold text-foreground">${totalInvoiced.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">Inc. 5% GST</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Paid</p>
                <p className="text-2xl font-bold text-success">${totalPaid.toFixed(2)}</p>
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
                <p className="text-2xl font-bold text-warning">${totalOutstanding.toFixed(2)}</p>
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
                <p className="text-2xl font-bold text-destructive">${totalOverdue.toFixed(2)}</p>
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
            <div className="flex gap-2">
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
                    <td className="p-4 text-right text-foreground">${ad.baseAmount.toFixed(2)}</td>
                    <td className="p-4 text-right">
                      {ad.discount > 0 ? (
                        <span className="text-success">-${ad.discount.toFixed(2)}</span>
                      ) : (
                        <span className="text-muted-foreground">$0.00</span>
                      )}
                    </td>
                    <td className="p-4 text-right text-foreground">${ad.gst.toFixed(2)}</td>
                    <td className="p-4 text-right font-medium text-foreground">${ad.totalAmount.toFixed(2)}</td>
                    <td className="p-4">
                      <div className="space-y-1">
                        {getStatusBadge(ad.paymentStatus)}
                        {ad.paymentStatus === "partial" && (
                          <p className="text-xs text-muted-foreground">
                            Paid: ${ad.paidAmount.toFixed(2)} / ${ad.totalAmount.toFixed(2)}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Due: {new Date(ad.dueDate).toLocaleDateString()}
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
                                <Label>Base Amount: ${ad.baseAmount.toFixed(2)}</Label>
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
                                    <Label htmlFor="discount-amount">Fixed Amount ($)</Label>
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
                                  <span>${ad.baseAmount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span>Discount:</span>
                                  <span className="text-success">
                                    -${calculateDiscount(ad.baseAmount, discountPercent, discountAmount).toFixed(2)}
                                  </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span>Subtotal:</span>
                                  <span>
                                    ${(ad.baseAmount - calculateDiscount(ad.baseAmount, discountPercent, discountAmount)).toFixed(2)}
                                  </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span>GST (5%):</span>
                                  <span>
                                    ${((ad.baseAmount - calculateDiscount(ad.baseAmount, discountPercent, discountAmount)) * 0.05).toFixed(2)}
                                  </span>
                                </div>
                                <div className="flex justify-between font-medium border-t pt-2">
                                  <span>Total Amount:</span>
                                  <span>
                                    ${((ad.baseAmount - calculateDiscount(ad.baseAmount, discountPercent, discountAmount)) * 1.05).toFixed(2)}
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
                        
                        <Button variant="ghost" size="sm" title="Update Payment">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="View Invoice">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Download Invoice">
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
    </div>
  );
};

export default Billing;