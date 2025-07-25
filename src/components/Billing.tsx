import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  CreditCard, 
  Download, 
  Calendar,
  DollarSign,
  Receipt,
  AlertCircle,
  CheckCircle,
  Clock,
  Plus,
  Eye,
  FileText,
  Banknote
} from "lucide-react";
import { useState } from "react";

const Billing = () => {
  const [timeFilter, setTimeFilter] = useState("30days");

  // Mock billing data
  const billingOverview = {
    currentBalance: 1250.75,
    monthlySpent: 3420.50,
    outstandingInvoices: 2,
    nextPaymentDate: "2024-02-15",
    paymentMethod: "**** **** **** 4242"
  };

  const invoiceHistory = [
    {
      id: "INV-2024-001",
      date: "2024-01-31",
      period: "January 2024",
      amount: 2890.50,
      status: "paid",
      dueDate: "2024-02-15",
      items: 24
    },
    {
      id: "INV-2024-002",
      date: "2024-01-15",
      period: "Mid-January 2024",
      amount: 1240.25,
      status: "paid",
      dueDate: "2024-01-30",
      items: 18
    },
    {
      id: "INV-2024-003",
      date: "2024-02-01",
      period: "February 2024",
      amount: 1850.00,
      status: "pending",
      dueDate: "2024-02-15",
      items: 32
    },
    {
      id: "INV-2024-004",
      date: "2024-02-05",
      period: "Early February 2024", 
      amount: 580.75,
      status: "overdue",
      dueDate: "2024-02-10",
      items: 8
    }
  ];

  const adSpendingBreakdown = [
    { page: "Front Page", ads: 8, amount: 1280.00, avgCost: 160.00 },
    { page: "Back Page", ads: 12, amount: 960.00, avgCost: 80.00 },
    { page: "Inner Color", ads: 15, amount: 750.00, avgCost: 50.00 },
    { page: "Inner B&W", ads: 18, amount: 540.00, avgCost: 30.00 },
    { page: "Classifieds", ads: 25, amount: 125.00, avgCost: 5.00 }
  ];

  const paymentMethods = [
    {
      id: 1,
      type: "card",
      last4: "4242",
      brand: "Visa",
      expiry: "12/25",
      isDefault: true
    },
    {
      id: 2,
      type: "card", 
      last4: "5555",
      brand: "Mastercard",
      expiry: "08/26",
      isDefault: false
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-success text-success-foreground"><CheckCircle className="h-3 w-3 mr-1" />Paid</Badge>;
      case "pending":
        return <Badge className="bg-warning text-warning-foreground"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case "overdue":
        return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Overdue</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPageBadge = (page: string) => {
    const colors: { [key: string]: string } = {
      "Front Page": "bg-red-100 text-red-800",
      "Back Page": "bg-blue-100 text-blue-800",
      "Inner Color": "bg-green-100 text-green-800",
      "Inner B&W": "bg-gray-100 text-gray-800",
      "Classifieds": "bg-yellow-100 text-yellow-800"
    };

    return (
      <Badge className={`text-xs ${colors[page] || "bg-gray-100 text-gray-800"}`}>
        {page}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-primary" />
            Billing & Payments
          </h1>
          <p className="text-muted-foreground">Manage your advertisement payments and billing information</p>
        </div>
        <div className="flex gap-3">
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Billing Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Balance</p>
                <p className="text-2xl font-bold text-foreground">${billingOverview.currentBalance.toFixed(2)}</p>
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
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold text-foreground">${billingOverview.monthlySpent.toFixed(2)}</p>
              </div>
              <div className="p-2 bg-success/10 rounded-lg">
                <Receipt className="h-5 w-5 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Outstanding</p>
                <p className="text-2xl font-bold text-destructive">{billingOverview.outstandingInvoices}</p>
                <p className="text-xs text-muted-foreground">invoices</p>
              </div>
              <div className="p-2 bg-destructive/10 rounded-lg">
                <AlertCircle className="h-5 w-5 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Next Payment</p>
                <p className="text-lg font-bold text-foreground">
                  {new Date(billingOverview.nextPaymentDate).toLocaleDateString()}
                </p>
                <p className="text-xs text-muted-foreground">{billingOverview.paymentMethod}</p>
              </div>
              <div className="p-2 bg-warning/10 rounded-lg">
                <Calendar className="h-5 w-5 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ad Spending Breakdown */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Banknote className="h-5 w-5 text-primary" />
            Ad Spending Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium text-foreground">Page Type</th>
                  <th className="text-right p-4 font-medium text-foreground">Ads Count</th>
                  <th className="text-right p-4 font-medium text-foreground">Total Amount</th>
                  <th className="text-right p-4 font-medium text-foreground">Avg. Cost</th>
                </tr>
              </thead>
              <tbody>
                {adSpendingBreakdown.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      {getPageBadge(item.page)}
                    </td>
                    <td className="p-4 text-right text-foreground">{item.ads}</td>
                    <td className="p-4 text-right font-medium text-foreground">
                      ${item.amount.toFixed(2)}
                    </td>
                    <td className="p-4 text-right text-foreground">
                      ${item.avgCost.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods and Invoice History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Methods */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Payment Methods
              </CardTitle>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Method
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {paymentMethods.map((method) => (
              <div key={method.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded">
                    <CreditCard className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">
                        {method.brand} **** {method.last4}
                      </span>
                      {method.isDefault && (
                        <Badge variant="secondary" className="text-xs">Default</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">Expires {method.expiry}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  Edit
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Download className="h-4 w-4 mr-2" />
              Download Tax Summary
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Receipt className="h-4 w-4 mr-2" />
              Request Invoice Copy
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <CreditCard className="h-4 w-4 mr-2" />
              Update Billing Address
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="h-4 w-4 mr-2" />
              Set Payment Reminders
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Invoice History */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-primary" />
              Invoice History
            </CardTitle>
            <div className="text-sm text-muted-foreground">
              Showing {invoiceHistory.length} invoices
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium text-foreground">Invoice</th>
                  <th className="text-left p-4 font-medium text-foreground">Period</th>
                  <th className="text-right p-4 font-medium text-foreground">Amount</th>
                  <th className="text-left p-4 font-medium text-foreground">Status</th>
                  <th className="text-left p-4 font-medium text-foreground">Due Date</th>
                  <th className="text-right p-4 font-medium text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoiceHistory.map((invoice) => (
                  <tr key={invoice.id} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-foreground">{invoice.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(invoice.date).toLocaleDateString()}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-foreground">{invoice.period}</p>
                        <p className="text-sm text-muted-foreground">{invoice.items} ads</p>
                      </div>
                    </td>
                    <td className="p-4 text-right font-medium text-foreground">
                      ${invoice.amount.toFixed(2)}
                    </td>
                    <td className="p-4">
                      {getStatusBadge(invoice.status)}
                    </td>
                    <td className="p-4">
                      <span className={`text-sm ${
                        invoice.status === "overdue" 
                          ? "text-destructive font-medium" 
                          : "text-foreground"
                      }`}>
                        {new Date(invoice.dueDate).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="ghost" size="sm" title="View Invoice">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Download PDF">
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