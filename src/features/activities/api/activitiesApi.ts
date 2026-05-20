import { api } from '../../../config/api';
import { Activity } from '../../../types/activity';

export const activitiesApi = {
  /**
   * Busca todas as atividades do utilizador logado.
   */
  getUserActivities: async (): Promise<Activity[]> => {
    const { data } = await api.get<Activity[]>('/activities');
    return data;
  },
};
