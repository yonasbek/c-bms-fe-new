export interface MaintenanceType {
    id?: string;
    description: string;
    contractId: string;
    contract?: {
        room?: {
            room_number?: string;
        }
    };
    request_status: MaintenanceStatus;
    special_note: string;
    created_at?: string;
    modified_at?: string;
    priority: Priority;
}
export type MaintenanceStatus = "pending" | "in_progress" | "completed" | "cancelled"
export type Priority = "low" | "medium" | "high" | "urgent"