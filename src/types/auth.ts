/**
 * Interface que espelha o DTO UserResponse retornado por /api/users/me
 */
export interface User {
  id: string; // UUID
  name: string;
  nickname: string;
  email: string;
  role: string;
  coins: number;
  points: number;
  totalPoints: number;
  streak: number;
  bestStreak: number;
  registrationYear: number;
}

/**
 * Interface que espelha o DTO TokenResponse retornado pelo login/refresh
 */
export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}
