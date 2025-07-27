import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Edit, Plus, User, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { dataService } from "@/utils/dataService";

const ClientAgentManagement = () => {
  const { toast } = useToast();
  const [clients, setClients] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [editingClient, setEditingClient] = useState<any>(null);
  const [editingAgent, setEditingAgent] = useState<any>(null);
  const [showClientDialog, setShowClientDialog] = useState(false);
  const [showAgentDialog, setShowAgentDialog] = useState(false);

  const [clientForm, setClientForm] = useState({
    name: "",
    type: "individual",
    contact: "",
    email: "",
    gst: ""
  });

  const [agentForm, setAgentForm] = useState({
    name: "",
    contact: "",
    email: "",
    agency: "",
    gst: ""
  });

  useEffect(() => {
    // Load initial data
    setClients(dataService.getClients());
    setAgents(dataService.getAgents());

    // Subscribe to updates
    const unsubscribeClients = dataService.subscribe('clients', setClients);
    const unsubscribeAgents = dataService.subscribe('agents', setAgents);

    return () => {
      unsubscribeClients();
      unsubscribeAgents();
    };
  }, []);

  const handleSaveClient = () => {
    if (!clientForm.name.trim() || !clientForm.contact.trim()) {
      toast({
        title: "Error",
        description: "Name and contact are required fields",
        variant: "destructive"
      });
      return;
    }

    if (editingClient) {
      dataService.updateClient(editingClient.id, clientForm);
      toast({
        title: "Success",
        description: "Client updated successfully"
      });
    } else {
      dataService.addClient(clientForm);
      toast({
        title: "Success",
        description: "Client added successfully"
      });
    }

    resetClientForm();
    setShowClientDialog(false);
  };

  const handleSaveAgent = () => {
    if (!agentForm.name.trim() || !agentForm.contact.trim()) {
      toast({
        title: "Error",
        description: "Name and contact are required fields",
        variant: "destructive"
      });
      return;
    }

    if (editingAgent) {
      dataService.updateAgent(editingAgent.id, agentForm);
      toast({
        title: "Success",
        description: "Agent updated successfully"
      });
    } else {
      dataService.addAgent(agentForm);
      toast({
        title: "Success",
        description: "Agent added successfully"
      });
    }

    resetAgentForm();
    setShowAgentDialog(false);
  };

  const handleDeleteClient = (clientId: number) => {
    if (confirm("Are you sure you want to delete this client?")) {
      dataService.deleteClient(clientId);
      toast({
        title: "Success",
        description: "Client deleted successfully"
      });
    }
  };

  const handleDeleteAgent = (agentId: number) => {
    if (confirm("Are you sure you want to delete this agent?")) {
      dataService.deleteAgent(agentId);
      toast({
        title: "Success",
        description: "Agent deleted successfully"
      });
    }
  };

  const handleEditClient = (client: any) => {
    setEditingClient(client);
    setClientForm({
      name: client.name,
      type: client.type,
      contact: client.contact,
      email: client.email || "",
      gst: client.gst || ""
    });
    setShowClientDialog(true);
  };

  const handleEditAgent = (agent: any) => {
    setEditingAgent(agent);
    setAgentForm({
      name: agent.name,
      contact: agent.contact,
      email: agent.email || "",
      agency: agent.agency || "",
      gst: agent.gst || ""
    });
    setShowAgentDialog(true);
  };

  const resetClientForm = () => {
    setEditingClient(null);
    setClientForm({
      name: "",
      type: "individual",
      contact: "",
      email: "",
      gst: ""
    });
  };

  const resetAgentForm = () => {
    setEditingAgent(null);
    setAgentForm({
      name: "",
      contact: "",
      email: "",
      agency: "",
      gst: ""
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Client & Agent Management</h1>
        <p className="text-muted-foreground">
          Manage your clients and agents database for easy access when creating advertisements
        </p>
      </div>

      <Tabs defaultValue="clients" className="space-y-4">
        <TabsList>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="agents">Agents</TabsTrigger>
        </TabsList>

        <TabsContent value="clients" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold">Clients</h2>
              <p className="text-muted-foreground">Manage your client database</p>
            </div>
            <Dialog open={showClientDialog} onOpenChange={setShowClientDialog}>
              <DialogTrigger asChild>
                <Button onClick={resetClientForm}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Client
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingClient ? "Edit Client" : "Add New Client"}</DialogTitle>
                  <DialogDescription>
                    {editingClient ? "Update client information" : "Add a new client to your database"}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="clientName">Name *</Label>
                    <Input
                      id="clientName"
                      value={clientForm.name}
                      onChange={(e) => setClientForm({...clientForm, name: e.target.value})}
                      placeholder="Client name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="clientType">Type</Label>
                    <Select value={clientForm.type} onValueChange={(value) => setClientForm({...clientForm, type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="individual">Individual</SelectItem>
                        <SelectItem value="agency">Agency</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="clientContact">Contact *</Label>
                    <Input
                      id="clientContact"
                      value={clientForm.contact}
                      onChange={(e) => setClientForm({...clientForm, contact: e.target.value})}
                      placeholder="Phone number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="clientEmail">Email</Label>
                    <Input
                      id="clientEmail"
                      type="email"
                      value={clientForm.email}
                      onChange={(e) => setClientForm({...clientForm, email: e.target.value})}
                      placeholder="Email address"
                    />
                  </div>
                  <div>
                    <Label htmlFor="clientGst">GST Number</Label>
                    <Input
                      id="clientGst"
                      value={clientForm.gst}
                      onChange={(e) => setClientForm({...clientForm, gst: e.target.value})}
                      placeholder="GST number (optional)"
                      maxLength={15}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowClientDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveClient}>
                    {editingClient ? "Update" : "Add"} Client
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>GST</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">{client.name}</TableCell>
                      <TableCell>
                        <Badge variant={client.type === 'individual' ? 'default' : 'secondary'}>
                          {client.type === 'individual' ? (
                            <><User className="w-3 h-3 mr-1" /> Individual</>
                          ) : (
                            <><Building className="w-3 h-3 mr-1" /> Agency</>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>{client.contact}</TableCell>
                      <TableCell>{client.email || "-"}</TableCell>
                      <TableCell>{client.gst || "-"}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditClient(client)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteClient(client.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agents" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold">Agents</h2>
              <p className="text-muted-foreground">Manage your agent database</p>
            </div>
            <Dialog open={showAgentDialog} onOpenChange={setShowAgentDialog}>
              <DialogTrigger asChild>
                <Button onClick={resetAgentForm}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Agent
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingAgent ? "Edit Agent" : "Add New Agent"}</DialogTitle>
                  <DialogDescription>
                    {editingAgent ? "Update agent information" : "Add a new agent to your database"}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="agentName">Name *</Label>
                    <Input
                      id="agentName"
                      value={agentForm.name}
                      onChange={(e) => setAgentForm({...agentForm, name: e.target.value})}
                      placeholder="Agent name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="agentContact">Contact *</Label>
                    <Input
                      id="agentContact"
                      value={agentForm.contact}
                      onChange={(e) => setAgentForm({...agentForm, contact: e.target.value})}
                      placeholder="Phone number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="agentEmail">Email</Label>
                    <Input
                      id="agentEmail"
                      type="email"
                      value={agentForm.email}
                      onChange={(e) => setAgentForm({...agentForm, email: e.target.value})}
                      placeholder="Email address"
                    />
                  </div>
                  <div>
                    <Label htmlFor="agentAgency">Agency</Label>
                    <Input
                      id="agentAgency"
                      value={agentForm.agency}
                      onChange={(e) => setAgentForm({...agentForm, agency: e.target.value})}
                      placeholder="Agency name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="agentGst">GST Number</Label>
                    <Input
                      id="agentGst"
                      value={agentForm.gst}
                      onChange={(e) => setAgentForm({...agentForm, gst: e.target.value})}
                      placeholder="GST number (optional)"
                      maxLength={15}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowAgentDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveAgent}>
                    {editingAgent ? "Update" : "Add"} Agent
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Agency</TableHead>
                    <TableHead>GST</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {agents.map((agent) => (
                    <TableRow key={agent.id}>
                      <TableCell className="font-medium">{agent.name}</TableCell>
                      <TableCell>{agent.contact}</TableCell>
                      <TableCell>{agent.email || "-"}</TableCell>
                      <TableCell>{agent.agency || "-"}</TableCell>
                      <TableCell>{agent.gst || "-"}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditAgent(agent)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteAgent(agent.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientAgentManagement;