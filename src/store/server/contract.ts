import { userRequest } from "../../lib/requests";

import { useMutation, useQuery, useQueryClient, useQueries } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import ContractType, { Contract, ContractWithDetails } from "../../types/contract";
import { isContractPaid } from "../../lib/utils";
  
// Get all contracts for a building
export const useGetBuildingContracts = (buildingId: string) => {
  return useQuery({
    queryKey: ["building-contracts", buildingId],
    queryFn: () => userRequest.get(`/building/${buildingId}/contracts`),
    select: (response) => response.data,
    enabled: !!buildingId,
  });
};

// Create a new contract
export const useCreateContract = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      userId: number;
      roomId: number;
      start_date: string;
      end_date: string;
      rate_per_sqm: number;
      monthly_rent: number;
      is_active: boolean;
      contract_status: string;
    }) => {
      console.log('Mutation starting with data:', data);
      try {
        const response = await userRequest.post<ContractType>("/contracts", data);
        console.log('API Response:', response);
        return response.data;
      } catch (error) {
        console.error('API Error:', error);
        throw error;
      }
    },
    onMutate: (variables) => {
      console.log('Mutation starting with variables:', variables);
    },
    onSuccess: (data) => {
      console.log('Contract created successfully:', data);
      toast.success("Contract created successfully");
      // Invalidate all building contracts queries
      queryClient.invalidateQueries({ queryKey: ["building-contracts"] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.error("Failed to create contract:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to create contract";
      toast.error(errorMessage);
    },
  });
};

// Get a single contract by ID
export const useGetContract = (contractId: string) => {
  return useQuery({
    queryKey: ["contract", contractId],
    queryFn: () => userRequest.get<ContractType>(`/contracts/${contractId}`),
    select: (response) => response.data,
    enabled: !!contractId,
  });
};

// Update contract status (e.g., terminate contract)
export const useTerminateContract = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      contractId, 
      isActive 
    }: { 
      contractId: string; 
      isActive: boolean 
    }) => {
      const response = await userRequest.put<ContractType>(
        `/contracts/${contractId}`,
        { is_active: isActive, contract_status: "terminated" }
      );
      const roomId = response.data.room.id;
      await userRequest.patch(`/room/${roomId}`, {
        room_status: "vacant"
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Contract status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["building-contracts"] });
      queryClient.invalidateQueries({ queryKey: ["tenant-contract", data.user.id] });
      queryClient.invalidateQueries({ queryKey: ["contract", data.id] });
      if (data.contract_status !== "active") {
        queryClient.invalidateQueries({ queryKey: ["rooms"] });
      }
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.error("Failed to update contract status:", error);
      toast.error(error.response?.data?.message || "Failed to update contract status");
    },
  });
};

export const useGetContractsForTenant = (tenantId: number) => {
  return useQuery({
    queryKey: ["tenant-contract", tenantId],
    queryFn: () => userRequest.get<ContractWithDetails[]>(`/contracts/tenant/${tenantId}`),
  });
};

export const GetContractsForTenant = (tenantId: number) => {
  const contractsQuery = useGetContractsForTenant(tenantId);
  const contracts = contractsQuery.data?.data || [];
  


  const isLoading = contractsQuery.isLoading;
  const isError = contractsQuery.isError;
  const error = contractsQuery.error;



  return {
    data: contracts,
    isLoading,
    isError,
    error,
    refetch: async () => {
      await contractsQuery.refetch();
    }
  };
};

export const useGetBuildingContractsByStatusAndPayment = (
  buildingId: string,
  contractStatus: 'all' | 'active' | 'terminated',
  paymentStatus: 'all' | 'paid' | 'unpaid'
) => {
  // Always fetch all contracts for the building
  const contractsQuery = useGetBuildingContracts(buildingId);
  const contracts = contractsQuery.data || [];

  // Filter contracts by status (frontend)
  const statusFilteredContracts = contractStatus === 'all'
    ? contracts
    : contracts.filter((c: any) => c.contract_status === contractStatus);

  // For payment filtering, use the isContractPaid utility function
  const filteredContracts = statusFilteredContracts.filter((contract: any) => {
    if (paymentStatus === 'all') return true;
    const isPaid = isContractPaid(contract.payments || []);
    return paymentStatus === 'paid' ? isPaid : !isPaid;
  });

  return {
    data: filteredContracts,
    isLoading: contractsQuery.isLoading,
    isError: contractsQuery.isError,
    error: contractsQuery.error,
  };
};