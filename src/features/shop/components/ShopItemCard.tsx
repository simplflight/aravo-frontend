import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Item } from '../../../types/shop';
import { ShopIcon } from './ShopIcon';
import { Button } from '../../../components/Button/Button';
import { Colors } from '../../../constants/colors';

interface ShopItemCardProps {
  item: Item;
  canAfford: boolean;
  isBuying: boolean;
  onBuy: (item: Item) => void;
}

/**
 * Componente puro para renderização de itens da loja.
 * O React.memo evita re-renders se as props não mudarem.
 */
function ShopItemCardComponent({ item, canAfford, isBuying, onBuy }: ShopItemCardProps) {
  return (
    <View 
      style={[styles.card, !canAfford && styles.cardDisabled]}
      // A11y: Agrupa os elementos para o leitor de ecrã ler tudo num único bloco lógico
      accessible={true}
      accessibilityRole="button"
      accessibilityState={{ disabled: !canAfford || isBuying }}
      accessibilityLabel={`Item ${item.name}. ${item.description}. Custa ${item.price} XP.`}
    >
      <View style={styles.iconContainer}>
        <ShopIcon iconKey={item.iconKey} size={48} grayscale={!canAfford} />
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.itemDesc} numberOfLines={2}>{item.description}</Text>
      </View>
      
      <View style={styles.actionContainer}>
        <Text 
          style={[styles.priceText, !canAfford && styles.priceTextDisabled]}
          importantForAccessibility="no" // Já lido no accessibilityLabel do pai
        >
          ⚡ {item.price}
        </Text>
        
        <Button 
          title="Comprar" 
          onPress={() => onBuy(item)} 
          disabled={!canAfford || isBuying}
          isLoading={isBuying}
          style={styles.buyButton}
          // Remove o componente nativo de acessibilidade do botão para não conflitar com o container pai
          importantForAccessibility="no-hide-descendants"
        />
      </View>
    </View>
  );
}

// Função de comparação para garantir que re-renders 
// ocorram apenas se o status de compra ou poder de compra mudar.
export const ShopItemCard = memo(ShopItemCardComponent, (prev, next) => {
  return (
    prev.item.id === next.item.id &&
    prev.canAfford === next.canAfford &&
    prev.isBuying === next.isBuying
  );
});

const styles = StyleSheet.create({
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
    backgroundColor: Colors.background,
    borderColor: Colors.disabledBorder,
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
  infoContainer: { flex: 1, justifyContent: 'center' },
  itemName: { fontSize: 16, fontWeight: 'bold', color: Colors.text },
  itemDesc: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  actionContainer: { alignItems: 'flex-end', marginLeft: 12 },
  priceText: { fontSize: 16, fontWeight: 'bold', color: Colors.primary, marginBottom: 8 },
  priceTextDisabled: { color: Colors.textSecondary },
  buyButton: { height: 36, width: 90 },
});
