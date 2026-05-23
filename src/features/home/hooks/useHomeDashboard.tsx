import { useMemo, useCallback } from 'react';
import { useStreakCalendar } from './useStreakCalendar';
import { useAuthStore } from '../../../store/useAuthStore';

interface WeekDayInfo {
  day: string;
  isCompleted: boolean;
  isFrozen: boolean;
  isActive: boolean;
}

/**
 * Hook responsável por orquestrar a lógica de negócio da Home Screen.
 * Isola o processamento de datas e sincronização de estado.
 */
export function useHomeDashboard() {
  const user = useAuthStore((state) => state.user);

  const todayDate = new Date();
  const currentMonth = todayDate.getMonth() + 1;
  const currentYear = todayDate.getFullYear();

  const { 
    data: streakData, 
    isLoading, 
    refetch, 
    isRefetching 
  } = useStreakCalendar(currentMonth, currentYear);

  // Lógica de cálculo transferida para fora da camada visual
  const weekDays = useMemo<WeekDayInfo[]>(() => {
    const days: WeekDayInfo[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      const dayName = d.toLocaleDateString('pt-BR', { weekday: 'short' }).charAt(0).toUpperCase();
      const record = streakData?.history.find(r => r.date === dateStr);
      
      const isCompleted = record?.status === 'COMPLETED';
      const isFrozen = record?.status === 'FROZEN';

      days.push({ 
        day: dayName, 
        isCompleted: isCompleted || false,
        isFrozen: isFrozen || false,
        isActive: isCompleted || isFrozen || false
      });
    }
    return days;
  }, [streakData]);

  // Envolve o refetch num useCallback para evitar recriações desnecessárias da função
  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    user,
    weekDays,
    isLoading,
    isRefetching,
    handleRefresh,
  };
}
