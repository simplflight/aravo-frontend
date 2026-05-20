export type DailyTrackingStatus = 'COMPLETED' | 'FROZEN';

export interface DailyRecord {
  date: string; // Formato "YYYY-MM-DD"
  count: number;
  status: DailyTrackingStatus;
}

export interface StreakCalendarResponse {
  currentStreak: number;
  highestStreak: number;
  history: DailyRecord[];
}
