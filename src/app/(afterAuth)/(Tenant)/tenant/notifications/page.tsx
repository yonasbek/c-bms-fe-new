"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../../components/ui/tabs"
import { Badge } from "../../../../../components/ui/badge"
import { Bell, Calendar, Info, Building } from "lucide-react"
import { format } from "date-fns"
import { useQuery } from "@tanstack/react-query"
import { userRequest } from "../../../../../lib/requests"
import { Skeleton } from "../../../../../components/ui/skeleton"
import { useTenantBuilding } from "../../../../../hooks/use-tenant-queries"

interface Notification {
  id: number
  title: string
  message: string
  type: "announcement" | "reminder" | "alert"
  created_at: string
  read: boolean
}

export default function TenantNotificationsPage() {
  const [activeTab, setActiveTab] = useState("all")
  
  // Initialize building query
  const { data: building, isLoading: buildingLoading } = useTenantBuilding()
  
  // Log building information for debugging
  useEffect(() => {
    if (building) {
      console.log("[Tenant UI] Current building in notifications:", building);
    }
  }, [building]);
  
  const { data: notifications, isLoading: notificationsLoading, error } = useQuery<Notification[]>({
    queryKey: ["tenant-notifications"],
    queryFn: async () => {
      console.log("[Tenant API] Fetching notifications");
      try {
        const response = await userRequest.get("/notifications");
        console.log("[Tenant API] Notifications received:", response.data);
        return response.data;
      } catch (error) {
        console.error("[Tenant API] Error fetching notifications: all finilzed ", error);
        throw error;
      }
    }
  })
  
  // Filter notifications based on active tab
  const filteredNotifications = notifications?.filter(notification => {
    if (activeTab === "all") return true
    if (activeTab === "unread") return !notification.read
    return notification.type === activeTab
  })
  
  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "announcement":
        return <Bell className="h-5 w-5" />
      case "reminder":
        return <Calendar className="h-5 w-5" />
      case "alert":
        return <Info className="h-5 w-5" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }
  
  // Get notification badge color based on type
  const getNotificationBadgeVariant = (type: string) => {
    switch (type) {
      case "announcement":
        return "default"
      case "reminder":
        return "secondary"
      case "alert":
        return "destructive"
      default:
        return "outline"
    }
  }
  
  const isLoading = notificationsLoading || buildingLoading;
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <h1 className="text-3xl font-bold">Notifications</h1>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <Skeleton className="h-10 w-full" />
          </TabsList>
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </Tabs>
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
            <p>Failed to load notifications. Please try again later.</p>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Notifications</h1>
        {building && (
          <div className="flex items-center gap-2 bg-muted px-3 py-1 rounded-md">
            <Building className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{building.name}</span>
          </div>
        )}
      </div>
      
      <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="announcement">Announcements</TabsTrigger>
          <TabsTrigger value="reminder">Reminders</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab}>
          {!filteredNotifications || filteredNotifications.length === 0 ? (
            <Card>
              <CardHeader className="text-center">
                <CardTitle>No Notifications</CardTitle>
                <CardDescription>
                  You don&apos;t have any {activeTab !== "all" ? activeTab + " " : ""}notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Bell className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-center text-muted-foreground max-w-md">
                  When you receive notifications, they will appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <Card key={notification.id} className={notification.read ? "opacity-70" : ""}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        {getNotificationIcon(notification.type)}
                        <CardTitle>{notification.title}</CardTitle>
                      </div>
                      <div className="flex gap-2 items-center">
                        <Badge 
                          variant={getNotificationBadgeVariant(notification.type)} 
                          className="capitalize"
                        >
                          {notification.type}
                        </Badge>
                        {!notification.read && (
                          <Badge variant="secondary">New</Badge>
                        )}
                      </div>
                    </div>
                    <CardDescription>
                      {format(new Date(notification.created_at), "MMMM d, yyyy 'at' h:mm a")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{notification.message}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
} 