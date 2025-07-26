import { Advertisement } from '@/types/ad';
import { migrateAllAdsInStorage } from './adDataMigration';

// Centralized data service for localStorage management
export class DataService {
  private static instance: DataService;
  private subscribers: Map<string, Set<(data: any) => void>> = new Map();

  static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  // Advertisement data management
  getAds(): Advertisement[] {
    return migrateAllAdsInStorage();
  }

  saveAds(ads: Advertisement[]): void {
    localStorage.setItem('newsprint-ads', JSON.stringify(ads));
    this.notifySubscribers('ads', ads);
  }

  addAd(ad: Advertisement): void {
    const ads = this.getAds();
    ads.push(ad);
    this.saveAds(ads);
  }

  updateAd(adId: number, updates: Partial<Advertisement>): void {
    const ads = this.getAds();
    const updatedAds = ads.map(ad => 
      ad.id === adId ? { ...ad, ...updates, updatedAt: new Date().toISOString() } : ad
    );
    this.saveAds(updatedAds);
  }

  deleteAd(adId: number): void {
    const ads = this.getAds();
    const updatedAds = ads.filter(ad => ad.id !== adId);
    this.saveAds(updatedAds);
  }

  // Page layouts management
  getPageLayouts(): any[] {
    const saved = localStorage.getItem('newsprint-page-layouts');
    if (saved) {
      return JSON.parse(saved);
    }
    
    // Default layouts
    const defaultLayouts = [
      { id: 1, name: "Front Page", value: "front", rate: "2000", active: true, description: "Premium front page placement" },
      { id: 2, name: "Back Page", value: "back", rate: "1500", active: true, description: "High visibility back page" },
      { id: 3, name: "Inner Color", value: "inner-color", rate: "1200", active: true, description: "Color inner pages" },
      { id: 4, name: "Inner B&W", value: "inner-bw", rate: "800", active: true, description: "Black & white inner pages" },
      { id: 5, name: "Classifieds", value: "classifieds", rate: "5", active: true, description: "Classified section (per word)" }
    ];
    
    this.savePageLayouts(defaultLayouts);
    return defaultLayouts;
  }

  savePageLayouts(layouts: any[]): void {
    localStorage.setItem('newsprint-page-layouts', JSON.stringify(layouts));
    this.notifySubscribers('page-layouts', layouts);
  }

  // Users management
  getUsers(): any[] {
    const saved = localStorage.getItem('newsprint-users');
    if (saved) {
      return JSON.parse(saved);
    }
    return [];
  }

  saveUsers(users: any[]): void {
    localStorage.setItem('newsprint-users', JSON.stringify(users));
    this.notifySubscribers('users', users);
  }

  // Subscription system for real-time updates
  subscribe(dataType: string, callback: (data: any) => void): () => void {
    if (!this.subscribers.has(dataType)) {
      this.subscribers.set(dataType, new Set());
    }
    this.subscribers.get(dataType)!.add(callback);

    // Return unsubscribe function
    return () => {
      this.subscribers.get(dataType)?.delete(callback);
    };
  }

  private notifySubscribers(dataType: string, data: any): void {
    const callbacks = this.subscribers.get(dataType);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  // Clean up old localStorage keys to prevent confusion
  cleanupOldData(): void {
    // Remove old keys that might cause confusion
    localStorage.removeItem('userAds');
    
    // Ensure data is in the correct format
    this.getAds(); // This will trigger migration if needed
    this.getPageLayouts(); // This will set defaults if needed
  }
}

// Export singleton instance
export const dataService = DataService.getInstance();