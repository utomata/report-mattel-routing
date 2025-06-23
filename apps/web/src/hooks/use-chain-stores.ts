import { useState, useEffect } from 'react';
import { apiService, type ChainStore, type ChainStoresData } from '@/lib/api';

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
        
        const responseData = await apiService.getChainStores(chainName);
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