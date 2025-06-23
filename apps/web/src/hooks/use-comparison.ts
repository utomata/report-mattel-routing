import { useQuery } from '@tanstack/react-query';
import { apiService, MetricsComparison, AgentPerformanceComparison, StorePerformanceComparison, WeeklyDistributionData } from '../lib/api';

// Core comparison metrics
export const useComparisonMetrics = () => {
  return useQuery({
    queryKey: ['comparison', 'metrics'],
    queryFn: () => apiService.getComparisonMetrics(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Agent performance comparison
export const useAgentPerformanceComparison = () => {
  return useQuery({
    queryKey: ['comparison', 'agent-performance'],
    queryFn: () => apiService.getAgentPerformanceComparison(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Store performance comparison
export const useStorePerformanceComparison = () => {
  return useQuery({
    queryKey: ['comparison', 'store-performance'],
    queryFn: () => apiService.getStorePerformanceComparison(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Weekly distribution comparison
export const useWeeklyDistribution = () => {
  return useQuery({
    queryKey: ['comparison', 'weekly-distribution'],
    queryFn: () => apiService.getWeeklyDistribution(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Combined comparison data hook
export const useComparisonData = () => {
  const metricsQuery = useComparisonMetrics();
  const agentPerformanceQuery = useAgentPerformanceComparison();
  const storePerformanceQuery = useStorePerformanceComparison();
  const weeklyDistributionQuery = useWeeklyDistribution();

  return {
    metrics: metricsQuery.data,
    agentPerformance: agentPerformanceQuery.data,
    storePerformance: storePerformanceQuery.data,
    weeklyDistribution: weeklyDistributionQuery.data,
    isLoading: metricsQuery.isLoading || agentPerformanceQuery.isLoading || storePerformanceQuery.isLoading || weeklyDistributionQuery.isLoading,
    isError: metricsQuery.isError || agentPerformanceQuery.isError || storePerformanceQuery.isError || weeklyDistributionQuery.isError,
    error: metricsQuery.error || agentPerformanceQuery.error || storePerformanceQuery.error || weeklyDistributionQuery.error,
    refetch: () => {
      metricsQuery.refetch();
      agentPerformanceQuery.refetch();
      storePerformanceQuery.refetch();
      weeklyDistributionQuery.refetch();
    },
  };
}; 