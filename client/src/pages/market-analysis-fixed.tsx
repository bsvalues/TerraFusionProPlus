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
  Printer,
  Activity,
  ArrowLeft
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

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  percentChange?: number;
}

function StatCard({ title, value, icon, percentChange }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        <div className="h-4 w-4 text-muted-foreground">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {percentChange !== undefined && (
          <p className="text-xs text-muted-foreground">
            <span className={percentChange > 0 ? "text-green-600" : "text-red-600"}>
              {percentChange > 0 ? "↑" : "↓"} {Math.abs(percentChange)}%
            </span> from previous period
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export default function MarketAnalysis() {
  const [location, setLocation] = useLocation();
  const [match, params] = useRoute("/market-analysis/:propertyId?");
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [timeframe, setTimeframe] = useState("12m");
  const [zipCode, setZipCode] = useState("90210");
  const [propertyType, setPropertyType] = useState("all");
  
  // State for property valuation calculator
  const [calculatorValues, setCalculatorValues] = useState({
    squareFeet: 2000,
    bedrooms: 3,
    bathrooms: 2,
    yearBuilt: 2000
  });
  
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
  
  // Calculate estimated value based on calculator inputs
  const calculateEstimatedValue = () => {
    const { squareFeet, bedrooms, bathrooms, yearBuilt } = calculatorValues;
    const currentYear = new Date().getFullYear();
    
    if (!squareFeet) return formatCurrency(0);
    
    // Base calculation using price per square foot
    let baseValue = squareFeet * (marketData.pricePerSqFt || 200);
    
    // Adjustments based on bedrooms (more bedrooms typically increase value)
    if (bedrooms > 2) {
      baseValue *= (1 + ((bedrooms - 2) * 0.05));
    }
    
    // Adjustments based on bathrooms
    if (bathrooms > 1.5) {
      baseValue *= (1 + ((bathrooms - 1.5) * 0.04));
    }
    
    // Age adjustment (newer properties are typically more valuable)
    if (yearBuilt > 0) {
      const age = currentYear - yearBuilt;
      if (age < 5) {
        baseValue *= 1.15; // Premium for new construction
      } else if (age < 20) {
        baseValue *= 1.05; // Slight premium for newer properties
      } else if (age > 50) {
        baseValue *= 0.85; // Discount for older properties unless historic
      }
    }
    
    return formatCurrency(baseValue);
  };

  const generateReport = () => {
    toast({
      title: "Report Generated",
      description: "Your market analysis report is ready to download.",
    });
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-2">
          {propertyId && (
            <Button 
              variant="outline" 
              size="sm" 
              className="mr-2"
              onClick={() => setLocation("/properties")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Properties
            </Button>
          )}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Market Analysis</h1>
            <p className="text-muted-foreground">
              Real estate trends and comparable sales data for your area
            </p>
          </div>
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
                  
                  {/* Visual Comparison */}
                  {propertyData.squareFeet && marketData.pricePerSqFt && (
                    <div className="pt-4 mt-4 border-t">
                      <h4 className="text-sm font-medium mb-2">Value Comparison</h4>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Market Median</span>
                            <span>{formatCurrency(marketData.medianPrice || 0)}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-primary h-2.5 rounded-full" 
                              style={{ width: '50%' }}
                            ></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Estimated Value</span>
                            <span>{formatCurrency(propertyData.squareFeet * marketData.pricePerSqFt)}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-secondary h-2.5 rounded-full" 
                              style={{ 
                                width: `${Math.min(100, (propertyData.squareFeet * marketData.pricePerSqFt) / marketData.medianPrice * 50)}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
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
            <StatCard 
              title="Average Price" 
              value={formatCurrency(marketData.averagePrice || 0)} 
              icon={<CircleDollarSign />}
              percentChange={marketData.priceChange}
            />
            <StatCard 
              title="Price Per SqFt" 
              value={`$${marketData.pricePerSqFt || 0}`} 
              icon={<Home />}
            />
            <StatCard 
              title="Days on Market" 
              value={`${marketData.averageDaysOnMarket || 0}`} 
              icon={<Calendar />}
            />
            <StatCard 
              title="Inventory Change" 
              value={`${(marketData.inventoryChange || 0) > 0 ? "+" : ""}${marketData.inventoryChange || 0}%`} 
              icon={<Activity />}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Market Summary Card */}
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
            
            {/* Property Valuation Calculator */}
            <Card>
              <CardHeader>
                <CardTitle>Property Valuation Calculator</CardTitle>
                <CardDescription>
                  Estimate property value based on current market data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Square Footage</label>
                      <Input 
                        type="number" 
                        placeholder="Enter sq ft"
                        value={calculatorValues.squareFeet}
                        onChange={(e) => setCalculatorValues({
                          ...calculatorValues,
                          squareFeet: Number(e.target.value) || 0
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Bedrooms</label>
                      <Input 
                        type="number" 
                        placeholder="Bedrooms"
                        value={calculatorValues.bedrooms}
                        onChange={(e) => setCalculatorValues({
                          ...calculatorValues,
                          bedrooms: Number(e.target.value) || 0
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Bathrooms</label>
                      <Input 
                        type="number" 
                        placeholder="Bathrooms"
                        value={calculatorValues.bathrooms}
                        onChange={(e) => setCalculatorValues({
                          ...calculatorValues,
                          bathrooms: Number(e.target.value) || 0
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Year Built</label>
                      <Input 
                        type="number" 
                        placeholder="Year Built"
                        value={calculatorValues.yearBuilt}
                        onChange={(e) => setCalculatorValues({
                          ...calculatorValues,
                          yearBuilt: Number(e.target.value) || 0
                        })}
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <p className="text-sm mb-1 font-medium">Estimated Value:</p>
                    <p className="text-2xl font-bold text-primary">
                      {calculateEstimatedValue()}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Based on market data and property characteristics
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
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
                      <Bar 
                        dataKey="value" 
                        name="Median Price" 
                        fill="#3b82f6" 
                      />
                      <Bar 
                        dataKey="sales" 
                        name="Number of Sales" 
                        fill="#10b981" 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Days on Market Trend</CardTitle>
              <CardDescription>
                Average time to sell properties over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              {trendsLoading ? (
                <div className="h-[300px] flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading trend data...</p>
                  </div>
                </div>
              ) : (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={marketTrendsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="daysOnMarket" 
                        name="Days on Market" 
                        stroke="#f43f5e" 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Recent Sales Tab */}
        <TabsContent value="comps" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Sales in the Area</CardTitle>
              <CardDescription>
                Comparable properties sold in the past 6 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              {salesLoading ? (
                <div className="h-[400px] flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading sales data...</p>
                  </div>
                </div>
              ) : (
                <div className="overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Address</TableHead>
                        <TableHead>Sale Date</TableHead>
                        <TableHead>Sale Price</TableHead>
                        <TableHead>Beds</TableHead>
                        <TableHead>Baths</TableHead>
                        <TableHead>Sq Ft</TableHead>
                        <TableHead>Price/Sq Ft</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentSalesData.map((sale, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {sale.address}
                            <div className="text-xs text-muted-foreground">{sale.city}, {sale.state}</div>
                          </TableCell>
                          <TableCell>{new Date(sale.saleDate).toLocaleDateString()}</TableCell>
                          <TableCell>{formatCurrency(sale.salePrice)}</TableCell>
                          <TableCell>{sale.beds}</TableCell>
                          <TableCell>{sale.baths}</TableCell>
                          <TableCell>{sale.sqft.toLocaleString()}</TableCell>
                          <TableCell>${sale.pricePerSqft}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
            <Button variant="outline">
              <Printer className="mr-2 h-4 w-4" />
              Print Report
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}