import { RoomType } from "./room";
import { TenantUser } from "./user";

export interface Contract {
  id: number;
  tenant_id: number;
  room_id: number;
  start_date: string;
  end_date: string;
  rate_per_sqm: number;
  monthly_rent: number; // This will be calculated from rate_per_sqm * room_size
  status: "active" | "expired" | "terminated";
  created_at: string;
  modified_at: string;
}

export interface ContractWithDetails extends Contract {
  tenant: {
    id: number;
    name: string;
    email: string;
  };
  room: {
    id: number;
    room_number: string;
    room_size: number;
  };
}

export interface ContractDocument {
  id: number;
  created_at: string;
  modified_at: string;
  is_active: boolean;
  contractId: number;
  document_name: string;
  document_url: string;
  document_type?: string;
  document_size?: number;
}

export interface ContractType {
  id: number;
  start_date: string;
  end_date: string;
  rate_per_sqm: number;
  room_size: number;
  monthly_rent: number;
  contract_status: "active" | "expired" | "terminated";
  user: {
    id: number;
    name: string;
  };
  room: {
    id: number;
    room_number: string;
    room_size: number;
  };
  building?: {
    id: number;
    name: string;
  };
  payments?: any[];
}

export default ContractType;