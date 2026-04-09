import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { StorageUtil } from '../utils/storage';
import { StandardError } from '../types/api';

const API_BASE_URL = 'http://localhost:8080/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // Timeout de 10s para evitar requests travados
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * Injeta o Bearer Token em todas as requisições que saem do app.
 */
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await StorageUtil.getToken();
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Trata respostas de sucesso e mapeia erros globalmente.
 */
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Retorna diretamente os dados se houver sucesso, simplificando o consumo nos hooks
    return response;
  },
  async (error: AxiosError<StandardError>) => {
    // Tratamento de sessão expirada / token inválido
    if (error.response?.status === 401) {
      // TODO: Integrar com a action de logout do Zustand quando o store for criado
      await StorageUtil.clearToken();
      console.warn('Sessão expirada. Usuário deslogado.');
    }

    // TODO: Adicionar lógicas para erros 403 (Forbidden) ou 500 (Internal Server Error)

    return Promise.reject(error);
  }
);
