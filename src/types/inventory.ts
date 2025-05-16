export type InventoryItem = {
  id: string;
  itemId: string; // Foreign key to Item
  quantity: string;
  procured_date: Date; // Date when the item was procured
  status: string; // Status of the inventory item
  description: string; // Description of the inventory item
  buildingId: string; // Foreign key to Building
  item: Item; // Item details
};

export type CreateInventoryItemInput = {
  itemId: string; // Foreign key to Item
  quantity: string;
  procured_date: Date; // Date when the item is procured
  status: string; // Status of the inventory item
  description?: string; // Description of the inventory item
  buildingId: string; // Foreign key to Building
};

export type CreateItem = {
  name: string;
  description?: string;
};

export type Item = {
  id: string;
  name: string;
  description?: string;
};