// Rotas Públicas
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

// Rotas das Abas Inferiores (Bottom Tabs)
export type MainTabParamList = {
  HomeTab: undefined;
  ActivitiesTab: undefined;
  ProfileTab: undefined;
};

// Rotas Privadas Globais (O Stack que engloba as abas e as telas em tela cheia)
export type AppStackParamList = {
  MainTabs: undefined;
  ActivityDetails: { activityId: string }; 
  CreateActivity: undefined;
  ActiveFocus: { activityId: string };
  CompleteActivity: { activityId: string };
  Shop: undefined;
  EditProfile: undefined;
};
