import { useQuery } from '@tanstack/react-query';
import { apiService, StoresData, AgentsData, RoutesData } from '../lib/api';

// Fetch all stores
export const useStores = () => {
  return useQuery<StoresData>({
    queryKey: ['maps', 'stores'],
    queryFn: () => apiService.getStores(),
    staleTime: Infinity, // Store locations don't change often
  });
};

// Fetch all agents
export const useAgents = () => {
  return useQuery<AgentsData>({
    queryKey: ['maps', 'agents'],
    queryFn: () => apiService.getAgents(),
    staleTime: Infinity, // Agent home locations don't change often
  });
};

// Fetch routes for a given process type
export const useRoutes = (processType: 'manual' | 'optimized') => {
  return useQuery<RoutesData>({
    queryKey: ['maps', 'routes', processType],
    queryFn: () => apiService.getRoutes(processType),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!processType, // Only run if processType is provided
  });
}; 