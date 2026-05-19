import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  TouchableOpacityProps 
} from 'react-native';
import { Colors } from '../../constants/colors';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  isLoading?: boolean;
  variant?: 'primary' | 'outline'; // Permite reaproveitar o botão para ações secundárias
}

/**
 * Componente de botão padronizado com suporte a estado de carregamento.
 */
export function Button({ 
  title, 
  isLoading = false, 
  variant = 'primary', 
  style, 
  disabled, 
  ...rest 
}: ButtonProps) {
  
  const isPrimary = variant === 'primary';
  const isDisabled = disabled || isLoading;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={isDisabled}
      style={[
        styles.button,
        isPrimary ? styles.primaryBackground : styles.outlineBackground,
        isDisabled && styles.disabled,
        style,
      ]}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator color={isPrimary ? Colors.surface : Colors.primary} />
      ) : (
        <Text 
          style={[
            styles.text, 
            isPrimary ? styles.primaryText : styles.outlineText
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    flexDirection: 'row',
  },
  primaryBackground: {
    backgroundColor: Colors.primary,
  },
  outlineBackground: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  primaryText: {
    color: Colors.surface,
  },
  outlineText: {
    color: Colors.primary,
  },
});
