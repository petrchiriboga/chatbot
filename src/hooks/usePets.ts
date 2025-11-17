import { useEffect, useState } from 'react';
import { Pet } from '@/types/pet';
import { useAuth } from '@/contexts/AuthContext';

export function usePets() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, idToken } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !idToken) {
      setPets([]);
      return;
    }

    const fetchPets = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('http://localhost:8080/account/pet-profiles', {
          headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch pets: ${response.statusText}`);
        }

        const data = await response.json();
        setPets(data.data || []);
      } catch (err) {
        console.error('Error fetching pets:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch pets');
        setPets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, [isAuthenticated, idToken]);

  return { pets, loading, error };
}
