import { api } from '../../../config/api';
import { User, UserUpdateRequest } from '../../../types/auth';

export const userApi = {
  /**
   * Atualiza os dados de perfil do utilizador autenticado.
   */
  updateProfile: async (payload: UserUpdateRequest): Promise<User> => {
    // Consome o @PutMapping("/me") do vosso UserController
    const { data } = await api.put<User>('/users/me', payload);
    return data;
  },
};
