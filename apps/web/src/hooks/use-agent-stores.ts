import { useState, useEffect } from 'react';
import { apiService } from '@/lib/api';

interface AgentStore {
  name: string;
  sales: number;
  coverage_status: string;
  weekly_visits: number;
  daily_visits: {
    Monday: number;
    Tuesday: number;
    Wednesday: number;
    Thursday: number;
    Friday: number;
    Saturday: number;
    Sunday: number;
  };
}

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
        const response = await fetch(`http://127.0.0.1:8000/api/coverage/agent-stores/${encodeURIComponent(agentName)}`);
        if (!response.ok) {
          throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
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