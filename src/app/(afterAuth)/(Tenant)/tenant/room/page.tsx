"use client"

import { useTenantRoom } from "../../../../../hooks/use-tenant-queries"
import { useTenantStore } from "../../../../../store/tenant"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../../components/ui/card"
import { Skeleton } from "../../../../../components/ui/skeleton"
import { Building, Home } from "lucide-react"

export default function TenantRoomPage() {
  const { room, isLoading, error } = useTenantStore()
  
  // Initialize the query
  useTenantRoom()
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <h1 className="text-3xl font-bold">My Room</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="container mx-auto py-6">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  if (!room) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>No Room Assigned</CardTitle>
            <CardDescription>You dont have a room assigned yet.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">My Room</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Room Details
            </CardTitle>
            <CardDescription>Information about your room</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm font-medium">Room Number:</div>
              <div>{room.room_number}</div>
              
              <div className="text-sm font-medium">Floor:</div>
              <div>{room.floor_number}</div>
              
              <div className="text-sm font-medium">Status:</div>
              <div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  room.room_status === 'occupied' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {room.room_status.charAt(0).toUpperCase() + room.room_status.slice(1)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Building Information
            </CardTitle>
            <CardDescription>Details about the building</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm font-medium">Building Name:</div>
              <div>{room.building.name}</div>
              
              <div className="text-sm font-medium">Address:</div>
              <div>{room.building.address}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 