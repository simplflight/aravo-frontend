import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useActivities } from '../hooks/useActivities';
import { ActivityCard } from '../components/ActivityCard';
import { Colors } from '../../../constants/colors';
import { Activity } from '../../../types/activity';

export function ActivitiesScreen() {
  const { data: activities, isLoading, isError, refetch, isRefetching } = useActivities();

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Erro ao carregar as atividades.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>O Meu Foco</Text>
      
      <FlashList<Activity>
        data={activities}
        renderItem={({ item }) => <ActivityCard activity={item} />}
        keyExtractor={(item: Activity) => item.id}
        // @ts-expect-error - Tipagem do FlashList pendente de atualização para React 19
        estimatedItemSize={100} 
        contentContainerStyle={styles.listContent}
        refreshing={isRefetching}
        onRefresh={refetch}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Ainda não tens atividades registadas.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 16,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  errorText: {
    color: Colors.error,
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.textSecondary,
    marginTop: 40,
    fontSize: 16,
  },
});
