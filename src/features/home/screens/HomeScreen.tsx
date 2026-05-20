import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppStackParamList } from '../../../types/navigation';
import { useAuthStore } from '../../../store/useAuthStore';
import { TopBar } from '../../../components/Header/TopBar';
import { Button } from '../../../components/Button/Button';
import { Colors } from '../../../constants/colors';

type HomeScreenNavProp = NativeStackNavigationProp<AppStackParamList>;

export function HomeScreen() {
  const user = useAuthStore((state) => state.user);
  const navigation = useNavigation<HomeScreenNavProp>();

  if (!user) return null;

  // Mock temporário para os dias da semana (no futuro puxaremos do histórico do backend)
  const weekDays = [
    { day: 'S', active: true },
    { day: 'T', active: true },
    { day: 'Q', active: true }, // Hoje
    { day: 'Q', active: false },
    { day: 'S', active: false },
    { day: 'S', active: false },
    { day: 'D', active: false },
  ];

  // Mock para as missões diárias
  const dailyQuests = [
    { id: 1, title: 'Primeiro Passo', desc: 'Inicie 1 sessão de foco hoje', progress: 1, total: 1, xp: 15 },
    { id: 2, title: 'Mestre do Estudo', desc: 'Foque por 45 minutos acumulados', progress: 15, total: 45, xp: 30 },
    { id: 3, title: 'Consistência Brutal', desc: 'Ganhe 50 XP no total hoje', progress: 20, total: 50, xp: 50 },
  ];

  return (
    <View style={styles.container}>
      {/* A nossa barra superior mágica fixa no topo */}
      <TopBar />

      {/* Todo o conteúdo envelopado em ScrollView para nunca quebrar o layout */}
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Bloco de Boas-Vindas */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Olá, {user.name.split(' ')[0]}! 👋</Text>
          <Text style={styles.subtitle}>Sua meta diária está quase completa hoje.</Text>
        </View>

        {/* Seção 1: Ofensiva Semanal (Estilo Duolingo) */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sua Semana</Text>
          <View style={styles.weekContainer}>
            {weekDays.map((item, index) => (
              <View key={index} style={styles.dayWrapper}>
                <View style={[
                  styles.dayCircle, 
                  item.active ? styles.dayCircleActive : styles.dayCircleInactive
                ]}>
                  <Text style={[
                    styles.dayText, 
                    item.active ? styles.dayTextActive : styles.dayTextInactive
                  ]}>
                    {item.active ? '🔥' : item.day}
                  </Text>
                </View>
                <Text style={styles.dayLabel}>{item.day}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Seção 2: Missões Diárias (Daily Quests) */}
        <Text style={styles.sectionTitle}>Missões de Hoje</Text>
        {dailyQuests.map((quest) => {
          const percentage = (quest.progress / quest.total) * 100;
          const isCompleted = quest.progress >= quest.total;

          return (
            <View key={quest.id} style={styles.questCard}>
              <View style={styles.questHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.questTitle}>{quest.title}</Text>
                  <Text style={styles.questDesc}>{quest.desc}</Text>
                </View>
                <View style={styles.xpBadge}>
                  <Text style={styles.xpText}>+{quest.xp} XP</Text>
                </View>
              </View>

              {/* Barra de Progresso */}
              <View style={styles.progressBackground}>
                <View style={[styles.progressFill, { width: `${percentage}%` }]} />
              </View>
              
              <Text style={styles.progressText}>
                {isCompleted ? '🎉 Concluída!' : `${quest.progress}/${quest.total}`}
              </Text>
            </View>
          );
        })}

        {/* Seção 3: Call To Action Centralizado */}
        <View style={styles.ctaContainer}>
          <Button 
            title="🔥 Iniciar Nova Sessão de Foco"
            onPress={() => navigation.navigate('CreateActivity')}
            style={styles.ctaButton}
          />
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  welcomeSection: {
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 32,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayWrapper: {
    alignItems: 'center',
  },
  dayCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  dayCircleActive: {
    backgroundColor: '#FFEAA7', // Fundo dourado suave para o fogo aceso
    borderWidth: 1,
    borderColor: '#F1C40F',
  },
  dayCircleInactive: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dayText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  dayTextActive: {
    fontSize: 18, // Pro fogo ficar maior
  },
  dayTextInactive: {
    color: Colors.textSecondary,
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  questCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
  },
  questHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  questTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  questDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
    paddingRight: 8,
  },
  xpBadge: {
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  xpText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  progressBackground: {
    height: 8,
    backgroundColor: Colors.background,
    borderRadius: 4,
    width: '100%',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.textSecondary,
    textAlign: 'right',
    marginTop: 6,
  },
  ctaContainer: {
    marginTop: 24,
    width: '100%',
  },
  ctaButton: {
    height: 54,
    borderRadius: 12,
  },
});
