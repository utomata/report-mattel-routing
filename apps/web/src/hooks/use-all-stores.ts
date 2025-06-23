import { useState, useEffect } from 'react';
import { apiService, AllStoresData } from '@/lib/api';

export const useAllStores = () => {
  const [data, setData] = useState<AllStoresData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllStores = async () => {
      try {
        setLoading(true);
        setError(null);
        const storesData = await apiService.getAllStores();
        setData(storesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stores data');
        console.error('Error fetching all stores:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllStores();
  }, []);

  return { data, loading, error };
}; 