import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View } from 'react-native';
import { useAuthStore } from '../store/useAuthStore';
import { StorageUtil } from '../utils/storage';
import { api } from '../config/api';
import { AuthNavigator } from './AuthNavigator';
import { AppNavigator } from './AppNavigator';

export function RootNavigator() {
  const { user, isLoading, setLoading, setUser } = useAuthStore();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const token = await StorageUtil.getToken();
        
        if (token) {
          // Injetamos o token silenciosamente para a API conseguir fazer a requisição
          useAuthStore.setState({ accessToken: token });
          
          // Validamos a sessão e buscamos os dados do utilizador
          const { data } = await api.get('/users/me');
          setUser(data);
        }
      } catch (error) {
        // Se der erro 401, o nosso interceptor do Axios já vai tratar de fazer o clearTokens
        console.log('Sessão inválida ou não encontrada na inicialização.');
      } finally {
        // A app pode finalmente esconder o "Splash Screen" virtual
        setLoading(false);
      }
    };

    initializeApp();
  }, [setUser, setLoading]);

  // Enquanto valida a sessão, mostra um carregamento nativo
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {/* O React Navigation troca de Stack automaticamente quando a variável 'user' muda */}
      {user ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
