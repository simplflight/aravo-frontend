import React from 'react';
import { View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  // As classes abaixo serão substituídas pelos SVGs reais posteriormente
  placeholder: {
    width: '100%',
    height: '100%',
  },
  potion: {
    backgroundColor: 'red',
  },
  sword: {
    backgroundColor: 'gray',
  },
  default: {
    backgroundColor: 'black',
  },
});

/**
 * Dicionário de mapeamento das iconKeys vindas da API
 */
const ICON_DICTIONARY: Record<string, React.ReactNode> = {
  'icon-potion': <View style={[styles.placeholder, styles.potion]} />,
  'icon-sword': <View style={[styles.placeholder, styles.sword]} />,
  'icon-default': <View style={[styles.placeholder, styles.default]} />,
};

interface IconProps {
  iconKey: string;
  size?: number;
}

/**
 * Componente responsável por renderizar ícones baseados na resposta do backend
 * @param {string} iconKey - Chave do ícone vinda do DTO do backend
 * @param {number} [size=24] - Tamanho opcional do ícone.
 */
export function Icon({ iconKey, size = 24 }: IconProps) {
  const iconToRender = ICON_DICTIONARY[iconKey] || ICON_DICTIONARY['icon-default'];

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {iconToRender}
    </View>
  );
}
