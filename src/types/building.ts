export interface Building {
  id: string | number;  // Support both string IDs from store and number IDs from API
  name: string;
  address: string;
  status?: string;
}
