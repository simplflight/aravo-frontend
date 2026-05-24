import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
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

type RegisterScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

export function RegisterScreen() {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const authenticate = useAuthStore((state) => state.authenticate);

  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Tratamento de erros
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [globalError, setGlobalError] = useState<string>();

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors: { [key: string]: string } = {};
    setGlobalError(undefined);

    if (!name.trim()) { newErrors.name = 'O nome é obrigatório.'; isValid = false; }
    if (!nickname.trim()) { newErrors.nickname = 'O nickname é obrigatório.'; isValid = false; }
    if (!email || !/\S+@\S+\.\S+/.test(email)) { newErrors.email = 'Insira um e-mail válido.'; isValid = false; }
    if (!password || password.length < 6) { newErrors.password = 'Mínimo de 6 caracteres.'; isValid = false; }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    Keyboard.dismiss();

    try {
      // 1. Cria a conta consumindo o DTO UserRegisterRequest da API
      const { data: newUser } = await api.post<User>('/users/register', {
        name,
        nickname,
        email,
        password,
      });

      // 2. Auto-Login UX: Autentica silenciosamente para poupar trabalho ao utilizador
      const { data: tokens } = await api.post<TokenResponse>('/users/login', {
        identifier: email, 
        password,
      });

      // 3. Salva a sessão no Zustand e dispara a mudança de Stack para a Home
      await authenticate(tokens, newUser);

    } catch (error) {
      const axiosError = error as AxiosError<StandardError>;
      const backendMessage = axiosError.response?.data?.message;
      setGlobalError(backendMessage || 'Erro ao criar conta. Verifique a sua conexão.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Criar Conta</Text>
          <Text style={styles.subtitle}>Junte-se ao Aravo e domine o seu tempo.</Text>
        </View>

        <View style={styles.form}>
          {globalError ? <Text style={styles.globalErrorText}>{globalError}</Text> : null}

          <Input
            label="Nome Completo"
            placeholder="Ex: Alan Turing"
            autoCapitalize="words"
            value={name}
            onChangeText={setName}
            error={errors.name}
          />

          <Input
            label="Nickname"
            placeholder="Ex: turing_master"
            autoCapitalize="none"
            value={nickname}
            onChangeText={setNickname}
            error={errors.nickname}
          />

          <Input
            label="E-mail"
            placeholder="seu@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
            error={errors.email}
          />

          <Input
            label="Senha"
            placeholder="Mínimo de 6 caracteres"
            secureTextEntry
            autoCapitalize="none"
            value={password}
            onChangeText={setPassword}
            error={errors.password}
          />

          <Button 
            title="Registrar e Entrar" 
            onPress={handleRegister} 
            isLoading={isLoading} 
            style={styles.submitButton}
          />

          <Button 
            title="Já tenho uma conta" 
            variant="outline"
            onPress={() => navigation.navigate('Login')} 
            disabled={isLoading}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text,
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
    marginTop: 16,
    marginBottom: 16,
  },
  globalErrorText: {
    color: Colors.error,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#FFEAA7',
    borderRadius: 8,
  },
});
