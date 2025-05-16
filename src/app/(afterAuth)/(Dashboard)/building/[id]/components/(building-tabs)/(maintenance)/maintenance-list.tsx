"use client"

import { useState } from "react"
import { Calendar, Clock, MoreVertical } from "lucide-react"
import { Button } from "../../../../../../../../components/ui/button"
import { Badge } from "../../../../../../../../components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../../../../../components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../../../../../../components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../../../../components/ui/select"
import { UpdateMaintenanceStatus } from "./update-maintenance"
import { cn } from "../../../../../../../../lib/utils"
import { useGetAllMaintenanceForBuilding } from "../../../../../../../../store/server/maintaince"
import { useBuildingStore } from "../../../../../../../../store/buildings"
import GlobalLoading from "../../../../../../../../components/global-loading"
import { MaintenanceStatus, Priority } from "../../../../../../../../types/maintainance"
import { AddMaintenanceDialog } from "./add-maintenance-dialog"



// interface MaintenanceRequest {
//   id: string
//   title: string
//   description: string
//   room: string
//   requestedAt: string
//   status: MaintenanceStatus
//   priority: Priority
  
// }


const statusColors: Record<MaintenanceStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  in_progress: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-gray-100 text-gray-800",
}

const priorityColors: Record<Priority, string> = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800",
}



export function MaintenanceList() {
  const [filter, setFilter] = useState<MaintenanceStatus | "all">("all")
  const {activeBuilding} = useBuildingStore();
  const {data:maintenance,isLoading} = useGetAllMaintenanceForBuilding(activeBuilding?.id as string);
  console.log(maintenance, 'maintenance')
  const filteredRequests = maintenance?.filter((request) => filter === "all" || request.request_status === filter)
  const [isOpen, setIsOpen] = useState(false);
  if(isLoading){
    return <GlobalLoading title="Maintenance"/>
  }

  if(maintenance?.length === 0){
    return (
    <div className="flex items-center justify-center h-full">
          <AddMaintenanceDialog trigger={<Button onClick={() => setIsOpen(true)}>New Request</Button>} />
    <div className="text-center text-muted-foreground">No maintenance requests found</div>
    </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Maintenance Requests</h2>
          <p className="text-sm text-muted-foreground">Manage and track maintenance requests for this building</p>
          <AddMaintenanceDialog trigger={<Button onClick={() => setIsOpen(true)}>New Request</Button>} />
        </div>
        {/* <Button onClick={() => setIsOpen(true)}>New Request</Button> */}
      </div>

      <div className="flex items-center gap-4">
        <Select value={filter} onValueChange={(value: MaintenanceStatus | "all") => setFilter(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Requests</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredRequests?.map((request) => (
          <Card key={request.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {/* {request.contact?.room?.room_number} */}
                    <Badge variant="outline">Room {request.contract?.room?.room_number}</Badge>
                  </CardTitle>
                  <CardDescription className="flex items-center gap-4 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(request?.created_at as string).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(request?.modified_at as string).toLocaleTimeString()}
                    </span>
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                 
                  <Badge className={cn(statusColors[request.request_status as MaintenanceStatus],'hover:text-black hover:bg-white cursor-default')} >
                    {request.request_status
                      .split("_")
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(" ")}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <UpdateMaintenanceStatus
                        requestId={request.id as string}
                        currentStatus={request.request_status as MaintenanceStatus}
                        trigger={
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Update Status</DropdownMenuItem>
                        }
                      />
                      
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{request.description}</p>
              <p className="text-sm text-muted-foreground">Note: {request.special_note}</p>
              <Badge className={cn(priorityColors[request.priority as Priority],'hover:text-black hover:bg-white cursor-default')} >
                    {request.priority
                      .split("_")
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(" ")}
                  </Badge>              
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

