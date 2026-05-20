import { useQuery } from '@tanstack/react-query';
import { activitiesApi } from '../api/activitiesApi';

/**
 * Hook para gerir o ciclo de vida e cache da lista de atividades.
 */
export function useActivities() {
  return useQuery({
    queryKey: ['activities'],
    queryFn: activitiesApi.getUserActivities,
  });
}
