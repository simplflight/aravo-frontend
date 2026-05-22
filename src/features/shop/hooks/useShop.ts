import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { shopApi } from '../api/shopApi';
import { useAuthStore } from '../../../store/useAuthStore';
import { Item } from '../../../types/shop';

export function useShop() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const queryClient = useQueryClient();

  const [buyingId, setBuyingId] = useState<string | null>(null);

  // Busca de itens com cache
  const query = useQuery({
    queryKey: ['shopItems'],
    queryFn: shopApi.getItems,
  });

  // Mutação otimista de compra
  const buyMutation = useMutation({
    mutationFn: (itemId: string) => shopApi.buyItem(itemId),
    onMutate: async (itemId) => {
      const purchasedItem = query.data?.find(i => i.id === itemId);
      if (!user || !purchasedItem) return { previousUser: user };

      const previousUser = { ...user };

      // Atualização otimista do Zustand (UX sem delays)
      setUser({
        ...user,
        points: user.points - purchasedItem.price
      });
      
      return { previousUser };
    },
    onError: (err, itemId, context) => {
      // Rollback em caso de falha de rede
      if (context?.previousUser) {
        setUser(context.previousUser);
      }
      Alert.alert('Erro na transação', 'A sua compra não pôde ser completada e o XP foi devolvido.');
    },
    onSuccess: (_, itemId) => {
      const purchasedItem = query.data?.find(i => i.id === itemId);
      Alert.alert('Compra realizada!', `Você adquiriu ${purchasedItem?.name}.`);
      // Opcional: Invalidar inventário se existir uma query para isso
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
    onSettled: () => {
      setBuyingId(null);
    }
  });

  // Função utilitária memoizada para disparar a compra
  const handleBuy = useCallback((item: Item) => {
    if (!user || user.points < item.price) return;
    setBuyingId(item.id);
    buyMutation.mutate(item.id);
  }, [user, buyMutation]);

  return {
    ...query,
    items: query.data,
    userPoints: user?.points || 0,
    buyingId,
    handleBuy,
  };
}
