import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@Aravo:token';
const LANGUAGE_KEY = '@Aravo:language';

/**
 * Utilitário responsável pelo armazenamento seguro de dados locais.
 */
export const StorageUtil = {
  /**
   * Salva o token JWT no dispositivo.
   * @param {string} token - Token JWT retornado pelo backend.
   */
  setToken: async (token: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
      console.error('Erro ao salvar o token no storage:', error);
    }
  },

  /**
   * Recupera o token JWT do dispositivo.
   * @returns {Promise<string | null>} Token ou null se não existir.
   */
  getToken: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error('Erro ao recuperar o token do storage:', error);
      return null;
    }
  },

  /**
   * Remove o token JWT do dispositivo (utilizado no Logout).
   */
  clearToken: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
    } catch (error) {
      console.error('Erro ao limpar o token do storage:', error);
    }
  },

  /**
   * Recupera o idioma preferido do usuário para enviar no Header da API.
   * @returns {Promise<string>} 'pt-BR' ou 'en-US'. Padrão: 'pt-BR'.
   */
  getLanguage: async (): Promise<string> => {
    try {
      const lang = await AsyncStorage.getItem(LANGUAGE_KEY);
      return lang || 'pt-BR'; // Fallback para o idioma padrão da API
    } catch (error) {
      return 'pt-BR';
    }
  }
};
