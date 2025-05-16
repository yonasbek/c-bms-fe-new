import { Building } from "./building";

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    phoneNumber: string;
    access_token: string;
}

export interface TenantUser extends User {
    is_active: boolean;
    created_at: string;
    modified_at: string;
}
export interface BuildingUserType {
    id: number;
    buildingId: number;
    building: Building;
    userId: number;
    user: TenantUser;
    created_at: string;
    modified_at: string;
    is_active: boolean;
    tin_number: string | null;
}

