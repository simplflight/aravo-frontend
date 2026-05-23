import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { streakApi } from '../api/streakApi';
import { useAuthStore } from '../../../store/useAuthStore';

export function useStreakCalendar(month: number, year: number) {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const query = useQuery({
    queryKey: ['streak', year, month],
    queryFn: () => streakApi.getCalendar(month, year),
  });

  // Sincronizador de Estado: Lazy Evaluation
  useEffect(() => {
    if (query.data && user) {
      if (query.data.currentStreak !== user.streak) {
        // Se a Lazy Evaluation do backend quebrou a ofensiva ou consumiu um bloqueio,
        // nós atualizamos o Zustand silenciosamente para a TopBar refletir o valor real.
        setUser({ ...user, streak: query.data.currentStreak });
      }
    }
  }, [query.data, user, setUser]);

  return query;
}
