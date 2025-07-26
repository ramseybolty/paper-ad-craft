import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Settings as SettingsIcon, 
  Users, 
  Shield, 
  Database, 
  Mail, 
  Bell, 
  Palette, 
  Globe, 
  CreditCard,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  IndianRupee,
  FileText,
  Clock,
  Printer,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import UserManagement from "./UserManagement";

const Settings = () => {
  const { toast } = useToast();

  // System Settings State
  const [systemSettings, setSystemSettings] = useState({
    companyName: "NewsPrint Pro",
    companyAddress: "123 Media Street, Press City, PC 12345",
    contactEmail: "admin@newsprintpro.com",
    contactPhone: "+91 98765 43210",
    taxGST: "5",
    currency: "INR",
    timezone: "Asia/Kolkata",
    language: "en"
  });

  // User Management Settings
  const [userSettings, setUserSettings] = useState({
    allowSelfRegistration: false,
    requireEmailVerification: true,
    passwordMinLength: "8",
    sessionTimeout: "24",
    twoFactorAuth: false,
    defaultUserRole: "staff"
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    newAdAlerts: true,
    paymentReminders: true,
    systemAlerts: true,
    weeklyReports: true
  });

  // Ad Management Settings
  const [adSettings, setAdSettings] = useState({
    maxAdDuration: "30",
    autoApproval: false,
    requirePaymentUpfront: true,
    allowCancellation: true,
    cancellationDeadline: "24",
    discountThreshold: "3",
    priorityFee: "500"
  });

  // Billing Settings
  const [billingSettings, setBillingSettings] = useState({
    invoicePrefix: "INV-",
    receiptPrefix: "RCP-",
    paymentTerms: "7",
    lateFeePercentage: "2",
    reminderDays: "3",
    gracePeriod: "5"
  });

  // Page Layout Settings
  const [layoutSettings, setLayoutSettings] = useState({
    frontPageRate: "2000",
    backPageRate: "1500",
    innerColorRate: "1200",
    innerBWRate: "800",
    classifiedWordRate: "5",
    minimumClassifiedCharge: "50"
  });

  // Page Layouts Management
  const [pageLayouts, setPageLayouts] = useState([
    { id: 1, name: "Front Page", value: "front", rate: "2000", active: true, description: "Premium front page placement" },
    { id: 2, name: "Back Page", value: "back", rate: "1500", active: true, description: "High visibility back page" },
    { id: 3, name: "Inner Color", value: "inner-color", rate: "1200", active: true, description: "Color inner pages" },
    { id: 4, name: "Inner B&W", value: "inner-bw", rate: "800", active: true, description: "Black & white inner pages" },
    { id: 5, name: "Classifieds", value: "classifieds", rate: "5", active: true, description: "Classified section (per word)" }
  ]);

  const [newLayout, setNewLayout] = useState({
    name: "",
    value: "",
    rate: "",
    description: "",
    active: true
  });

  // Page Layout Management Functions
  const addNewLayout = () => {
    if (!newLayout.name || !newLayout.value || !newLayout.rate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Check if value already exists
    if (pageLayouts.some(layout => layout.value === newLayout.value)) {
      toast({
        title: "Duplicate Value",
        description: "Page value already exists. Please use a unique value.",
        variant: "destructive",
      });
      return;
    }

    const layout = {
      id: Math.max(...pageLayouts.map(l => l.id)) + 1,
      ...newLayout
    };

    setPageLayouts([...pageLayouts, layout]);
    setNewLayout({ name: "", value: "", rate: "", description: "", active: true });
    
    // Save to localStorage
    localStorage.setItem('newsprint-page-layouts', JSON.stringify([...pageLayouts, layout]));

    toast({
      title: "Layout Added",
      description: `${newLayout.name} has been added successfully`,
    });
  };

  const toggleLayoutActive = (id: number) => {
    const updated = pageLayouts.map(layout => 
      layout.id === id ? { ...layout, active: !layout.active } : layout
    );
    setPageLayouts(updated);
    localStorage.setItem('newsprint-page-layouts', JSON.stringify(updated));
    
    toast({
      title: "Layout Updated",
      description: "Layout visibility has been updated",
    });
  };

  const deleteLayout = (id: number) => {
    const layout = pageLayouts.find(l => l.id === id);
    if (!layout) return;

    const updated = pageLayouts.filter(l => l.id !== id);
    setPageLayouts(updated);
    localStorage.setItem('newsprint-page-layouts', JSON.stringify(updated));

    toast({
      title: "Layout Deleted",
      description: `${layout.name} has been removed`,
    });
  };

  const handleSaveSettings = (section: string) => {
    if (section === "Layout & Pricing") {
      localStorage.setItem('newsprint-page-layouts', JSON.stringify(pageLayouts));
    }
    toast({
      title: "Settings Saved",
      description: `${section} settings have been updated successfully`,
    });
  };

  const handleResetSettings = (section: string) => {
    toast({
      title: "Settings Reset",
      description: `${section} settings have been reset to defaults`,
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <SettingsIcon className="h-6 w-6 text-primary" />
            Administration Settings
          </h1>
          <p className="text-muted-foreground">Configure system settings and preferences</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset All
          </Button>
          <Button variant="default" size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save All Changes
          </Button>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="system" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="ads">Ads</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="notifications">Alerts</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* System Settings */}
        <TabsContent value="system" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-primary" />
                <span>System Configuration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input
                      id="company-name"
                      value={systemSettings.companyName}
                      onChange={(e) => setSystemSettings({...systemSettings, companyName: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="company-address">Company Address</Label>
                    <Textarea
                      id="company-address"
                      value={systemSettings.companyAddress}
                      onChange={(e) => setSystemSettings({...systemSettings, companyAddress: e.target.value})}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact-email">Contact Email</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      value={systemSettings.contactEmail}
                      onChange={(e) => setSystemSettings({...systemSettings, contactEmail: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact-phone">Contact Phone</Label>
                    <Input
                      id="contact-phone"
                      value={systemSettings.contactPhone}
                      onChange={(e) => setSystemSettings({...systemSettings, contactPhone: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="tax-gst">GST Rate (%)</Label>
                    <Input
                      id="tax-gst"
                      type="number"
                      value={systemSettings.taxGST}
                      onChange={(e) => setSystemSettings({...systemSettings, taxGST: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={systemSettings.currency} onValueChange={(value) => setSystemSettings({...systemSettings, currency: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                        <SelectItem value="USD">US Dollar ($)</SelectItem>
                        <SelectItem value="EUR">Euro (€)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select value={systemSettings.timezone} onValueChange={(value) => setSystemSettings({...systemSettings, timezone: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                        <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                        <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="language">Default Language</Label>
                    <Select value={systemSettings.language} onValueChange={(value) => setSystemSettings({...systemSettings, language: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="hi">Hindi</SelectItem>
                        <SelectItem value="mr">Marathi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => handleResetSettings("System")}>
                  Reset
                </Button>
                <Button onClick={() => handleSaveSettings("System")}>
                  <Save className="h-4 w-4 mr-2" />
                  Save System Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Management */}
        <TabsContent value="users" className="space-y-6">
          <UserManagement />
        </TabsContent>

        {/* Ad Management Settings */}
        <TabsContent value="ads" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-primary" />
                <span>Advertisement Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="max-duration">Maximum Ad Duration (days)</Label>
                    <Input
                      id="max-duration"
                      type="number"
                      value={adSettings.maxAdDuration}
                      onChange={(e) => setAdSettings({...adSettings, maxAdDuration: e.target.value})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto-approve Ads</Label>
                      <p className="text-sm text-muted-foreground">Automatically approve submitted ads</p>
                    </div>
                    <Switch
                      checked={adSettings.autoApproval}
                      onCheckedChange={(checked) => setAdSettings({...adSettings, autoApproval: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Require Payment Upfront</Label>
                      <p className="text-sm text-muted-foreground">Payment required before publishing</p>
                    </div>
                    <Switch
                      checked={adSettings.requirePaymentUpfront}
                      onCheckedChange={(checked) => setAdSettings({...adSettings, requirePaymentUpfront: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Allow Cancellation</Label>
                      <p className="text-sm text-muted-foreground">Users can cancel published ads</p>
                    </div>
                    <Switch
                      checked={adSettings.allowCancellation}
                      onCheckedChange={(checked) => setAdSettings({...adSettings, allowCancellation: checked})}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cancellation-deadline">Cancellation Deadline (hours)</Label>
                    <Input
                      id="cancellation-deadline"
                      type="number"
                      value={adSettings.cancellationDeadline}
                      onChange={(e) => setAdSettings({...adSettings, cancellationDeadline: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="discount-threshold">Discount Threshold (days)</Label>
                    <Input
                      id="discount-threshold"
                      type="number"
                      value={adSettings.discountThreshold}
                      onChange={(e) => setAdSettings({...adSettings, discountThreshold: e.target.value})}
                    />
                    <p className="text-xs text-muted-foreground">Only admin can apply discounts after this many days</p>
                  </div>
                  <div>
                    <Label htmlFor="priority-fee">Priority Processing Fee (₹)</Label>
                    <Input
                      id="priority-fee"
                      type="number"
                      value={adSettings.priorityFee}
                      onChange={(e) => setAdSettings({...adSettings, priorityFee: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => handleResetSettings("Ad Management")}>
                  Reset
                </Button>
                <Button onClick={() => handleSaveSettings("Ad Management")}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Ad Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Settings */}
        <TabsContent value="billing" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5 text-primary" />
                <span>Billing Configuration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="invoice-prefix">Invoice Number Prefix</Label>
                    <Input
                      id="invoice-prefix"
                      value={billingSettings.invoicePrefix}
                      onChange={(e) => setBillingSettings({...billingSettings, invoicePrefix: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="receipt-prefix">Receipt Number Prefix</Label>
                    <Input
                      id="receipt-prefix"
                      value={billingSettings.receiptPrefix}
                      onChange={(e) => setBillingSettings({...billingSettings, receiptPrefix: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="payment-terms">Payment Terms (days)</Label>
                    <Input
                      id="payment-terms"
                      type="number"
                      value={billingSettings.paymentTerms}
                      onChange={(e) => setBillingSettings({...billingSettings, paymentTerms: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="late-fee">Late Fee Percentage (%)</Label>
                    <Input
                      id="late-fee"
                      type="number"
                      value={billingSettings.lateFeePercentage}
                      onChange={(e) => setBillingSettings({...billingSettings, lateFeePercentage: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="reminder-days">Payment Reminder (days before due)</Label>
                    <Input
                      id="reminder-days"
                      type="number"
                      value={billingSettings.reminderDays}
                      onChange={(e) => setBillingSettings({...billingSettings, reminderDays: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="grace-period">Grace Period (days after due)</Label>
                    <Input
                      id="grace-period"
                      type="number"
                      value={billingSettings.gracePeriod}
                      onChange={(e) => setBillingSettings({...billingSettings, gracePeriod: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => handleResetSettings("Billing")}>
                  Reset
                </Button>
                <Button onClick={() => handleSaveSettings("Billing")}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Billing Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Layout & Pricing Settings */}
        <TabsContent value="layout" className="space-y-6">
          {/* Add New Layout Form */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="h-5 w-5 text-primary" />
                <span>Add New Page Layout</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="layout-name">Layout Name *</Label>
                  <Input
                    id="layout-name"
                    placeholder="e.g., Sports Section"
                    value={newLayout.name}
                    onChange={(e) => setNewLayout({...newLayout, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="layout-value">Value (Internal) *</Label>
                  <Input
                    id="layout-value"
                    placeholder="e.g., sports-section"
                    value={newLayout.value}
                    onChange={(e) => setNewLayout({...newLayout, value: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                  />
                </div>
                <div>
                  <Label htmlFor="layout-rate">Rate (₹) *</Label>
                  <Input
                    id="layout-rate"
                    type="number"
                    placeholder="e.g., 1000"
                    value={newLayout.rate}
                    onChange={(e) => setNewLayout({...newLayout, rate: e.target.value})}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={addNewLayout} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Layout
                  </Button>
                </div>
              </div>
              <div>
                <Label htmlFor="layout-description">Description</Label>
                <Input
                  id="layout-description"
                  placeholder="Brief description of the layout"
                  value={newLayout.description}
                  onChange={(e) => setNewLayout({...newLayout, description: e.target.value})}
                />
              </div>
            </CardContent>
          </Card>

          {/* Existing Layouts Management */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Printer className="h-5 w-5 text-primary" />
                <span>Manage Page Layouts</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pageLayouts.map((layout) => (
                  <div key={layout.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={layout.active}
                          onCheckedChange={() => toggleLayoutActive(layout.id)}
                        />
                        {layout.active ? (
                          <Eye className="h-4 w-4 text-success" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{layout.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Value: {layout.value} | Rate: ₹{layout.rate}
                          {layout.value === "classifieds" ? "/word" : "/column inch"}
                        </p>
                        {layout.description && (
                          <p className="text-xs text-muted-foreground italic">{layout.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={layout.active ? "default" : "secondary"}>
                        {layout.active ? "Active" : "Inactive"}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => deleteLayout(layout.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <Button variant="outline" onClick={() => handleResetSettings("Layout & Pricing")}>
                  Reset
                </Button>
                <Button onClick={() => handleSaveSettings("Layout & Pricing")}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Layout Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-primary" />
                <span>Notification Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Send notifications via email</p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, emailNotifications: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">Send notifications via SMS</p>
                    </div>
                    <Switch
                      checked={notificationSettings.smsNotifications}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, smsNotifications: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Browser push notifications</p>
                    </div>
                    <Switch
                      checked={notificationSettings.pushNotifications}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, pushNotifications: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>New Ad Alerts</Label>
                      <p className="text-sm text-muted-foreground">Notify when new ads are submitted</p>
                    </div>
                    <Switch
                      checked={notificationSettings.newAdAlerts}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, newAdAlerts: checked})}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Payment Reminders</Label>
                      <p className="text-sm text-muted-foreground">Send payment due reminders</p>
                    </div>
                    <Switch
                      checked={notificationSettings.paymentReminders}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, paymentReminders: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>System Alerts</Label>
                      <p className="text-sm text-muted-foreground">Critical system notifications</p>
                    </div>
                    <Switch
                      checked={notificationSettings.systemAlerts}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, systemAlerts: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Weekly Reports</Label>
                      <p className="text-sm text-muted-foreground">Automated weekly summary reports</p>
                    </div>
                    <Switch
                      checked={notificationSettings.weeklyReports}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, weeklyReports: checked})}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => handleResetSettings("Notifications")}>
                  Reset
                </Button>
                <Button onClick={() => handleSaveSettings("Notifications")}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Notification Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-primary" />
                <span>Security Configuration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800">Security Notice</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        These settings affect system security. Changes require admin confirmation and may log out all users.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">System Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">SSL Certificate</span>
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Valid
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Database Security</span>
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Encrypted
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Backup Status</span>
                        <Badge className="bg-blue-100 text-blue-800">
                          <Clock className="h-3 w-3 mr-1" />
                          Daily
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Security Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Force Password Reset (All Users)
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <Database className="h-4 w-4 mr-2" />
                        Create Security Backup
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start text-destructive">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Logout All Sessions
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => handleResetSettings("Security")}>
                  Reset
                </Button>
                <Button onClick={() => handleSaveSettings("Security")}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Security Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;