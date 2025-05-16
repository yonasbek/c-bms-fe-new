// store/rooms.ts
import {create} from 'zustand';
import { nanoid } from 'nanoid';

export interface Room {
  id: string;
  name: string;
  floor: string;
}

interface RoomStore {
  rooms: Room[];
  addRoom: (room: Omit<Room, 'id'>) => void;
  updateRoom: (room: Room) => void;
  mergeRooms: (roomId1: string, roomId2: string) => void;
  simulateAddRooms: () => void;
}

// Define available floors
const floors = ["Floor 1", "Floor 2", "Floor 3", "Floor 4"];

// Pre-populate twenty rooms, distributed evenly across the four floors
const defaultRooms: Room[] = Array.from({ length: 20 }, (_, index) => ({
  id: nanoid(),
  name: `Room ${index + 1}`,
  floor: floors[index % floors.length],
}));

export const useRoomStore = create<RoomStore>((set, get) => ({
  rooms: defaultRooms,
  
  addRoom: (room) => {
    const newRoom = { ...room, id: nanoid() };
    set((state) => ({
      rooms: [...state.rooms, newRoom],
    }));
  },
  
  updateRoom: (updatedRoom) => {
    set((state) => ({
      rooms: state.rooms.map((room) =>
        room.id === updatedRoom.id ? updatedRoom : room
      ),
    }));
  },
  
  mergeRooms: (roomId1, roomId2) => {
    set((state) => {
      const room1 = state.rooms.find((room) => room.id === roomId1);
      const room2 = state.rooms.find((room) => room.id === roomId2);
      if (!room1 || !room2) return state;
      
      // Merge logic: combine names and retain room1's floor
      const mergedRoom: Room = {
        ...room1,
        name: `${room1.name} & ${room2.name}`,
      };

      return {
        rooms: state.rooms
          .filter((room) => room.id !== roomId2)
          .map((room) => (room.id === roomId1 ? mergedRoom : room)),
      };
    });
  },
  
  // Simulate adding a new room after a 3-second delay
  simulateAddRooms: () => {
    setTimeout(() => {
      const randomFloor = floors[Math.floor(Math.random() * floors.length)];
      const simulatedRoom = {
        name: `Simulated Room ${Math.floor(Math.random() * 1000)}`,
        floor: randomFloor,
      };
      get().addRoom(simulatedRoom);
    }, 3000);
  },
}));
