import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppStackParamList } from '../types/navigation';
import { View, Text } from 'react-native';

const Stack = createNativeStackNavigator<AppStackParamList>();

// Placeholder temporário
const HomeScreen = () => <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Home (Protegida)</Text></View>;

export function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
}
