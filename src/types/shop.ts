export type ItemType = 'STREAK_FREEZE' | 'XP_BOOST' | 'COSMETIC';

/**
 * Interface que espelha o DTO ItemResponse
 */
export interface Item {
  id: string; // UUID
  name: string;
  description: string;
  price: number;
  type: ItemType;
  iconKey: string;
  maxQuantity: number;
}
