import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Receipt, Calendar, User, CreditCard, IndianRupee } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface Payment {
  id: number;
  amount: number;
  date: string;
  receiptNumber: string;
  utrNumber?: string;
  method: "cash" | "bank_transfer" | "cheque" | "online" | "upi";
  addedBy: string;
  addedByRole: string;
  notes?: string;
}

interface PaymentHistoryProps {
  adId: number;
  invoiceNumber: string;
  totalAmount: number;
  payments: Payment[];
  onAddPayment: (payment: Omit<Payment, 'id'>) => void;
}

import { format } from "date-fns";
import { formatDate } from "@/lib/utils";

const PaymentHistory = ({ adId, invoiceNumber, totalAmount, payments, onAddPayment }: PaymentHistoryProps) => {
  const { toast } = useToast();
  const [isAddingPayment, setIsAddingPayment] = useState(false);
  const [newPayment, setNewPayment] = useState({
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    receiptNumber: "",
    utrNumber: "",
    method: "cash" as const,
    notes: ""
  });


  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const remainingAmount = totalAmount - totalPaid;

  const handleAddPayment = () => {
    if (!newPayment.amount || !newPayment.receiptNumber) {
      toast({
        title: "Missing Information",
        description: "Amount and receipt number are required",
        variant: "destructive",
      });
      return;
    }

    if (newPayment.amount > remainingAmount) {
      toast({
        title: "Invalid Amount",
        description: `Payment amount cannot exceed remaining balance of ₹${remainingAmount.toFixed(2)}`,
        variant: "destructive",
      });
      return;
    }

    onAddPayment({
      ...newPayment,
      addedBy: "Current User", // In real app, get from auth
      addedByRole: "staff" // In real app, get from auth
    });

    // Reset form
    setNewPayment({
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      receiptNumber: "",
      utrNumber: "",
      method: "cash",
      notes: ""
    });
    setIsAddingPayment(false);

    toast({
      title: "Payment Added",
      description: `Payment of ₹${newPayment.amount.toFixed(2)} recorded successfully`,
    });
  };

  const getMethodBadge = (method: string) => {
    const colors = {
      cash: "bg-green-100 text-green-800",
      bank_transfer: "bg-blue-100 text-blue-800",
      cheque: "bg-yellow-100 text-yellow-800",
      online: "bg-purple-100 text-purple-800",
      upi: "bg-orange-100 text-orange-800"
    };

    const labels = {
      cash: "Cash",
      bank_transfer: "Bank Transfer",
      cheque: "Cheque",
      online: "Online",
      upi: "UPI"
    };

    return (
      <Badge className={`text-xs ${colors[method as keyof typeof colors] || "bg-gray-100 text-gray-800"}`}>
        {labels[method as keyof typeof labels] || method}
      </Badge>
    );
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Receipt className="h-5 w-5 text-primary" />
            <span>Payment History - {invoiceNumber}</span>
          </CardTitle>
          <Dialog open={isAddingPayment} onOpenChange={setIsAddingPayment}>
            <DialogTrigger asChild>
              <Button size="sm" disabled={remainingAmount <= 0}>
                <Plus className="h-4 w-4 mr-2" />
                Add Payment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Payment</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="p-3 bg-muted/30 rounded">
                  <div className="flex justify-between text-sm">
                    <span>Total Amount:</span>
                    <span className="font-medium">₹{totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Paid Amount:</span>
                    <span className="text-success">₹{totalPaid.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium border-t pt-2 mt-2">
                    <span>Remaining:</span>
                    <span className="text-warning">₹{remainingAmount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="payment-amount">Amount (₹) *</Label>
                    <Input
                      id="payment-amount"
                      type="number"
                      max={remainingAmount}
                      value={newPayment.amount || ""}
                      onChange={(e) => setNewPayment(prev => ({ ...prev, amount: Number(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="payment-date">Date *</Label>
                    <Input
                      id="payment-date"
                      type="date"
                      value={newPayment.date}
                      onChange={(e) => setNewPayment(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="payment-method">Payment Method *</Label>
                  <Select value={newPayment.method} onValueChange={(value: any) => setNewPayment(prev => ({ ...prev, method: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      <SelectItem value="cheque">Cheque</SelectItem>
                      <SelectItem value="online">Online Payment</SelectItem>
                      <SelectItem value="upi">UPI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="receipt-number">Receipt Number *</Label>
                  <Input
                    id="receipt-number"
                    placeholder="Receipt/Bill number (Required)"
                    value={newPayment.receiptNumber}
                    onChange={(e) => setNewPayment(prev => ({ ...prev, receiptNumber: e.target.value }))}
                    className={!newPayment.receiptNumber ? "border-destructive" : ""}
                    required
                  />
                </div>

                {(["bank_transfer", "online", "upi"].includes(newPayment.method)) && (
                  <div>
                    <Label htmlFor="utr-number">UTR/Transaction ID</Label>
                    <Input
                      id="utr-number"
                      placeholder="Bank UTR or Transaction ID"
                      value={newPayment.utrNumber}
                      onChange={(e) => setNewPayment(prev => ({ ...prev, utrNumber: e.target.value }))}
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="payment-notes">Notes (Optional)</Label>
                  <Input
                    id="payment-notes"
                    placeholder="Additional notes"
                    value={newPayment.notes}
                    onChange={(e) => setNewPayment(prev => ({ ...prev, notes: e.target.value }))}
                  />
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setIsAddingPayment(false)}>
                    Cancel
                  </Button>
                  <Button className="flex-1" onClick={handleAddPayment}>
                    Add Payment
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {payments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No payments recorded yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Payment Summary */}
            <div className="grid grid-cols-3 gap-4 p-3 bg-muted/30 rounded">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="font-medium">₹{totalAmount.toFixed(2)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Paid</p>
                <p className="font-medium text-success">₹{totalPaid.toFixed(2)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Remaining</p>
                <p className="font-medium text-warning">₹{remainingAmount.toFixed(2)}</p>
              </div>
            </div>

            {/* Payments List */}
            <div className="space-y-3">
              {payments.map((payment) => (
                <div key={payment.id} className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <IndianRupee className="h-4 w-4 text-success" />
                      <span className="font-medium text-success">₹{payment.amount.toFixed(2)}</span>
                      {getMethodBadge(payment.method)}
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(payment.date)}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                    <div>
                      <span className="font-medium">Receipt:</span> {payment.receiptNumber}
                    </div>
                    {payment.utrNumber && (
                      <div>
                        <span className="font-medium">UTR:</span> {payment.utrNumber}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span>{payment.addedBy} ({payment.addedByRole})</span>
                    </div>
                    {payment.notes && (
                      <span className="italic">"{payment.notes}"</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentHistory;