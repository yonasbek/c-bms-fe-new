import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InventoryItem, CreateInventoryItemInput, CreateItem, Item } from "../../types/inventory";
import { userRequest } from "../../lib/requests"; // Assuming you have a userRequest setup for API calls
import { toast } from "sonner";


export const useGetInventoryForBuilding = (buildingId: string) => {
    return useQuery({ 
      queryKey: ['inventory', buildingId],
      queryFn: () => userRequest.get<InventoryItem[]>(`/inventory/building/${buildingId}`),
    });
  };
// Create a new inventory item
export const useCreateInventory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newItem: CreateInventoryItemInput) => {
      return userRequest.post<InventoryItem>("/inventory", newItem);
    },
    onSuccess: (data) => {
      console.log('Inventory item created successfully', data);
      toast.success("Inventory item created successfully");
      queryClient.invalidateQueries({ queryKey: ['inventory'] }); // Invalidate inventory queries to refresh data
    },
    onError: (error) => {
      console.error('Inventory creation failed:', error);
      toast.error("Failed to create inventory item");
    },
  });
}; 

export const useCreateItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (newItem: CreateItem) => {
        return userRequest.post<Item>("/items", newItem);
      },
      onSuccess: (data) => {
        console.log(' item created successfully', data);
        toast.success(" item created successfully");
        queryClient.invalidateQueries({ queryKey: ['items'] }); // Invalidate inventory queries to refresh data
      },
      onError: (error) => {
        console.error('Item creation failed:', error);
        toast.error("Failed to create  item");
      },
    });
  }; 

export const useGetAllInventoryForBuilding = (buildingId: string) => {
    const inventoryQuery = useGetInventoryForBuilding(buildingId);
    const inventory = inventoryQuery.data?.data || [];
    
  
  
    const isLoading = inventoryQuery.isLoading;
    const isError = inventoryQuery.isError;
    const error = inventoryQuery.error;
  
  
  
    return {
      data: inventory,
      isLoading,
      isError,
      error,
      refetch: async () => {
        await inventoryQuery.refetch();
      }
    };
  };

  export const GetAllItems = () => {
    return useQuery({ 
      queryKey: ['items'],
      queryFn: () => userRequest.get<Item[]>(`/items`),
    });
  };

  export const useGetAllItems = () => {
    const itemsQuery = GetAllItems();
    const items = itemsQuery.data?.data || [];
    
  
  
    const isLoading = itemsQuery.isLoading;
    const isError = itemsQuery.isError;
    const error = itemsQuery.error;
  
  
  
    return {
      data: items,
      isLoading,
      isError,
      error,
      refetch: async () => {
        await itemsQuery.refetch();
      }
    };
  };
  
  