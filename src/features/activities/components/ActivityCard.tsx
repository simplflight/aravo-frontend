import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Activity } from '../../../types/activity';
import { Colors } from '../../../constants/colors';

interface ActivityCardProps {
  activity: Activity;
  onPress?: () => void;
  onFinishPress?: () => void;
}

export function ActivityCard({ activity, onPress, onFinishPress }: ActivityCardProps) {
  const isCompleted = activity.status === 'COMPLETED';
  const isInProgress = activity.status === 'IN_PROGRESS';

  return (
    <TouchableOpacity 
      style={[styles.card, isInProgress && styles.cardActive]} 
      onPress={onPress} 
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={styles.category}>{activity.category}</Text>
        <View style={[
          styles.badge, 
          isCompleted ? styles.badgeCompleted : isInProgress ? styles.badgeInProgress : styles.badgeCancelled
        ]}>
          <Text style={styles.badgeText}>{activity.status}</Text>
        </View>
      </View>
      
      {/* Mostra o Título se existir, caso contrário mostra um texto padrão */}
      <Text style={styles.title}>
        {activity.title ? activity.title : (isInProgress ? 'Foco em andamento...' : 'Sem título')}
      </Text>

      <View style={styles.footer}>
        {isCompleted && activity.pointsEarned ? (
          <Text style={styles.points}>+{activity.pointsEarned} XP</Text>
        ) : <View />}

        {/* Botão de segurança para tarefas presas em IN_PROGRESS */}
        {isInProgress && onFinishPress && (
          <TouchableOpacity 
            style={styles.finishButton} 
            onPress={onFinishPress}
            activeOpacity={0.8}
          >
            <Text style={styles.finishButtonText}>Finalizar Foco</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardActive: {
    borderColor: Colors.primary,
    borderWidth: 1.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  category: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textSecondary,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeCompleted: { backgroundColor: Colors.successLight },
  badgeInProgress: { backgroundColor: Colors.primaryLight },
  badgeCancelled: { backgroundColor: Colors.errorLight },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  points: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.success,
  },
  finishButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  finishButtonText: {
    color: Colors.surface,
    fontSize: 12,
    fontWeight: 'bold',
  },
});
