import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppStackParamList } from '../../../types/navigation';
import { Button } from '../../../components/Button/Button';
import { Colors } from '../../../constants/colors';

type ActiveFocusRouteProp = RouteProp<AppStackParamList, 'ActiveFocus'>;
type ActiveFocusNavProp = NativeStackNavigationProp<AppStackParamList>;

export function ActiveFocusScreen() {
  const route = useRoute<ActiveFocusRouteProp>();
  const navigation = useNavigation<ActiveFocusNavProp>();
  const { activityId } = route.params;

  const [seconds, setSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

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
    // Usamos 'replace' para que ele não consiga voltar para o cronômetro apertando o botão de voltar do Android.
    navigation.replace('CompleteActivity', { activityId });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Foco em Andamento</Text>
      
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{formatTime(seconds)}</Text>
      </View>

      <View style={styles.controls}>
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
