"use client"

import { useTenantContract, useTenantBuilding } from "../../../../../hooks/use-tenant-queries"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../../components/ui/card"
import { Skeleton } from "../../../../../components/ui/skeleton"
import { Badge } from "../../../../../components/ui/badge"
import { Button } from "../../../../../components/ui/button"
import { CalendarRange, DollarSign, FileText, Building } from "lucide-react"
import { format } from "date-fns"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { TenantContract } from "../../../../../types/tenant"

export default function TenantContractPage() {
  const { data: session } = useSession();
  const [activeContract, setActiveContract] = useState<TenantContract | null>(null);
  
  const { data: contracts, isLoading: contractLoading, error: contractError } = useTenantContract({
    userId: session?.user?.id || ''
  });
  
  const { data: building, isLoading: buildingLoading } = useTenantBuilding();
  
  useEffect(() => {
    if (contracts && contracts.length > 0) {
      const activeOne = contracts.find(c => c.contract_status === "active") || contracts[0];
      setActiveContract(activeOne);
      console.log("[Tenant UI] Contracts received:", contracts);
      console.log("[Tenant UI] Active contract set:", activeOne);
    }
  }, [contracts]);
  
  useEffect(() => {
    if (building) {
      console.log("[Tenant UI] Current building:", building);
    }
  }, [building]);
  
  const isLoading = contractLoading || buildingLoading;
  
  if (isLoading) {
    return (
      <div className="w-full space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">My Contract</h1>
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-32" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-6">
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
            </div>
            <div className="grid grid-cols-3 gap-6 pt-4 border-t">
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  if (contractError) {
    return (
      <div className="w-full space-y-6">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>{contractError instanceof Error ? contractError.message : "An error occurred"}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }
  
  if (!contracts || contracts.length === 0 || !activeContract) {
    return (
      <div className="w-full space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>No Contract Found</CardTitle>
            <CardDescription>You don&apos;t have an active contract yet.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My Contract</h1>
        {building && (
          <div className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-md">
            <Building className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{building.name}</span>
          </div>
        )}
      </div>

      {contracts.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {contracts.map((contract) => (
            <Button
              key={contract.id}
              variant={activeContract.id === contract.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveContract(contract)}
              className="h-8"
            >
              Room {contract.room.room_number}
              <Badge
                variant={contract.contract_status === 'active' ? 'default' : 'secondary'}
                className="ml-2 capitalize h-5 text-xs"
              >
                {contract.contract_status}
              </Badge>
            </Button>
          ))}
        </div>
      )}

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5" />
            Contract Details
          </CardTitle>
          <CardDescription>Information about your rental contract</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarRange className="h-4 w-4" />
                Start Date
              </div>
              <p className="font-medium">
                {format(new Date(activeContract.start_date), "MMMM d, yyyy")}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarRange className="h-4 w-4" />
                End Date
              </div>
              <p className="font-medium">
                {format(new Date(activeContract.end_date), "MMMM d, yyyy")}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                Monthly Rent
              </div>
              <p className="font-medium">
                ${activeContract.monthly_rent.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Contract Status</p>
              <Badge
                variant={activeContract.contract_status === 'active' ? 'default' : 'secondary'}
                className="capitalize"
              >
                {activeContract.contract_status}
              </Badge>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Room</p>
              <p className="font-medium">
                Room {activeContract.room.room_number}, Floor {activeContract.room.floor.name}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Building</p>
              <p className="font-medium">{activeContract.room.floor.building.name}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 