import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar, 
  Eye, 
  MousePointer,
  Users,
  Newspaper,
  Target,
  Activity
} from "lucide-react";
import { useState } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from "recharts";

const Analytics = () => {
  const [timeRange, setTimeRange] = useState("30days");
  const [pageFilter, setPageFilter] = useState("all");

  // Mock analytics data
  const adPerformanceData = [
    { month: "Jan", ads: 24, revenue: 12400, impressions: 15600, clicks: 890 },
    { month: "Feb", ads: 31, revenue: 15100, impressions: 18200, clicks: 1120 },
    { month: "Mar", ads: 28, revenue: 13800, impressions: 17100, clicks: 980 },
    { month: "Apr", ads: 35, revenue: 18500, impressions: 21800, clicks: 1340 },
    { month: "May", ads: 42, revenue: 22100, impressions: 26400, clicks: 1580 },
    { month: "Jun", ads: 38, revenue: 19800, impressions: 23700, clicks: 1420 }
  ];

  const pagePerformanceData = [
    { name: "Front Page", value: 35, color: "#ef4444", revenue: 18500 },
    { name: "Back Page", value: 25, color: "#3b82f6", revenue: 12800 },
    { name: "Inner Color", value: 20, color: "#10b981", revenue: 9200 },
    { name: "Inner B&W", value: 15, color: "#6b7280", revenue: 6400 },
    { name: "Classifieds", value: 5, color: "#f59e0b", revenue: 2100 }
  ];

  const categoryData = [
    { name: "Real Estate", ads: 142, revenue: 28400, growth: 12.5 },
    { name: "Automotive", ads: 98, revenue: 19600, growth: 8.3 },
    { name: "Services", ads: 87, revenue: 15200, growth: -2.1 },
    { name: "Jobs", ads: 156, revenue: 31200, growth: 15.7 },
    { name: "Personal", ads: 234, revenue: 8900, growth: 5.4 }
  ];

  // Client analysis data
  const clientTypeData = [
    { name: "Individual", value: 65, color: "#3b82f6", clients: 234, revenue: 45600, avgRevenue: 195 },
    { name: "Agency", value: 35, color: "#10b981", clients: 87, revenue: 78980, avgRevenue: 908 }
  ];

  const topClientsData = [
    { name: "ABC Digital Agency", type: "Agency", ads: 24, revenue: 12400, lastAd: "2024-01-20" },
    { name: "Prime Motors Ltd", type: "Agency", ads: 18, revenue: 9800, lastAd: "2024-01-18" },
    { name: "Real Estate Pro", type: "Agency", ads: 15, revenue: 8900, lastAd: "2024-01-15" },
    { name: "John Smith", type: "Individual", ads: 12, revenue: 2400, lastAd: "2024-01-22" },
    { name: "Sarah Johnson", type: "Individual", ads: 8, revenue: 1600, lastAd: "2024-01-19" },
    { name: "Maria Garcia", type: "Individual", ads: 6, revenue: 900, lastAd: "2024-01-21" }
  ];

  // Agent analysis data
  const agentPerformanceData = [
    { name: "Mike Wilson", ads: 45, revenue: 23400, clients: 12, avgDeal: 520, commission: 2340 },
    { name: "Lisa Chen", ads: 38, revenue: 19800, clients: 9, avgDeal: 521, commission: 1980 },
    { name: "David Brown", ads: 32, revenue: 16200, clients: 8, avgDeal: 506, commission: 1620 },
    { name: "Emma Davis", ads: 28, revenue: 14600, clients: 7, avgDeal: 521, commission: 1460 },
    { name: "No Agent", ads: 89, revenue: 18900, clients: 45, avgDeal: 212, commission: 0 }
  ];

  const agentTrendsData = [
    { month: "Jan", mike: 3800, lisa: 3200, david: 2900, emma: 2400 },
    { month: "Feb", mike: 4200, lisa: 3600, david: 3100, emma: 2800 },
    { month: "Mar", mike: 3900, lisa: 3400, david: 2800, emma: 2600 },
    { month: "Apr", mike: 4500, lisa: 3800, david: 3300, emma: 3000 },
    { month: "May", mike: 4800, lisa: 4100, david: 3600, emma: 3200 },
    { month: "Jun", mike: 4300, lisa: 3700, david: 3200, emma: 2900 }
  ];

  const weeklyTrends = [
    { day: "Mon", ads: 12, revenue: 2400 },
    { day: "Tue", ads: 19, revenue: 3100 },
    { day: "Wed", ads: 15, revenue: 2800 },
    { day: "Thu", ads: 22, revenue: 3800 },
    { day: "Fri", ads: 18, revenue: 3200 },
    { day: "Sat", ads: 8, revenue: 1600 },
    { day: "Sun", ads: 6, revenue: 1100 }
  ];

  const topMetrics = [
    { 
      label: "Total Revenue", 
      value: "$124,580", 
      change: "+12.5%", 
      trend: "up", 
      icon: DollarSign,
      period: "This month" 
    },
    { 
      label: "Total Ads", 
      value: "847", 
      change: "+8.2%", 
      trend: "up", 
      icon: Newspaper,
      period: "This month" 
    },
    { 
      label: "Click Through Rate", 
      value: "4.8%", 
      change: "-0.3%", 
      trend: "down", 
      icon: MousePointer,
      period: "Average" 
    },
    { 
      label: "Active Clients", 
      value: "156", 
      change: "+15.1%", 
      trend: "up", 
      icon: Users,
      period: "This month" 
    }
  ];

  const getGrowthBadge = (growth: number) => {
    if (growth > 0) {
      return (
        <Badge className="bg-success/10 text-success border-success/20">
          <TrendingUp className="h-3 w-3 mr-1" />
          +{growth}%
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-destructive/10 text-destructive border-destructive/20">
          <TrendingDown className="h-3 w-3 mr-1" />
          {growth}%
        </Badge>
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground">Track advertisement performance and insights</p>
        </div>
        <div className="flex gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="6months">Last 6 months</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
              <SelectItem value="yearly">Yearly Analysis</SelectItem>
            </SelectContent>
          </Select>
          <Select value={pageFilter} onValueChange={setPageFilter}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Pages</SelectItem>
              <SelectItem value="front">Front Page</SelectItem>
              <SelectItem value="back">Back Page</SelectItem>
              <SelectItem value="inner-color">Inner Color</SelectItem>
              <SelectItem value="inner-bw">Inner B&W</SelectItem>
              <SelectItem value="classifieds">Classifieds</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {topMetrics.map((metric, index) => (
          <Card key={index} className="shadow-card hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <metric.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{metric.label}</p>
                    <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`flex items-center text-sm ${
                    metric.trend === "up" ? "text-success" : "text-destructive"
                  }`}>
                    {metric.trend === "up" ? (
                      <TrendingUp className="h-4 w-4 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 mr-1" />
                    )}
                    {metric.change}
                  </div>
                  <p className="text-xs text-muted-foreground">{metric.period}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Revenue Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={adPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="month" 
                  className="text-xs fill-muted-foreground"
                />
                <YAxis className="text-xs fill-muted-foreground" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary) / 0.1)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Ads Published */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Newspaper className="h-5 w-5 text-primary" />
              Ads Published
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={adPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="month" 
                  className="text-xs fill-muted-foreground"
                />
                <YAxis className="text-xs fill-muted-foreground" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar 
                  dataKey="ads" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Page Performance and Weekly Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Page Performance */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Page Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pagePerformanceData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                    labelLine={false}
                  >
                    {pagePerformanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {pagePerformanceData.map((page, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: page.color }}
                      />
                      <span className="text-foreground">{page.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-medium text-foreground">${page.revenue.toLocaleString()}</span>
                      <span className="text-muted-foreground ml-2">({page.value}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Trends */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Weekly Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyTrends}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="day" 
                  className="text-xs fill-muted-foreground"
                />
                <YAxis className="text-xs fill-muted-foreground" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="ads" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Category Performance Table */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Category Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium text-foreground">Category</th>
                  <th className="text-right p-4 font-medium text-foreground">Total Ads</th>
                  <th className="text-right p-4 font-medium text-foreground">Revenue</th>
                  <th className="text-right p-4 font-medium text-foreground">Growth</th>
                  <th className="text-right p-4 font-medium text-foreground">Avg. Revenue</th>
                </tr>
              </thead>
              <tbody>
                {categoryData.map((category, index) => (
                  <tr key={index} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <span className="font-medium text-foreground">{category.name}</span>
                    </td>
                    <td className="p-4 text-right text-foreground">{category.ads}</td>
                    <td className="p-4 text-right text-foreground">
                      ${category.revenue.toLocaleString()}
                    </td>
                    <td className="p-4 text-right">
                      {getGrowthBadge(category.growth)}
                    </td>
                    <td className="p-4 text-right text-foreground">
                      ${Math.round(category.revenue / category.ads)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Client Analysis Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Client Analysis
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Client Type Distribution */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Client Type Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={clientTypeData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                      labelLine={false}
                    >
                      {clientTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-3">
                  {clientTypeData.map((type, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: type.color }}
                        />
                        <div>
                          <span className="font-medium text-foreground">{type.name}</span>
                          <p className="text-sm text-muted-foreground">{type.clients} clients</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-foreground">${type.revenue.toLocaleString()}</span>
                        <p className="text-sm text-muted-foreground">Avg: ${type.avgRevenue}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Clients */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Top Performing Clients
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="text-left p-3 font-medium text-sm text-foreground">Client</th>
                      <th className="text-right p-3 font-medium text-sm text-foreground">Ads</th>
                      <th className="text-right p-3 font-medium text-sm text-foreground">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topClientsData.map((client, index) => (
                      <tr key={index} className="border-b hover:bg-muted/30 transition-colors">
                        <td className="p-3">
                          <div>
                            <p className="font-medium text-foreground text-sm">{client.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${
                                  client.type === "Agency" 
                                    ? "bg-green-100 text-green-800" 
                                    : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {client.type}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                Last: {new Date(client.lastAd).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-right text-sm text-foreground">{client.ads}</td>
                        <td className="p-3 text-right text-sm font-medium text-foreground">
                          ${client.revenue.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Agent Analysis Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Agent Performance Analysis
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Agent Revenue Trends */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Agent Revenue Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={agentTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="month" 
                    className="text-xs fill-muted-foreground"
                  />
                  <YAxis className="text-xs fill-muted-foreground" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="mike" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Mike Wilson"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="lisa" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="Lisa Chen"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="david" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    name="David Brown"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="emma" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    name="Emma Davis"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Agent Performance Table */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Agent Performance Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="text-left p-3 font-medium text-sm text-foreground">Agent</th>
                      <th className="text-right p-3 font-medium text-sm text-foreground">Ads</th>
                      <th className="text-right p-3 font-medium text-sm text-foreground">Revenue</th>
                      <th className="text-right p-3 font-medium text-sm text-foreground">Avg Deal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agentPerformanceData.map((agent, index) => (
                      <tr key={index} className="border-b hover:bg-muted/30 transition-colors">
                        <td className="p-3">
                          <div>
                            <p className="font-medium text-foreground text-sm">{agent.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {agent.name === "No Agent" ? "Direct clients" : `${agent.clients} clients`}
                            </p>
                          </div>
                        </td>
                        <td className="p-3 text-right text-sm text-foreground">{agent.ads}</td>
                        <td className="p-3 text-right text-sm font-medium text-foreground">
                          ${agent.revenue.toLocaleString()}
                        </td>
                        <td className="p-3 text-right text-sm text-foreground">
                          ${agent.avgDeal}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Agent Commission Summary */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Commission Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={agentPerformanceData.filter(agent => agent.name !== "No Agent")}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="name" 
                  className="text-xs fill-muted-foreground"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis className="text-xs fill-muted-foreground" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar 
                  dataKey="commission" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]}
                  name="Commission ($)"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;