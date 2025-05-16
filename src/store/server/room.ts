// export const useCreateFloor = () => {
//     const queryClient = useQueryClient();

import { userRequest } from "../../lib/requests";
import { RoomType } from "../../types/room";
import { FloorType } from "../../types/floor";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


interface CreateRoomData {
    name: string;
    floorId: string;
    room_number: string;
    room_size: string;
    room_status: string;
    description: string;
}
  
//     return useMutation({
//       mutationFn: (data: CreateFloorData) => {
//         return userRequest.post<FloorType>("/floor", data)},
//       onSuccess: (data) => {
//         console.log('Floor created successfully', data);
//         toast.success("Floor created successfully");
//         queryClient.invalidateQueries({ queryKey: ['floors'] });
//         queryClient.invalidateQueries({ queryKey: ['building', data.data.buildingId] });
//       },
//       onError: (error) => {
//         console.error('Floor creation failed:', error);
//         toast.error("Failed to create floor");
//       }
//     });
//   };

export const useCreateRoom = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateRoomData) => {
            return userRequest.post<RoomType>("/room", data)},
        onSuccess: (data, variables) => {
            toast.success("Room created successfully");
            // Get the floor data to access building ID
            const floorData = queryClient.getQueryData<{ data: FloorType[] }>(['floors', variables.floorId]);
            // Invalidate all relevant queries
            queryClient.invalidateQueries({ 
                predicate: (query) => {
                    return (
                        query.queryKey[0] === 'floors' || 
                        query.queryKey[0] === 'roomsInFloor' ||
                        (Array.isArray(query.queryKey) && query.queryKey[0] === 'roomsInFloor' && query.queryKey[1] === variables.floorId)
                    );
                }
            });
        },
    });
}