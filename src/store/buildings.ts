// store/buildings.ts
import { Building } from '../types/building';
import { nanoid } from 'nanoid';
import { create } from 'zustand';



interface BuildingStore {
  buildings: Building[];
  activeBuilding: Building | null;
  setActiveBuilding: (buildingId: string | number) => void;
  setBuildings: (buildings: Building[]) => void;
  addBuilding: (building: Omit<Building, 'id'>) => void;
}



export const useBuildingStore = create<BuildingStore>((set, get) => ({
  // Pre-populate with a few example buildings
  buildings: [
    // {
    //   id: 'building-id-1',
    //   name: 'Frendship Tower',
    //   address: 'Bole Airport Road',
    //   status: 'active',
    // },
    // {
    //   id: 'building-id-2',
    //   name: 'Edna Mall',
    //   address: 'Bole Medhane Alem',
    //   status: 'active',
    // },
  ],
  activeBuilding: null,
  
  // Set the active building based on its ID
  setActiveBuilding: (buildingId: string | number) => {
    const building = get().buildings.find((b) => 
      // Handle both string and number IDs
      b.id.toString() === buildingId.toString()
    ) || null;
    set({ activeBuilding: building });
  },
  
  // Add a new building to the store
  addBuilding: (building) => {
    const newBuilding = { ...building, id: nanoid() };
    set((state) => ({
      buildings: [...state.buildings, newBuilding],
    }));
  },

  setBuildings: (buildings: Building[]) => {
    set({ buildings });
  },
}));
