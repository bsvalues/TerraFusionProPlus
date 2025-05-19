import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Calculator, TrendingUp, Building, Home, DollarSign } from "lucide-react";
import { Comparable, Property } from "@shared/schema";
import { 
  calculateSalesComparisonValue, 
  calculateIncomeValue, 
  calculateCostValue,
  calculateMarketStatistics
} from "@/lib/calculations";

interface ValuationCalculatorProps {
  property: Property;
  comparables?: Comparable[];
  onValueCalculated?: (method: string, value: number) => void;
}

export default function ValuationCalculator({
  property,
  comparables = [],
  onValueCalculated
}: ValuationCalculatorProps) {
  const [activeTab, setActiveTab] = useState("sales");
  
  // Sales comparison approach
  const [salesValue, setSalesValue] = useState<number>(0);
  
  // Income approach
  const [monthlyRent, setMonthlyRent] = useState<number>(property.squareFeet ? property.squareFeet * 1.5 : 2000);
  const [vacancyRate, setVacancyRate] = useState<number>(5);
  const [operatingExpensesRate, setOperatingExpensesRate] = useState<number>(45);
  const [capitalizationRate, setCapitalizationRate] = useState<number>(6);
  const [incomeValue, setIncomeValue] = useState<number>(0);
  
  // Cost approach
  const [landValue, setLandValue] = useState<number>(150000);
  const [replacementCost, setReplacementCost] = useState<number>(150);
  const [physicalDepreciation, setPhysicalDepreciation] = useState<number>(property.yearBuilt ? Math.min(70, (new Date().getFullYear() - property.yearBuilt) * 1.5) : 20);
  const [functionalObsolescence, setFunctionalObsolescence] = useState<number>(5);
  const [externalObsolescence, setExternalObsolescence] = useState<number>(5);
  const [costValue, setCostValue] = useState<number>(0);
  
  // Reconciliation
  const [finalValue, setFinalValue] = useState<number>(0);
  const [marketStats, setMarketStats] = useState<{
    averagePrice: number;
    medianPrice: number;
    averagePricePerSqft: number;
    priceRange: [number, number];
    averageDaysOnMarket: number;
    salesVolume: number;
  }>({
    averagePrice: 0,
    medianPrice: 0,
    averagePricePerSqft: 0,
    priceRange: [0, 0],
    averageDaysOnMarket: 0,
    salesVolume: 0
  });
  
  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Calculate sales comparison value when comparables change
  useEffect(() => {
    if (comparables && comparables.length > 0) {
      const value = calculateSalesComparisonValue(property, comparables, []);
      setSalesValue(value);
      if (onValueCalculated) {
        onValueCalculated("sales_comparison", value);
      }
      
      // Calculate market statistics
      setMarketStats(calculateMarketStatistics(comparables));
    }
  }, [property, comparables, onValueCalculated]);
  
  // Calculate income approach value when inputs change
  useEffect(() => {
    const value = calculateIncomeValue(
      property,
      monthlyRent,
      vacancyRate,
      operatingExpensesRate,
      capitalizationRate
    );
    setIncomeValue(value);
    if (onValueCalculated) {
      onValueCalculated("income", value);
    }
  }, [property, monthlyRent, vacancyRate, operatingExpensesRate, capitalizationRate, onValueCalculated]);
  
  // Calculate cost approach value when inputs change
  useEffect(() => {
    const value = calculateCostValue(
      property,
      landValue,
      replacementCost,
      physicalDepreciation,
      functionalObsolescence,
      externalObsolescence
    );
    setCostValue(value);
    if (onValueCalculated) {
      onValueCalculated("cost", value);
    }
  }, [property, landValue, replacementCost, physicalDepreciation, functionalObsolescence, externalObsolescence, onValueCalculated]);
  
  // Calculate final reconciled value
  useEffect(() => {
    const salesWeight = activeTab === "sales" ? 0.6 : 0.4;
    const incomeWeight = activeTab === "income" ? 0.5 : 0.3;
    const costWeight = activeTab === "cost" ? 0.5 : 0.3;
    
    const totalWeight = salesWeight + incomeWeight + costWeight;
    
    const reconciled = (
      (salesValue * salesWeight) +
      (incomeValue * incomeWeight) +
      (costValue * costWeight)
    ) / totalWeight;
    
    setFinalValue(Math.round(reconciled));
    
    if (onValueCalculated) {
      onValueCalculated("final", Math.round(reconciled));
    }
  }, [salesValue, incomeValue, costValue, activeTab, onValueCalculated]);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center">
            <Calculator className="mr-2 h-5 w-5 text-primary" />
            Property Valuation Calculator
          </CardTitle>
          <CardDescription>
            Calculate estimated market value using multiple approaches
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="sales" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="sales" className="flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Sales Comparison
              </TabsTrigger>
              <TabsTrigger value="income" className="flex items-center">
                <DollarSign className="h-4 w-4 mr-2" />
                Income Approach
              </TabsTrigger>
              <TabsTrigger value="cost" className="flex items-center">
                <Building className="h-4 w-4 mr-2" />
                Cost Approach
              </TabsTrigger>
            </TabsList>
            
            {/* Sales Comparison Approach */}
            <TabsContent value="sales" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-4">
                    <h3 className="text-lg font-medium mb-2">Sales Comparison Approach</h3>
                    <p className="text-sm text-muted-foreground">
                      Valuation based on {comparables.length} comparable properties in the area.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <div className="font-medium mb-1">Estimated Value</div>
                      <div className="text-2xl font-bold text-primary">{formatCurrency(salesValue)}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Based on adjusted comparable sales
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <div className="font-medium mb-1">Price per Sq. Ft.</div>
                      <div className="text-xl font-bold">
                        {property.squareFeet && salesValue 
                          ? `$${Math.round(salesValue / property.squareFeet)}/sqft` 
                          : 'N/A'}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Market average: ${Math.round(marketStats.averagePricePerSqft)}/sqft
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Market Statistics</h4>
                    <span className="text-xs text-muted-foreground">Based on {marketStats.salesVolume} sales</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 border rounded">
                      <div className="text-sm text-muted-foreground">Average Price</div>
                      <div className="font-bold">{formatCurrency(marketStats.averagePrice)}</div>
                    </div>
                    <div className="p-3 border rounded">
                      <div className="text-sm text-muted-foreground">Median Price</div>
                      <div className="font-bold">{formatCurrency(marketStats.medianPrice)}</div>
                    </div>
                    <div className="p-3 border rounded">
                      <div className="text-sm text-muted-foreground">Price Range</div>
                      <div className="font-bold">
                        {formatCurrency(marketStats.priceRange[0])} - {formatCurrency(marketStats.priceRange[1])}
                      </div>
                    </div>
                    <div className="p-3 border rounded">
                      <div className="text-sm text-muted-foreground">Days on Market</div>
                      <div className="font-bold">{Math.round(marketStats.averageDaysOnMarket)} days</div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg bg-slate-50">
                    <h4 className="font-medium mb-2">Subject Property</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Address:</span> {property.address}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Size:</span> {property.squareFeet?.toLocaleString()} sqft
                      </div>
                      <div>
                        <span className="text-muted-foreground">Year Built:</span> {property.yearBuilt || 'N/A'}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Bed/Bath:</span> {property.bedrooms || 'N/A'}/{property.bathrooms || 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Income Approach */}
            <TabsContent value="income" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-4">
                    <h3 className="text-lg font-medium mb-2">Income Approach</h3>
                    <p className="text-sm text-muted-foreground">
                      Valuation based on income potential and capitalization rate.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <div className="font-medium mb-1">Estimated Value</div>
                      <div className="text-2xl font-bold text-primary">{formatCurrency(incomeValue)}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Based on capitalized rental income
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-lg space-y-2">
                      <div>
                        <span className="text-sm text-muted-foreground">Annual Gross Income:</span>{' '}
                        {formatCurrency(monthlyRent * 12)}
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Effective Gross Income:</span>{' '}
                        {formatCurrency(monthlyRent * 12 * (1 - vacancyRate / 100))}
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Net Operating Income:</span>{' '}
                        {formatCurrency(monthlyRent * 12 * (1 - vacancyRate / 100) * (1 - operatingExpensesRate / 100))}
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Cap Rate:</span>{' '}
                        {capitalizationRate}%
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="font-medium mb-1">Income Parameters</div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="monthly-rent">Monthly Rent</Label>
                      <div className="flex items-center space-x-2">
                        <span className="text-muted-foreground">$</span>
                        <Input
                          id="monthly-rent"
                          type="number"
                          value={monthlyRent}
                          onChange={(e) => setMonthlyRent(Number(e.target.value))}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="vacancy-rate">Vacancy Rate: {vacancyRate}%</Label>
                      </div>
                      <Slider
                        id="vacancy-rate"
                        min={0}
                        max={20}
                        step={1}
                        value={[vacancyRate]}
                        onValueChange={(value) => setVacancyRate(value[0])}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="expenses-rate">Operating Expenses: {operatingExpensesRate}%</Label>
                      </div>
                      <Slider
                        id="expenses-rate"
                        min={20}
                        max={70}
                        step={1}
                        value={[operatingExpensesRate]}
                        onValueChange={(value) => setOperatingExpensesRate(value[0])}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="cap-rate">Capitalization Rate: {capitalizationRate}%</Label>
                      </div>
                      <Slider
                        id="cap-rate"
                        min={3}
                        max={12}
                        step={0.25}
                        value={[capitalizationRate]}
                        onValueChange={(value) => setCapitalizationRate(value[0])}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Cost Approach */}
            <TabsContent value="cost" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-4">
                    <h3 className="text-lg font-medium mb-2">Cost Approach</h3>
                    <p className="text-sm text-muted-foreground">
                      Valuation based on cost to rebuild minus depreciation plus land value.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <div className="font-medium mb-1">Estimated Value</div>
                      <div className="text-2xl font-bold text-primary">{formatCurrency(costValue)}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Based on cost to rebuild minus depreciation
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-lg space-y-2">
                      <div>
                        <span className="text-sm text-muted-foreground">Land Value:</span>{' '}
                        {formatCurrency(landValue)}
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Replacement Cost New:</span>{' '}
                        {formatCurrency(property.squareFeet ? property.squareFeet * replacementCost : 0)}
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Total Depreciation:</span>{' '}
                        {formatCurrency(property.squareFeet
                          ? property.squareFeet * replacementCost * 
                            (physicalDepreciation + functionalObsolescence + externalObsolescence) / 100
                          : 0
                        )}
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Depreciated Improvement Value:</span>{' '}
                        {formatCurrency(property.squareFeet
                          ? property.squareFeet * replacementCost * 
                            (1 - (physicalDepreciation + functionalObsolescence + externalObsolescence) / 100)
                          : 0
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="font-medium mb-1">Cost Parameters</div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="land-value">Land Value</Label>
                      <div className="flex items-center space-x-2">
                        <span className="text-muted-foreground">$</span>
                        <Input
                          id="land-value"
                          type="number"
                          value={landValue}
                          onChange={(e) => setLandValue(Number(e.target.value))}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="replacement-cost">Replacement Cost Per Sq Ft</Label>
                      <div className="flex items-center space-x-2">
                        <span className="text-muted-foreground">$</span>
                        <Input
                          id="replacement-cost"
                          type="number"
                          value={replacementCost}
                          onChange={(e) => setReplacementCost(Number(e.target.value))}
                          className="flex-1"
                        />
                        <span className="text-muted-foreground">/sqft</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="physical-dep">Physical Depreciation: {physicalDepreciation}%</Label>
                      </div>
                      <Slider
                        id="physical-dep"
                        min={0}
                        max={80}
                        step={1}
                        value={[physicalDepreciation]}
                        onValueChange={(value) => setPhysicalDepreciation(value[0])}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="functional-obs">Functional Obsolescence: {functionalObsolescence}%</Label>
                      </div>
                      <Slider
                        id="functional-obs"
                        min={0}
                        max={30}
                        step={1}
                        value={[functionalObsolescence]}
                        onValueChange={(value) => setFunctionalObsolescence(value[0])}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="external-obs">External Obsolescence: {externalObsolescence}%</Label>
                      </div>
                      <Slider
                        id="external-obs"
                        min={0}
                        max={30}
                        step={1}
                        value={[externalObsolescence]}
                        onValueChange={(value) => setExternalObsolescence(value[0])}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Reconciliation Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center">
            <TrendingUp className="mr-2 h-5 w-5 text-primary" />
            Value Reconciliation
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground">Sales Comparison</div>
              <div className="text-lg font-bold">{formatCurrency(salesValue)}</div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground">Income Approach</div>
              <div className="text-lg font-bold">{formatCurrency(incomeValue)}</div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground">Cost Approach</div>
              <div className="text-lg font-bold">{formatCurrency(costValue)}</div>
            </div>
            
            <div className="p-4 border rounded-lg bg-primary/5">
              <div className="text-sm text-muted-foreground">Final Value</div>
              <div className="text-xl font-bold text-primary">{formatCurrency(finalValue)}</div>
            </div>
          </div>
          
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">
              The final value is a weighted average of the three approaches, with emphasis on the {activeTab === "sales" ? "sales comparison" : activeTab === "income" ? "income" : "cost"} approach.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}