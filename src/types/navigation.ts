/**
 * Definição das rotas públicas (utilizador não autenticado).
 */
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

/**
 * Definição das rotas privadas (utilizador autenticado).
 * Exemplo: ActivityDetails exige o ID da atividade para ser acedida.
 */
export type AppStackParamList = {
  Home: undefined;
  ActivityDetails: { activityId: string };
  Shop: undefined;
  Profile: undefined;
};
