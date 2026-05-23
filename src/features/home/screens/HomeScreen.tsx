import React from 'react';
import { 
  View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppStackParamList } from '../../../types/navigation';
import { TopBar } from '../../../components/Header/TopBar';
import { Button } from '../../../components/Button/Button';
import { Colors } from '../../../constants/colors';
import { useHomeDashboard } from '../hooks/useHomeDashboard';

export function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const insets = useSafeAreaInsets();
  
  const { user, weekDays, isLoading, isRefetching, handleRefresh } = useHomeDashboard();

  if (!user) return null;

  const dailyQuests = [
    { id: 1, title: 'Primeiro Passo', desc: 'Inicie 1 sessão de foco hoje', progress: 0, total: 1, xp: 15 },
    { id: 2, title: 'Consistência Brutal', desc: 'Ganhe 50 XP no total hoje', progress: 20, total: 50, xp: 50 },
  ];

  return (
    <View style={styles.container}>
      <TopBar />

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 40 + insets.bottom }]}
        refreshControl={
          <RefreshControl 
            refreshing={isRefetching} 
            onRefresh={handleRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
      >
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Olá, {user.name.split(' ')[0]}! 👋</Text>
          <Text style={styles.subtitle}>Pronto para manter a sua ofensiva?</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Últimos 7 dias</Text>
          
          {isLoading && !isRefetching ? (
            <ActivityIndicator size="small" color={Colors.primary} style={styles.loader}/>
          ) : (
            <View style={styles.weekContainer}>
              {weekDays.map((item, index) => (
                <View key={index} style={styles.dayWrapper}>
                  <View style={[
                    styles.dayCircle, 
                    item.isCompleted && styles.dayCircleCompleted,
                    item.isFrozen && styles.dayCircleFrozen,
                    !item.isActive && styles.dayCircleInactive
                  ]}>
                    <Text style={[styles.dayText, item.isActive ? styles.dayTextActive : styles.dayTextInactive]}>
                      {item.isCompleted ? '🔥' : item.isFrozen ? '🧊' : item.day}
                    </Text>
                  </View>
                  <Text style={styles.dayLabel}>{item.day}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <Text style={styles.sectionTitle}>Missões de Hoje</Text>
        {dailyQuests.map((quest) => {
          const percentage = (quest.progress / quest.total) * 100;
          return (
            <View key={quest.id} style={styles.questCard}>
              <View style={styles.questHeader}>
                <View style={styles.questTextContainer}>
                  <Text style={styles.questTitle}>{quest.title}</Text>
                  <Text style={styles.questDesc}>{quest.desc}</Text>
                </View>
                <View style={styles.xpBadge}>
                  <Text style={styles.xpText}>+{quest.xp} XP</Text>
                </View>
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
  loader: {
    marginVertical: 16,
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
  dayCircleInactive: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dayCircleCompleted: {
    backgroundColor: Colors.warningLight,
    borderWidth: 1,
    borderColor: Colors.warning,
  },
  dayCircleFrozen: {
    backgroundColor: Colors.infoLight,
    borderWidth: 1,
    borderColor: Colors.info,
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
  questTextContainer: {
    flex: 1,
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
    backgroundColor: Colors.primaryLight,
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
