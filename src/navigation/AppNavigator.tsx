import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CreateActivityScreen } from '../features/activities/screens/CreateActivityScreen';
import { ActiveFocusScreen } from '../features/activities/screens/ActiveFocusScreen';
import { CompleteActivityScreen } from '../features/activities/screens/CompleteActivityScreen';
import { ActivityDetailsScreen } from '../features/activities/screens/ActivityDetailsScreen'
import { ShopScreen } from '../features/shop/screens/ShopScreen';
import { EditProfileScreen } from '../features/user/screens/EditProfileScreen';
import { AppStackParamList } from '../types/navigation';
import { MainTabNavigator } from './MainTabNavigator';

const Stack = createNativeStackNavigator<AppStackParamList>();

export function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* A tela principal - navegador de abas */}
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      
      {/* Telas complementares */}
      <Stack.Screen 
        name="CreateActivity" 
        component={CreateActivityScreen} 
        options={{ presentation: 'modal' }} // Faz a tela subir de baixo (Modal)
      />
      <Stack.Screen name="ActiveFocus" component={ActiveFocusScreen} />
      <Stack.Screen name="CompleteActivity" component={CompleteActivityScreen} />
      <Stack.Screen 
        name="ActivityDetails" 
        component={ActivityDetailsScreen} 
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen name="Shop" component={ShopScreen} />
      <Stack.Screen 
        name="EditProfile" 
        component={EditProfileScreen} 
        options={{ presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
}
