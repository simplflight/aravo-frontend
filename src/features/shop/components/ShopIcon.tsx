import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../constants/colors';

interface ShopIconProps {
  iconKey: string;
  size?: number;
  grayscale?: boolean;
}

/**
 * Padrão Icon Mapper: Transforma chaves de texto da API em componentes visuais nativos.
 */
export function ShopIcon({ iconKey, size = 40, grayscale = false }: ShopIconProps) {
  const color = grayscale ? Colors.textSecondary : Colors.primary;

  // 1. Verificamos se é um ícone mapeado na nossa biblioteca do Ionicons
  const isIonicons = [
    'shield-check', 'flame', 'potion', 'zap', 'cart', 'star', 'snow'
  ].includes(iconKey);

  if (isIonicons) {
    // Fazemos um de-para seguro para os nomes exatos do Ionicons
    let mappedName: keyof typeof Ionicons.glyphMap = 'help-circle';
    
    if (iconKey === 'shield-check') mappedName = 'shield-checkmark';
    if (iconKey === 'flame') mappedName = 'flame';
    if (iconKey === 'potion') mappedName = 'flask'; // Aproximação
    if (iconKey === 'zap') mappedName = 'flash';
    if (iconKey === 'snow') mappedName = 'snow';

    return <Ionicons name={mappedName} size={size} color={color} />;
  }

  // 2. Se não for um ícone vetorial conhecido, assumimos que o backend mandou um Emoji puro (ex: ❄️)
  return (
    <Text style={[
      styles.emoji, 
      { fontSize: size },
      grayscale && styles.grayscaleEmoji
    ]}>
      {iconKey}
    </Text>
  );
}

const styles = StyleSheet.create({
  emoji: {
    textAlign: 'center',
  },
  grayscaleEmoji: {
    opacity: 0.4, // O efeito visual mais próximo de grayscale num Emoji nativo do OS
  }
});
