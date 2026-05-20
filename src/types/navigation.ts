import { NavigatorScreenParams } from '@react-navigation/native';

// 1. Rotas Públicas
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

// 2. Rotas das Abas Inferiores (Bottom Tabs)
export type MainTabParamList = {
  HomeTab: undefined;
  ActivitiesTab: undefined;
  ShopTab: undefined;
  ProfileTab: undefined;
};

// 3. Rotas Privadas Globais (O Stack que engloba as abas e as telas em tela cheia)
export type AppStackParamList = {
  // A tela principal é o próprio navegador de abas
  MainTabs: NavigatorScreenParams<MainTabParamList>; 
  // Telas que abrem por cima das abas (ex: Detalhes de uma atividade, Pomodoro rodando)
  ActivityDetails: { activityId: string }; 
};
