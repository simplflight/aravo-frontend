import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types/navigation';
import { View, Text } from 'react-native';

const Stack = createNativeStackNavigator<AuthStackParamList>();

// Placeholders temporários
const LoginScreen = () => <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Ecrã de Login</Text></View>;
const RegisterScreen = () => <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Ecrã de Registo</Text></View>;

export function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}
