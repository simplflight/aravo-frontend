import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types/navigation';
import { View, Text } from 'react-native';

// Importe a tela real que acabamos de criar
import { LoginScreen } from '../features/auth/screens/LoginScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

// Placeholder mantido provisoriamente apenas para a rota de Registro
const RegisterScreen = () => <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Ecrã de Registo</Text></View>;

export function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Removemos o componente falso e inserimos a tela real */}
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}
