import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, DollarSign, FileText, Image as ImageIcon, Users, Building, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn, formatDate } from "@/lib/utils";
import { Advertisement, AdPublication } from "@/types/ad";
import { dataService } from "@/utils/dataService";

const AdForm = () => {
  const { toast } = useToast();
  
  // Set tomorrow as default date and calculate today for comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison
  
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0); // Reset time to start of day
  
  const [publishDates, setPublishDates] = useState<Date[]>([]); // No default selection
  const [tempDate, setTempDate] = useState<Date>();
  const [clientSearchOpen, setClientSearchOpen] = useState(false);
  const [agentSearchOpen, setAgentSearchOpen] = useState(false);
  const [isClientFromDropdown, setIsClientFromDropdown] = useState(false);
  const [isAgentFromDropdown, setIsAgentFromDropdown] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [availablePageLayouts, setAvailablePageLayouts] = useState([
    { id: 1, name: "Front Page", value: "front", rate: "2000", active: true, description: "Premium front page placement" },
    { id: 2, name: "Back Page", value: "back", rate: "1500", active: true, description: "High visibility back page" },
    { id: 3, name: "Inner Color", value: "inner-color", rate: "1200", active: true, description: "Color inner pages" },
    { id: 4, name: "Inner B&W", value: "inner-bw", rate: "800", active: true, description: "Black & white inner pages" },
    { id: 5, name: "Classifieds", value: "classifieds", rate: "5", active: true, description: "Classified section (per word)" }
  ]);
  
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    content: "",
    instructions: "", // New optional instructions field
    page: "", // New page selection field
    columns: "",
    centimeters: "",
    words: "", // For classified ads
    clientName: "",
    clientType: "individual",
    clientContact: "",
    clientGst: "", // New GST field for client
    agentName: "",
    agentContact: "",
    agentGst: "" // New GST field for agent
  });

  // Load page layouts, clients, and agents from data service on component mount
  useEffect(() => {
    const layouts = dataService.getPageLayouts();
    setAvailablePageLayouts(layouts);
    
    const clients = dataService.getClients();
    setSavedClients(clients);
    
    const agents = dataService.getAgents();
    setSavedAgents(agents);

    // Subscribe to updates
    const unsubscribeClients = dataService.subscribe('clients', setSavedClients);
    const unsubscribeAgents = dataService.subscribe('agents', setSavedAgents);

    return () => {
      unsubscribeClients();
      unsubscribeAgents();
    };
  }, []);

  // Load clients and agents from data service
  const [savedClients, setSavedClients] = useState<any[]>([]);
  const [savedAgents, setSavedAgents] = useState<any[]>([]);

  const addPublishDate = () => {
    if (tempDate && !publishDates.some(date => date.getTime() === tempDate.getTime())) {
      setPublishDates([...publishDates, tempDate]);
      setTempDate(undefined);
    }
  };

  const removePublishDate = (dateToRemove: Date) => {
    setPublishDates(publishDates.filter(date => date.getTime() !== dateToRemove.getTime()));
  };

  const selectSavedClient = (clientId: string) => {
    const client = savedClients.find(c => c.id === parseInt(clientId));
    if (client) {
      setFormData({
        ...formData,
        clientName: client.name,
        clientType: client.type,
        clientContact: client.contact
      });
      setIsClientFromDropdown(true);
      setClientSearchOpen(false);
    }
  };

  const selectSavedAgent = (agentId: string) => {
    const agent = savedAgents.find(a => a.id === parseInt(agentId));
    if (agent) {
      setFormData({
        ...formData,
        agentName: agent.name,
        agentContact: agent.contact
      });
      setIsAgentFromDropdown(true);
      setAgentSearchOpen(false);
    }
  };

  const clearClientSelection = () => {
    setFormData({
      ...formData,
      clientName: "",
      clientContact: ""
    });
    setIsClientFromDropdown(false);
  };

  const clearAgentSelection = () => {
    setFormData({
      ...formData,
      agentName: "",
      agentContact: ""
    });
    setIsAgentFromDropdown(false);
  };

  const categories = [
    "Classified",
    "Real Estate", 
    "Automotive",
    "Jobs",
    "Services",
    "Business",
    "Events",
    "Personal"
  ];

  const adSizes = [
    { value: "1x5", label: "1 Column x 5 cm", price: "₹150" },
    { value: "2x8", label: "2 Columns x 8 cm", price: "₹350" },
    { value: "3x10", label: "3 Columns x 10 cm", price: "₹650" },
    { value: "4x12", label: "4 Columns x 12 cm", price: "₹950" },
    { value: "5x15", label: "5 Columns x 15 cm", price: "₹1,400" },
    { value: "6x20", label: "6 Columns x 20 cm (Full Width)", price: "₹2,200" }
  ];

  const resetForm = () => {
    // Reset all form data to initial state
    setFormData({
      title: "",
      category: "",
      content: "",
      instructions: "",
      page: "",
      columns: "",
      centimeters: "",
      words: "",
      clientName: "",
      clientType: "individual",
      clientContact: "",
      clientGst: "",
      agentName: "",
      agentContact: "",
      agentGst: ""
    });
    
    // Reset dates to empty (no default selection)
    setPublishDates([]);
    setTempDate(undefined);
    
    // Reset dropdown states
    setIsClientFromDropdown(false);
    setIsAgentFromDropdown(false);
    setClientSearchOpen(false);
    setAgentSearchOpen(false);
  };

  const isFormComplete = () => {
    // Check basic required fields
    if (!formData.title.trim()) return false;
    if (!formData.category) return false;
    if (!formData.page) return false;
    if (!formData.clientName.trim()) return false;
    if (!formData.clientContact.trim()) return false;
    if (publishDates.length === 0) return false;
    
    // Check size requirements based on page type
    if (formData.page === 'classifieds') {
      if (!formData.words || parseInt(formData.words) < 10) return false;
    } else {
      if (!formData.columns || !formData.centimeters) return false;
    }
    
    return true;
  };

  const validateForm = () => {
    const errors = [];
    
    if (!formData.title.trim()) errors.push("Title is required");
    if (!formData.category) errors.push("Category is required");
    if (!formData.page) errors.push("Page selection is required");
    if (!formData.clientName.trim()) errors.push("Client name is required");
    if (!formData.clientContact.trim()) errors.push("Client contact is required");
    if (publishDates.length === 0) errors.push("At least one publication date is required");
    
    if (formData.page === 'classifieds') {
      if (!formData.words || parseInt(formData.words) < 10) {
        errors.push("At least 10 words required for classified ads");
      }
    } else {
      if (!formData.columns || !formData.centimeters) {
        errors.push("Both columns and height are required");
      } else {
        const columns = parseInt(formData.columns);
        const height = parseInt(formData.centimeters);
        if (columns > 16) {
          errors.push("Maximum 16 columns allowed");
        }
        if (height > 50) {
          errors.push("Maximum 50cm height allowed");
        }
      }
    }
    
    return errors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      toast({
        title: "Please complete all required fields",
        description: validationErrors.join(", "),
        variant: "destructive"
      });
      return;
    }
    
    setShowConfirmDialog(true);
  };

  const downloadOrderCopy = () => {
    // Generate order copy data
    const orderData = {
      title: formData.title,
      category: formData.category,
      page: formData.page,
      client: `${formData.clientName} (${formData.clientType})`,
      clientContact: formData.clientContact,
      agent: formData.agentName || "None",
      agentContact: formData.agentContact || "None",
      size: formData.page === 'classifieds' 
        ? `${formData.words} words` 
        : `${formData.columns} columns × ${formData.centimeters} cm`,
      publishDates: publishDates.map(date => formatDate(date)).join(", "),
      content: formData.content || "Content to be provided",
      instructions: formData.instructions || "None",
      timestamp: new Date().toLocaleString()
    };

    // Create downloadable content
    const orderContent = `
ADVERTISEMENT ORDER COPY

Order Generated: ${orderData.timestamp}
===========================================

ADVERTISEMENT DETAILS:
• Title: ${orderData.title}
• Category: ${orderData.category}
• Page: ${orderData.page}
• Size: ${orderData.size}

CLIENT INFORMATION:
• Name: ${orderData.client}
• Contact: ${orderData.clientContact}

AGENT INFORMATION:
• Agent: ${orderData.agent}
• Contact: ${orderData.agentContact}

PUBLICATION DETAILS:
• Dates: ${orderData.publishDates}
• Content: ${orderData.content}
• Special Instructions: ${orderData.instructions}

===========================================
Client Signature: ___________________
Date: ___________________

Please sign and return this order copy.
    `;

    // Download as text file (can be converted to PDF by office software)
    const blob = new Blob([orderContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ad-order-${formData.clientName.replace(/\s+/g, '-')}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Order Copy Downloaded",
      description: "The advertisement order copy has been downloaded for client signature.",
    });
  };

  const saveNewClientToDatabase = () => {
    // Check if contact info already exists (names can be duplicate, but contact must be unique)
    const existingClient = savedClients.find(
      client => client.contact === formData.clientContact.trim()
    );
    
    if (existingClient) {
      toast({
        title: "Client Already Exists",
        description: `A client with phone number ${formData.clientContact} already exists in the database.`,
        variant: "destructive"
      });
      return false;
    }
    
    if (formData.clientName.trim() && formData.clientContact.trim()) {
      const newClient = {
        id: Math.max(...savedClients.map(c => c.id)) + 1,
        name: formData.clientName.trim(),
        type: formData.clientType,
        contact: formData.clientContact.trim(),
        email: formData.clientContact.includes('@') ? formData.clientContact.trim() : `${formData.clientName.toLowerCase().replace(/\s+/g, '.')}@email.com`,
        gstNumber: formData.clientGst || "",
        address: ""
      };
      
      const updatedClients = [...savedClients, newClient];
      setSavedClients(updatedClients);
      dataService.saveClients(updatedClients);
      
      toast({
        title: "New Client Added",
        description: `${formData.clientName} has been saved to the client database for future use.`,
      });
      return true;
    }
    return false;
  };

  // Removed agent creation from create ad page - only available through administration

  const confirmSubmission = () => {
    // Create publications array from selected dates
    const publications: AdPublication[] = publishDates.map(date => ({
      date: date.toISOString().split('T')[0],
      status: 'scheduled' as const
    }));

    // Create new ad object with new data structure
    const newAd: Advertisement = {
      id: Date.now(), // Simple ID generation
      title: formData.title,
      category: formData.category,
      content: formData.content || "Content to be provided",
      instructions: formData.instructions || "",
      page: formData.page,
      size: formData.page === 'classifieds' 
        ? `${formData.words} words` 
        : `${formData.columns}x${formData.centimeters}`,
      columns: formData.columns,
      centimeters: formData.centimeters,
      words: formData.words,
      clientName: formData.clientName,
      clientType: formData.clientType as 'individual' | 'agency',
      clientContact: formData.clientContact,
      agentName: formData.agentName || "",
      agentContact: formData.agentContact || "",
      publications, // Use new publications structure
      priority: "medium",
      createdAt: new Date().toISOString(),
      baseAmount: formData.page === 'classifieds' 
        ? parseInt(formData.words) * 5 
        : parseInt(formData.columns) * parseInt(formData.centimeters) * 80,
      gst: 0, // Will be calculated
      totalAmount: 0 // Will be calculated
    };

    // Calculate GST and total
    newAd.gst = newAd.baseAmount * 0.05;
    newAd.totalAmount = newAd.baseAmount + newAd.gst;

    // Save using data service
    dataService.addAd(newAd);

    // Save new client data to database before submission
    if (!isClientFromDropdown) {
      const clientSaved = saveNewClientToDatabase();
      if (!clientSaved) {
        setShowConfirmDialog(false);
        return;
      }
    }
    
    toast({
      title: "Advertisement Scheduled Successfully!",
      description: `Your ad "${formData.title}" has been scheduled for ${publishDates.length} publication date${publishDates.length > 1 ? 's' : ''}.`,
    });
    
    // Reset form for new entry
    resetForm();
    setShowConfirmDialog(false);
  };

  return (
    <Card className="shadow-card">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-primary-glow/5">
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-primary" />
          <span>Create New Advertisement</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Advertisement Title *</Label>
              <Input
                id="title"
                placeholder="Enter a compelling title for your ad"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select advertisement category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category.toLowerCase()}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="page">Page Selection *</Label>
              <Select value={formData.page} onValueChange={(value) => setFormData({...formData, page: value, columns: "", centimeters: "", words: ""})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select page" />
                </SelectTrigger>
                <SelectContent>
                  {availablePageLayouts
                    .filter(layout => layout.active)
                    .map((layout) => (
                      <SelectItem key={layout.value} value={layout.value}>
                        {layout.name} - ₹{layout.rate}{layout.value === "classifieds" ? "/word" : "/column inch"}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Advertisement Content</Label>
            <Textarea
              id="content"
              placeholder="Write your advertisement content here..."
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              className="min-h-32 transition-all duration-300 focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions">Special Instructions (Optional)</Label>
            <Textarea
              id="instructions"
              placeholder="Any special instructions or notes for the advertisement..."
              value={formData.instructions}
              onChange={(e) => setFormData({...formData, instructions: e.target.value})}
              className="min-h-16 transition-all duration-300 focus:ring-2 focus:ring-primary/20"
              maxLength={200}
              rows={2}
            />
            <p className="text-xs text-muted-foreground">
              Optional field for special requirements, layout preferences, or other notes (max 200 characters)
            </p>
          </div>

          {/* Client and Agent Information */}
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg border">
            <div className="flex items-center space-x-2 mb-3">
              <Users className="h-5 w-5 text-primary" />
              <Label className="text-base font-semibold">Client & Agent Information</Label>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Label>Search & Select Client (Optional)</Label>
                    {isClientFromDropdown && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={clearClientSelection}
                        className="text-xs text-muted-foreground hover:text-foreground"
                      >
                        Clear & Edit Manually
                      </Button>
                    )}
                  </div>
                  <Popover open={clientSearchOpen} onOpenChange={setClientSearchOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={clientSearchOpen}
                        className="w-full justify-between text-left font-normal"
                        disabled={isClientFromDropdown}
                      >
                        <span className="truncate">
                          {formData.clientName || "Search clients..."}
                        </span>
                        <Users className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0 bg-card border shadow-md z-50" align="start">
                      <Command className="bg-card">
                        <CommandInput placeholder="Search clients by name or contact..." />
                        <CommandList className="bg-card">
                          <CommandEmpty>No clients found.</CommandEmpty>
                          <CommandGroup heading="Saved Clients" className="bg-card">
                            {savedClients.map((client) => (
                              <CommandItem
                                key={client.id}
                                value={`${client.name} ${client.contact} ${client.email}`}
                                onSelect={() => selectSavedClient(client.id.toString())}
                                className="cursor-pointer hover:bg-muted"
                              >
                                <div className="flex flex-col w-full">
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium">{client.name}</span>
                                    <Badge variant="outline" className="text-xs">
                                      {client.type}
                                    </Badge>
                                  </div>
                                  <div className="text-xs text-muted-foreground mt-1">
                                    📞 {client.contact} • ✉️ {client.email}
                                  </div>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                {/* Client Information - More Compact Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Client Type *</Label>
                    <Select value={formData.clientType} onValueChange={(value) => setFormData({...formData, clientType: value})} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select client type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="individual">Individual</SelectItem>
                        <SelectItem value="agency">Agency/Business</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="clientGst">Client GST Number (Optional)</Label>
                    <Input
                      id="clientGst"
                      placeholder="Enter GST number"
                      value={formData.clientGst}
                      onChange={(e) => setFormData({...formData, clientGst: e.target.value})}
                      className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                      maxLength={15}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientName">Client Name *</Label>
                    <Input
                      id="clientName"
                      placeholder="Enter client name"
                      value={formData.clientName}
                      onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                      className={cn(
                        "transition-all duration-300 focus:ring-2 focus:ring-primary/20",
                        isClientFromDropdown && "bg-muted/50 cursor-not-allowed opacity-60"
                      )}
                      disabled={isClientFromDropdown}
                      required
                    />
                    {isClientFromDropdown && (
                      <p className="text-xs text-muted-foreground">
                        ℹ️ Client selected from saved list. Use "Clear & Edit Manually" to modify.
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="clientContact">Client Contact *</Label>
                    <Input
                      id="clientContact"
                      placeholder="Client phone/email"
                      value={formData.clientContact}
                      onChange={(e) => setFormData({...formData, clientContact: e.target.value})}
                      className={cn(
                        "transition-all duration-300 focus:ring-2 focus:ring-primary/20",
                        isClientFromDropdown && "bg-muted/50 cursor-not-allowed opacity-60"
                      )}
                      disabled={isClientFromDropdown}
                      required
                    />
                    {isClientFromDropdown && (
                      <p className="text-xs text-muted-foreground">
                        ℹ️ Contact auto-filled from saved client. Use "Clear & Edit Manually" to modify.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Agent Information Section */}
              <div className="space-y-4">
                <Label className="text-base font-semibold text-muted-foreground">Agent Information (Optional)</Label>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Label>Search & Select Agent (Optional)</Label>
                    {isAgentFromDropdown && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={clearAgentSelection}
                        className="text-xs text-muted-foreground hover:text-foreground"
                      >
                        Clear & Edit Manually
                      </Button>
                    )}
                  </div>
                  <Popover open={agentSearchOpen} onOpenChange={setAgentSearchOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={agentSearchOpen}
                        className="w-full justify-between text-left font-normal"
                        disabled={isAgentFromDropdown}
                      >
                        <span className="truncate">
                          {formData.agentName || "Search agents..."}
                        </span>
                        <Building className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0 bg-card border shadow-md z-50" align="start">
                      <Command className="bg-card">
                        <CommandInput placeholder="Search agents by name, contact, or agency..." />
                        <CommandList className="bg-card">
                          <CommandEmpty>No agents found.</CommandEmpty>
                          <CommandGroup heading="Saved Agents" className="bg-card">
                            {savedAgents.map((agent) => (
                              <CommandItem
                                key={agent.id}
                                value={`${agent.name} ${agent.contact} ${agent.email} ${agent.agency}`}
                                onSelect={() => selectSavedAgent(agent.id.toString())}
                                className="cursor-pointer hover:bg-muted"
                              >
                                <div className="flex flex-col w-full">
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium">{agent.name}</span>
                                    <Badge variant="outline" className="text-xs">
                                      {agent.agency}
                                    </Badge>
                                  </div>
                                  <div className="text-xs text-muted-foreground mt-1">
                                    📞 {agent.contact} • ✉️ {agent.email}
                                  </div>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

            </div>
          </div>

          {/* Publication Dates - Multiple Date Selection */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Publication Dates *</Label>
            <p className="text-sm text-muted-foreground">Select dates when the advertisement should be published in the newspaper</p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="flex-1">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !tempDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {tempDate ? format(tempDate, "PPP") : <span>Select a publish date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-card border shadow-md z-50" align="start">
                      <Calendar
                        mode="single"
                        selected={tempDate}
                        onSelect={setTempDate}
                        disabled={(date) => date <= today}
                        defaultMonth={tomorrow}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                        modifiers={{
                          tomorrow: tomorrow
                        }}
                        modifiersStyles={{
                          tomorrow: {
                            backgroundColor: '#fef3c7',
                            color: '#92400e',
                            fontWeight: 600
                          }
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <Button 
                  type="button"
                  onClick={addPublishDate}
                  disabled={!tempDate}
                  className="flex items-center space-x-1"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Date</span>
                </Button>
              </div>

              {publishDates.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Selected Publication Dates:</Label>
                  <div className="flex flex-wrap gap-2">
                    {publishDates.map((date, index) => (
                      <Badge key={index} variant="default" className="flex items-center space-x-2 pr-1">
                        <span>{formatDate(date)}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 w-4 h-4 hover:bg-transparent"
                          onClick={() => removePublishDate(date)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {publishDates.length} date{publishDates.length !== 1 ? 's' : ''} selected
                  </p>
                </div>
              )}

              {publishDates.length === 0 && (
                <div className="p-3 bg-warning/10 rounded-lg border border-warning/20">
                  <p className="text-sm text-warning-foreground">
                    ⚠️ Please select at least one publication date for your advertisement
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Size Configuration - Conditional based on page selection */}
          {formData.page && (
            <div className="space-y-4">
              <Label className="text-base font-semibold">Advertisement Size *</Label>
              <p className="text-sm text-muted-foreground">
                {formData.page === 'classifieds' 
                  ? 'Specify word count for classified advertisement pricing'
                  : 'Specify dimensions for your advertisement (required for pricing calculation)'
                }
              </p>
              
              {formData.page === 'classifieds' ? (
                // Classified ads - Words field
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="words">Number of Words *</Label>
                    <Input
                      id="words"
                      type="number"
                      min="10"
                      placeholder="Number of words in the classified ad (minimum 10)"
                      value={formData.words}
                      onChange={(e) => setFormData({...formData, words: e.target.value})}
                      className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Minimum 10 words required for classified advertisements
                    </p>
                  </div>
                  
                  {formData.words && (
                    <div className="p-4 bg-success/10 rounded-lg border border-success/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            Classified Ad: {formData.words} word{formData.words !== "1" ? "s" : ""}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Cost per date: ₹{(parseInt(formData.words) * 5).toFixed(2)} (₹5/word)
                          </p>
                        </div>
                        <Badge variant="default" className="bg-success text-success-foreground">
                          Words Set
                        </Badge>
                      </div>
                    </div>
                  )}

                  {!formData.words && (
                    <div className="p-3 bg-warning/10 rounded-lg border border-warning/20">
                      <p className="text-sm text-warning-foreground">
                        ⚠️ Number of words is required for classified ad pricing
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                // Other pages - Columns and Height fields
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="columns">Columns *</Label>
                      <Input
                        id="columns"
                        type="number"
                        min="1"
                        max="16"
                        placeholder="Number of columns (1-16)"
                        value={formData.columns}
                        onChange={(e) => setFormData({...formData, columns: e.target.value})}
                        className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="centimeters">Height (cm) *</Label>
                      <Input
                        id="centimeters"
                        type="number"
                        min="1"
                        max="50"
                        placeholder="Height in centimeters (max 50cm)"
                        value={formData.centimeters}
                        onChange={(e) => setFormData({...formData, centimeters: e.target.value})}
                        className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                        required
                      />
                    </div>
                  </div>
                  
                  {formData.columns && formData.centimeters && (
                    <div className="p-4 bg-success/10 rounded-lg border border-success/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            Size: {formData.columns} Column{formData.columns !== "1" ? "s" : ""} × {formData.centimeters} cm
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Cost per date: ₹{(parseInt(formData.columns) * parseInt(formData.centimeters) * 80).toFixed(2)}
                          </p>
                        </div>
                        <Badge variant="default" className="bg-success text-success-foreground">
                          Size Set
                        </Badge>
                      </div>
                    </div>
                  )}

                  {(!formData.columns || !formData.centimeters) && (
                    <div className="p-3 bg-warning/10 rounded-lg border border-warning/20">
                      <p className="text-sm text-warning-foreground">
                        ⚠️ Both columns and height are required for advertisement pricing
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {!formData.page && (
            <div className="p-3 bg-warning/10 rounded-lg border border-warning/20">
              <p className="text-sm text-warning-foreground">
                ⚠️ Please select a page first to configure advertisement size
              </p>
            </div>
          )}

          <div className="flex items-center space-x-4 p-4 bg-accent/10 rounded-lg border border-accent/20">
            <ImageIcon className="h-5 w-5 text-accent" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Add Images (Optional)</p>
              <p className="text-xs text-muted-foreground">Upload Advertisement design</p>
            </div>
            <Button variant="outline" size="sm">
              Upload
            </Button>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-3">
              <Button 
                type="button"
                variant="outline" 
                onClick={downloadOrderCopy}
                disabled={!isFormComplete()}
                className={cn(
                  "flex items-center space-x-2",
                  !isFormComplete() && "opacity-50 cursor-not-allowed"
                )}
              >
                <FileText className="h-4 w-4" />
                <span>Download Order Copy</span>
              </Button>
              <p className="text-xs text-muted-foreground">
                {isFormComplete() 
                  ? "Generate order copy for client signature" 
                  : "Complete all required fields first"
                }
              </p>
            </div>
            <div className="flex space-x-3">
              <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <AlertDialogTrigger asChild>
                  <Button 
                    type="submit" 
                    disabled={!isFormComplete()}
                    className={cn(
                      "shadow-sm",
                      !isFormComplete() && "opacity-50 cursor-not-allowed"
                    )}
                  >
                     Schedule Advertisement
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Advertisement Submission</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to submit this advertisement? Once submitted, it will be sent for review and approval. 
                      The form will be cleared for your next entry after submission.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={confirmSubmission}>
                      Yes, Schedule Advertisement
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdForm;