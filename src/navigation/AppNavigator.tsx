import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CreateActivityScreen } from '../features/activities/screens/CreateActivityScreen';
import { ActiveFocusScreen } from '../features/activities/screens/ActiveFocusScreen';
import { CompleteActivityScreen } from '../features/activities/screens/CompleteActivityScreen';
import { ShopScreen } from '../features/shop/screens/ShopScreen';
import { AppStackParamList } from '../types/navigation';
import { MainTabNavigator } from './MainTabNavigator';
import { View, Text } from 'react-native';

const Stack = createNativeStackNavigator<AppStackParamList>();

// Placeholder para futuras telas que abrem por cima das abas
const ActivityDetailsPlaceholder = () => <View><Text>Detalhes</Text></View>;

export function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* A tela principal agora é o navegador de abas */}
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      
      {/* Telas complementares do app */}
      <Stack.Screen name="ActivityDetails" component={ActivityDetailsPlaceholder} />

      <Stack.Screen 
        name="CreateActivity" 
        component={CreateActivityScreen} 
        options={{ presentation: 'modal' }} // Faz a tela subir de baixo (Modal)
      />

      <Stack.Screen name="ActiveFocus" component={ActiveFocusScreen} />
      <Stack.Screen name="CompleteActivity" component={CompleteActivityScreen} />
      <Stack.Screen name="Shop" component={ShopScreen} />
    </Stack.Navigator>
  );
}
