"use client"

import { Bell } from "lucide-react"
import { Button } from "./ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover"
import { ScrollArea } from "./ui/scroll-area"
import { useTenantNotifications } from "../hooks/use-tenant-queries"
import { format } from "date-fns"
import { Badge } from "./ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Skeleton } from "./ui/skeleton"
import { useEffect } from "react"
import { useSession } from "next-auth/react"

export function NotificationIcon() {
  const { data: session } = useSession();
  const { data: notifications, isLoading, error } = useTenantNotifications(session?.user?.id || '');
  const unreadCount = notifications?.filter(n => !n.is_read).length || 0;

  // Log notifications for debugging
  useEffect(() => {
    if (notifications) {
      console.log("[Tenant UI] Current notifications:", notifications);
    }
    if (error) {
      console.error("[Tenant UI] Error fetching notifications:", error);
    }
  }, [notifications, error]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {!isLoading && unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium leading-none">Notifications</h4>
            {!isLoading && unreadCount > 0 && (
              <Badge variant="secondary">{unreadCount} unread</Badge>
            )}
          </div>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : error ? (
            <div className="text-center py-6 text-sm text-destructive">
              Failed to load notifications
            </div>
          ) : notifications && notifications.length > 0 ? (
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {notifications.map((notification) => (
                  <Card key={notification.id} className={!notification.is_read ? "bg-muted" : ""}>
                    <CardHeader className="p-3">
                      <CardTitle className="text-sm">{notification.title}</CardTitle>
                      <CardDescription className="text-xs">
                        {format(new Date(notification.created_at), "MMM d, yyyy 'at' h:mm a")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                      <p className="text-sm">{notification.message}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center py-6 text-sm text-muted-foreground">
              No notifications
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
} 