import { useState, useEffect } from 'react';
import { apiService } from '@/lib/api';

interface ChainStore {
  store_id: string;
  name: string;
  sales: number;
  weekly_visits: number;
  min_weekly_visits: number;
  max_weekly_visits: number;
  coverage_status: string;
  daily_visits: {
    Monday: number;
    Tuesday: number;
    Wednesday: number;
    Thursday: number;
    Friday: number;
    Saturday: number;
    Sunday: number;
  };
  latitude: number;
  longitude: number;
}

interface ChainStoresData {
  chain: string;
  total_stores: number;
  stores: ChainStore[];
}

export const useChainStores = (chainName: string | null) => {
  const [data, setData] = useState<ChainStoresData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!chainName) {
      setData(null);
      return;
    }

    const fetchChainStores = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`http://127.0.0.1:8000/api/coverage/chain-stores/${encodeURIComponent(chainName)}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch chain stores: ${response.status}`);
        }
        const responseData = await response.json();
        setData(responseData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch chain stores'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchChainStores();
  }, [chainName]);

  return {
    data,
    isLoading,
    error,
    stores: data?.stores || [],
    totalStores: data?.total_stores || 0
  };
}; 