import { useQuery } from '@tanstack/react-query';
import { apiService } from '../lib/api';

// Agent Performance (Coverage View)
export const useAgentPerformance = () => {
  return useQuery({
    queryKey: ['coverage', 'agent-performance'],
    queryFn: () => apiService.getAgentPerformance(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Store Chain Analysis
export const useStoreChainAnalysis = () => {
  return useQuery({
    queryKey: ['coverage', 'store-chain-analysis'],
    queryFn: () => apiService.getStoreChainAnalysis(),
    staleTime: 5 * 60 * 1000,
  });
};

// Top Stores Analysis - Note: This endpoint was removed
export const useTopStoresAnalysis = () => {
  return useQuery({
    queryKey: ['coverage', 'top-stores'],
    queryFn: () => Promise.resolve({ stores: [] }),
    staleTime: 5 * 60 * 1000,
    enabled: false, // Disabled since this endpoint was removed
  });
};

// Visit Time Distribution
export const useVisitTimeDistribution = () => {
  return useQuery({
    queryKey: ['coverage', 'visit-time-distribution'],
    queryFn: () => apiService.getVisitTimeDistribution(),
    staleTime: 5 * 60 * 1000,
  });
};

// Combined hook for all coverage data
export const useCoverageData = () => {
  const agentPerformanceQuery = useAgentPerformance();
  const storeChainAnalysisQuery = useStoreChainAnalysis();
  const visitTimeDistributionQuery = useVisitTimeDistribution();

  return {
    agentPerformance: agentPerformanceQuery.data,
    storeChainAnalysis: storeChainAnalysisQuery.data,
    visitTimeDistribution: visitTimeDistributionQuery.data,
    isLoading:
      agentPerformanceQuery.isLoading ||
      storeChainAnalysisQuery.isLoading ||
      visitTimeDistributionQuery.isLoading,
    isError:
      agentPerformanceQuery.isError ||
      storeChainAnalysisQuery.isError ||
      visitTimeDistributionQuery.isError,
    error:
      agentPerformanceQuery.error ||
      storeChainAnalysisQuery.error ||
      visitTimeDistributionQuery.error,
  };
}; 