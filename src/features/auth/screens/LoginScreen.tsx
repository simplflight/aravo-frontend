import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  TouchableWithoutFeedback, 
  Keyboard 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AxiosError } from 'axios';

import { AuthStackParamList } from '../../../types/navigation';
import { useAuthStore } from '../../../store/useAuthStore';
import { api } from '../../../config/api';
import { TokenResponse, User } from '../../../types/auth';
import { StandardError } from '../../../types/api';

import { Input } from '../../../components/Input/Input';
import { Button } from '../../../components/Button/Button';
import { Colors } from '../../../constants/colors';

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export function LoginScreen() {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const authenticate = useAuthStore((state) => state.authenticate);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados para erros individuais dos campos ou erro geral da API
  const [emailError, setEmailError] = useState<string>();
  const [passwordError, setPasswordError] = useState<string>();
  const [globalError, setGlobalError] = useState<string>();

  const validateForm = (): boolean => {
    let isValid = true;
    setEmailError(undefined);
    setPasswordError(undefined);
    setGlobalError(undefined);

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Insira um e-mail válido.');
      isValid = false;
    }
    if (!password || password.length < 6) {
      setPasswordError('A senha deve ter no mínimo 6 caracteres.');
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    Keyboard.dismiss(); // Esconde o teclado nativamente para melhorar a UX durante o loading

    try {
      // 1. Requisita os tokens
      // O DTO do backend v1.1.0 (UserLoginRequest) espera { email, password }
      const { data: tokens } = await api.post<TokenResponse>('/users/login', {
        identifier: email, 
        password,
      });

      // 2. Com o token em mãos, busca os dados do usuário.
      // Injetamos o token no header manualmente aqui pois ele ainda não está no Zustand
      const { data: user } = await api.get<User>('/users/me', {
        headers: { Authorization: `Bearer ${tokens.accessToken}` }
      });

      // 3. Sucesso! Salva no Zustand (que por sua vez salva no Storage e atualiza a navegação)
      await authenticate(tokens, user);

    } catch (error) {
      const axiosError = error as AxiosError<StandardError>;
      // Se o backend enviar uma mensagem traduzida pelo messages.properties, nós a exibimos.
      // Caso contrário, exibimos uma mensagem genérica (ex: servidor offline).
      const backendMessage = axiosError.response?.data?.message;
      setGlobalError(backendMessage || 'Ocorreu um erro ao tentar acessar. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          
          <View style={styles.header}>
            {/* Espaço reservado para o Logo SVG do Aravo no futuro */}
            <Text style={styles.title}>Aravo</Text>
            <Text style={styles.subtitle}>Sua jornada rumo ao foco começa aqui.</Text>
          </View>

          <View style={styles.form}>
            {globalError ? <Text style={styles.globalErrorText}>{globalError}</Text> : null}

            <Input
              label="E-mail"
              placeholder="seu@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
              error={emailError}
            />

            <Input
              label="Senha"
              placeholder="Digite sua senha"
              secureTextEntry
              autoCapitalize="none"
              value={password}
              onChangeText={setPassword}
              error={passwordError}
            />

            <Button 
              title="Entrar" 
              onPress={handleLogin} 
              isLoading={isLoading} 
              style={styles.submitButton}
            />

            <Button 
              title="Criar uma conta" 
              variant="outline"
              onPress={() => navigation.navigate('Register')} 
              disabled={isLoading}
            />
          </View>

        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  submitButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  globalErrorText: {
    color: Colors.error,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#FFEAA7', // Um fundo de alerta amarelo suave
    borderRadius: 8,
  },
});
