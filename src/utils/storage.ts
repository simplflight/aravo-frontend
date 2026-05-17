import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@Aravo:accessToken';
const REFRESH_TOKEN_KEY = '@Aravo:refreshToken';
const LANGUAGE_KEY = '@Aravo:language';

export const StorageUtil = {
  setToken: async (token: string): Promise<void> => {
    try { await AsyncStorage.setItem(TOKEN_KEY, token); } 
    catch (e) { console.error('Erro ao salvar token', e); }
  },

  getToken: async (): Promise<string | null> => {
    try { return await AsyncStorage.getItem(TOKEN_KEY); } 
    catch (e) { return null; }
  },

  setRefreshToken: async (token: string): Promise<void> => {
    try { await AsyncStorage.setItem(REFRESH_TOKEN_KEY, token); } 
    catch (e) { console.error('Erro ao salvar refresh token', e); }
  },

  getRefreshToken: async (): Promise<string | null> => {
    try { return await AsyncStorage.getItem(REFRESH_TOKEN_KEY); } 
    catch (e) { return null; }
  },

  clearTokens: async (): Promise<void> => {
    try { await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_TOKEN_KEY]); } 
    catch (e) { console.error('Erro ao limpar tokens', e); }
  },

  getLanguage: async (): Promise<string> => {
    try { return await AsyncStorage.getItem(LANGUAGE_KEY) || 'pt-BR'; } 
    catch (e) { return 'pt-BR'; }
  },

  setLanguage: async (language: string): Promise<void> => {
    try { await AsyncStorage.setItem(LANGUAGE_KEY, language); } 
    catch (e) { console.error('Erro ao salvar idioma', e); }
  }
};
