import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../constants/colors';

interface ShopIconProps {
  iconKey: string;
  size?: number;
  grayscale?: boolean;
}

/**
 * Padrão Icon Mapper: Lê o "iconKey" do backend e renderiza o SVG correspondente.
 */
export function ShopIcon({ iconKey, size = 40, grayscale = false }: ShopIconProps) {
  // Se o utilizador não tiver pontos suficientes, o ícone fica com a cor de texto secundário (cinza)
  const color = grayscale ? Colors.textSecondary : Colors.primary;

  let mappedName: keyof typeof Ionicons.glyphMap | null = null;

  // De-Para: String do Backend -> Ícone do Expo
  switch (iconKey) {
    case 'ic_streak_freeze':
      mappedName = 'snow'; // Um floco de neve representa perfeitamente o "Freeze"
      break;
    case 'ic_xp_boost':
      mappedName = 'flash'; // Um raio representa o "Boost" de energia/XP
      break;
  }

  if (mappedName) {
    return <Ionicons name={mappedName} size={size} color={color} />;
  }

  // Fallback de segurança: Se o backend mandar um ícone novo que o frontend ainda não conhece
  return (
    <View style={styles.fallbackContainer}>
      <Text style={[styles.fallbackEmoji, grayscale && styles.grayscaleEmoji]}>📦</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fallbackContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackEmoji: {
    fontSize: 24,
  },
  grayscaleEmoji: {
    opacity: 0.4,
  }
});
