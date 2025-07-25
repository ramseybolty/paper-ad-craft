import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { formatDate } from "@/lib/utils";
import { CalendarIcon, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface EditAdModalProps {
  ad: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedAd: any) => void;
}

const EditAdModal = ({ ad, isOpen, onClose, onSave }: EditAdModalProps) => {
  const { toast } = useToast();
  const [tempDate, setTempDate] = useState<Date>();
  const [publishDates, setPublishDates] = useState<Date[]>([]);
  const [availablePageLayouts, setAvailablePageLayouts] = useState([
    { id: 1, name: "Front Page", value: "front", rate: "2000", active: true },
    { id: 2, name: "Back Page", value: "back", rate: "1500", active: true },
    { id: 3, name: "Inner Color", value: "inner-color", rate: "1200", active: true },
    { id: 4, name: "Inner B&W", value: "inner-bw", rate: "800", active: true },
    { id: 5, name: "Classifieds", value: "classifieds", rate: "5", active: true }
  ]);

  const [formData, setFormData] = useState({
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
    agentName: "",
    agentContact: "",
    status: "scheduled"
  });

  // Load page layouts from settings
  useEffect(() => {
    const savedLayouts = localStorage.getItem('newsprint-page-layouts');
    if (savedLayouts) {
      const layouts = JSON.parse(savedLayouts);
      setAvailablePageLayouts(layouts);
    }
  }, []);

  // Initialize form data when ad changes
  useEffect(() => {
    if (ad && isOpen) {
      setFormData({
        title: ad.title || "",
        category: ad.category || "",
        content: ad.content || "",
        instructions: ad.instructions || "",
        page: ad.page || "",
        columns: ad.columns || "",
        centimeters: ad.centimeters || "",
        words: ad.words || "",
        clientName: ad.clientName || "",
        clientType: ad.clientType || "individual",
        clientContact: ad.clientContact || "",
        agentName: ad.agentName || "",
        agentContact: ad.agentContact || "",
        status: ad.status || "scheduled"
      });

      // Convert publish dates to Date objects
      if (ad.publishDates && Array.isArray(ad.publishDates)) {
        const dates = ad.publishDates.map((date: string) => new Date(date));
        setPublishDates(dates);
      }
    }
  }, [ad, isOpen]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addPublishDate = () => {
    if (tempDate && !publishDates.some(date => 
      date.toDateString() === tempDate.toDateString()
    )) {
      setPublishDates([...publishDates, tempDate]);
      setTempDate(undefined);
    }
  };

  const removePublishDate = (index: number) => {
    setPublishDates(publishDates.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    // Validation
    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter an advertisement title.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.category.trim()) {
      toast({
        title: "Validation Error", 
        description: "Please enter a category.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.page) {
      toast({
        title: "Validation Error",
        description: "Please select a page layout.",
        variant: "destructive"
      });
      return;
    }

    if (publishDates.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one publish date.",
        variant: "destructive"
      });
      return;
    }

    // Create updated ad object
    const updatedAd = {
      ...ad,
      ...formData,
      publishDates: publishDates.map(date => date.toISOString().split('T')[0])
    };

    onSave(updatedAd);
    toast({
      title: "Advertisement Updated",
      description: "The advertisement has been successfully updated.",
    });
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const categories = [
    "Real Estate", "Automotive", "Jobs", "Services", "Electronics", 
    "Fashion", "Home & Garden", "Sports", "Education", "Health", 
    "Travel", "Food", "Events", "Legal", "Finance", "Other"
  ];

  const activePageLayouts = availablePageLayouts.filter(layout => layout.active);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Advertisement</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Advertisement Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter advertisement title"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
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
                value={formData.content}
                onChange={(e) => handleInputChange("content", e.target.value)}
                placeholder="Enter the content of your advertisement"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructions">Special Instructions</Label>
              <Textarea
                id="instructions"
                value={formData.instructions}
                onChange={(e) => handleInputChange("instructions", e.target.value)}
                placeholder="Any special layout or design instructions"
                rows={2}
              />
            </div>
          </div>

          {/* Page Layout & Sizing */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Page Layout & Sizing</h3>
            
            <div className="space-y-2">
              <Label htmlFor="page">Page Layout *</Label>
              <Select value={formData.page} onValueChange={(value) => handleInputChange("page", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select page layout" />
                </SelectTrigger>
                <SelectContent>
                  {activePageLayouts.map((layout) => (
                    <SelectItem key={layout.id} value={layout.value}>
                      <div className="flex justify-between items-center w-full">
                        <span>{layout.name}</span>
                        <span className="text-muted-foreground ml-2">
                          ₹{layout.rate}{layout.value === "classifieds" ? "/word" : ""}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {formData.page === "classifieds" ? (
              <div className="space-y-2">
                <Label htmlFor="words">Number of Words</Label>
                <Input
                  id="words"
                  type="number"
                  value={formData.words}
                  onChange={(e) => handleInputChange("words", e.target.value)}
                  placeholder="Enter number of words"
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="columns">Columns</Label>
                  <Input
                    id="columns"
                    type="number"
                    value={formData.columns}
                    onChange={(e) => handleInputChange("columns", e.target.value)}
                    placeholder="Number of columns"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="centimeters">Height (cm)</Label>
                  <Input
                    id="centimeters"
                    type="number"
                    value={formData.centimeters}
                    onChange={(e) => handleInputChange("centimeters", e.target.value)}
                    placeholder="Height in centimeters"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Client Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Client Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clientName">Client Name</Label>
                <Input
                  id="clientName"
                  value={formData.clientName}
                  onChange={(e) => handleInputChange("clientName", e.target.value)}
                  placeholder="Enter client name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="clientType">Client Type</Label>
                <Select value={formData.clientType} onValueChange={(value) => handleInputChange("clientType", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual</SelectItem>
                    <SelectItem value="agency">Agency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="clientContact">Client Contact</Label>
                <Input
                  id="clientContact"
                  value={formData.clientContact}
                  onChange={(e) => handleInputChange("clientContact", e.target.value)}
                  placeholder="Phone/Email"
                />
              </div>
            </div>
          </div>

          {/* Agent Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Agent Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="agentName">Agent Name</Label>
                <Input
                  id="agentName"
                  value={formData.agentName}
                  onChange={(e) => handleInputChange("agentName", e.target.value)}
                  placeholder="Enter agent name (optional)"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="agentContact">Agent Contact</Label>
                <Input
                  id="agentContact"
                  value={formData.agentContact}
                  onChange={(e) => handleInputChange("agentContact", e.target.value)}
                  placeholder="Phone/Email (optional)"
                />
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Advertisement Status</h3>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Publish Dates */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Publish Dates</h3>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {publishDates.map((date, index) => (
                <Badge key={index} variant="default" className="flex items-center space-x-2 pr-1">
                  <span>{formatDate(date)}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => removePublishDate(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>

            <div className="flex gap-2 items-end">
              <div className="space-y-2">
                <Label>Add Publish Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-60 justify-start text-left font-normal",
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
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <Button
                type="button"
                onClick={addPublishDate}
                disabled={!tempDate}
                className="mb-1"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Date
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditAdModal;