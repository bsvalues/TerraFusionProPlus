import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CircleDollarSign, 
  TrendingUp, 
  Home, 
  Calendar, 
  Map, 
  BarChart3,
  FileText,
  Download,
  Printer
} from "lucide-react";

// Sample market data
const marketTrends = [
  { month: 'Jan', value: 320000, sales: 24, daysOnMarket: 45 },
  { month: 'Feb', value: 325000, sales: 28, daysOnMarket: 42 },
  { month: 'Mar', value: 330000, sales: 32, daysOnMarket: 38 },
  { month: 'Apr', value: 335000, sales: 35, daysOnMarket: 35 },
  { month: 'May', value: 338000, sales: 30, daysOnMarket: 32 },
  { month: 'Jun', value: 342000, sales: 36, daysOnMarket: 30 },
  { month: 'Jul', value: 350000, sales: 40, daysOnMarket: 28 },
  { month: 'Aug', value: 355000, sales: 38, daysOnMarket: 30 },
  { month: 'Sep', value: 360000, sales: 35, daysOnMarket: 32 },
  { month: 'Oct', value: 358000, sales: 32, daysOnMarket: 34 },
  { month: 'Nov', value: 355000, sales: 28, daysOnMarket: 36 },
  { month: 'Dec', value: 352000, sales: 25, daysOnMarket: 40 },
];

const recentSales = [
  { 
    address: "125 Oak Drive", 
    city: "Westwood", 
    state: "CA", 
    saleDate: "2023-11-15", 
    salePrice: 375000, 
    beds: 3, 
    baths: 2, 
    sqft: 1850, 
    pricePerSqft: 203
  },
  { 
    address: "47 Maple Ave", 
    city: "Westwood", 
    state: "CA", 
    saleDate: "2023-11-02", 
    salePrice: 410000, 
    beds: 4, 
    baths: 2.5, 
    sqft: 2200, 
    pricePerSqft: 186
  },
  { 
    address: "892 Pine St", 
    city: "Westwood", 
    state: "CA", 
    saleDate: "2023-10-28", 
    salePrice: 342000, 
    beds: 3, 
    baths: 2, 
    sqft: 1750, 
    pricePerSqft: 195
  },
  { 
    address: "1432 Cedar Ln", 
    city: "Westwood", 
    state: "CA", 
    saleDate: "2023-10-15", 
    salePrice: 398000, 
    beds: 3, 
    baths: 2.5, 
    sqft: 2100, 
    pricePerSqft: 190
  },
  { 
    address: "542 Redwood Ct", 
    city: "Westwood", 
    state: "CA", 
    saleDate: "2023-10-05", 
    salePrice: 425000, 
    beds: 4, 
    baths: 3, 
    sqft: 2350, 
    pricePerSqft: 181
  },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
};

export default function MarketAnalysis() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [timeframe, setTimeframe] = useState("12m");
  const [zipCode, setZipCode] = useState("90210");
  
  // Fetch market analysis data from our API
  const { data: marketData = {}, isLoading: marketLoading } = useQuery({
    queryKey: ['/api/market-analysis', zipCode, timeframe],
  });
  
  const { data: marketTrendsData = [], isLoading: trendsLoading } = useQuery({
    queryKey: ['/api/market-analysis/trends', zipCode, timeframe],
  });
  
  const { data: recentSalesData = [], isLoading: salesLoading } = useQuery({
    queryKey: ['/api/market-analysis/recent-sales', zipCode],
  });
  
  const generateReport = () => {
    toast({
      title: "Report Generated",
      description: "Your market analysis report is ready to download.",
    });
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Market Analysis</h1>
          <p className="text-muted-foreground">
            Real estate trends and comparable sales data for your area
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Input
            className="w-24 md:w-32"
            placeholder="ZIP Code"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
          />
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3m">3 Months</SelectItem>
              <SelectItem value="6m">6 Months</SelectItem>
              <SelectItem value="12m">12 Months</SelectItem>
              <SelectItem value="24m">24 Months</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={generateReport}>
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 md:w-[400px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Price Trends</TabsTrigger>
          <TabsTrigger value="comps">Recent Sales</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Median Sale Price
                </CardTitle>
                <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(marketData.medianPrice)}</div>
                <p className="text-xs text-muted-foreground">
                  <span className={marketData.priceChange > 0 ? "text-green-600" : "text-red-600"}>
                    {marketData.priceChange > 0 ? "↑" : "↓"} {Math.abs(marketData.priceChange)}%
                  </span> from last year
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Price Per Sq Ft
                </CardTitle>
                <Home className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${marketData.pricePerSqFt}</div>
                <p className="text-xs text-muted-foreground">
                  Average for {zipCode} area
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Days on Market
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{marketData.averageDaysOnMarket}</div>
                <p className="text-xs text-muted-foreground">
                  Average time to sell
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Inventory Change
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {marketData.inventoryChange > 0 ? "+" : ""}{marketData.inventoryChange}%
                </div>
                <p className="text-xs text-muted-foreground">
                  From previous period
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Market Summary</CardTitle>
              <CardDescription>
                Price trends for the past 12 months in {zipCode}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={marketTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis 
                      yAxisId="left"
                      orientation="left" 
                      tickFormatter={(value) => `$${value/1000}k`}
                    />
                    <YAxis 
                      yAxisId="right"
                      orientation="right" 
                      tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip 
                      formatter={(value, name) => {
                        if (name === "value") return formatCurrency(value as number);
                        return value;
                      }}
                    />
                    <Legend />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="value" 
                      name="Median Price" 
                      stroke="#8884d8" 
                      activeDot={{ r: 8 }} 
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="daysOnMarket" 
                      name="Days on Market" 
                      stroke="#82ca9d" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Price Trends Tab */}
        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Price Trends</CardTitle>
              <CardDescription>
                Historical market value changes over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={marketTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `$${value/1000}k`} />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Legend />
                    <Bar dataKey="value" name="Median Sale Price" fill="#8884d8" />
                    <Bar dataKey="sales" name="Number of Sales" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Year-Over-Year</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">+4.2%</div>
                      <p className="text-xs text-muted-foreground">
                        Price appreciation since last year
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">5-Year Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">+18.5%</div>
                      <p className="text-xs text-muted-foreground">
                        Cumulative growth since 2018
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Forecast</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">+2.8%</div>
                      <p className="text-xs text-muted-foreground">
                        Projected growth over next 12 months
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  The market in ZIP code {zipCode} has shown consistent growth over the past
                  twelve months. Demand remains strong with properties selling within {marketData.averageDaysOnMarket} days
                  on average. The price per square foot has increased from $183 to ${marketData.pricePerSqFt}
                  during this period.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Comparables Tab */}
        <TabsContent value="comps" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
              <CardDescription>
                Comparable properties sold in your market area
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Address</TableHead>
                    <TableHead>Sale Date</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead>Beds/Baths</TableHead>
                    <TableHead className="text-right">Sq Ft</TableHead>
                    <TableHead className="text-right">$/Sq Ft</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentSales.map((sale, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {sale.address}
                        <div className="text-xs text-muted-foreground">
                          {sale.city}, {sale.state}
                        </div>
                      </TableCell>
                      <TableCell>{format(new Date(sale.saleDate), "MM/dd/yyyy")}</TableCell>
                      <TableCell className="text-right">{formatCurrency(sale.salePrice)}</TableCell>
                      <TableCell>{sale.beds}/{sale.baths}</TableCell>
                      <TableCell className="text-right">{sale.sqft.toLocaleString()}</TableCell>
                      <TableCell className="text-right">${sale.pricePerSqft}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <div className="mt-4 flex justify-end space-x-2">
                <Button variant="outline" size="sm">
                  <Printer className="mr-2 h-4 w-4" />
                  Print
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
              
              <div className="mt-6 p-4 bg-muted rounded-md">
                <h3 className="font-medium mb-2">Analysis Notes</h3>
                <p className="text-sm text-muted-foreground">
                  The comparable sales in this area indicate a stable market with consistent pricing.
                  Properties with recent renovations or premium features (updated kitchens, finished basements,
                  larger lots) are commanding 5-10% price premiums. Based on this data, the subject property 
                  falls within the middle range of the current market in terms of per-square-foot value.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end">
        <Button 
          onClick={() => setLocation("/appraisals")}
          variant="outline"
        >
          Back to Appraisals
        </Button>
      </div>
    </div>
  );
}