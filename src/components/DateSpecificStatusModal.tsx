import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Calendar, Clock, CheckCircle, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";
import { Advertisement, AdPublication } from "@/types/ad";
import { getEditablePublications } from "@/utils/adDataMigration";

interface DateSpecificStatusModalProps {
  ad: Advertisement;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedAd: Advertisement) => void;
  isAdmin?: boolean;
}

const DateSpecificStatusModal = ({ ad, isOpen, onClose, onSave, isAdmin = false }: DateSpecificStatusModalProps) => {
  const { toast } = useToast();
  const [publications, setPublications] = useState<AdPublication[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize publications when modal opens
  useEffect(() => {
    if (ad && isOpen) {
      setPublications([...ad.publications]);
      setHasChanges(false);
    }
  }, [ad, isOpen]);

  // Get editable publications (future dates only for non-admin)
  const editablePublications = isAdmin ? publications : getEditablePublications(ad);
  const editableDates = editablePublications.map(pub => pub.date);

  const updatePublicationStatus = (date: string, newStatus: 'scheduled' | 'cancelled', reason?: string) => {
    const updatedPublications = publications.map(pub => {
      if (pub.date === date) {
        const now = new Date().toISOString();
        return {
          ...pub,
          status: newStatus,
          publishedAt: undefined, // Clear published timestamp when changing status
          cancelledAt: newStatus === 'cancelled' ? now : undefined,
          reason: newStatus === 'cancelled' ? reason : undefined
        };
      }
      return pub;
    });
    
    setPublications(updatedPublications);
    setHasChanges(true);
  };

  const handleSave = () => {
    const updatedAd: Advertisement = {
      ...ad,
      publications,
      updatedAt: new Date().toISOString()
    };

    onSave(updatedAd);
    
    const changedCount = publications.filter((pub, index) => 
      JSON.stringify(pub) !== JSON.stringify(ad.publications[index])
    ).length;

    toast({
      title: "Publication Status Updated",
      description: `Updated ${changedCount} publication date${changedCount !== 1 ? 's' : ''}.`,
    });
    
    onClose();
  };

  const handleCancel = () => {
    setPublications([...ad.publications]);
    setHasChanges(false);
    onClose();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Scheduled</Badge>;
      case "published":
        return <Badge variant="default"><CheckCircle className="h-3 w-3 mr-1" />Published</Badge>;
      case "cancelled":
        return <Badge variant="destructive"><X className="h-3 w-3 mr-1" />Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const isDateEditable = (date: string) => {
    if (isAdmin) return true;
    return editableDates.includes(date);
  };

  if (!ad) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Publication Status</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Ad Info */}
          <div className="space-y-2">
            <div className="font-medium text-sm text-muted-foreground">Advertisement</div>
            <div className="font-semibold">{ad.title}</div>
            <div className="text-sm text-muted-foreground">{ad.category}</div>
          </div>

          {/* Publication Dates */}
          <div className="space-y-4">
            <Label>Publication Dates & Status</Label>
            
            {publications.map((publication, index) => {
              const isEditable = isDateEditable(publication.date);
              const pubDate = new Date(publication.date);
              const yesterday = new Date();
              yesterday.setDate(yesterday.getDate() - 1);
              yesterday.setHours(23, 59, 59, 999);
              pubDate.setHours(0, 0, 0, 0);
              const isFuture = pubDate > yesterday;

              return (
                <div key={publication.date} className={`border rounded-lg p-4 space-y-3 ${
                  isEditable ? 'border-border' : 'border-muted bg-muted/20'
                }`}>
                  {/* Date Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span className="font-medium">{formatDate(publication.date)}</span>
                      {isFuture ? (
                        <Badge variant="outline" className="text-xs">Future</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">Past</Badge>
                      )}
                    </div>
                    {getStatusBadge(publication.status)}
                  </div>

                  {/* Status Control */}
                  {isEditable ? (
                    <div className="space-y-2">
                      <Label className="text-sm">Status</Label>
                      <Select 
                        value={publication.status} 
                        onValueChange={(value: 'scheduled' | 'cancelled') => 
                          updatePublicationStatus(publication.date, value)
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      {/* Reason for cancellation */}
                      {publication.status === 'cancelled' && (
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Cancellation Reason</Label>
                          <Textarea
                            placeholder="Optional reason for cancellation..."
                            value={publication.reason || ''}
                            onChange={(e) => {
                              const updatedPublications = publications.map(pub => 
                                pub.date === publication.date 
                                  ? { ...pub, reason: e.target.value }
                                  : pub
                              );
                              setPublications(updatedPublications);
                              setHasChanges(true);
                            }}
                            className="text-xs"
                            rows={2}
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {isAdmin ? 'Status cannot be changed for past dates' : 'You can only edit future publication dates'}
                    </div>
                  )}

                  {/* Timestamps */}
                  {(publication.publishedAt || publication.cancelledAt) && (
                    <div className="text-xs text-muted-foreground space-y-1">
                      {publication.publishedAt && (
                        <div>Published: {new Date(publication.publishedAt).toLocaleString()}</div>
                      )}
                      {publication.cancelledAt && (
                        <div>Cancelled: {new Date(publication.cancelledAt).toLocaleString()}</div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Info message */}
          {!isAdmin && editablePublications.length === 0 && (
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <AlertCircle className="h-4 w-4" />
                <span className="font-medium">No Editable Publications</span>
              </div>
              <div className="text-sm text-muted-foreground">
                You can only edit status for publications with dates greater than yesterday. This ad has no upcoming publications.
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
            disabled={!hasChanges}
          >
            Update Publications
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DateSpecificStatusModal;