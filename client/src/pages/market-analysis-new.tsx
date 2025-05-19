import { useState, useMemo } from "react";
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
import { Label } from "@/components/ui/label";
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
  
  // State for valuation method
  const [valuationMethod, setValuationMethod] = useState("comparable");
  
  // Helper function to calculate value based on method
  const calculateValueByMethod = (method: string): number => {
    const { squareFeet, bedrooms, bathrooms, yearBuilt } = calculatorValues;
    const currentYear = new Date().getFullYear();
    
    if (!squareFeet) return 0;
    
    let baseValue = 0;
    
    switch (method) {
      case "comparable":
        // Comparable sales approach
        baseValue = squareFeet * (marketData.pricePerSqFt || 200);
        
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
        break;
        
      case "income":
        // Income approach (simplified cap rate method)
        // Assume monthly rent is roughly 0.8% of property value for typical residential
        const estimatedMonthlyRent = (squareFeet * (marketData.pricePerSqFt || 200)) * 0.008;
        const annualRent = estimatedMonthlyRent * 12;
        // Use cap rate of 5% for residential properties
        baseValue = annualRent / 0.05;
        break;
        
      case "cost":
        // Cost approach
        // Base construction cost per square foot (varies by property type and location)
        const baseCostPerSqFt = 150;
        const constructionCost = squareFeet * baseCostPerSqFt;
        
        // Land value (roughly 20-30% of total value in many areas)
        const landValue = squareFeet * (marketData.pricePerSqFt || 200) * 0.25;
        
        // Depreciation based on age
        let depreciationFactor = 0;
        if (yearBuilt > 0) {
          const age = currentYear - yearBuilt;
          // Simple straight-line depreciation over 50 years (2% per year)
          depreciationFactor = Math.min(0.7, age * 0.02); // Cap at 70% depreciation
        }
        
        // Calculate final value: Land + (Construction Cost - Depreciation)
        baseValue = landValue + (constructionCost * (1 - depreciationFactor));
        break;
    }
    
    return baseValue;
  };
  
  // Calculate estimated value based on calculator inputs and current method
  const calculateEstimatedValue = () => {
    return formatCurrency(calculateValueByMethod(valuationMethod));
  };
  
  // Calculate all method values for comparison
  const comparableValue = useMemo(() => calculateValueByMethod("comparable"), [calculatorValues, marketData.pricePerSqFt]);
  const incomeValue = useMemo(() => calculateValueByMethod("income"), [calculatorValues, marketData.pricePerSqFt]);
  const costValue = useMemo(() => calculateValueByMethod("cost"), [calculatorValues, marketData.pricePerSqFt]);
  const maxValue = useMemo(() => Math.max(comparableValue, incomeValue, costValue), [comparableValue, incomeValue, costValue]);

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
          <TabsTrigger value="overview">Market Overview</TabsTrigger>
          <TabsTrigger value="trends">Price Trends</TabsTrigger>
          <TabsTrigger value="sales">Recent Sales</TabsTrigger>
        </TabsList>
        
        {/* Market Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
              title="Median Home Price" 
              value={formatCurrency(marketData.medianPrice || 0)} 
              icon={<Home className="w-4 h-4" />}
              percentChange={marketData.priceChange}
            />
            <StatCard 
              title="Avg. Price per SqFt" 
              value={`$${marketData.pricePerSqFt || 0}`} 
              icon={<Map className="w-4 h-4" />}
              percentChange={3.2}
            />
            <StatCard 
              title="Days on Market" 
              value={`${marketData.averageDaysOnMarket || 0} days`} 
              icon={<Calendar className="w-4 h-4" />}
              percentChange={-5.8}
            />
            <StatCard 
              title="Sales Volume" 
              value={`${marketData.salesVolume || 0}`} 
              icon={<Activity className="w-4 h-4" />}
              percentChange={marketData.inventoryChange || 0}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Home Price Trends</CardTitle>
                  <CardDescription>
                    Last {timeframe === '3m' ? '3 months' : timeframe === '6m' ? '6 months' : timeframe === '24m' ? '2 years' : '12 months'} price trends in {zipCode}
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={marketTrendsData}
                      margin={{
                        top: 5,
                        right: 10,
                        left: 10,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis 
                        tickFormatter={(value) => `$${(value / 1000)}k`}
                      />
                      <Tooltip 
                        formatter={(value) => [`${formatCurrency(value as number)}`, "Median Price"]}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#6366F1"
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                        name="Median Price"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
            
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
                  <div className="space-y-2">
                    <Label htmlFor="valuation-method">Valuation Method</Label>
                    <Select 
                      value={valuationMethod} 
                      onValueChange={setValuationMethod}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="comparable">Comparable Sales Approach</SelectItem>
                        <SelectItem value="income">Income Approach</SelectItem>
                        <SelectItem value="cost">Cost Approach</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      {valuationMethod === "comparable" && "Bases value on similar properties that have recently sold"}
                      {valuationMethod === "income" && "Calculates value based on potential rental income"}
                      {valuationMethod === "cost" && "Estimates value using construction costs less depreciation plus land value"}
                    </p>
                  </div>
                  
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
                    <div className="mb-3">
                      <p className="text-sm mb-1 font-medium">Estimated Value ({valuationMethod === "comparable" ? "Comparable Sales" : valuationMethod === "income" ? "Income" : "Cost"} Approach):</p>
                      <p className="text-2xl font-bold text-primary">
                        {calculateEstimatedValue()}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {valuationMethod === "comparable" && "Based on recent sales of similar properties in the area"}
                        {valuationMethod === "income" && "Based on potential rental income and current cap rates"}
                        {valuationMethod === "cost" && "Based on construction cost, land value, and depreciation"}
                      </p>
                      
                      <div className="pt-3 mt-3 border-t">
                        <p className="text-sm mb-2 font-medium">Valuation Method Comparison</p>
                        <div className="space-y-2">
                          {/* Comparable Method Bar */}
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span>Comparable Sales</span>
                              <span>{formatCurrency(comparableValue)}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div 
                                className="bg-blue-600 h-2.5 rounded-full" 
                                style={{ width: maxValue > 0 ? `${(comparableValue / maxValue) * 100}%` : '0%' }}
                              ></div>
                            </div>
                          </div>
                          
                          {/* Income Method Bar */}
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span>Income</span>
                              <span>{formatCurrency(incomeValue)}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div 
                                className="bg-green-600 h-2.5 rounded-full" 
                                style={{ width: maxValue > 0 ? `${(incomeValue / maxValue) * 100}%` : '0%' }}
                              ></div>
                            </div>
                          </div>
                          
                          {/* Cost Method Bar */}
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span>Cost</span>
                              <span>{formatCurrency(costValue)}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div 
                                className="bg-amber-600 h-2.5 rounded-full" 
                                style={{ width: maxValue > 0 ? `${(costValue / maxValue) * 100}%` : '0%' }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <Button
                        variant={valuationMethod === "comparable" ? "default" : "outline"} 
                        size="sm"
                        onClick={() => setValuationMethod("comparable")}
                        className="flex flex-col items-center justify-center h-16 gap-1"
                      >
                        <Home className="h-4 w-4" />
                        <span className="text-xs">Comparable</span>
                      </Button>
                      <Button
                        variant={valuationMethod === "income" ? "default" : "outline"} 
                        size="sm"
                        onClick={() => setValuationMethod("income")}
                        className="flex flex-col items-center justify-center h-16 gap-1"
                      >
                        <CircleDollarSign className="h-4 w-4" />
                        <span className="text-xs">Income</span>
                      </Button>
                      <Button
                        variant={valuationMethod === "cost" ? "default" : "outline"} 
                        size="sm"
                        onClick={() => setValuationMethod("cost")}
                        className="flex flex-col items-center justify-center h-16 gap-1"
                      >
                        <BarChart3 className="h-4 w-4" />
                        <span className="text-xs">Cost</span>
                      </Button>
                    </div>
                    
                    <div className="mt-4">
                      <Button 
                        onClick={generateReport} 
                        className="w-full"
                        variant="default"
                      >
                        <FileText className="mr-2 h-4 w-4" /> 
                        Generate Valuation Report
                      </Button>
                    </div>
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
              <CardTitle>Market Trends</CardTitle>
              <CardDescription>
                Historical market data for {zipCode} ({propertyType === 'all' ? 'All Properties' : propertyType})
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium mb-4">Price Trends</h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={marketTrendsData}
                        margin={{
                          top: 5,
                          right: 10,
                          left: 10,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis 
                          tickFormatter={(value) => `$${(value / 1000)}k`}
                        />
                        <Tooltip 
                          formatter={(value) => [`${formatCurrency(value as number)}`, "Median Price"]}
                        />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#6366F1"
                          strokeWidth={2}
                          name="Median Price"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Sales Volume</h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={marketTrendsData}
                        margin={{
                          top: 5,
                          right: 10,
                          left: 10,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => [`${value}`, "Sales"]}
                        />
                        <Bar dataKey="sales" fill="#22C55E" name="Sales" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Days on Market</h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={marketTrendsData}
                        margin={{
                          top: 5,
                          right: 10,
                          left: 10,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => [`${value} days`, "Avg Days on Market"]}
                        />
                        <Line
                          type="monotone"
                          dataKey="daysOnMarket"
                          stroke="#F59E0B"
                          strokeWidth={2}
                          name="Avg Days on Market"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Market Summary</h3>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Median Sale Price:</span>
                          <span className="font-medium">{formatCurrency(marketData.medianPrice || 0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Average Sale Price:</span>
                          <span className="font-medium">{formatCurrency(marketData.averagePrice || 0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Price/Sq Ft:</span>
                          <span className="font-medium">${marketData.pricePerSqFt || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Sales Volume:</span>
                          <span className="font-medium">{marketData.salesVolume || 0} properties</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Avg Days on Market:</span>
                          <span className="font-medium">{marketData.averageDaysOnMarket || 0} days</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">YoY Price Change:</span>
                          <span className={`font-medium ${(marketData.priceChange || 0) > 0 ? "text-green-600" : "text-red-600"}`}>
                            {(marketData.priceChange || 0) > 0 ? "+" : ""}{marketData.priceChange || 0}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Inventory Change:</span>
                          <span className={`font-medium ${(marketData.inventoryChange || 0) > 0 ? "text-green-600" : "text-red-600"}`}>
                            {(marketData.inventoryChange || 0) > 0 ? "+" : ""}{marketData.inventoryChange || 0}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Data Updated:</span>
                          <span className="font-medium">{marketData.lastUpdated ? format(new Date(marketData.lastUpdated), 'MMM d, yyyy') : 'N/A'}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Recent Sales Tab */}
        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
              <CardDescription>
                Recent property sales in {zipCode} area
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Address</TableHead>
                      <TableHead>Sale Date</TableHead>
                      <TableHead>Sale Price</TableHead>
                      <TableHead className="hidden md:table-cell">Beds/Baths</TableHead>
                      <TableHead className="hidden md:table-cell">SqFt</TableHead>
                      <TableHead className="hidden md:table-cell">Price/SqFt</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentSalesData.map((sale, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          <div>{sale.address}</div>
                          <div className="text-xs text-muted-foreground">{sale.city}, {sale.state}</div>
                        </TableCell>
                        <TableCell>
                          {format(new Date(sale.saleDate), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(sale.salePrice)}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {sale.beds} / {sale.baths}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {sale.sqft.toLocaleString()}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          ${sale.pricePerSqft}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex justify-center mt-4">
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export Sales Data
                </Button>
                <Button variant="outline" className="ml-2">
                  <Printer className="mr-2 h-4 w-4" />
                  Print Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}