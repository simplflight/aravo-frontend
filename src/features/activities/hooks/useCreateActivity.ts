import { useMutation, useQueryClient } from '@tanstack/react-query';
import { activitiesApi } from '../api/activitiesApi';
import { ActivityCategory } from '../../../types/activity';

export function useCreateActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (category: ActivityCategory) => activitiesApi.createActivity(category),
    onSuccess: () => {
      // A mágica acontece aqui: ao criar com sucesso, dizemos ao React Query
      // que a lista 'activities' ficou velha. Ele fará o fetch automático e a lista na tela será atualizada!
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
  });
}
