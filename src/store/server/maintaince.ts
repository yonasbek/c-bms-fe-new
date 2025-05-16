//mutiate floor create 
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userRequest } from "../../lib/requests";
import { toast } from "sonner";
import { MaintenanceType } from "../../types/maintainance";
import { RoomType } from "../../types/room";


interface CreateMaintenanceData {
    description: string;
    request_status: string;
    special_note: string;
    roomId: string;
    priority: string;

}

export const useCreateMaintenance = () => {
  const queryClient = useQueryClient();
   
  
  return useMutation({
    mutationFn: (data: CreateMaintenanceData) => {
      return userRequest.post<MaintenanceType>("/maintenance", data)},
    onSuccess: (data) => {
      console.log('Maintenance created successfully', data);
      toast.success("Maintenance created successfully");
      queryClient.invalidateQueries({ queryKey: ['maintenance'] });
    },
    onError: (error) => {
      console.error('Maintenance creation failed:', error);
      toast.error("Failed to create maintenance");
    }
  });
};



export const useGetMaintenanceForBuilding = (buildingId: string) => {
  return useQuery({ 
    queryKey: ['maintenance', buildingId],
    queryFn: () => userRequest.get<MaintenanceType[]>(`/maintenance/building/${buildingId}`),
  });
};

export const useGetContractForRoom = (roomId: string) => {
  return useQuery({ 
    queryKey: ['contract', roomId],
    queryFn: () => userRequest.get<string>(`/contract/contractId/room/${roomId}`),
  });
};

export const useGetAllMaintenanceForBuilding = (buildingId: string) => {
  const maintainanceQuery = useGetMaintenanceForBuilding(buildingId);
  const maintainance = maintainanceQuery.data?.data || [];
  


  const isLoading = maintainanceQuery.isLoading;
  const isError = maintainanceQuery.isError;
  const error = maintainanceQuery.error;



  return {
    data: maintainance,
    isLoading,
    isError,
    error,
    refetch: async () => {
      await maintainanceQuery.refetch();
    }
  };
};


export const useGetRoomsForBuilding = (buildingId: string) => {
  return useQuery({ 
    queryKey: ['rooms', buildingId],
    queryFn: () => userRequest.get<RoomType[]>(`/room/building/${buildingId}`),
  });
};

export const useGetRoomForBuilding = (buildingId: string) => {
  const roomQuery = useGetRoomsForBuilding(buildingId);
  const room = roomQuery.data?.data || [];
  


  const isLoading = roomQuery.isLoading;
  const isError = roomQuery.isError;
  const error = roomQuery.error;



  return {
    data: room,
    isLoading,
    isError,
    error,
    refetch: async () => {
      await roomQuery.refetch();
    }
  };
};

interface UpdateMaintenanceStatus {
    id: string;
    request_status?: string;
}

export const useUpdateMaintenance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateMaintenanceStatus) => {
      return userRequest.put<MaintenanceType>(`/maintenance/${data.id}`, {request_status: data.request_status});
    },
    onSuccess: (data) => {
      console.log('Maintenance updated successfully', data);
      toast.success("Maintenance updated successfully");
      queryClient.invalidateQueries({ queryKey: ['maintenance'] });
    },
    onError: (error) => {
      console.error('Maintenance update failed:', error);
      toast.error("Failed to update maintenance");
    }
  });
};




