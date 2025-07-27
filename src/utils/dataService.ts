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

  // Clients management
  getClients(): any[] {
    const saved = localStorage.getItem('newsprint-clients');
    if (saved) {
      return JSON.parse(saved);
    }
    
    // Default clients
    const defaultClients = [
      { id: 1, name: "John Smith", type: "individual", contact: "+1-555-0101", email: "john@email.com", gst: "" },
      { id: 2, name: "ABC Real Estate", type: "agency", contact: "+1-555-0102", email: "info@abcrealty.com", gst: "27ABCDE1234F1Z5" },
      { id: 3, name: "Sarah Johnson", type: "individual", contact: "+1-555-0103", email: "sarah@email.com", gst: "" },
      { id: 4, name: "Prime Motors Ltd", type: "agency", contact: "+1-555-0104", email: "sales@primemotors.com", gst: "29XYZAB5678C1D9" },
      { id: 5, name: "John Miller", type: "individual", contact: "+1-555-0105", email: "jmiller@email.com", gst: "" }
    ];
    
    this.saveClients(defaultClients);
    return defaultClients;
  }

  saveClients(clients: any[]): void {
    localStorage.setItem('newsprint-clients', JSON.stringify(clients));
    this.notifySubscribers('clients', clients);
  }

  addClient(client: any): void {
    const clients = this.getClients();
    const newClient = { ...client, id: Math.max(...clients.map(c => c.id)) + 1 };
    clients.push(newClient);
    this.saveClients(clients);
  }

  updateClient(clientId: number, updates: any): void {
    const clients = this.getClients();
    const updatedClients = clients.map(client => 
      client.id === clientId ? { ...client, ...updates } : client
    );
    this.saveClients(updatedClients);
  }

  deleteClient(clientId: number): void {
    const clients = this.getClients();
    const updatedClients = clients.filter(client => client.id !== clientId);
    this.saveClients(updatedClients);
  }

  // Agents management
  getAgents(): any[] {
    const saved = localStorage.getItem('newsprint-agents');
    if (saved) {
      return JSON.parse(saved);
    }
    
    // Default agents
    const defaultAgents = [
      { id: 1, name: "Mike Wilson", contact: "+1-555-0201", email: "mike@newsagency.com", agency: "News Agency Pro", gst: "27AGENT1234F5Z7" },
      { id: 2, name: "Lisa Chen", contact: "+1-555-0202", email: "lisa@adpartners.com", agency: "Ad Partners", gst: "29AGENT5678C9D1" },
      { id: 3, name: "David Brown", contact: "+1-555-0203", email: "david@mediagroup.com", agency: "Media Group", gst: "" },
      { id: 4, name: "Emily Wilson", contact: "+1-555-0204", email: "emily@newsagency.com", agency: "News Agency Pro", gst: "27AGENT1234F5Z7" },
      { id: 5, name: "Michael Torres", contact: "+1-555-0205", email: "mtorres@adpartners.com", agency: "Ad Partners", gst: "29AGENT5678C9D1" }
    ];
    
    this.saveAgents(defaultAgents);
    return defaultAgents;
  }

  saveAgents(agents: any[]): void {
    localStorage.setItem('newsprint-agents', JSON.stringify(agents));
    this.notifySubscribers('agents', agents);
  }

  addAgent(agent: any): void {
    const agents = this.getAgents();
    const newAgent = { ...agent, id: Math.max(...agents.map(a => a.id)) + 1 };
    agents.push(newAgent);
    this.saveAgents(agents);
  }

  updateAgent(agentId: number, updates: any): void {
    const agents = this.getAgents();
    const updatedAgents = agents.map(agent => 
      agent.id === agentId ? { ...agent, ...updates } : agent
    );
    this.saveAgents(updatedAgents);
  }

  deleteAgent(agentId: number): void {
    const agents = this.getAgents();
    const updatedAgents = agents.filter(agent => agent.id !== agentId);
    this.saveAgents(updatedAgents);
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