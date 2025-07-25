export interface AdPublication {
  date: string; // ISO date string (YYYY-MM-DD)
  status: 'scheduled' | 'published' | 'cancelled';
  publishedAt?: string; // ISO timestamp when status changed to published
  cancelledAt?: string; // ISO timestamp when status changed to cancelled
  reason?: string; // Optional reason for cancellation
}

export interface Advertisement {
  id: number;
  title: string;
  category: string;
  content?: string;
  instructions?: string;
  page: string;
  size?: string;
  columns?: string;
  centimeters?: string;
  words?: string;
  clientName: string;
  clientType: 'individual' | 'agency';
  clientContact: string;
  agentName?: string;
  agentContact?: string;
  publications: AdPublication[]; // New structure for date-specific statuses
  priority?: string;
  createdAt: string;
  updatedAt?: string;
  baseAmount?: number;
  gst?: number;
  totalAmount?: number;
  
  // Legacy fields (for backward compatibility during migration)
  publishDates?: string[];
  status?: string;
}

export type AdStatus = 'scheduled' | 'published' | 'cancelled' | 'mixed';