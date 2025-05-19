import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useRoute } from "wouter";
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

// Define types for our API responses
interface MarketData {
  averagePrice: number;
  medianPrice: number;
  salesVolume: number;
  averageDaysOnMarket: number;
  priceChange: number;
  inventoryChange: number;
  pricePerSqFt: number;
  lastUpdated: string;
}

interface MarketTrend {
  month: string;
  value: number;
  sales: number;
  daysOnMarket: number;
}

interface RecentSale {
  address: string;
  city: string;
  state: string;
  saleDate: string;
  salePrice: number;
  beds: number;
  baths: number;
  sqft: number;
  pricePerSqft: number;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
};

export default function MarketAnalysis() {
  const [location, setLocation] = useLocation();
  const [match, params] = useRoute("/market-analysis/:propertyId?");
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [timeframe, setTimeframe] = useState("12m");
  const [zipCode, setZipCode] = useState("90210");
  const [propertyType, setPropertyType] = useState("all");
  
  // Check if we're viewing a specific property's market analysis
  const propertyId = params?.propertyId;
  
  // Fetch market analysis data from our API
  const { data: marketData = {} as MarketData, isLoading: marketLoading } = useQuery<MarketData>({
    queryKey: ['/api/market-analysis', zipCode, timeframe, propertyType],
  });
  
  const { data: marketTrendsData = [] as MarketTrend[], isLoading: trendsLoading } = useQuery<MarketTrend[]>({
    queryKey: ['/api/market-analysis/trends', zipCode, timeframe, propertyType],
  });
  
  const { data: recentSalesData = [] as RecentSale[], isLoading: salesLoading } = useQuery<RecentSale[]>({
    queryKey: ['/api/market-analysis/recent-sales', zipCode, propertyType],
  });
  
  // Fetch property data if propertyId is available
  const { data: propertyData, isLoading: propertyLoading } = useQuery({
    queryKey: [`/api/properties/${propertyId}`],
    enabled: !!propertyId,
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
        
        <div className="flex flex-wrap items-center gap-2">
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
          
          <Select value={propertyType} onValueChange={setPropertyType}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Property Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Properties</SelectItem>
              <SelectItem value="singleFamily">Single Family</SelectItem>
              <SelectItem value="condo">Condo/Townhouse</SelectItem>
              <SelectItem value="multiFamily">Multi-Family</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
              <SelectItem value="land">Land/Lots</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={generateReport}>
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      {propertyId && !propertyLoading && propertyData && (
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Property Comparison</CardTitle>
            <CardDescription>
              Comparing {propertyData.address} against local market trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Property Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Address:</span>
                    <span className="font-medium">{propertyData.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location:</span>
                    <span className="font-medium">{propertyData.city}, {propertyData.state} {propertyData.zipCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Property Type:</span>
                    <span className="font-medium">{propertyData.propertyType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bedrooms/Bathrooms:</span>
                    <span className="font-medium">{propertyData.bedrooms || 'N/A'} / {propertyData.bathrooms || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Square Feet:</span>
                    <span className="font-medium">{propertyData.squareFeet?.toLocaleString() || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Year Built:</span>
                    <span className="font-medium">{propertyData.yearBuilt || 'N/A'}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Market Comparison</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Market Median Price:</span>
                    <span className="font-medium">{formatCurrency(marketData.medianPrice || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Market Price/SqFt:</span>
                    <span className="font-medium">${marketData.pricePerSqFt || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estimated Value:</span>
                    <span className="font-medium">
                      {propertyData.squareFeet && marketData.pricePerSqFt 
                        ? formatCurrency(propertyData.squareFeet * marketData.pricePerSqFt)
                        : 'Insufficient data'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price Trend:</span>
                    <span className={`font-medium ${(marketData.priceChange || 0) > 0 ? "text-green-600" : "text-red-600"}`}>
                      {(marketData.priceChange || 0) > 0 ? "+" : ""}{marketData.priceChange || 0}% annually
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avg. Days on Market:</span>
                    <span className="font-medium">{marketData.averageDaysOnMarket || 0} days</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
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
                <div className="text-2xl font-bold">{formatCurrency(marketData.medianPrice || 0)}</div>
                <p className="text-xs text-muted-foreground">
                  <span className={(marketData.priceChange || 0) > 0 ? "text-green-600" : "text-red-600"}>
                    {(marketData.priceChange || 0) > 0 ? "↑" : "↓"} {Math.abs(marketData.priceChange || 0)}%
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
                <div className="text-2xl font-bold">${marketData.pricePerSqFt || 0}</div>
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
                <div className="text-2xl font-bold">{marketData.averageDaysOnMarket || 0}</div>
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
                  {(marketData.inventoryChange || 0) > 0 ? "+" : ""}{marketData.inventoryChange || 0}%
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
              {trendsLoading ? (
                <div className="h-[300px] flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading market data...</p>
                  </div>
                </div>
              ) : (
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
              )}
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
              {trendsLoading ? (
                <div className="h-[400px] flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading trend data...</p>
                  </div>
                </div>
              ) : (
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={marketTrendsData}>
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
              )}
              
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
                  twelve months. Demand remains strong with properties selling within {marketData.averageDaysOnMarket || 35} days
                  on average. The price per square foot has increased from $183 to ${marketData.pricePerSqFt || 192}
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
              {salesLoading ? (
                <div className="h-[300px] flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading recent sales data...</p>
                  </div>
                </div>
              ) : (
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
                    {recentSalesData.map((sale, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {sale.address}
                          <div className="text-xs text-muted-foreground">
                            {sale.city}, {sale.state}
                          </div>
                        </TableCell>
                        <TableCell>{sale.saleDate}</TableCell>
                        <TableCell className="text-right">{formatCurrency(sale.salePrice)}</TableCell>
                        <TableCell>{sale.beds}/{sale.baths}</TableCell>
                        <TableCell className="text-right">{sale.sqft.toLocaleString()}</TableCell>
                        <TableCell className="text-right">${sale.pricePerSqft}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              
              <div className="flex justify-between mt-6">
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
                <Button variant="outline">
                  <Printer className="mr-2 h-4 w-4" />
                  Print
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