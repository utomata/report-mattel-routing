import { useState, useEffect } from 'react';
import { apiService, AgentTimeDistribution } from '@/lib/api';

export const useAgentTimeDistribution = () => {
  const [data, setData] = useState<AgentTimeDistribution | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTimeDistribution = async () => {
      try {
        setLoading(true);
        setError(null);
        const timeDistributionData = await apiService.getAgentTimeDistribution();
        setData(timeDistributionData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch time distribution data');
        console.error('Error fetching agent time distribution:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTimeDistribution();
  }, []);

  return { data, loading, error };
}; 