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
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, DollarSign, FileText, Image as ImageIcon, Users, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const AdForm = () => {
  const { toast } = useToast();
  const [publishDate, setPublishDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    content: "",
    contactInfo: "",
    columns: "",
    centimeters: "",
    clientName: "",
    clientType: "individual", // individual or agency
    agentName: "",
    agentContact: ""
  });

  const mockClients = [
    { id: 1, name: "John Smith", type: "individual", contact: "john@email.com" },
    { id: 2, name: "ABC Real Estate", type: "agency", contact: "info@abcrealty.com" },
    { id: 3, name: "Sarah Johnson", type: "individual", contact: "sarah@email.com" },
    { id: 4, name: "Prime Motors Ltd", type: "agency", contact: "sales@primemotors.com" }
  ];

  const mockAgents = [
    { id: 1, name: "Mike Wilson", contact: "mike@newsagency.com", agency: "News Agency Pro" },
    { id: 2, name: "Lisa Chen", contact: "lisa@adpartners.com", agency: "Ad Partners" },
    { id: 3, name: "David Brown", contact: "david@mediagroup.com", agency: "Media Group" }
  ];

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
                  <Label htmlFor="clientName">Client Name</Label>
                  <Input
                    id="clientName"
                    placeholder="Enter client name"
                    value={formData.clientName}
                    onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                    className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="space-y-4">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="contact">Contact Information</Label>
              <Input
                id="contact"
                placeholder="Phone, email, or address"
                value={formData.contactInfo}
                onChange={(e) => setFormData({...formData, contactInfo: e.target.value})}
                className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Date Selection */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Publication Dates</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Date of Publish (DOP)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !publishDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {publishDate ? format(publishDate, "PPP") : <span>Select publish date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={publishDate}
                      onSelect={setPublishDate}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>End Date (Optional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : <span>Select end date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {/* Size Configuration */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Advertisement Size (Optional)</Label>
            <p className="text-sm text-muted-foreground">Specify custom dimensions for your advertisement</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="columns">Columns</Label>
                <Input
                  id="columns"
                  type="number"
                  placeholder="Number of columns (e.g., 2)"
                  value={formData.columns}
                  onChange={(e) => setFormData({...formData, columns: e.target.value})}
                  className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="centimeters">Height (cm)</Label>
                <Input
                  id="centimeters"
                  type="number"
                  placeholder="Height in centimeters (e.g., 10)"
                  value={formData.centimeters}
                  onChange={(e) => setFormData({...formData, centimeters: e.target.value})}
                  className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            
            {formData.columns && formData.centimeters && (
              <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                <p className="text-sm font-medium text-foreground">
                  Size Preview: {formData.columns} Column{formData.columns !== "1" ? "s" : ""} × {formData.centimeters} cm
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Estimated cost will be calculated based on dimensions
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