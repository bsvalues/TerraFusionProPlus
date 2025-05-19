import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  CircleDollarSign,
  Building,
  Calculator,
  Home,
  BarChart3,
  LineChart,
  FileText,
} from "lucide-react";

interface ValuationCalculatorProps {
  property: any;
  comparables?: any[];
  onValueCalculated?: (method: string, value: number) => void;
}

const VALUATION_METHODS = [
  {
    id: "comparable",
    name: "Comparable Sales",
    description: "Estimate based on similar property sales",
    icon: <Home className="h-4 w-4" />,
  },
  {
    id: "income",
    name: "Income Approach",
    description: "Capitalization of potential rental income",
    icon: <CircleDollarSign className="h-4 w-4" />,
  },
  {
    id: "cost",
    name: "Cost Approach",
    description: "Construction cost less depreciation plus land value",
    icon: <BarChart3 className="h-4 w-4" />,
  },
];

export default function ValuationCalculator({
  property,
  comparables = [],
  onValueCalculated,
}: ValuationCalculatorProps) {
  const [activeMethod, setActiveMethod] = useState("comparable");
  const [calculatorValues, setCalculatorValues] = useState({
    squareFeet: property?.squareFeet || 2000,
    bedrooms: property?.bedrooms || 3,
    bathrooms: property?.bathrooms || 2,
    yearBuilt: property?.yearBuilt || 2000,
    lotSize: property?.lotSize || 0.25,
    rentalIncome: 2500,
    vacancyRate: 5,
    expenseRatio: 35,
    capRate: 5,
    constructionCost: 150,
    landValuePerSqFt: 50,
  });
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  // Helper function to update calculator values
  const updateValue = (key: string, value: string | number) => {
    setCalculatorValues({
      ...calculatorValues,
      [key]: typeof value === 'string' ? parseFloat(value) || 0 : value,
    });
  };
  
  // Calculate value based on comparable sales approach
  const comparableValue = useMemo(() => {
    const { squareFeet, bedrooms, bathrooms, yearBuilt } = calculatorValues;
    const currentYear = new Date().getFullYear();
    
    if (!squareFeet) return 0;
    
    // Start with average price per square foot from comparables or use default
    let avgPricePerSqFt = 200; // Default fallback
    
    if (comparables && comparables.length > 0) {
      // Calculate average price per square foot from comparable properties
      avgPricePerSqFt = comparables.reduce((sum, comp) => {
        if (comp.salePrice && comp.squareFeet) {
          return sum + (comp.salePrice / comp.squareFeet);
        }
        return sum;
      }, 0) / comparables.filter(comp => comp.salePrice && comp.squareFeet).length;
      
      // If no valid comparables with both price and sqft, use default
      if (isNaN(avgPricePerSqFt)) avgPricePerSqFt = 200;
    }
    
    let baseValue = squareFeet * avgPricePerSqFt;
    
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
    
    return Math.round(baseValue);
  }, [calculatorValues, comparables]);
  
  // Calculate value based on income approach
  const incomeValue = useMemo(() => {
    const { rentalIncome, vacancyRate, expenseRatio, capRate } = calculatorValues;
    
    if (!rentalIncome || !capRate) return 0;
    
    // Monthly rent to annual
    const annualRent = rentalIncome * 12;
    
    // Account for vacancy
    const effectiveGrossIncome = annualRent * (1 - (vacancyRate / 100));
    
    // Account for expenses
    const netOperatingIncome = effectiveGrossIncome * (1 - (expenseRatio / 100));
    
    // Apply cap rate (as a percentage)
    const propertyValue = netOperatingIncome / (capRate / 100);
    
    return Math.round(propertyValue);
  }, [calculatorValues]);
  
  // Calculate value based on cost approach
  const costValue = useMemo(() => {
    const { squareFeet, yearBuilt, lotSize, constructionCost, landValuePerSqFt } = calculatorValues;
    const currentYear = new Date().getFullYear();
    
    if (!squareFeet || !yearBuilt) return 0;
    
    // Calculate land value
    const landValue = lotSize * 43560 * landValuePerSqFt; // 43560 sq ft in an acre
    
    // Calculate replacement cost
    const replacementCost = squareFeet * constructionCost;
    
    // Calculate depreciation
    const age = currentYear - yearBuilt;
    const economicLife = 60; // Typical economic life of a building in years
    const straightLineDepreciation = Math.min(age / economicLife, 0.7); // Cap at 70% depreciation
    const depreciation = replacementCost * straightLineDepreciation;
    
    // Land value + (Replacement cost - Depreciation)
    const propertyValue = landValue + (replacementCost - depreciation);
    
    return Math.round(propertyValue);
  }, [calculatorValues]);
  
  // Get value based on current method
  const currentValue = useMemo(() => {
    switch (activeMethod) {
      case "comparable":
        return comparableValue;
      case "income":
        return incomeValue;
      case "cost":
        return costValue;
      default:
        return 0;
    }
  }, [activeMethod, comparableValue, incomeValue, costValue]);
  
  // Find highest and lowest values for comparison
  const highestValue = Math.max(comparableValue, incomeValue, costValue);
  const lowestValue = Math.min(comparableValue, incomeValue, costValue);
  
  // Calculate average of all three methods
  const averageValue = Math.round(
    (comparableValue + incomeValue + costValue) / 3
  );
  
  // Call the onValueCalculated callback when currentValue changes
  useMemo(() => {
    if (onValueCalculated) {
      onValueCalculated(activeMethod, currentValue);
    }
  }, [currentValue, activeMethod, onValueCalculated]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calculator className="mr-2 h-5 w-5 text-primary" />
          Property Valuation Calculator
        </CardTitle>
        <CardDescription>
          Calculate property value using multiple appraisal methods
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeMethod} onValueChange={setActiveMethod} className="space-y-4">
          <TabsList className="grid grid-cols-3 mb-4">
            {VALUATION_METHODS.map((method) => (
              <TabsTrigger key={method.id} value={method.id} className="flex items-center">
                {method.icon}
                <span className="ml-2 hidden sm:inline">{method.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          {/* Comparable Sales Approach */}
          <TabsContent value="comparable" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="squareFeet">Square Feet</Label>
                <Input
                  id="squareFeet"
                  type="number"
                  value={calculatorValues.squareFeet}
                  onChange={(e) => updateValue("squareFeet", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  value={calculatorValues.bedrooms}
                  onChange={(e) => updateValue("bedrooms", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  value={calculatorValues.bathrooms}
                  onChange={(e) => updateValue("bathrooms", e.target.value)}
                  step="0.5"
                />
              </div>
              <div>
                <Label htmlFor="yearBuilt">Year Built</Label>
                <Input
                  id="yearBuilt"
                  type="number"
                  value={calculatorValues.yearBuilt}
                  onChange={(e) => updateValue("yearBuilt", e.target.value)}
                />
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground mt-2">
              {comparables && comparables.length > 0 ? (
                <>This calculation is based on {comparables.length} comparable properties in the area.</>
              ) : (
                <>This calculation uses default market values for your area. Add comparable properties for more accuracy.</>
              )}
            </div>
          </TabsContent>
          
          {/* Income Approach */}
          <TabsContent value="income" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="rentalIncome">Monthly Rental Income ($)</Label>
                <Input
                  id="rentalIncome"
                  type="number"
                  value={calculatorValues.rentalIncome}
                  onChange={(e) => updateValue("rentalIncome", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="vacancyRate">Vacancy Rate (%)</Label>
                <Input
                  id="vacancyRate"
                  type="number"
                  value={calculatorValues.vacancyRate}
                  onChange={(e) => updateValue("vacancyRate", e.target.value)}
                  step="0.1"
                />
              </div>
              <div>
                <Label htmlFor="expenseRatio">Operating Expense Ratio (%)</Label>
                <Input
                  id="expenseRatio"
                  type="number"
                  value={calculatorValues.expenseRatio}
                  onChange={(e) => updateValue("expenseRatio", e.target.value)}
                  step="0.1"
                />
              </div>
              <div>
                <Label htmlFor="capRate">Capitalization Rate (%)</Label>
                <Input
                  id="capRate"
                  type="number"
                  value={calculatorValues.capRate}
                  onChange={(e) => updateValue("capRate", e.target.value)}
                  step="0.1"
                />
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground mt-2">
              The income approach calculates property value based on potential rental income and expenses.
            </div>
          </TabsContent>
          
          {/* Cost Approach */}
          <TabsContent value="cost" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="constructionCost">Construction Cost ($ per sqft)</Label>
                <Input
                  id="constructionCost"
                  type="number"
                  value={calculatorValues.constructionCost}
                  onChange={(e) => updateValue("constructionCost", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="landValuePerSqFt">Land Value ($ per sqft)</Label>
                <Input
                  id="landValuePerSqFt"
                  type="number"
                  value={calculatorValues.landValuePerSqFt}
                  onChange={(e) => updateValue("landValuePerSqFt", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="lotSize">Lot Size (acres)</Label>
                <Input
                  id="lotSize"
                  type="number"
                  value={calculatorValues.lotSize}
                  onChange={(e) => updateValue("lotSize", e.target.value)}
                  step="0.01"
                />
              </div>
              <div>
                <Label htmlFor="yearBuilt2">Year Built</Label>
                <Input
                  id="yearBuilt2"
                  type="number"
                  value={calculatorValues.yearBuilt}
                  onChange={(e) => updateValue("yearBuilt", e.target.value)}
                />
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground mt-2">
              The cost approach estimates property value as the cost to construct a replacement building, minus depreciation, plus land value.
            </div>
          </TabsContent>
          
          {/* Results */}
          <div className="mt-6 pt-6 border-t space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Estimated Value:</h3>
                <p className="text-sm text-muted-foreground">
                  Using {activeMethod === "comparable" ? "Comparable Sales" : activeMethod === "income" ? "Income" : "Cost"} Approach
                </p>
              </div>
              <div className="text-2xl font-bold text-primary">
                {formatCurrency(currentValue)}
              </div>
            </div>
            
            {/* Method Comparison */}
            <div>
              <h4 className="text-sm font-medium mb-2">Valuation Method Comparison</h4>
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
                      style={{ width: highestValue > 0 ? `${(comparableValue / highestValue) * 100}%` : '0%' }}
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
                      style={{ width: highestValue > 0 ? `${(incomeValue / highestValue) * 100}%` : '0%' }}
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
                      style={{ width: highestValue > 0 ? `${(costValue / highestValue) * 100}%` : '0%' }}
                    ></div>
                  </div>
                </div>
                
                {/* Average Value */}
                <div className="pt-2 mt-2 border-t">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium">Reconciled Value (Average)</span>
                    <span className="font-medium">{formatCurrency(averageValue)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-primary h-2.5 rounded-full" 
                      style={{ width: highestValue > 0 ? `${(averageValue / highestValue) * 100}%` : '0%' }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Generate Valuation Report
              </Button>
            </div>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}