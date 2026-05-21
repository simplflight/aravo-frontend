import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';

import { shopApi } from '../api/shopApi';
import { useAuthStore } from '../../../store/useAuthStore';
import { Item } from '../../../types/shop';

import { ShopIcon } from '../components/ShopIcon';
import { Button } from '../../../components/Button/Button';
import { Colors } from '../../../constants/colors';
import { TopBar } from '../../../components/Header/TopBar'; // Reaproveitamos a barra para mostrar o XP!

export function ShopScreen() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const navigation = useNavigation();

  const [buyingId, setBuyingId] = useState<string | null>(null);

  // Busca os itens da vitrine
  const { data: items, isLoading, isError } = useQuery({
    queryKey: ['shopItems'],
    queryFn: shopApi.getItems,
  });

  // Mutação de Compra
  const buyMutation = useMutation({
    mutationFn: (itemId: string) => shopApi.buyItem(itemId),
    onSuccess: (_, itemId) => {
      // Magia do Zustand: Se comprou com sucesso, nós descontamos o XP imediatamente no Frontend
      // para não precisarmos fazer uma nova requisição ao /users/me !
      const purchasedItem = items?.find(i => i.id === itemId);
      if (user && purchasedItem) {
        setUser({
          ...user,
          points: user.points - purchasedItem.price
        });
        Alert.alert('Compra realizada!', `Você adquiriu ${purchasedItem.name}.`);
      }
    },
    onError: () => {
      Alert.alert('Erro', 'Não foi possível completar a transação.');
    },
    onSettled: () => {
      setBuyingId(null);
    }
  });

  const handleBuy = (item: Item) => {
    if (!user || user.points < item.price) return;
    setBuyingId(item.id);
    buyMutation.mutate(item.id);
  };

  if (!user) return null;

  return (
    <View style={styles.container}>
      {/* A TopBar entra aqui para o utilizador ver o seu saldo de XP atual ao vivo! */}
      <TopBar />

      <View style={styles.header}>
        <Text style={styles.title}>Loja de Recompensas</Text>
        <Text style={styles.subtitle}>Use o seu XP para adquirir vantagens no Aravo.</Text>
      </View>

      {isLoading ? (
        <Text style={styles.loadingText}>Carregando vitrine...</Text>
      ) : isError ? (
        <Text style={styles.errorText}>Erro ao carregar a loja.</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const canAfford = user.points >= item.price;
            const isBuying = buyingId === item.id;

            return (
              <View style={[styles.card, !canAfford && styles.cardDisabled]}>
                <View style={styles.iconContainer}>
                  {/* Nosso Mapper nativo em ação! */}
                  <ShopIcon iconKey={item.iconKey} size={48} grayscale={!canAfford} />
                </View>
                
                <View style={styles.infoContainer}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemDesc}>{item.description}</Text>
                </View>
                
                <View style={styles.actionContainer}>
                  <Text style={[styles.priceText, !canAfford && styles.priceTextDisabled]}>
                    ⚡ {item.price}
                  </Text>
                  
                  <Button 
                    title="Comprar" 
                    onPress={() => handleBuy(item)} 
                    disabled={!canAfford || isBuying}
                    isLoading={isBuying}
                    style={styles.buyButton}
                  />
                </View>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: 24, paddingBottom: 16 },
  title: { fontSize: 28, fontWeight: 'bold', color: Colors.text },
  subtitle: { fontSize: 16, color: Colors.textSecondary, marginTop: 4 },
  listContent: { paddingHorizontal: 24, paddingBottom: 40 },
  loadingText: { textAlign: 'center', marginTop: 24 },
  errorText: { textAlign: 'center', marginTop: 24, color: Colors.error },
  
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  cardDisabled: {
    backgroundColor: '#F8F9FA',
    borderColor: '#E9ECEF',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: { fontSize: 16, fontWeight: 'bold', color: Colors.text },
  itemDesc: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  
  actionContainer: {
    alignItems: 'flex-end',
    marginLeft: 12,
  },
  priceText: { fontSize: 16, fontWeight: 'bold', color: Colors.primary, marginBottom: 8 },
  priceTextDisabled: { color: Colors.textSecondary },
  buyButton: { height: 36, width: 90 },
});
