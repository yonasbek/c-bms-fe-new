import { userRequest } from "../lib/requests";
import { MaintenanceRequest, TenantContract, TenantRoom, Building, Notification } from "../types/tenant";

export const getTenantRoom = async (): Promise<TenantRoom> => {
  console.log("[Tenant API] Fetching tenant room data");
  try {
    const response = await userRequest.get("/tenant/room");
    console.log("[Tenant API] Room data received:", response.data);
    return response.data;
  } catch (error) {
    console.error("[Tenant API] Error fetching room data:", error);
    throw error;
  }
};

export const getTenantContract = async (userId: string): Promise<TenantContract[]> => {
  console.log("[Tenant API] Fetching tenant contract data for userId:", userId);
  try {
    const response = await userRequest.get(`/contracts/search/userId/${userId}`);
    console.log("[Tenant API] Contract data received:", response.data);
    return response.data;
  } catch (error) {
    console.error("[Tenant API] Error fetching contract data:", error);
    throw error;
  }
};

export const getTenantMaintenanceRequests = async (): Promise<MaintenanceRequest[]> => {
  console.log("[Tenant API] Fetching maintenance requests");
  try {
    const response = await userRequest.get("/maintenance");
    console.log("[Tenant API] Maintenance requests received:", response.data);
    return response.data;
  } catch (error) {
    console.error("[Tenant API] Error fetching maintenance requests:", error);
    throw error;
  }
};

export const getMaintenanceRequestsByRoomId = async (roomId: string | number): Promise<MaintenanceRequest[]> => {
  console.log("[Tenant API] Fetching maintenance requests for roomId:", roomId);
  try {
    const response = await userRequest.get(`/maintenance/search/roomId/${roomId}`);
    console.log("[Tenant API] Maintenance requests for roomId received:", response.data);
    return response.data;
  } catch (error) {
    console.error("[Tenant API] Error fetching maintenance requests for roomId:", error);
    throw error;
  }
};

export const createMaintenanceRequest = async (data: {
  description: string;
  roomId: number;
  priority?: string;
  special_note?: string;
}): Promise<MaintenanceRequest> => {
  console.log("[Tenant API] Creating maintenance request:", data);
  try { 
    const response = await userRequest.post("/maintenance", {
      ...data,
      request_status: "pending",
      is_active: true
    });
    console.log("[Tenant API] Maintenance request created:", response.data);
    return response.data;
  } catch (error) {
    console.error("[Tenant API] Error creating maintenance request:", error);
    throw error;
  }
};

export const getTenantBuilding = async (): Promise<Building> => {
  console.log("[Tenant API] Fetching tenant building data");
  try {
    const response = await userRequest.get("/building");
    console.log("[Tenant API] Building data received:", response.data);
    return response.data;
  } catch (error) {
    console.error("[Tenant API] Error fetching building data:", error);
    throw error;
  }
};

export const getTenantNotifications = async (userId: string): Promise<Notification[]> => {
  console.log("[Tenant API] Fetching notifications for userId:", userId);
  try {
    const response = await userRequest.get(`/notifications/user/${userId}`);
    console.log("[Tenant API] Notifications received:", response.data);
    return response.data;
  } catch (error) {
    console.error("[Tenant API] Error fetching notifications:", error);
    throw error;
  }
};

export type CreateTenantUserData = {
  name: string;
  email: string;
  phoneNumber: string;
  tin_number?: string;
  room_id: string;
  start_date: string;
  end_date: string;
  monthly_rent: number;
  contract_status: "active" | "inactive";
}

export async function createTenantUser(data: CreateTenantUserData) {
  console.log("Creating tenant user with data:", data);
  try {
    const response = await userRequest.post("/tenant-users", data);
    console.log("Tenant user created successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating tenant user:", error);
    throw error;
  }
} 