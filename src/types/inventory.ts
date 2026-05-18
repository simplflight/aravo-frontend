/**
 * Interface que espelha o DTO InventoryResponse
 */
export interface InventoryItem {
  itemId: string; // UUID
  itemName: string;
  iconKey: string;
  currentQuantity: number;
  maxQuantity: number;
}
