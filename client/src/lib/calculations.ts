import { Comparable, Adjustment } from "@shared/schema";

interface CalculationResult {
  netAdjustment: number;
  grossAdjustment: number;
  netAdjustmentPercentage: number;
  grossAdjustmentPercentage: number;
  adjustedPrice: number;
  adjustedPricePerSqft: number;
}

/**
 * Calculate all adjustments for a comparable property
 */
export function calculateAdjustments(
  comparable: Comparable, 
  adjustments: Adjustment[]
): CalculationResult {
  // Find all adjustments for this comparable
  const comparableAdjustments = adjustments.filter(
    adj => adj.comparableId === comparable.id
  );
  
  // Calculate the sum of all adjustments
  const netAdjustment = comparableAdjustments.reduce(
    (sum, adj) => sum + Number(adj.amount), 
    0
  );
  
  // Calculate the sum of absolute values of all adjustments
  const grossAdjustment = comparableAdjustments.reduce(
    (sum, adj) => sum + Math.abs(Number(adj.amount)), 
    0
  );
  
  // Calculate the adjusted price
  const salePrice = typeof comparable.salePrice === 'string' 
    ? parseFloat(comparable.salePrice) 
    : (comparable.salePrice || 0);
  
  const adjustedPrice = salePrice + netAdjustment;
  
  // Calculate adjustment percentages
  const netAdjustmentPercentage = salePrice ? (netAdjustment / salePrice) * 100 : 0;
  const grossAdjustmentPercentage = salePrice ? (grossAdjustment / salePrice) * 100 : 0;
  
  // Calculate price per square foot
  const squareFeet = comparable.squareFeet || comparable.squareFootage;
  const adjustedPricePerSqft = squareFeet ? adjustedPrice / squareFeet : 0;
  
  return {
    netAdjustment,
    grossAdjustment,
    netAdjustmentPercentage,
    grossAdjustmentPercentage,
    adjustedPrice,
    adjustedPricePerSqft
  };
}

/**
 * Calculate the value of a property using the sales comparison approach
 */
export function calculateSalesComparisonValue(
  property: any,
  comparables: Comparable[],
  adjustments: Adjustment[]
): number {
  if (!comparables || comparables.length === 0) {
    return 0;
  }
  
  // Calculate adjusted values for all comparables
  const calculatedResults = comparables.map(comp => 
    calculateAdjustments(comp, adjustments)
  );
  
  // Get the average adjusted price
  const totalAdjustedPrice = calculatedResults.reduce(
    (sum, result) => sum + result.adjustedPrice, 
    0
  );
  
  const averageAdjustedPrice = totalAdjustedPrice / calculatedResults.length;
  
  // Get the median adjusted price
  const sortedPrices = [...calculatedResults]
    .sort((a, b) => a.adjustedPrice - b.adjustedPrice)
    .map(result => result.adjustedPrice);
  
  const medianIndex = Math.floor(sortedPrices.length / 2);
  const medianAdjustedPrice = sortedPrices.length % 2 === 0
    ? (sortedPrices[medianIndex - 1] + sortedPrices[medianIndex]) / 2
    : sortedPrices[medianIndex];
  
  // Calculate the average price per square foot
  const totalPricePerSqft = calculatedResults.reduce(
    (sum, result) => sum + result.adjustedPricePerSqft, 
    0
  );
  
  const averagePricePerSqft = totalPricePerSqft / calculatedResults.length;
  
  // Calculate the subject property value based on its square footage
  const subjectSqft = property.squareFeet || property.squareFootage || 0;
  const valueByPricePerSqft = subjectSqft * averagePricePerSqft;
  
  // Weight the results (50% median, 30% average, 20% price per sqft)
  const finalValue = (
    medianAdjustedPrice * 0.5 + 
    averageAdjustedPrice * 0.3 + 
    valueByPricePerSqft * 0.2
  );
  
  return Math.round(finalValue);
}

/**
 * Calculate the value of a property using the income approach
 */
export function calculateIncomeValue(
  property: any,
  monthlyRent: number,
  vacancyRate: number = 5,
  operatingExpensesPercentage: number = 45,
  capitalizationRate: number = 6
): number {
  if (!monthlyRent || monthlyRent <= 0) {
    return 0;
  }
  
  // Calculate annual gross income
  const annualGrossIncome = monthlyRent * 12;
  
  // Apply vacancy loss
  const effectiveGrossIncome = annualGrossIncome * (1 - vacancyRate / 100);
  
  // Apply operating expenses
  const netOperatingIncome = effectiveGrossIncome * (1 - operatingExpensesPercentage / 100);
  
  // Apply capitalization rate
  const propertyValue = netOperatingIncome / (capitalizationRate / 100);
  
  return Math.round(propertyValue);
}

/**
 * Calculate the value of a property using the cost approach
 */
export function calculateCostValue(
  property: any,
  landValue: number,
  replacementCostPerSqft: number = 150,
  physicalDepreciation: number = 20,
  functionalObsolescence: number = 5,
  externalObsolescence: number = 5
): number {
  if (!property || !landValue || landValue <= 0) {
    return 0;
  }
  
  const squareFeet = property.squareFeet || property.squareFootage || 0;
  
  if (squareFeet <= 0) {
    return 0;
  }
  
  // Calculate replacement cost new
  const replacementCostNew = squareFeet * replacementCostPerSqft;
  
  // Calculate total depreciation
  const totalDepreciationPercentage = 
    physicalDepreciation + functionalObsolescence + externalObsolescence;
  
  // Apply depreciation
  const depreciation = replacementCostNew * (totalDepreciationPercentage / 100);
  
  // Calculate the depreciated value of improvements
  const depreciatedImprovementValue = replacementCostNew - depreciation;
  
  // Add land value to get total property value
  const propertyValue = depreciatedImprovementValue + landValue;
  
  return Math.round(propertyValue);
}

/**
 * Calculate market statistics from a set of comparable properties
 */
export function calculateMarketStatistics(comparables: Comparable[]) {
  if (!comparables || comparables.length === 0) {
    return {
      averagePrice: 0,
      medianPrice: 0,
      averagePricePerSqft: 0,
      priceRange: [0, 0],
      averageDaysOnMarket: 0,
      salesVolume: 0
    };
  }
  
  // Extract prices and sort them
  const prices = comparables
    .map(comp => typeof comp.salePrice === 'string' ? parseFloat(comp.salePrice) : (comp.salePrice || 0))
    .filter(price => price > 0)
    .sort((a, b) => a - b);
  
  // Calculate average price
  const averagePrice = prices.length 
    ? prices.reduce((sum, price) => sum + price, 0) / prices.length 
    : 0;
  
  // Calculate median price
  const midIndex = Math.floor(prices.length / 2);
  const medianPrice = prices.length % 2 === 0
    ? (prices[midIndex - 1] + prices[midIndex]) / 2
    : prices[midIndex];
  
  // Calculate price per square foot for each comparable
  const pricesPerSqft = comparables
    .map(comp => {
      const price = typeof comp.salePrice === 'string' ? parseFloat(comp.salePrice) : (comp.salePrice || 0);
      const sqft = comp.squareFeet || comp.squareFootage || 0;
      return sqft > 0 ? price / sqft : 0;
    })
    .filter(ppsf => ppsf > 0);
  
  // Calculate average price per square foot
  const averagePricePerSqft = pricesPerSqft.length 
    ? pricesPerSqft.reduce((sum, ppsf) => sum + ppsf, 0) / pricesPerSqft.length
    : 0;
  
  // Calculate price range [min, max]
  const priceRange = prices.length 
    ? [prices[0], prices[prices.length - 1]]
    : [0, 0];
  
  // Calculate average days on market (if available)
  const daysOnMarket = comparables
    .map(comp => comp.daysOnMarket || 0)
    .filter(dom => dom > 0);
  
  const averageDaysOnMarket = daysOnMarket.length
    ? daysOnMarket.reduce((sum, dom) => sum + dom, 0) / daysOnMarket.length
    : 0;
  
  // Count sales volume
  const salesVolume = prices.length;
  
  return {
    averagePrice,
    medianPrice,
    averagePricePerSqft,
    priceRange,
    averageDaysOnMarket,
    salesVolume
  };
}