import { Contract } from "./contract";

export interface Building {
  id: number;
  name: string;
  address: string;
}

export interface Floor {
  id: number;
  name: string;
  building: Building;
}

export interface Room {
  id: number;
  room_number: string;
  floor: Floor;
  floor_number: number;
  room_status: string;
}

export interface TenantRoom {
  id: number;
  room_number: string;
  floor_number: number;
  room_status: string;
  building: Building;
}

export interface TenantContract {
  id: number;
  start_date: string;
  end_date: string;
  monthly_rent: number;
  contract_status: string;
  file_url?: string | null;
  room: Room;
  building: Building;
}

export type MaintenanceStatus = 'pending' | 'in_progress' | 'completed' | 'rejected';
export type MaintenancePriority = 'low' | 'medium' | 'high' | 'urgent';
export type MaintenanceType = 'plumbing' | 'electrical' | 'hvac' | 'appliance' | 'other';

export interface MaintenanceRequest {
  id: number;
  description: string;
  request_status: MaintenanceStatus;
  special_note?: string;
  roomId: number;
  priority?: MaintenancePriority;
  created_at: string;
  modified_at: string;
  is_active: boolean;
  room?: {
    id: number;
    room_number: string;
  };
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  type: 'announcement' | 'reminder' | 'alert';
  user_id: number;
}

export interface TenantUser {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    tin_number?: string;
  };
  building_id: string;
  contracts: Contract[];
  created_at: string;
  updated_at: string;
} 