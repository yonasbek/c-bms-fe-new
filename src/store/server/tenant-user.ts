import { userRequest } from "../../lib/requests";
import { BuildingUserType } from "../../types/user";
import { useQuery, useMutation, useQueryClient, useQueries } from "@tanstack/react-query";
import { toast } from "sonner";
import { useBuildingStore } from "../buildings";
import ContractType from "../../types/contract";
import { AxiosError } from "axios";



interface TenantWithContract extends BuildingUserType {
  tin_number: string | null;
  contracts: ContractType[];
}

export const useGetAllTenantUsersForABuilding = (buildingId: string) => {
  // First, fetch all tenants
  const tenantsQuery = useQuery({
    queryKey: ["tenant-user", buildingId],
    queryFn: () => userRequest.get<BuildingUserType[]>(
      `/building-tenant/search/buildingId/${buildingId}`
    ),
  });

  // Then fetch contracts for each tenant
  const contractQueries = useQueries({
    queries: (tenantsQuery.data?.data || []).map((tenant) => ({
      queryKey: ["tenant-contract", tenant.userId],
      queryFn: () => userRequest.get<ContractType[]>(
        `/contracts/search/userId/${tenant.userId}`
      ),
      enabled: !!tenant.userId, // Only run if we have a userId
    })),
  });

  // Combine tenant and contract data
  const tenantsWithContracts: TenantWithContract[] = 
    tenantsQuery.data?.data.map((tenant, index) => ({
      ...tenant,
      contracts: contractQueries[index]?.data?.data || [], // Get all contracts
    })) || [];

  return {
    data: tenantsWithContracts,
    isLoading: tenantsQuery.isLoading || contractQueries.some(q => q.isLoading),
    isError: tenantsQuery.isError || contractQueries.some(q => q.isError),
    error: tenantsQuery.error || contractQueries.find(q => q.error)?.error,
    refetch: async () => {
      await tenantsQuery.refetch();
      await Promise.all(contractQueries.map(q => q.refetch()));
    }
  };
};

interface CreateTenantUserData {
  name: string;
  email: string;
  phoneNumber: string;
  role?: string;
  tin_number?: string;
}

interface TenantUserResponse {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
}

interface BuildingTenantData {
  userId: string;
  buildingId: string;
  tin_number?: string;
}

export const useCreateTenantUser = () => {
  const queryClient = useQueryClient();
  const { activeBuilding } = useBuildingStore();

  return useMutation({
    mutationFn: async (data: CreateTenantUserData) => {
      // First create the user
      const requestData = {
        name: data.name,
        email: data.email,
        phone: data.phoneNumber,
        password: data.phoneNumber,
        role: data.role || "tenant",
      };

      const userResponse = await userRequest.post<TenantUserResponse>(
        "/auth/register",
        requestData
      );

      if (!activeBuilding) {
        throw new Error("No active building selected");
      }

      // Then create the building-tenant relationship
      const buildingTenantData: BuildingTenantData = {
        userId: userResponse.data.id,
        buildingId: activeBuilding.id.toString(),
        tin_number: data.tin_number,
      };
      if (requestData.role === "admin")
        await userRequest.post("/building-user", buildingTenantData);
      else await userRequest.post("/building-tenant", buildingTenantData);

      return userResponse.data;
    },
    onSuccess: () => {
      toast.success(
        "Tenant user created and assigned to building successfully"
      );
      // Invalidate both queries
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      queryClient.invalidateQueries({ queryKey: ["tenant-user"] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.error("Failed to create tenant user:", error);
      toast.error(
        error.response?.data?.message || "Failed to create tenant user"
      );
    },
  });
};

export const useGetTenantUsersByContractStatus = (buildingId: string, status: 'active' | 'terminated' | 'no-contract' | 'all') => {
  // Fetch all tenants for the building
  const tenantsQuery = useQuery({
    queryKey: ["tenant-user", buildingId],
    queryFn: () => userRequest.get<BuildingUserType[]>(`/building-tenant/search/buildingId/${buildingId}`),
    enabled: !!buildingId,
  });

  // Fetch contracts by status if not 'no-contract' or 'all'
  const contractStatus = status === 'all' ? undefined : status;
  const contractQueries = useQueries({
    queries: (tenantsQuery.data?.data || []).map((tenant) => ({
      queryKey: ["tenant-contract", tenant.userId, contractStatus],
      queryFn: () =>
        contractStatus && contractStatus !== 'no-contract'
          ? userRequest.get<ContractType[]>(`/contracts/search/contract_status/${contractStatus}`)
              .then(res => res.data.filter((c: ContractType) => c.user.id === tenant.userId))
          : userRequest.get<ContractType[]>(`/contracts/search/userId/${tenant.userId}`).then(res => res.data),
      enabled: !!tenant.userId && !!buildingId,
    })),
  });

  // Combine tenant and contract data
  let tenantsWithContracts: TenantWithContract[] = [];
  if (tenantsQuery.data?.data) {
    tenantsWithContracts = tenantsQuery.data.data.map((tenant, index) => ({
      ...tenant,
      contracts: contractQueries[index]?.data || [],
    }));
    if (status === 'no-contract') {
      tenantsWithContracts = tenantsWithContracts.filter(t => (t.contracts.length === 0));
    } else if (status === 'active' || status === 'terminated') {
      tenantsWithContracts = tenantsWithContracts.filter(t => t.contracts.some(c => c.contract_status === status));
    }
  }

  return {
    data: tenantsWithContracts,
    isLoading: tenantsQuery.isLoading || contractQueries.some(q => q.isLoading),
    isError: tenantsQuery.isError || contractQueries.some(q => q.isError),
    error: tenantsQuery.error || contractQueries.find(q => q.error)?.error,
    refetch: async () => {
      await tenantsQuery.refetch();
      await Promise.all(contractQueries.map(q => q.refetch()));
    }
  };
};

/**
 * building
: 
{id: 22, created_at: '2025-03-03T07:57:33.045Z', modified_at: '2025-03-03T07:57:33.045Z', is_active: true, name: 'Building AA', …}
buildingId
: 
22
created_at
: 
"2025-03-03T19:13:54.957Z"
id
: 
1
is_active
: 
true
modified_at
: 
"2025-03-03T19:13:54.957Z"
user
: 
{id: 1, created_at: '2025-03-02T17:05:00.149Z', modified_at: '2025-03-02T17:05:00.149Z', is_active: true, name: 'Tinsae Mesfin', …}
userId
: 
1
 */
