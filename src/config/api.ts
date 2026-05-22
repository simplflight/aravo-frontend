import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { StorageUtil } from '../utils/storage';
import { StandardError } from '../types/api';
import { useAuthStore } from '../store/useAuthStore';
import { TokenResponse } from '../types/auth';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.100:8080/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: unknown) => void; reject: (reason?: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;
    const language = await StorageUtil.getLanguage();
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (config.headers) {
      config.headers['Accept-Language'] = language;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<StandardError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // 401 Unauthorized e ainda não retentou
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = 'Bearer ' + token;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await StorageUtil.getRefreshToken();
        
        if (!refreshToken) throw new Error('Refresh token não encontrado');

        // Chama o refresh usando o axios puro para não cair neste mesmo interceptor
        const { data } = await axios.post<TokenResponse>(`${API_BASE_URL}/users/refresh`, {
          refreshToken,
        });

        // Salva novo token e avisa a fila
        await useAuthStore.getState().updateToken(data.accessToken);
        processQueue(null, data.accessToken);
        
        // Refaz a requisição que deu erro
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
        
      } catch (refreshError) {
        processQueue(refreshError, null);
        await useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
