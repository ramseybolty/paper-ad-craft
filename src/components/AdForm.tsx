import { useState } from "react";
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
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, DollarSign, FileText, Image as ImageIcon, Users, Building, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const AdForm = () => {
  const { toast } = useToast();
  const [publishDates, setPublishDates] = useState<Date[]>([]);
  const [tempDate, setTempDate] = useState<Date>();
  const [clientSearchOpen, setClientSearchOpen] = useState(false);
  const [agentSearchOpen, setAgentSearchOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    content: "",
    contactInfo: "",
    columns: "",
    centimeters: "",
    clientName: "",
    clientType: "individual",
    clientContact: "", // Separate client contact
    agentName: "",
    agentContact: "" // Separate agent contact
  });

  // Expanded mock data for better testing
  const [savedClients] = useState([
    { id: 1, name: "John Smith", type: "individual", contact: "+1-555-0101", email: "john@email.com" },
    { id: 2, name: "ABC Real Estate", type: "agency", contact: "+1-555-0102", email: "info@abcrealty.com" },
    { id: 3, name: "Sarah Johnson", type: "individual", contact: "+1-555-0103", email: "sarah@email.com" },
    { id: 4, name: "Prime Motors Ltd", type: "agency", contact: "+1-555-0104", email: "sales@primemotors.com" },
    { id: 5, name: "John Miller", type: "individual", contact: "+1-555-0105", email: "jmiller@email.com" },
    { id: 6, name: "Tech Solutions Inc", type: "agency", contact: "+1-555-0106", email: "contact@techsolutions.com" },
    { id: 7, name: "Sarah Williams", type: "individual", contact: "+1-555-0107", email: "swilliams@email.com" },
    { id: 8, name: "Global Marketing Agency", type: "agency", contact: "+1-555-0108", email: "hello@globalmarketing.com" },
    { id: 9, name: "John Davis", type: "individual", contact: "+1-555-0109", email: "jdavis@email.com" },
    { id: 10, name: "Metro Properties", type: "agency", contact: "+1-555-0110", email: "info@metroproperties.com" }
  ]);

  const [savedAgents] = useState([
    { id: 1, name: "Mike Wilson", contact: "+1-555-0201", email: "mike@newsagency.com", agency: "News Agency Pro" },
    { id: 2, name: "Lisa Chen", contact: "+1-555-0202", email: "lisa@adpartners.com", agency: "Ad Partners" },
    { id: 3, name: "David Brown", contact: "+1-555-0203", email: "david@mediagroup.com", agency: "Media Group" },
    { id: 4, name: "Emily Wilson", contact: "+1-555-0204", email: "emily@newsagency.com", agency: "News Agency Pro" },
    { id: 5, name: "Michael Torres", contact: "+1-555-0205", email: "mtorres@adpartners.com", agency: "Ad Partners" },
    { id: 6, name: "Jennifer Lee", contact: "+1-555-0206", email: "jlee@creativemedia.com", agency: "Creative Media" },
    { id: 7, name: "Robert Smith", contact: "+1-555-0207", email: "rsmith@newscentral.com", agency: "News Central" },
    { id: 8, name: "Amanda Johnson", contact: "+1-555-0208", email: "ajohnson@mediaplus.com", agency: "Media Plus" }
  ]);

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
      setAgentSearchOpen(false);
    }
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
    { value: "1x5", label: "1 Column x 5 cm", price: "$15" },
    { value: "2x8", label: "2 Columns x 8 cm", price: "$35" },
    { value: "3x10", label: "3 Columns x 10 cm", price: "$65" },
    { value: "4x12", label: "4 Columns x 12 cm", price: "$95" },
    { value: "5x15", label: "5 Columns x 15 cm", price: "$140" },
    { value: "6x20", label: "6 Columns x 20 cm (Full Width)", price: "$220" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Advertisement Submitted",
      description: "Your ad has been submitted for review and will be published soon.",
    });
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Advertisement Title</Label>
              <Input
                id="title"
                placeholder="Enter a compelling title for your ad"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
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

          {/* Client and Agent Information */}
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg border">
            <div className="flex items-center space-x-2 mb-3">
              <Users className="h-5 w-5 text-primary" />
              <Label className="text-base font-semibold">Client & Agent Information</Label>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Search & Select Client (Optional)</Label>
                  <Popover open={clientSearchOpen} onOpenChange={setClientSearchOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={clientSearchOpen}
                        className="w-full justify-between text-left font-normal"
                      >
                        <span className="truncate">
                          {formData.clientName || "Search clients..."}
                        </span>
                        <Users className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search clients by name or contact..." />
                        <CommandList>
                          <CommandEmpty>No clients found.</CommandEmpty>
                          <CommandGroup heading="Saved Clients">
                            {savedClients.map((client) => (
                              <CommandItem
                                key={client.id}
                                value={`${client.name} ${client.contact} ${client.email}`}
                                onSelect={() => selectSavedClient(client.id.toString())}
                                className="cursor-pointer"
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
                </div>

                <div className="space-y-2">
                  <Label>Client Type</Label>
                  <Select value={formData.clientType} onValueChange={(value) => setFormData({...formData, clientType: value})}>
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
                  <Label htmlFor="clientName">Client Name *</Label>
                  <Input
                    id="clientName"
                    placeholder="Enter client name"
                    value={formData.clientName}
                    onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                    className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clientContact">Client Contact *</Label>
                  <Input
                    id="clientContact"
                    placeholder="Client phone/email"
                    value={formData.clientContact}
                    onChange={(e) => setFormData({...formData, clientContact: e.target.value})}
                    className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Search & Select Agent (Optional)</Label>
                  <Popover open={agentSearchOpen} onOpenChange={setAgentSearchOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={agentSearchOpen}
                        className="w-full justify-between text-left font-normal"
                      >
                        <span className="truncate">
                          {formData.agentName || "Search agents..."}
                        </span>
                        <Building className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search agents by name, contact, or agency..." />
                        <CommandList>
                          <CommandEmpty>No agents found.</CommandEmpty>
                          <CommandGroup heading="Saved Agents">
                            {savedAgents.map((agent) => (
                              <CommandItem
                                key={agent.id}
                                value={`${agent.name} ${agent.contact} ${agent.email} ${agent.agency}`}
                                onSelect={() => selectSavedAgent(agent.id.toString())}
                                className="cursor-pointer"
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

                <div className="space-y-2">
                  <Label htmlFor="agentName">Agent Name (Optional)</Label>
                  <Input
                    id="agentName"
                    placeholder="Enter agent name"
                    value={formData.agentName}
                    onChange={(e) => setFormData({...formData, agentName: e.target.value})}
                    className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="agentContact">Agent Contact (Optional)</Label>
                  <Input
                    id="agentContact"
                    placeholder="Agent phone/email"
                    value={formData.agentContact}
                    onChange={(e) => setFormData({...formData, agentContact: e.target.value})}
                    className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact">Advertisement Contact Information *</Label>
            <Input
              id="contact"
              placeholder="Contact info to display in the ad (phone, email, address)"
              value={formData.contactInfo}
              onChange={(e) => setFormData({...formData, contactInfo: e.target.value})}
              className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
              required
            />
            <p className="text-xs text-muted-foreground">
              This contact info will be displayed in the advertisement for readers to reach out
            </p>
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
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={tempDate}
                        onSelect={setTempDate}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
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
                        <span>{format(date, "MMM dd, yyyy")}</span>
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

          {/* Size Configuration - Now Mandatory */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Advertisement Size *</Label>
            <p className="text-sm text-muted-foreground">Specify dimensions for your advertisement (required for pricing calculation)</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="columns">Columns *</Label>
                <Input
                  id="columns"
                  type="number"
                  min="1"
                  max="6"
                  placeholder="Number of columns (1-6)"
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
                  placeholder="Height in centimeters"
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
                      Cost per date: ${(parseInt(formData.columns) * parseInt(formData.centimeters) * 0.8).toFixed(2)}
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

          <div className="flex items-center space-x-4 p-4 bg-accent/10 rounded-lg border border-accent/20">
            <ImageIcon className="h-5 w-5 text-accent" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Add Images (Optional)</p>
              <p className="text-xs text-muted-foreground">Upload images to make your ad more attractive</p>
            </div>
            <Button variant="outline" size="sm">
              Upload
            </Button>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Ads are typically approved within 24 hours</span>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" type="button">
                Save as Draft
              </Button>
              <Button type="submit" className="shadow-sm">
                Submit Advertisement
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdForm;