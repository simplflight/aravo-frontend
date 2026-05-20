import { api } from '../../../config/api';
import { StreakCalendarResponse } from '../../../types/streak';

export const streakApi = {
  getCalendar: async (month: number, year: number): Promise<StreakCalendarResponse> => {
    const { data } = await api.get<StreakCalendarResponse>('/users/me/streak', {
      params: { month, year },
    });
    return data;
  },
};
