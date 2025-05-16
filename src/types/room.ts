import { FloorType } from "./floor";

export type RoomType = {
    id: string;
    name?: string;
    room_number: string;
    room_status: string;
    floorId: string;
    floor?: FloorType;
    room_size?: number;
    created_at: string;
    updated_at: string;
}

