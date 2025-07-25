import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, DollarSign, FileText, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    content: "",
    contactInfo: "",
    duration: "",
    size: "",
    placement: ""
  });

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
    { value: "small", label: "Small (2x2 inches)", price: "$25" },
    { value: "medium", label: "Medium (4x3 inches)", price: "$65" },
    { value: "large", label: "Large (6x4 inches)", price: "$120" },
    { value: "full", label: "Full Column (8x6 inches)", price: "$200" }
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
            
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (Days)</Label>
              <Select value={formData.duration} onValueChange={(value) => setFormData({...formData, duration: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="How long to run the ad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Day</SelectItem>
                  <SelectItem value="3">3 Days</SelectItem>
                  <SelectItem value="7">1 Week</SelectItem>
                  <SelectItem value="14">2 Weeks</SelectItem>
                  <SelectItem value="30">1 Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <Label>Advertisement Size & Pricing</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {adSizes.map((size) => (
                <div 
                  key={size.value}
                  className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 hover:border-primary/50 ${
                    formData.size === size.value 
                      ? 'border-primary bg-primary/5 shadow-md' 
                      : 'border-border hover:shadow-sm'
                  }`}
                  onClick={() => setFormData({...formData, size: size.value})}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-foreground">{size.label}</h4>
                      <p className="text-sm text-muted-foreground">Perfect for {size.value} ads</p>
                    </div>
                    <Badge variant={formData.size === size.value ? "default" : "secondary"} className="flex items-center space-x-1">
                      <DollarSign className="h-3 w-3" />
                      <span>{size.price}</span>
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
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