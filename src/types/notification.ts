export type NotificationType = 'other' | 'payment' | 'maintenance' | 'contract';

export interface Building {
  id: number;
  created_at: string;
  modified_at: string;
  is_active: boolean;
  name: string;
  address: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Notification {
  id: number;
  created_at: string;
  modified_at: string;
  is_active: boolean;
  name: string;
  message: string;
  type: NotificationType;
  userId: number | null; // null for group notifications
  user?: User; // present only for individual notifications
  buildingId: number;
  building: Building;
}

// This interface is kept for backward compatibility during transition
// It can be removed once all code is updated
export interface UserNotification {
  id: number;
  created_at: string;
  modified_at: string;
  is_active: boolean;
  userId: number;
  notificationId: number;
  is_read: boolean;
  user?: {
    id: number;
    name: string;
    email: string;
  };
} 