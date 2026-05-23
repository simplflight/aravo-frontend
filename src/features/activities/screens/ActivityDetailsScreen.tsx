import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppStackParamList } from '../../../types/navigation';
import { Activity } from '../../../types/activity';
import { TopBar } from '../../../components/Header/TopBar';
import { Button } from '../../../components/Button/Button';
import { Colors } from '../../../constants/colors';

type DetailsRouteProp = RouteProp<AppStackParamList, 'ActivityDetails'>;

export function ActivityDetailsScreen() {
  const route = useRoute<DetailsRouteProp>();
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();
  const { activityId } = route.params;

  // Performance máxima: busca a atividade direto do cache do TanStack Query sem ir à rede
  const activities = queryClient.getQueryData<Activity[]>(['activities']);
  const activity = activities?.find((a) => a.id === activityId);

  if (!activity) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Atividade não encontrada.</Text>
        <Button title="Voltar" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopBar />
      
      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.categoryLabel}>{activity.category}</Text>
        
        <Text style={styles.title}>{activity.title || 'Sem título'}</Text>
        
        <View style={styles.divider} />

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Estado atual:</Text>
            <Text style={styles.statusValue}>{activity.status}</Text>
          </View>

          {activity.pointsEarned ? (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Recompensa obtida:</Text>
              <Text style={styles.xpValue}>⚡ +{activity.pointsEarned} XP</Text>
            </View>
          ) : null}
        </View>

        {activity.description ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Anotações de Foco</Text>
            <Text style={styles.descriptionText}>{activity.description}</Text>
          </View>
        ) : null}

        <Button 
          title="Voltar para a Lista" 
          variant="outline" 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Colors.background 
  },
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 24 
  },
  scrollContent: { padding: 24 },
  categoryLabel: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    color: Colors.primary, 
    textTransform: 'uppercase', 
    letterSpacing: 1 
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: Colors.text, 
    marginTop: 8 
  },
  divider: { 
    height: 1, 
    backgroundColor: Colors.border, 
    marginVertical: 20 
  },
  
  infoCard: { 
    backgroundColor: Colors.surface, 
    borderRadius: 16, 
    padding: 16, 
    borderWidth: 1, 
    borderColor: Colors.border, 
    marginBottom: 24 
  },
  infoRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingVertical: 8 
  },
  label: { 
    fontSize: 15, 
    color: Colors.textSecondary, 
    fontWeight: '500' 
  },
  statusValue: { 
    fontSize: 15, 
    fontWeight: 'bold', 
    color: Colors.text 
  },
  xpValue: { 
    fontSize: 15, 
    fontWeight: 'bold', 
    color: Colors.success 
  },
  
  section: { marginBottom: 32 },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: Colors.text,
    marginBottom: 8 
  },
  descriptionText: { 
    fontSize: 15,
    color: Colors.textSecondary, 
    lineHeight: 22 
  },
  
  backButton: { marginTop: 16 },
  errorText: { 
    fontSize: 16, 
    color: Colors.error, 
    marginBottom: 16 
  }
});
