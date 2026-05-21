/**
 * Interface que espelha o DTO UserResponse
 */
export interface User {
  id: string; // UUID
  email: string;
  nickname: string;
  name: string;
  points: number;
  totalPoints: number;
  streak: number;
  highestStreak: number;
  createdAt: string; // LocalDateTime formatado como string ISO-8601
  lastActivityDate: string | null; // LocalDate formatado como string
}

/**
 * Interface que espelha o DTO TokenResponse
 */
export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

/**
 * DTO que espelha o UserUpdateRequest do Java.
 */
export interface UserUpdateRequest {
  name: string;
  nickname: string;
}
