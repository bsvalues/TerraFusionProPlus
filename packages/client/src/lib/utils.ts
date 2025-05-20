// Format a currency value to USD
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

// Format a number with commas for thousands
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

// Format a date to a readable string
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

// Calculate price per square foot
export function calculatePricePerSqFt(price: number, sqFt: number): number {
  if (!sqFt || sqFt === 0) return 0;
  return Math.round(price / sqFt);
}

// Calculate adjusted value based on comparable properties
export function calculateAdjustedValue(
  property: any,
  comparables: any[],
  adjustmentFactors = {
    locationFactor: 0.05,
    sizeFactor: 0.1,
    ageFactor: 0.02,
    conditionFactor: 0.15,
  }
): number {
  if (!comparables || comparables.length === 0) {
    return property.lastSalePrice || 0;
  }

  // Calculate base comparable value
  const avgComparablePrice =
    comparables.reduce((sum, comp) => sum + comp.salePrice, 0) / comparables.length;

  // Apply adjustments based on property characteristics
  let adjustedValue = avgComparablePrice;

  // Size adjustment
  if (property.squareFeet) {
    const avgCompSqFt =
      comparables.reduce((sum, comp) => sum + comp.squareFeet, 0) / comparables.length;
    const sizeDiff = property.squareFeet / avgCompSqFt - 1;
    adjustedValue *= 1 + sizeDiff * adjustmentFactors.sizeFactor;
  }

  // Age adjustment
  if (property.yearBuilt) {
    const avgCompAge =
      comparables.reduce((sum, comp) => sum + (comp.yearBuilt || 0), 0) / comparables.length;
    if (avgCompAge > 0) {
      const ageDiff = (property.yearBuilt - avgCompAge) / 100; // Normalize age difference
      adjustedValue *= 1 + ageDiff * adjustmentFactors.ageFactor;
    }
  }

  return Math.round(adjustedValue);
}