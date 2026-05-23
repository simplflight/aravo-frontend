import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useActivities } from '../hooks/useActivities';
import { ActivityCard } from '../components/ActivityCard';
import { Colors } from '../../../constants/colors';
import { Activity } from '../../../types/activity';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../../types/navigation';
import { TopBar } from '../../../components/Header/TopBar';

export function ActivitiesScreen() {
  const { data: activities, isLoading, isError, refetch, isRefetching } = useActivities();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();

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
      <TopBar />
      <View style={styles.header}>
        <Text style={styles.title}>O Meu Foco</Text>
        <TouchableOpacity onPress={() => navigation.navigate('CreateActivity')} style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Nova</Text>
        </TouchableOpacity>
      </View>
      
      <FlashList<Activity>
          data={activities}
          keyExtractor={(item: Activity) => item.id}
          // @ts-expect-error - Tipagem do FlashList
          estimatedItemSize={120} 
          contentContainerStyle={styles.listContent}
          refreshing={isRefetching}
          onRefresh={refetch}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Ainda não tens atividades registadas.</Text>
          }
          renderItem={({ item }) => (
            <ActivityCard 
              activity={item} 
              // Ao clicar no cartão, vamos para os Detalhes da Atividade
              onPress={() => navigation.navigate('ActivityDetails', { activityId: item.id })}
              
              // Ao clicar no botão vermelho/roxo de finalizar, saltamos direto para o ecrã de preencher o título/xp
              onFinishPress={() => navigation.navigate('CompleteActivity', { activityId: item.id })}
            />
          )}
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
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 24, 
    paddingTop: 16, 
    paddingBottom: 16 
  },
  addButton: { 
    backgroundColor: Colors.primary, 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    borderRadius: 20 
  },
  addButtonText: { 
    color: Colors.surface, 
    fontWeight: 'bold' 
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
