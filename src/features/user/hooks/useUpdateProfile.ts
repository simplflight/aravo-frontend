import { useMutation } from '@tanstack/react-query';
import { userApi } from '../api/userApi';
import { useAuthStore } from '../../../store/useAuthStore';
import { User, UserUpdateRequest } from '../../../types/auth';

export function useUpdateProfile() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation<User, Error, UserUpdateRequest>({
    mutationFn: (payload) => userApi.updateProfile(payload),
    onSuccess: (updatedUser) => {
      // Sincronização mágica: Atualiza o Zustand com o novo Nome e Nickname devolvidos pela API
      if (user) {
        setUser({
          ...user,
          name: updatedUser.name,
          nickname: updatedUser.nickname,
        });
      }
    },
  });
}
