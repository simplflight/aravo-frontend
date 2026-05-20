import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { AppStackParamList } from '../../../types/navigation';
import { activitiesApi } from '../api/activitiesApi';
import { ActivityCompleteRequest } from '../../../types/activity';
import { Input } from '../../../components/Input/Input';
import { Button } from '../../../components/Button/Button';
import { Colors } from '../../../constants/colors';

type CompleteRouteProp = RouteProp<AppStackParamList, 'CompleteActivity'>;
type CompleteNavProp = NativeStackNavigationProp<AppStackParamList>;

export function CompleteActivityScreen() {
  const route = useRoute<CompleteRouteProp>();
  const navigation = useNavigation<CompleteNavProp>();
  const queryClient = useQueryClient();
  const { activityId } = route.params;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string>();

  // Mutação do TanStack Query para finalizar
  const { mutateAsync: completeActivity, isPending } = useMutation({
    mutationFn: (payload: ActivityCompleteRequest) => activitiesApi.completeActivity(activityId, payload),
    onSuccess: () => {
      // Invalida a lista para forçar o recarregamento na tela inicial
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    }
  });

  const handleSave = async () => {
    if (!title.trim()) {
      setError('O título é obrigatório.');
      return;
    }

    try {
      await completeActivity({ title, description });
      // Volta à raiz da aplicação (Abas Principais)
      navigation.navigate('MainTabs');
    } catch (err) {
      setError('Erro ao salvar. Tente novamente.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Foco Concluído! 🎉</Text>
      <Text style={styles.subtitle}>Registe o que você produziu neste tempo.</Text>

      <View style={styles.form}>
        <Input 
          label="Título (Obrigatório)" 
          placeholder="Ex: Resumo de História" 
          value={title} 
          onChangeText={(text) => { setTitle(text); setError(undefined); }} 
          error={error}
        />
        
        <Input 
          label="Anotações (Opcional)" 
          placeholder="O que você aprendeu ou fez?" 
          multiline
          numberOfLines={4}
          value={description} 
          onChangeText={setDescription} 
          style={styles.textArea}
        />

        <Button 
          title="Salvar e Ganhar XP" 
          onPress={handleSave} 
          isLoading={isPending} 
          style={styles.button} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface, padding: 24, paddingTop: 64 },
  title: { fontSize: 32, fontWeight: 'bold', color: Colors.primary, marginBottom: 8 },
  subtitle: { fontSize: 16, color: Colors.textSecondary, marginBottom: 32 },
  form: { flex: 1 },
  textArea: { height: 100, textAlignVertical: 'top' },
  button: { marginTop: 'auto', marginBottom: 24 }
});
