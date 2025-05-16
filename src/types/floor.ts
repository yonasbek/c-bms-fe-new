import { RoomType } from "./room";

export interface FloorType {
    id: string;
    name: string;
    buildingId:string;
    createdAt: string;
    updatedAt: string;
}

export interface FloorWithRooms {
  id: number;
  name: string;
  buildingId: number;
  is_active: boolean;
  created_at: string;
  modified_at: string;
  rooms: {
    id: number;
    room_number: string;
    room_status: "occupied" | "vacant" | "maintenance";
    room_size: number;
  }[];
}

