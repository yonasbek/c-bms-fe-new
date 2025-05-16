import { create } from 'zustand';
import { TenantRoom, TenantContract, MaintenanceRequest, Building } from '../types/tenant';

interface TenantStore {
  room: TenantRoom | null;
  contract: TenantContract | null;
  building: Building | null;
  maintenanceRequests: MaintenanceRequest[];
  isLoading: boolean;
  error: string | null;
  
  setRoom: (room: TenantRoom | null) => void;
  setContract: (contract: TenantContract | null) => void;
  setBuilding: (building: Building | null) => void;
  setMaintenanceRequests: (requests: MaintenanceRequest[]) => void;
  addMaintenanceRequest: (request: MaintenanceRequest) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useTenantStore = create<TenantStore>((set) => ({
  room: null,
  contract: null,
  building: null,
  maintenanceRequests: [],
  isLoading: false,
  error: null,
  
  setRoom: (room) => set({ room }),
  setContract: (contract) => set({ contract }),
  setBuilding: (building) => set({ building }),
  setMaintenanceRequests: (requests) => set({ maintenanceRequests: requests }),
  addMaintenanceRequest: (request) => set((state) => ({ 
    maintenanceRequests: [request, ...state.maintenanceRequests] 
  })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
})); 