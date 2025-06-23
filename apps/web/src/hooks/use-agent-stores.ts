import { useState, useEffect } from 'react';
import { apiService, type AgentStore } from '@/lib/api';

interface UseAgentStoresResult {
  stores: AgentStore[];
  isLoading: boolean;
  error: Error | null;
}

export const useAgentStores = (agentName: string | null): UseAgentStoresResult => {
  const [stores, setStores] = useState<AgentStore[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!agentName) {
      setStores([]);
      return;
    }

    const fetchAgentStores = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await apiService.getAgentStores(agentName);
        setStores(data.stores || []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch agent stores'));
        setStores([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgentStores();
  }, [agentName]);

  return { stores, isLoading, error };
}; 