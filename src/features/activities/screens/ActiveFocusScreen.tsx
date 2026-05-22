import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMutation, useQueryClient } from '@tanstack/react-query'; 

import { AppStackParamList } from '../../../types/navigation';
import { Button } from '../../../components/Button/Button';
import { Colors } from '../../../constants/colors';
import { activitiesApi } from '../api/activitiesApi';

type ActiveFocusRouteProp = RouteProp<AppStackParamList, 'ActiveFocus'>;
type ActiveFocusNavProp = NativeStackNavigationProp<AppStackParamList>;

export function ActiveFocusScreen() {
  const route = useRoute<ActiveFocusRouteProp>();
  const navigation = useNavigation<ActiveFocusNavProp>();
  const { activityId } = route.params;
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();

  const [seconds, setSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Mutação silenciosa para apagar a atividade no backend caso seja abandonada
  const { mutate: deleteActivity } = useMutation({
    mutationFn: (id: string) => activitiesApi.deleteActivity(id),
    onSuccess: () => {
      // Assim que o servidor confirmar a exclusão, invalidamos a lista de atividades.
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    }
  });

  // SEQUESTRA A AÇÃO DE VOLTAR
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      // Se a ação for um "replace" (ou seja, ele clicou no nosso botão de Finalizar), nós permitimos!
      if (e.data.action.type === 'REPLACE') {
        return;
      }

      // Caso contrário (deslizou a tela ou apertou voltar no celular), bloqueamos a ação.
      e.preventDefault();

      Alert.alert(
        'Abandonar Foco?',
        'Tem a certeza que quer sair? A atividade será cancelada e removida.',
        [
          { text: 'Continuar Focado', style: 'cancel', onPress: () => {} },
          {
            text: 'Abandonar',
            style: 'destructive',
            onPress: () => {
              // 1. Dispara a API para apagar a tarefa "fantasma"
              deleteActivity(activityId);
              
              // 2. Liberta a navegação para o ecrã anterior imediatamente
              navigation.dispatch(e.data.action);
            },
          },
        ]
      );
    });

    return unsubscribe;
  }, [navigation, activityId, deleteActivity]);

  // Efeito simples de Cronômetro
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!isPaused) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPaused]);

  // Formata os segundos para MM:SS
  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleFinish = () => {
    // O utilizador terminou! Navegamos para a tela de preencher o Título/Descrição.
    // Usamos 'replace' para que ele não consiga voltar para o cronômetro apertando voltar.
    navigation.replace('CompleteActivity', { activityId });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Foco em Andamento</Text>
      
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{formatTime(seconds)}</Text>
      </View>

      <View style={[styles.controls, { paddingBottom: Math.max(insets.bottom, 24) }]}>
        <Button 
          title={isPaused ? "Retomar" : "Pausar"} 
          variant="outline"
          onPress={() => setIsPaused(!isPaused)} 
          style={styles.controlButton}
        />
        <Button 
          title="Finalizar" 
          onPress={handleFinish} 
          style={styles.controlButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center', padding: 24 },
  headerTitle: { fontSize: 20, color: Colors.textSecondary, marginBottom: 48 },
  timerContainer: { 
    width: 250, height: 250, borderRadius: 125, borderWidth: 8, borderColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center', marginBottom: 64 
  },
  timerText: { fontSize: 56, fontWeight: 'bold', color: Colors.text },
  controls: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  controlButton: { width: '48%' }
});
