import React, { useMemo } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, ActivityIndicator 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppStackParamList } from '../../../types/navigation';
import { useAuthStore } from '../../../store/useAuthStore';
import { TopBar } from '../../../components/Header/TopBar';
import { Button } from '../../../components/Button/Button';
import { Colors } from '../../../constants/colors';
import { useStreakCalendar } from '../hooks/useStreakCalendar';

export function HomeScreen() {
  const user = useAuthStore((state) => state.user);
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  // Obtém o mês e o ano atuais
  const todayDate = new Date();
  const currentMonth = todayDate.getMonth() + 1;
  const currentYear = todayDate.getFullYear();

  // Chama o hook
  const { data: streakData, isLoading } = useStreakCalendar(currentMonth, currentYear);

  // Algoritmo que constrói os últimos 7 dias baseados na resposta da API
  const weekDays = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      
      // Extração segura do fuso horário local
      const year = d.getFullYear();
      // O getMonth() começa no 0 (Janeiro), por isso somamos 1. O padStart garante o "0" na frente de números < 10.
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      
      const dateStr = `${year}-${month}-${day}`; // "YYYY-MM-DD" local e blindado!

      // Pega a primeira letra do dia da semana (S, T, Q...)
      const dayName = d.toLocaleDateString('pt-BR', { weekday: 'short' }).charAt(0).toUpperCase();

      // Procura se o utilizador fez algo neste dia através do histórico da API
      const record = streakData?.history.find(r => r.date === dateStr);
      
      days.push({ 
        day: dayName, 
        isCompleted: record?.status === 'COMPLETED',
        isFrozen: record?.status === 'FROZEN'
      });
    }
    return days;
  }, [streakData]);

  if (!user) return null;

  // Mock provisório para as missões
  const dailyQuests = [
    { id: 1, title: 'Primeiro Passo', desc: 'Inicie 1 sessão de foco hoje', progress: 0, total: 1, xp: 15 },
    { id: 2, title: 'Consistência Brutal', desc: 'Ganhe 50 XP no total hoje', progress: 20, total: 50, xp: 50 },
  ];

  return (
    <View style={styles.container}>
      <TopBar />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Olá, {user.name.split(' ')[0]}! 👋</Text>
          <Text style={styles.subtitle}>Pronto para manter a sua ofensiva?</Text>
        </View>

        {/* Bloco Dinâmico do Calendário */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Últimos 7 dias</Text>
          
          {isLoading ? (
            <ActivityIndicator size="small" color={Colors.primary} style={{ marginVertical: 16 }}/>
          ) : (
            <View style={styles.weekContainer}>
              {weekDays.map((item, index) => {
                const isActive = item.isCompleted || item.isFrozen;
                return (
                  <View key={index} style={styles.dayWrapper}>
                    <View style={[
                      styles.dayCircle, 
                      item.isCompleted && styles.dayCircleCompleted,
                      item.isFrozen && styles.dayCircleFrozen,
                      !isActive && styles.dayCircleInactive
                    ]}>
                      <Text style={[styles.dayText, isActive ? styles.dayTextActive : styles.dayTextInactive]}>
                        {item.isCompleted ? '🔥' : item.isFrozen ? '🧊' : item.day}
                      </Text>
                    </View>
                    <Text style={styles.dayLabel}>{item.day}</Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        <Text style={styles.sectionTitle}>Missões de Hoje</Text>
        {dailyQuests.map((quest) => {
          const percentage = (quest.progress / quest.total) * 100;
          return (
            <View key={quest.id} style={styles.questCard}>
              <View style={styles.questHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.questTitle}>{quest.title}</Text>
                  <Text style={styles.questDesc}>{quest.desc}</Text>
                </View>
                <View style={styles.xpBadge}><Text style={styles.xpText}>+{quest.xp} XP</Text></View>
              </View>
              <View style={styles.progressBackground}>
                <View style={[styles.progressFill, { width: `${percentage}%` }]} />
              </View>
              <Text style={styles.progressText}>{quest.progress}/{quest.total}</Text>
            </View>
          );
        })}

        <View style={styles.ctaContainer}>
          <Button 
            title="🔥 Iniciar Nova Sessão"
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
    backgroundColor: Colors.status.warningBg,
    borderWidth: 1,
    borderColor: Colors.status.warningBorder,
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
    fontSize: 18,
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
    backgroundColor: Colors.status.inProgressBg,
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
  dayCircleCompleted: { 
    backgroundColor: Colors.status.warningBg, 
    borderWidth: 1, 
    borderColor: Colors.status.warningBorder 
  }, 
  dayCircleFrozen: { 
    backgroundColor: Colors.status.infoBg, 
    borderWidth: 1, 
    borderColor: Colors.status.infoBorder
  },
});
