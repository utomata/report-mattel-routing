import { useQuery } from '@tanstack/react-query';
import { apiService, KPIMetrics, EfficiencyComparison, StoreChainDistribution } from '../lib/api';

// Dashboard KPI metrics
export const useDashboardKPIs = () => {
  return useQuery({
    queryKey: ['dashboard', 'kpis'],
    queryFn: () => apiService.getDashboardKPIs(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });
};

// Daily efficiency comparison
export const useEfficiencyComparison = () => {
  return useQuery({
    queryKey: ['dashboard', 'efficiency-comparison'],
    queryFn: () => apiService.getEfficiencyComparison(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Store chain distribution
export const useStoreChainDistribution = () => {
  return useQuery({
    queryKey: ['dashboard', 'store-chain-distribution'],
    queryFn: () => apiService.getStoreChainDistribution(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Combined dashboard data hook
export const useDashboardData = () => {
  const kpisQuery = useDashboardKPIs();
  const efficiencyQuery = useEfficiencyComparison();
  const chainDistributionQuery = useStoreChainDistribution();

  return {
    kpis: kpisQuery.data,
    efficiencyComparison: efficiencyQuery.data,
    storeChainDistribution: chainDistributionQuery.data,
    isLoading: kpisQuery.isLoading || efficiencyQuery.isLoading || chainDistributionQuery.isLoading,
    isError: kpisQuery.isError || efficiencyQuery.isError || chainDistributionQuery.isError,
    error: kpisQuery.error || efficiencyQuery.error || chainDistributionQuery.error,
    refetch: () => {
      kpisQuery.refetch();
      efficiencyQuery.refetch();
      chainDistributionQuery.refetch();
    },
  };
}; 