// 1. Rotas Públicas
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

// 2. Rotas das Abas Inferiores (Bottom Tabs)
export type MainTabParamList = {
  HomeTab: undefined;
  ActivitiesTab: undefined;
  ProfileTab: undefined;
};

// 3. Rotas Privadas Globais (O Stack que engloba as abas e as telas em tela cheia)
export type AppStackParamList = {
  MainTabs: undefined; // Simplificado por enquanto
  ActivityDetails: { activityId: string }; 
  CreateActivity: undefined;
  ActiveFocus: { activityId: string }; // <--- TELA DO CRONÔMETRO
  CompleteActivity: { activityId: string }; // <--- TELA DO FORMULÁRIO FINAL
  Shop: undefined;
  EditProfile: undefined;
};
