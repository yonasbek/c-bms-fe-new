"use client"

import { useState } from "react"
import { useTenantContract, useTenantMaintenanceRequestsByContracts, useTenantBuilding } from "../../../../../hooks/use-tenant-queries"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../../../../../components/ui/card"
import { Skeleton } from "../../../../../components/ui/skeleton"
import { Badge } from "../../../../../components/ui/badge"
import { Button } from "../../../../../components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../../components/ui/tabs"
import { Wrench, Plus, AlertCircle, Building } from "lucide-react"
import { format } from "date-fns"
import { MaintenanceRequest, MaintenanceStatus } from "../../../../../types/tenant"
import { AddMaintenanceRequestDialog } from "./components/add-maintenance-request-dialog"
import { useEffect } from "react"
import { useSession } from "next-auth/react"

export default function TenantMaintenancePage() {
  const { data: session } = useSession();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Initialize the queries
  const { data: contracts, isLoading: contractsLoading } = useTenantContract({
    userId: session?.user?.id || ''
  });
  
  // Fetch maintenance requests for all rooms in the user's contracts
  const { 
    data: maintenanceRequests, 
    isLoading: maintenanceLoading, 
    error: maintenanceError 
  } = useTenantMaintenanceRequestsByContracts(contracts);
  
  const { data: building, isLoading: buildingLoading } = useTenantBuilding();
  
  // Log contracts and maintenance requests for debugging
  useEffect(() => {
    if (contracts) {
      console.log("[Tenant UI] User contracts:", contracts);
      console.log("[Tenant UI] Room IDs:", contracts.map(c => c.room.id));
    }
  }, [contracts]);
  
  // Log building information for debugging
  useEffect(() => {
    if (building) {
      console.log("[Tenant UI] Current building in maintenance:", building);
    }
  }, [building]);
  
  // Function to get status badge variant
  const getStatusVariant = (status: MaintenanceStatus) => {
    switch (status) {
      case "pending":
        return "secondary"
      case "in_progress":
        return "default"
      case "completed":
        return "success"
      case "rejected":
        return "destructive"
      default:
        return "outline"
    }
  }
  
  const isLoading = contractsLoading || maintenanceLoading || buildingLoading;
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Maintenance Requests</h1>
          <Skeleton className="h-10 w-40" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }
  
  if (maintenanceError) {
    return (
      <div className="container mx-auto py-6">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{maintenanceError instanceof Error ? maintenanceError.message : "An error occurred"}</p>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  // Filter requests by status
  const pendingRequests = maintenanceRequests?.filter(req => 
    req.request_status === "pending" || req.request_status === "in_progress") || []
  const completedRequests = maintenanceRequests?.filter(req => 
    req.request_status === "completed" || req.request_status === "rejected") || []
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Maintenance Requests</h1>
        <div className="flex items-center gap-4">
          {building && (
            <div className="flex items-center gap-2 bg-muted px-3 py-1 rounded-md">
              <Building className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{building.name}</span>
            </div>
          )}
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Request
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="active">Active Requests</TabsTrigger>
          <TabsTrigger value="completed">Completed Requests</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          {pendingRequests.length === 0 ? (
            <Card>
              <CardHeader className="text-center">
                <CardTitle>No Active Requests</CardTitle>
                <CardDescription>
                  You dont have any active maintenance requests
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Wrench className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-center text-muted-foreground max-w-md">
                  Need something fixed in your room? Create a new maintenance request and our team will address it promptly.
                </p>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Request
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <MaintenanceRequestCard key={request.id} request={request} />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completed">
          {completedRequests.length === 0 ? (
            <Card>
              <CardHeader className="text-center">
                <CardTitle>No Completed Requests</CardTitle>
                <CardDescription>
                  You dont have any completed maintenance requests
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <div className="space-y-4">
              {completedRequests.map((request) => (
                <MaintenanceRequestCard key={request.id} request={request} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <AddMaintenanceRequestDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        contracts={contracts || []}
      />
    </div>
  )
}

function MaintenanceRequestCard({ request }: { request: MaintenanceRequest }) {
  // Function to get status badge variant
  const getStatusVariant = (status: MaintenanceStatus) => {
    switch (status) {
      case "pending":
        return "secondary"
      case "in_progress":
        return "default"
      case "completed":
        return "success"
      case "rejected":
        return "destructive"
      default:
        return "outline"
    }
  }
  
  // Function to get priority badge variant
  const getPriorityVariant = (priority: string | undefined) => {
    switch (priority) {
      case "low":
        return "outline"
      case "medium":
        return "secondary"
      case "high":
        return "default"
      case "urgent":
        return "destructive"
      default:
        return "outline"
    }
  }
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Maintenance Request #{request.id}</CardTitle>
            <CardDescription>
              Room {request.room?.room_number || request.roomId} &#8226; Created {format(new Date(request.created_at), "MMM d, yyyy")}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {request.priority && (
              <Badge 
                variant={getPriorityVariant(request.priority)} 
                className="capitalize"
              >
                {request.priority} Priority
              </Badge>
            )}
            <Badge variant={getStatusVariant(request.request_status) as "outline" | "secondary" | "default" | "destructive" | null} className="capitalize">
              {request.request_status.replace('_', ' ')}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{request.description}</p>
        {request.special_note && (
          <div className="mt-4 p-3 bg-muted rounded-md">
            <p className="text-sm font-medium">Special Notes:</p>
            <p className="text-sm">{request.special_note}</p>
          </div>
        )}
      </CardContent>
      {request.request_status === "rejected" && (
        <CardFooter className="bg-destructive/10 text-destructive text-sm flex gap-2 items-center">
          <AlertCircle className="h-4 w-4" />
          This request was rejected. Please submit a new request if the issue persists.
        </CardFooter>
      )}
    </Card>
  )
} 