import { useMutation, useQuery, useQueries } from "@tanstack/react-query";
import { createMaintenanceRequest, getMaintenanceRequestsByRoomId, getTenantBuilding, getTenantContract, getTenantMaintenanceRequests, getTenantRoom, getTenantNotifications } from "../services/tenant";
import { TenantContract, Notification } from "../types/tenant";

export const useTenantRoom = () => {
  return useQuery({
    queryKey: ["tenant-room"],
    queryFn: getTenantRoom,
  });
};

export const useTenantContract = ({userId}: {userId: string}) => {
  return useQuery<TenantContract[]>({
    queryKey: ["tenant-contract", userId],
    queryFn: () => getTenantContract(userId),
    enabled: !!userId,
  });
};

export const useTenantMaintenanceRequests = () => {
  return useQuery({
    queryKey: ["tenant-maintenance-requests"],
    queryFn: getTenantMaintenanceRequests,
  });
};

export const useTenantMaintenanceRequestsByContracts = (contracts: TenantContract[] | undefined) => {
  // Extract roomIds from contracts
  const roomIds = contracts?.map(contract => contract.room.id) || [];
  
  // Create a query for each roomId
  const maintenanceQueries = useQueries({
    queries: roomIds.map(roomId => ({
      queryKey: ["maintenance-requests", roomId],
      queryFn: () => getMaintenanceRequestsByRoomId(roomId),
      enabled: !!roomId,
    })),
  });
  
  // Combine all maintenance requests and handle loading/error states
  const isLoading = maintenanceQueries.some(query => query.isLoading);
  const isError = maintenanceQueries.some(query => query.isError);
  const error = maintenanceQueries.find(query => query.error)?.error;
  const data = maintenanceQueries.flatMap(query => query.data || []);
  
  // Log combined data for debugging
  if (!isLoading && maintenanceQueries.every(query => query.isSuccess)) {
    console.log("[Tenant UI] All maintenance requests:", data);
  }
  
  return {
    data,
    isLoading,
    isError,
    error
  };
};

export const useCreateMaintenanceRequest = () => {
  return useMutation({
    mutationFn: createMaintenanceRequest,
  });
};

export const useTenantBuilding = () => {
  return useQuery({
    queryKey: ["tenant-building"],
    queryFn: getTenantBuilding,
  });
};

export function useTenantNotifications(userId: string) {
  return useQuery<Notification[]>({
    queryKey: ['tenant-notifications', userId],
    queryFn: () => getTenantNotifications(userId),
    enabled: !!userId,
  });
} 