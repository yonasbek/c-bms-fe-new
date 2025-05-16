"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../../../components/ui/card"
import { Button } from "../../../../../components/ui/button"
import { Badge } from "../../../../../components/ui/badge"
import { useSession } from "next-auth/react"
import { useQuery } from "@tanstack/react-query"
import { userRequest } from "../../../../../lib/requests"
import { format } from "date-fns"
import { 
  Home, 
  ClipboardList, 
  Wrench, 
  Bell, 
  DollarSign, 
  CalendarRange,
  ArrowRight,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react"
import Link from "next/link"

interface TenantDashboardData {
  room: {
    id: number;
    room_number: string;
    floor_number: number;
    room_status: string;
    building: {
      id: number;
      name: string;
    };
  };
  contract: {
    id: number;
    start_date: string;
    end_date: string;
    monthly_rent: number;
    status: string;
  };
  maintenance: {
    total: number;
    pending: number;
    in_progress: number;
    completed: number;
    rejected: number;
    recent: Array<{
      id: number;
      title: string;
      status: 'pending' | 'in_progress' | 'completed' | 'rejected';
      created_at: string;
    }>;
  };
  notifications: {
    total: number;
    unread: number;
    recent: Array<{
      id: number;
      name: string;
      type: string;
      created_at: string;
    }>;
  };
}

export default function TenantDashboardPage() {
  const { data: session } = useSession()
  const { data: dashboardData, isLoading } = useQuery<TenantDashboardData>({
    queryKey: ['tenant-dashboard'],
    queryFn: async () => {
      const response = await userRequest.get(`/tenant/dashboard/${session?.user?.id}`);
      return response.data;
    },
    enabled: !!session?.user?.id,
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'in_progress':
        return <Wrench className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex flex-col items-center justify-center h-[400px] text-center space-y-4">
          <div className="rounded-full bg-muted p-6">
            <Home className="h-12 w-12 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold">No Data Available</h3>
            <p className="text-muted-foreground max-w-sm">
              We couldnt load your dashboard data. Please try again later or contact support.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your tenant portal. Heres an overview of your information.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Room Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Home className="h-4 w-4 text-primary" />
              My Room
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold">Room {dashboardData.room.room_number}</p>
                <Badge variant="outline" className="capitalize">
                  {dashboardData.room.room_status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Floor {dashboardData.room.floor_number}, {dashboardData.room.building.name}
              </p>
              <Link href="/tenant/room">
                <Button variant="ghost" className="w-full justify-between mt-2 text-primary">
                  View Details
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Contract Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-primary" />
              My Contract
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  <p className="text-2xl font-bold">{dashboardData.contract.monthly_rent.toLocaleString()}&#36;</p>
                </div>
                <Badge 
                  variant={dashboardData.contract.status === 'active' ? 'default' : 'secondary'}
                  className="capitalize"
                >
                  {dashboardData.contract.status}
                </Badge>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <CalendarRange className="h-3 w-3" />
                <span>Ends {format(new Date(dashboardData.contract.end_date), "MMM d, yyyy")}</span>
              </div>
              <Link href="/tenant/contract">
                <Button variant="ghost" className="w-full justify-between mt-2 text-primary">
                  View Contract
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Maintenance Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Wrench className="h-4 w-4 text-primary" />
              Maintenance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold">{dashboardData.maintenance.total}</p>
                <div className="flex items-center gap-1">
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                    {dashboardData.maintenance.pending} Pending
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {dashboardData.maintenance.in_progress} in progress, {dashboardData.maintenance.completed} completed
              </p>
              <Link href="/tenant/maintenance">
                <Button variant="ghost" className="w-full justify-between mt-2 text-primary">
                  View Requests
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Notifications Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold">{dashboardData.notifications.total}</p>
                {dashboardData.notifications.unread > 0 && (
                  <Badge variant="default" className="bg-primary animate-pulse">
                    {dashboardData.notifications.unread} New
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {dashboardData.notifications.recent.length > 0 
                  ? `Latest: ${dashboardData.notifications.recent[0].name}`
                  : 'No recent notifications'}
              </p>
              <Link href="/tenant/notifications">
                <Button variant="ghost" className="w-full justify-between mt-2 text-primary">
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Maintenance Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Maintenance Requests</CardTitle>
            <CardDescription>Your latest maintenance requests and their status</CardDescription>
          </CardHeader>
          <CardContent>
            {dashboardData.maintenance.recent.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.maintenance.recent.map((request) => (
                  <div key={request.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                    <div className="space-y-1">
                      <p className="font-medium">{request.title}</p>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline"
                          className={`flex items-center gap-1 capitalize ${getStatusColor(request.status)}`}
                        >
                          {getStatusIcon(request.status)}
                          {request.status.replace('_', ' ')}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(request.created_at), "MMM d, yyyy")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <Wrench className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No maintenance requests yet</p>
              </div>
            )}
            <div className="mt-4 pt-2">
              <Link href="/tenant/maintenance">
                <Button variant="outline" className="w-full">
                  View All Maintenance Requests
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
            <CardDescription>Latest notifications from building management</CardDescription>
          </CardHeader>
          <CardContent>
            {dashboardData.notifications.recent.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.notifications.recent.map((notification) => (
                  <div key={notification.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                    <div className="space-y-1">
                      <p className="font-medium">{notification.name}</p>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline" 
                          className="capitalize"
                        >
                          {notification.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(notification.created_at), "MMM d, yyyy")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <Bell className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No notifications yet</p>
              </div>
            )}
            <div className="mt-4 pt-2">
              <Link href="/tenant/notifications">
                <Button variant="outline" className="w-full">
                  View All Notifications
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 