//mutiate floor create 
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userRequest } from "../../lib/requests";
import { toast } from "sonner";
import { CreateSubContractType, SubContractType } from "../../types/subContract";
import { Building } from "../../types/building";


export const useCreateSubContract = () => {
  const queryClient = useQueryClient();
   
  
  return useMutation({
    mutationFn: (data: CreateSubContractType) => {
      return userRequest.post<SubContractType>("/subcontract", data)},
    onSuccess: (data) => {
      console.log('SubContract created successfully', data);
      toast.success("SubContract created successfully");
      queryClient.invalidateQueries({ queryKey: ['sub-contract'] });
    },
    onError: (error) => {
      console.error('SubContract creation failed:', error);
      toast.error("Failed to create sub-contract");
    }
  });
};



export const useGetSubContractForBuilding = (buildingId: string) => {
  return useQuery({ 
    queryKey: ['sub-contract', buildingId],
    queryFn: () => userRequest.get<SubContractType[]>(`/subcontract/building/${buildingId}`),
  });
};



export const useGetAllSubContractForBuilding = (buildingId: string) => {
  const subContractQuery = useGetSubContractForBuilding(buildingId);
  const subContract = subContractQuery.data?.data || [];
  


  const isLoading = subContractQuery.isLoading;
  const isError = subContractQuery.isError;
  const error = subContractQuery.error;



  return {
    data: subContract,
    isLoading,
    isError,
    error,
    refetch: async () => {
      await subContractQuery.refetch();
    }
  };
};


export const useGetAllBuildingForSubContract = () => {
  return useQuery({
    queryKey: ['sub-contract', 'building'],
    queryFn: () => userRequest.get<Building[]>('/building'),
  });
};

export const useGetBuildingForSubContract = () => {
  const buildingQuery = useGetAllBuildingForSubContract();
  const building = buildingQuery.data?.data || [];
  


  const isLoading = buildingQuery.isLoading;
  const isError = buildingQuery.isError;
  const error = buildingQuery.error;



  return {
    data: building,
    isLoading,
    isError,
    error,
    refetch: async () => {
      await buildingQuery.refetch();
    }
  };
};

interface UpdateSubContractStatus {
    id: string;
    status?: string;
}

export const useUpdateSubContract = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateSubContractStatus) => {
      return userRequest.put<SubContractType>(`/subcontract/${data.id}`, {status: data.status});
    },
    onSuccess: (data) => {
      console.log('SubContract updated successfully', data);
      toast.success("SubContract updated successfully");
      queryClient.invalidateQueries({ queryKey: ['sub-contract'] });
    },
    onError: (error) => {
      console.error('SubContract update failed:', error);
      toast.error("Failed to update sub-contract");
    }
  });
};




