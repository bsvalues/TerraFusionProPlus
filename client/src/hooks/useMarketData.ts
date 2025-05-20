import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '../lib/queryClient';
import { MarketData, InsertMarketData, PriceTrendDataPoint, DomTrendDataPoint, SalesTrendDataPoint, PropertyTypeDataPoint, NeighborhoodPriceDataPoint } from '../types';
import { format, parse, getYear } from 'date-fns';

const MARKET_DATA_ENDPOINT = '/api/market-data';

// Helper functions to transform raw MarketData to specific chart formats
const transformPriceTrends = (data: MarketData[]): PriceTrendDataPoint[] => {
  return data
    .filter(item => item.data_type === 'Median Price')
    .map(item => {
      // Parse quarter from "2023-Q1" format
      const [year, quarter] = item.time.split('-Q');
      // Create month string based on the quarter (Q1 = Jan, Q2 = Apr, etc.)
      const month = ['Jan', 'Apr', 'Jul', 'Oct'][parseInt(quarter) - 1];
      
      return {
        month,
        value: Number(item.value),
        year: parseInt(year)
      };
    })
    .sort((a, b) => {
      // Sort by year and then by quarter (month)
      if (a.year !== b.year) return a.year - b.year;
      const monthOrder = { 'Jan': 0, 'Apr': 1, 'Jul': 2, 'Oct': 3 };
      return monthOrder[a.month as keyof typeof monthOrder] - monthOrder[b.month as keyof typeof monthOrder];
    });
};

const transformDomTrends = (data: MarketData[]): DomTrendDataPoint[] => {
  return data
    .filter(item => item.data_type === 'Days on Market')
    .map(item => {
      const [year, quarter] = item.time.split('-Q');
      const month = ['Jan', 'Apr', 'Jul', 'Oct'][parseInt(quarter) - 1];
      
      return {
        month,
        days: Number(item.value),
        year: parseInt(year)
      };
    })
    .sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      const monthOrder = { 'Jan': 0, 'Apr': 1, 'Jul': 2, 'Oct': 3 };
      return monthOrder[a.month as keyof typeof monthOrder] - monthOrder[b.month as keyof typeof monthOrder];
    });
};

const transformSalesTrends = (data: MarketData[]): SalesTrendDataPoint[] => {
  return data
    .filter(item => item.data_type === 'Sales Volume')
    .map(item => {
      const [year, quarter] = item.time.split('-Q');
      const month = ['Jan', 'Apr', 'Jul', 'Oct'][parseInt(quarter) - 1];
      
      return {
        month,
        sales: Number(item.value),
        year: parseInt(year)
      };
    })
    .sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      const monthOrder = { 'Jan': 0, 'Apr': 1, 'Jul': 2, 'Oct': 3 };
      return monthOrder[a.month as keyof typeof monthOrder] - monthOrder[b.month as keyof typeof monthOrder];
    });
};

// This would be populated from actual data in a real implementation
const mockPropertyTypeDistribution = (): PropertyTypeDataPoint[] => {
  return [
    { name: 'Single Family', value: 65 },
    { name: 'Condo', value: 20 },
    { name: 'Multi-Family', value: 10 },
    { name: 'Commercial', value: 5 }
  ];
};

// This would be populated from actual data in a real implementation
const mockNeighborhoodPrices = (): NeighborhoodPriceDataPoint[] => {
  return [
    { name: 'Downtown', medianPrice: 950000, pricePerSqft: 780 },
    { name: 'Marina District', medianPrice: 1200000, pricePerSqft: 950 },
    { name: 'Mission District', medianPrice: 850000, pricePerSqft: 720 },
    { name: 'Nob Hill', medianPrice: 1100000, pricePerSqft: 890 },
    { name: 'Pacific Heights', medianPrice: 1500000, pricePerSqft: 1050 }
  ];
};

type MarketDataFilters = {
  location?: string;
  data_type?: string;
};

export function useMarketData(filters?: MarketDataFilters) {
  return useQuery({
    queryKey: ['market-data', filters],
    queryFn: () => {
      let url = MARKET_DATA_ENDPOINT;
      const params = new URLSearchParams();
      
      if (filters?.location) {
        params.append('location', filters.location);
      }
      
      if (filters?.data_type) {
        params.append('data_type', filters.data_type);
      }
      
      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
      
      return apiRequest<MarketData[]>({ url });
    },
  });
}

export function useCreateMarketData() {
  return useMutation({
    mutationFn: (data: InsertMarketData) => {
      return apiRequest<MarketData>({
        url: MARKET_DATA_ENDPOINT,
        method: 'POST',
        body: data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['market-data'] });
    },
  });
}

// Custom hooks for specific market data visualizations
export function usePriceTrends(location: string = 'San Francisco') {
  const { data: marketData, isLoading, error } = useMarketData({ 
    location, 
    data_type: 'Median Price' 
  });
  
  return {
    data: marketData ? transformPriceTrends(marketData) : [],
    isLoading,
    error
  };
}

export function useDaysOnMarketTrends(location: string = 'San Francisco') {
  const { data: marketData, isLoading, error } = useMarketData({ 
    location, 
    data_type: 'Days on Market' 
  });
  
  return {
    data: marketData ? transformDomTrends(marketData) : [],
    isLoading,
    error
  };
}

export function useSalesVolumeTrends(location: string = 'San Francisco') {
  const { data: marketData, isLoading, error } = useMarketData({ 
    location, 
    data_type: 'Sales Volume' 
  });
  
  return {
    data: marketData ? transformSalesTrends(marketData) : [],
    isLoading,
    error
  };
}

export function usePropertyTypeDistribution() {
  // In a real implementation, this would query and transform actual data
  return {
    data: mockPropertyTypeDistribution(),
    isLoading: false,
    error: null
  };
}

export function useNeighborhoodPrices() {
  // In a real implementation, this would query and transform actual data
  return {
    data: mockNeighborhoodPrices(),
    isLoading: false,
    error: null
  };
}