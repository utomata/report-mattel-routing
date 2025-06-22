import { useQuery } from '@tanstack/react-query';
import { apiService, MetricsComparison, AgentPerformanceComparison, WeeklyDistributionData } from '../lib/api';

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
  const weeklyDistributionQuery = useWeeklyDistribution();

  return {
    metrics: metricsQuery.data,
    agentPerformance: agentPerformanceQuery.data,
    weeklyDistribution: weeklyDistributionQuery.data,
    isLoading: metricsQuery.isLoading || agentPerformanceQuery.isLoading || weeklyDistributionQuery.isLoading,
    isError: metricsQuery.isError || agentPerformanceQuery.isError || weeklyDistributionQuery.isError,
    error: metricsQuery.error || agentPerformanceQuery.error || weeklyDistributionQuery.error,
    refetch: () => {
      metricsQuery.refetch();
      agentPerformanceQuery.refetch();
      weeklyDistributionQuery.refetch();
    },
  };
}; 