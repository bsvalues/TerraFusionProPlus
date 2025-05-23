// Mock data for development purposes
const properties = [
  {
    id: 1,
    address: "123 Main Street",
    city: "San Francisco",
    state: "CA",
    zipCode: "94105",
    propertyType: "Single Family",
    bedrooms: 4,
    bathrooms: "3",
    squareFeet: "2500",
    lotSize: "0.25",
    yearBuilt: 1998,
    description: "Beautiful updated home in prime location",
    parcelNumber: "123-456-789",
    zoning: "Residential",
    createdAt: new Date("2025-01-15T12:00:00Z"),
    updatedAt: new Date("2025-04-20T14:30:00Z"),
  },
  {
    id: 2,
    address: "456 Park Avenue",
    city: "New York",
    state: "NY",
    zipCode: "10022",
    propertyType: "Condominium",
    bedrooms: 2,
    bathrooms: "2",
    squareFeet: "1200",
    lotSize: null,
    yearBuilt: 2010,
    description: "Luxury condo with spectacular views",
    parcelNumber: "789-012-345",
    zoning: "Mixed Use",
    createdAt: new Date("2025-02-10T09:15:00Z"),
    updatedAt: new Date("2025-05-01T10:45:00Z"),
  },
  {
    id: 3,
    address: "789 Oak Drive",
    city: "Austin",
    state: "TX",
    zipCode: "78701",
    propertyType: "Single Family",
    bedrooms: 3,
    bathrooms: "2.5",
    squareFeet: "2100",
    lotSize: "0.15",
    yearBuilt: 2005,
    description: "Contemporary home in vibrant neighborhood",
    parcelNumber: "567-890-123",
    zoning: "Residential",
    createdAt: new Date("2025-03-05T15:30:00Z"),
    updatedAt: new Date("2025-04-28T11:20:00Z"),
  }
];

const appraisals = [
  {
    id: 1,
    propertyId: 1,
    appraiserId: 101,
    createdAt: new Date("2025-03-10T09:00:00Z"),
    completedAt: new Date("2025-03-15T14:30:00Z"),
    status: "completed",
    purpose: "Refinance",
    marketValue: "850000",
    valuationMethod: "Sales Comparison Approach",
    effectiveDate: new Date("2025-03-15"),
    reportDate: new Date("2025-03-16"),
  },
  {
    id: 2,
    propertyId: 2,
    appraiserId: 102,
    createdAt: new Date("2025-04-05T10:15:00Z"),
    completedAt: null,
    status: "in_progress",
    purpose: "Purchase",
    marketValue: null,
    valuationMethod: "Income Approach",
    effectiveDate: new Date("2025-04-20"),
    reportDate: null,
  },
  {
    id: 3,
    propertyId: 3,
    appraiserId: 101,
    createdAt: new Date("2025-04-12T11:30:00Z"),
    completedAt: new Date("2025-04-18T16:45:00Z"),
    status: "completed",
    purpose: "Refinance",
    marketValue: "625000",
    valuationMethod: "Sales Comparison Approach",
    effectiveDate: new Date("2025-04-18"),
    reportDate: new Date("2025-04-19"),
  }
];

const comparables = [
  {
    id: 1,
    appraisalId: 1,
    address: "125 Main Street",
    city: "San Francisco",
    state: "CA",
    zipCode: "94105",
    propertyType: "Single Family",
    bedrooms: 4,
    bathrooms: "3",
    squareFeet: "2450",
    lotSize: "0.23",
    yearBuilt: 1997,
    salePrice: "840000",
    saleDate: new Date("2024-12-10"),
    distance: "0.1",
    notes: "Very similar property, recent sale",
    adjustedValue: "845000",
    createdAt: new Date("2025-03-12T10:30:00Z"),
  },
  {
    id: 2,
    appraisalId: 1,
    address: "130 Elm Street",
    city: "San Francisco",
    state: "CA",
    zipCode: "94105",
    propertyType: "Single Family",
    bedrooms: 4,
    bathrooms: "3.5",
    squareFeet: "2600",
    lotSize: "0.26",
    yearBuilt: 2000,
    salePrice: "875000",
    saleDate: new Date("2025-01-15"),
    distance: "0.3",
    notes: "Slightly larger with updated kitchen",
    adjustedValue: "855000",
    createdAt: new Date("2025-03-12T11:45:00Z"),
  }
];

const marketData = [
  {
    id: 1,
    zipCode: "94105",
    period: "2025-Q1",
    medianSalePrice: "825000",
    averageSalePrice: "842000",
    averagePricePerSqft: "380",
    totalSales: 48,
    averageDaysOnMarket: "22",
    propertyType: "Single Family",
    createdAt: new Date("2025-04-05T09:30:00Z"),
    updatedAt: new Date("2025-04-05T09:30:00Z"),
  },
  {
    id: 2,
    zipCode: "10022",
    period: "2025-Q1",
    medianSalePrice: "1250000",
    averageSalePrice: "1340000",
    averagePricePerSqft: "1120",
    totalSales: 36,
    averageDaysOnMarket: "35",
    propertyType: "Condominium",
    createdAt: new Date("2025-04-05T10:15:00Z"),
    updatedAt: new Date("2025-04-05T10:15:00Z"),
  },
  {
    id: 3,
    zipCode: "78701",
    period: "2025-Q1",
    medianSalePrice: "620000",
    averageSalePrice: "635000",
    averagePricePerSqft: "310",
    totalSales: 52,
    averageDaysOnMarket: "18",
    propertyType: "Single Family",
    createdAt: new Date("2025-04-05T11:00:00Z"),
    updatedAt: new Date("2025-04-05T11:00:00Z"),
  }
];

module.exports = {
  properties,
  appraisals,
  comparables,
  marketData
};