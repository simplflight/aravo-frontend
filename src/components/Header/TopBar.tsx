import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  Pressable,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppStackParamList } from '../../types/navigation';
import { useAuthStore } from '../../store/useAuthStore';
import { Colors } from '../../constants/colors';

export function TopBar() {
  const user = useAuthStore(state => state.user);
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const insets = useSafeAreaInsets(); // Para não ficar por baixo do relógio/notch do telemóvel
  
  const [menuVisible, setMenuVisible] = useState(false);

  if (!user) return null;

  const handleOpenShop = () => {
    setMenuVisible(false);
    navigation.navigate('Shop');
  };

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 16) }]}>
      
      {/* Lado Esquerdo: Futuro Espaço para o Logo ou Avatar */}
      <View style={styles.leftSide} />

      {/* Lado Direito: Status Gamificados */}
      <View style={styles.stats}>
        {/* Ofensiva (Streak) */}
        <View style={styles.statPill}>
          <Text style={styles.icon}>🔥</Text>
          <Text style={styles.statText}>{user.streak}</Text>
        </View>

        {/* XP / Pontos */}
        <TouchableOpacity 
          style={styles.statPill} 
          activeOpacity={0.7} 
          onPress={() => setMenuVisible(true)}
        >
          <Text style={styles.icon}>⚡</Text>
          <Text style={styles.statText}>{user.points}</Text>
        </TouchableOpacity>
      </View>

      {/* Modal Dropdown Transparente */}
      <Modal visible={menuVisible} transparent animationType="fade">
        <Pressable onPress={() => setMenuVisible(false)}>
          <View style={styles.modalOverlay}>
            <Pressable>
              <View style={[styles.dropdown, { top: Math.max(insets.top, 16) + 50 }]}>
                <TouchableOpacity style={styles.dropdownItem} onPress={handleOpenShop}>
                  <Text style={styles.dropdownIcon}>🛒</Text>
                  <Text style={styles.dropdownText}>Loja de Recompensas</Text>
                </TouchableOpacity>
                {/* Aqui poderemos adicionar Ranking, Conquistas, etc no futuro */}
              </View>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 16,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  leftSide: { flex: 1 },
  stats: {
    flexDirection: 'row',
    gap: 12,
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  icon: { fontSize: 16, marginRight: 4 },
  statText: { fontSize: 14, fontWeight: 'bold', color: Colors.text },
  
  /* Estilos do Modal / Dropdown */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)', // Fundo levemente escurecido
  },
  dropdown: {
    position: 'absolute',
    right: 24,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 8,
    minWidth: 200,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12 },
      android: { elevation: 8 },
    }),
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  dropdownIcon: { fontSize: 20, marginRight: 12 },
  dropdownText: { fontSize: 16, fontWeight: '600', color: Colors.text },
});
