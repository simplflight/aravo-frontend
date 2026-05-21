import { api } from '../../../config/api';
import { Item } from '../../../types/shop';

export const shopApi = {
  // Busca todos os itens disponíveis na vitrine
  getItems: async (): Promise<Item[]> => {
    const { data } = await api.get<Item[]>('/items');
    return data;
  },

  // Efetua a compra do item e o backend deve descontar o XP internamente
  buyItem: async (itemId: string): Promise<void> => {
    await api.post(`/items/buy/${itemId}`);
  }
};
