import React, { useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useShop } from '../hooks/useShop';
import { Item } from '../../../types/shop';
import { ShopItemCard } from '../components/ShopItemCard';
import { TopBar } from '../../../components/Header/TopBar';
import { Colors } from '../../../constants/colors';

export function ShopScreen() {
  const insets = useSafeAreaInsets();
  const { items, isLoading, isError, userPoints, buyingId, handleBuy, refetch, isRefetching } = useShop();

  // useCallback evita que a referência da função mude, otimizando o FlashList
  const renderItem = useCallback(({ item }: { item: Item }) => {
    const canAfford = userPoints >= item.price;
    const isBuying = buyingId === item.id;

    return (
      <ShopItemCard 
        item={item} 
        canAfford={canAfford} 
        isBuying={isBuying} 
        onBuy={handleBuy} 
      />
    );
  }, [userPoints, buyingId, handleBuy]);

  // keyExtractor memoizado
  const keyExtractor = useCallback((item: Item) => item.id, []);

  return (
    <View style={styles.container}>
      <TopBar />

      <View style={styles.header}>
        <Text style={styles.title}>Loja de Recompensas</Text>
        <Text style={styles.subtitle}>Use o seu XP para adquirir vantagens no Aravo.</Text>
      </View>

      {isError ? (
        <Text style={styles.errorText}>Erro ao carregar a vitrine. Puxe para atualizar.</Text>
      ) : (
        <View style={styles.listContainer}>
          <FlashList
            data={items || []}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            // @ts-expect-error - Conflito conhecido de tipagem entre @shopify/flash-list e @types/react 19
            estimatedItemSize={110} 
            contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 + insets.bottom }}
            showsVerticalScrollIndicator={false}
            refreshing={isRefetching || (isLoading && !items)}
            onRefresh={refetch}
            ListEmptyComponent={
              !isLoading ? <Text style={styles.emptyText}>Nenhum item disponível no momento.</Text> : null
            }
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: 24, paddingBottom: 16 },
  title: { fontSize: 28, fontWeight: 'bold', color: Colors.text },
  subtitle: { fontSize: 16, color: Colors.textSecondary, marginTop: 4 },
  listContainer: { flex: 1 }, // FlashList exige que o pai tenha flex: 1 ou dimensão fixa
  errorText: { textAlign: 'center', marginTop: 24, color: Colors.error },
  emptyText: { textAlign: 'center', marginTop: 40, color: Colors.textSecondary },
});
