import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Calendar, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";

interface StatusEditModalProps {
  ad: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedAd: any) => void;
  isAdmin?: boolean;
}

const StatusEditModal = ({ ad, isOpen, onClose, onSave, isAdmin = false }: StatusEditModalProps) => {
  const { toast } = useToast();
  const [selectedStatus, setSelectedStatus] = useState("");

  // Initialize status when ad changes
  useEffect(() => {
    if (ad && isOpen) {
      setSelectedStatus(ad.status || "scheduled");
    }
  }, [ad, isOpen]);

  // Check if ad has future publish dates
  const hasFutureDates = () => {
    if (!ad?.publishDates) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return ad.publishDates.some((dateStr: string) => {
      const publishDate = new Date(dateStr);
      publishDate.setHours(0, 0, 0, 0);
      return publishDate >= today;
    });
  };

  // Check if user can edit this ad
  const canEditStatus = () => {
    if (isAdmin) return true;
    return hasFutureDates();
  };

  // Get next future publish date
  const getNextFutureDate = () => {
    if (!ad?.publishDates) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const futureDates = ad.publishDates
      .map((dateStr: string) => new Date(dateStr))
      .filter(date => {
        date.setHours(0, 0, 0, 0);
        return date >= today;
      })
      .sort((a, b) => a.getTime() - b.getTime());
    
    return futureDates.length > 0 ? futureDates[0] : null;
  };

  const handleSave = () => {
    if (!canEditStatus()) {
      toast({
        title: "Cannot Edit Status",
        description: "You can only edit status for advertisements with future publish dates.",
        variant: "destructive"
      });
      return;
    }

    if (selectedStatus === ad.status) {
      onClose();
      return;
    }

    const updatedAd = {
      ...ad,
      status: selectedStatus
    };

    onSave(updatedAd);
    toast({
      title: "Status Updated",
      description: `Advertisement status changed to ${selectedStatus}.`,
    });
    onClose();
  };

  const handleCancel = () => {
    setSelectedStatus(ad?.status || "scheduled");
    onClose();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Scheduled</Badge>;
      case "published":
        return <Badge variant="default">Published</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (!ad) return null;

  const canEdit = canEditStatus();
  const nextFutureDate = getNextFutureDate();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Advertisement Status</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Ad Info */}
          <div className="space-y-2">
            <div className="font-medium text-sm text-muted-foreground">Advertisement</div>
            <div className="font-semibold">{ad.title}</div>
            <div className="text-sm text-muted-foreground">{ad.category}</div>
          </div>

          {/* Current Status */}
          <div className="space-y-2">
            <Label>Current Status</Label>
            <div>{getStatusBadge(ad.status)}</div>
          </div>

          {/* Publish Dates Info */}
          <div className="space-y-2">
            <Label>Publish Dates</Label>
            <div className="space-y-1">
              {ad.publishDates?.map((dateStr: string, index: number) => {
                const date = new Date(dateStr);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                date.setHours(0, 0, 0, 0);
                const isFuture = date >= today;
                
                return (
                  <div key={index} className={`text-xs flex items-center gap-2 ${isFuture ? 'text-foreground' : 'text-muted-foreground'}`}>
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(dateStr)}</span>
                    {isFuture && <Badge variant="outline" className="text-xs py-0">Future</Badge>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Status Change */}
          {canEdit ? (
            <div className="space-y-2">
              <Label htmlFor="status">New Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              {nextFutureDate && (
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Next publication: {formatDate(nextFutureDate)}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <AlertCircle className="h-4 w-4" />
                <span className="font-medium">Cannot Edit Status</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {isAdmin 
                  ? "No restrictions for admin users."
                  : "You can only edit status for advertisements with future publish dates."
                }
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!canEdit || selectedStatus === ad.status}
          >
            Update Status
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StatusEditModal;