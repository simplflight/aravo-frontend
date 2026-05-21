import React, { useState } from 'react';
import { View, Text, StyleSheet, Keyboard, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppStackParamList } from '../../../types/navigation';
import { useAuthStore } from '../../../store/useAuthStore';
import { useUpdateProfile } from '../hooks/useUpdateProfile';

import { Input } from '../../../components/Input/Input';
import { Button } from '../../../components/Button/Button';
import { Colors } from '../../../constants/colors';

export function EditProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const user = useAuthStore((state) => state.user);
  const { mutateAsync: updateProfile, isPending } = useUpdateProfile();

  if (!user) return null;

  // Inicializa os estados com os valores atuais do utilizador no Zustand
  const [name, setName] = useState(user.name);
  const [nickname, setNickname] = useState(user.nickname);
  
  const [errors, setErrors] = useState<{ name?: string; nickname?: string }>({});
  const [globalError, setGlobalError] = useState<string>();

  const validateForm = () => {
    let isValid = true;
    const newErrors: typeof errors = {};
    setGlobalError(undefined);

    if (!name.trim()) { newErrors.name = 'O nome não pode estar vazio.'; isValid = false; }
    if (!nickname.trim()) { newErrors.nickname = 'O nickname não pode estar vazio.'; isValid = false; }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    Keyboard.dismiss();

    try {
      await updateProfile({ name, nickname });
      navigation.goBack(); // Fecha o modal e volta ao perfil
    } catch (err) {
      setGlobalError('Erro ao atualizar perfil. Nickname já pode estar em uso.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Editar Perfil</Text>
      <Text style={styles.subtitle}>Atualize os seus dados de identificação do Aravo.</Text>

      {globalError ? <Text style={styles.globalErrorText}>{globalError}</Text> : null}

      <View style={styles.form}>
        <Input
          label="Nome Completo"
          placeholder="Ajuste o seu nome"
          value={name}
          onChangeText={setName}
          error={errors.name}
        />

        <Input
          label="Nickname"
          placeholder="Escolha um novo username"
          autoCapitalize="none"
          value={nickname}
          onChangeText={setNickname}
          error={errors.nickname}
        />

        <Button
          title="Guardar Alterações"
          onPress={handleSave}
          isLoading={isPending}
          style={styles.saveButton}
        />
        
        <Button
          title="Cancelar"
          variant="outline"
          onPress={() => navigation.goBack()}
          disabled={isPending}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: Colors.surface, padding: 24, paddingTop: 48 },
  title: { fontSize: 28, fontWeight: 'bold', color: Colors.text },
  subtitle: { fontSize: 16, color: Colors.textSecondary, marginBottom: 32, marginTop: 4 },
  form: { width: '100%', flex: 1 },
  saveButton: { marginTop: 'auto', marginBottom: 12 },
  globalErrorText: { color: Colors.error, fontSize: 14, fontWeight: 'bold', textAlign: 'center', marginBottom: 16, padding: 12, backgroundColor: '#FFEBEB', borderRadius: 8 },
});
