import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppStackParamList } from '../../../types/navigation';
import { ActivityCategory } from '../../../types/activity';
import { useCreateActivity } from '../hooks/useCreateActivity';
import { Button } from '../../../components/Button/Button';
import { Colors } from '../../../constants/colors';

// Mapeamento visual das categorias
const CATEGORIES: { label: string; value: ActivityCategory; icon: string }[] = [
  { label: 'Trabalho', value: 'WORK', icon: '💼' },
  { label: 'Estudo', value: 'STUDY', icon: '📚' },
  { label: 'Saúde', value: 'HEALTH', icon: '🏋️' },
  { label: 'Leitura', value: 'READING', icon: '📖' },
  { label: 'Meditação', value: 'MEDITATION', icon: '🧘' },
  { label: 'Outro', value: 'OTHER', icon: '✨' },
];

export function CreateActivityScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const { mutateAsync: createActivity, isPending } = useCreateActivity();
  
  const [selectedCategory, setSelectedCategory] = useState<ActivityCategory>('WORK');
  const [error, setError] = useState<string>();

  const handleStart = async () => {
    setError(undefined);
    try {
      // Usamos a função de mutação que agora chama /start
      const newActivity = await createActivity(selectedCategory);
      
      // Substitui o modal pela tela do Cronômetro!
      navigation.replace('ActiveFocus', { activityId: newActivity.id });
      
    } catch (err) {
      setError('Erro ao iniciar atividade. Tente novamente.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nova Atividade</Text>
      <Text style={styles.subtitle}>O que vamos focar agora?</Text>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.grid}>
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.value;
          return (
            <TouchableOpacity
              key={cat.value}
              activeOpacity={0.7}
              style={[styles.card, isSelected && styles.cardSelected]}
              onPress={() => setSelectedCategory(cat.value)}
            >
              <Text style={styles.icon}>{cat.icon}</Text>
              <Text style={[styles.label, isSelected && styles.labelSelected]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Button 
        title="Iniciar Foco" 
        onPress={handleStart} 
        isLoading={isPending}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface, padding: 24, paddingTop: 48 },
  title: { fontSize: 28, fontWeight: 'bold', color: Colors.text },
  subtitle: { fontSize: 16, color: Colors.textSecondary, marginBottom: 24 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { 
    width: '48%', backgroundColor: Colors.background, padding: 16, borderRadius: 12, 
    alignItems: 'center', marginBottom: 16, borderWidth: 2, borderColor: 'transparent' 
  },
  cardSelected: { borderColor: Colors.primary, backgroundColor: '#E0E7FF' },
  icon: { fontSize: 32, marginBottom: 8 },
  label: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
  labelSelected: { color: Colors.primary },
  button: { marginTop: 'auto', marginBottom: 24 },
  errorText: { color: Colors.error, marginBottom: 16, textAlign: 'center', fontWeight: 'bold' }
});
