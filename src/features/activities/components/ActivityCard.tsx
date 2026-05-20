import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Activity } from '../../../types/activity';
import { Colors } from '../../../constants/colors';

interface ActivityCardProps {
  activity: Activity;
  onPress?: () => void;
}

export function ActivityCard({ activity, onPress }: ActivityCardProps) {
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
      
      {isCompleted && activity.pointsEarned ? (
        <Text style={styles.points}>+{activity.pointsEarned} XP</Text>
      ) : null}
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
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeCompleted: { backgroundColor: '#E3FBE3' },
  badgeInProgress: { backgroundColor: '#E0E7FF' },
  badgeCancelled: { backgroundColor: '#FFEBEB' },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.textSecondary,
  },
  points: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.success,
    marginTop: 8,
  },
});
