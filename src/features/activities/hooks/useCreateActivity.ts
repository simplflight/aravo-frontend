import { useMutation, useQueryClient } from '@tanstack/react-query';
import { activitiesApi } from '../api/activitiesApi';
import { Activity, ActivityCategory } from '../../../types/activity';

export function useCreateActivity() {
  const queryClient = useQueryClient();

  // 1º Dado retornado (Activity) | 2º Tipo do Erro (Error) | 3º Variável de entrada (ActivityCategory)
  return useMutation<Activity, Error, ActivityCategory>({
    mutationFn: (category: ActivityCategory) => activitiesApi.startActivity(category),
    onSuccess: () => {
      // Invalida o cache para atualizar a lista automaticamente
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
  });
}
