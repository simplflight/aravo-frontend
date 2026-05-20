import { api } from '../../../config/api';
import { Activity, ActivityCategory } from '../../../types/activity';

export const activitiesApi = {
  getUserActivities: async (): Promise<Activity[]> => {
    const { data } = await api.get<Activity[]>('/activities');
    return data;
  },

  /**
   * Inicia uma nova atividade.
   */
  createActivity: async (category: ActivityCategory): Promise<Activity> => {
    // Presumindo que o DTO ActivityRequest exija o campo 'category'
    const { data } = await api.post<Activity>('/activities', { category });
    return data;
  },
};
