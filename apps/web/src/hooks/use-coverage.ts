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

// Sales Range Analysis
export const useSalesRangeAnalysis = () => {
  return useQuery({
    queryKey: ['coverage', 'sales-range-analysis'],
    queryFn: () => apiService.getSalesRangeAnalysis(),
    staleTime: 5 * 60 * 1000,
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
  const salesRangeAnalysisQuery = useSalesRangeAnalysis();
  const visitTimeDistributionQuery = useVisitTimeDistribution();

  return {
    agentPerformance: agentPerformanceQuery.data,
    storeChainAnalysis: storeChainAnalysisQuery.data,
    salesRangeAnalysis: salesRangeAnalysisQuery.data,
    visitTimeDistribution: visitTimeDistributionQuery.data,
    isLoading:
      agentPerformanceQuery.isLoading ||
      storeChainAnalysisQuery.isLoading ||
      salesRangeAnalysisQuery.isLoading ||
      visitTimeDistributionQuery.isLoading,
    isError:
      agentPerformanceQuery.isError ||
      storeChainAnalysisQuery.isError ||
      salesRangeAnalysisQuery.isError ||
      visitTimeDistributionQuery.isError,
    error:
      agentPerformanceQuery.error ||
      storeChainAnalysisQuery.error ||
      salesRangeAnalysisQuery.error ||
      visitTimeDistributionQuery.error,
  };
}; 