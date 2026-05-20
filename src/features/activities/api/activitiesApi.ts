import { api } from '../../../config/api';
import { Activity, ActivityCategory, ActivityCompleteRequest } from '../../../types/activity';

export const activitiesApi = {
  getUserActivities: async (): Promise<Activity[]> => {
    const { data } = await api.get<Activity[]>('/activities');
    return data;
  },

  startActivity: async (category: ActivityCategory): Promise<Activity> => {
    // Atualizado para a nova rota /start
    const { data } = await api.post<Activity>('/activities/start', { category });
    return data;
  },

  completeActivity: async (id: string, payload: ActivityCompleteRequest): Promise<Activity> => {
    // Nova rota de conclusão
    const { data } = await api.post<Activity>(`/activities/${id}/complete`, payload);
    return data;
  }
};
