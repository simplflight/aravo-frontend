import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { StorageUtil } from '../utils/storage';
import { StandardError } from '../types/api';

// URL base apontando para o localhost do emulador Android
const API_BASE_URL = 'http://10.0.2.2:8080/api';

/**
 * Instância global do Axios para a API Aravo.
 */
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // Timeout de 10s para evitar travamentos de UI em conexões ruins
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * Injeta o Bearer Token e o idioma (Accept-Language) em todas as requisições.
 */
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await StorageUtil.getToken();
    const language = await StorageUtil.getLanguage();
    
    // Injeção do JWT
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Injeção do cabeçalho de internacionalização (i18n) configurado na sua API
    if (config.headers) {
      config.headers['Accept-Language'] = language;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Mapeia erros globalmente e trata o ciclo de vida da sessão (Logout forçado).
 */
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Retorna diretamente os dados se houver sucesso, simplificando o consumo nos hooks
    return response;
  },
  async (error: AxiosError<StandardError>) => {
    // 401 Unauthorized - Token expirado ou inválido
    if (error.response?.status === 401) {
      // TODO: Disparar ação do Zustand para deslogar o usuário no estado global da aplicação
      await StorageUtil.clearToken();
      console.warn('Sessão expirada. Usuário deslogado.');
    }

    // TODO: Adicionar lógicas para erros 403 (Forbidden) ou 500 (Internal Server Error)

    return Promise.reject(error);
  }
);
