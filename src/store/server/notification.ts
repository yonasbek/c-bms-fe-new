import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userRequest } from "../../lib/requests";
import { Notification } from "../../types/notification";
import { useBuildingStore } from "../../store/buildings";

interface CreateNotificationData {
  name: string;
  message: string;
  type: Notification['type'];
  userId?: number; // Optional - when undefined, it's a group notification
}

export function useGetNotifications() {
  const { activeBuilding } = useBuildingStore();
  
  return useQuery({
    queryKey: ['notifications', activeBuilding?.id],
    queryFn: async () => {
      const response = await userRequest.get<Notification[]>(`/notifications/building/${activeBuilding?.id}`);
      return response.data;
    },
    enabled: !!activeBuilding?.id,
  });
}

export function useCreateNotification() {
  const queryClient = useQueryClient();
  const { activeBuilding } = useBuildingStore();

  return useMutation({
    mutationFn: async (data: CreateNotificationData) => {
      const response = await userRequest.post<Notification>('/notifications', {
        ...data,
        buildingId: activeBuilding?.id,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
} 