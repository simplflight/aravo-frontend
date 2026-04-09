/**
 * Espelha o padrão de erro retornado pel API.
 * Facilita a extração de mensagens vindas do messages.properties.
 */
export interface StandardError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}

/**
 * Tipo customizado para tipar os erros capturados nos blocos catch ou no TanStack Query.
 */
export interface ApiErrorResponse {
  data?: StandardError;
  status?: number;
}
