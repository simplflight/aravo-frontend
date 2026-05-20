export type ActivityCategory = 'WORK' | 'STUDY' | 'HEALTH' | 'READING' | 'MEDITATION' | 'OTHER';

export type ActivityStatus = 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

/**
 * Interface que espelha o DTO ActivityResponse
 */
export interface Activity {
  id: string; // UUID
  category: ActivityCategory;
  status: ActivityStatus;
  startTime: string; // LocalDateTime string
  endTime: string | null; // Pode ser null se a atividade estiver IN_PROGRESS
  pointsEarned: number | null;
  title?: string | null; 
  description?: string | null;
}

export interface ActivityCompleteRequest {
  title: string;
  description?: string;
}
