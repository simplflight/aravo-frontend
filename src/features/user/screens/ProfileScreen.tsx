import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { useAuthStore } from '../../../store/useAuthStore';
import { TopBar } from '../../../components/Header/TopBar';
import { Button } from '../../../components/Button/Button';
import { Colors } from '../../../constants/colors';

export function ProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  if (!user) return null;

  // Função simples para pegar as iniciais do nome (Ex: "Felipe Macedo" -> "FM")
  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleLogout = () => {
    // SE ESTIVER NA WEB: Usa o confirm do próprio navegador
    if (Platform.OS === 'web') {
      const confirmed = window.confirm("Tem a certeza que deseja sair do Aravo?");
      if (confirmed) {
        logout();
      }
    } else {
      // SE ESTIVER NO MOBILE (Android/iOS): Usa o Alerta nativo lindão
      Alert.alert(
        "Sair da conta",
        "Tem a certeza que deseja sair do Aravo?",
        [
          { text: "Cancelar", style: "cancel" },
          { 
            text: "Sair", 
            style: "destructive", 
            onPress: async () => {
              await logout();
            } 
          }
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Mantemos a TopBar para consistência na navegação */}
      <TopBar />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Cartão de Identificação (Header do Perfil) */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(user.name)}</Text>
          </View>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.nickname}>@{user.nickname}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>

        {/* Estatísticas Globais da Vida do Utilizador */}
        <Text style={styles.sectionTitle}>As Suas Conquistas</Text>
        <View style={styles.statsGrid}>
          
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🏆</Text>
            <Text style={styles.statValue}>{user.totalPoints}</Text>
            <Text style={styles.statLabel}>XP Total</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statIcon}>👑</Text>
            <Text style={styles.statValue}>{user.highestStreak}</Text>
            <Text style={styles.statLabel}>Recorde Ofensiva</Text>
          </View>

        </View>

        {/* Botões de Ação */}
        <View style={styles.actionsContainer}>
          <Button 
            title="Editar Perfil" 
            variant="outline" 
            onPress={() => Alert.alert('Em breve', 'Funcionalidade em desenvolvimento!')} 
            style={styles.actionButton}
          />

          <Button 
            title="Sair da Conta" 
            variant="outline" 
            onPress={handleLogout} 
            style={[styles.actionButton, styles.logoutButton]}
            // Usamos um truque de estilo inline temporário para deixar a borda vermelha
          />
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { padding: 24, paddingBottom: 40 },
  
  profileHeader: { alignItems: 'center', marginBottom: 40 },
  avatar: { 
    width: 100, 
    height: 100, 
    borderRadius: 50, 
    backgroundColor: Colors.primary, 
    justifyContent: 'center', 
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarText: { fontSize: 36, fontWeight: 'bold', color: Colors.surface, letterSpacing: 2 },
  name: { fontSize: 24, fontWeight: 'bold', color: Colors.text, marginBottom: 4 },
  nickname: { fontSize: 16, fontWeight: '600', color: Colors.primary, marginBottom: 4 },
  email: { fontSize: 14, color: Colors.textSecondary },

  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: Colors.text, marginBottom: 16 },
  
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 },
  statCard: { 
    width: '48%', 
    backgroundColor: Colors.surface, 
    padding: 20, 
    borderRadius: 16, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statIcon: { fontSize: 32, marginBottom: 8 },
  statValue: { fontSize: 24, fontWeight: 'bold', color: Colors.text, marginBottom: 4 },
  statLabel: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary, textTransform: 'uppercase' },

  actionsContainer: { marginTop: 16 },
  actionButton: { marginBottom: 16 },
  logoutButton: { borderColor: Colors.error },
});
