"use client"

import { useState } from "react"
import { FileText, Calendar, Building2 } from "lucide-react"
import { Badge } from "../../../../../../../../components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../../../../../components/ui/card"
import { Avatar, AvatarFallback } from "../../../../../../../../components/ui/avatar"
import { useGetTenantUsersByContractStatus } from "../../../../../../../../store/server/tenant-user"
import { useBuildingStore } from "../../../../../../../../store/buildings"
import GlobalLoading from "../../../../../../../../components/global-loading"
import { AddTenantUserDialog } from "./add-tenant-user-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../../../../components/ui/select"

type ContractStatus = "active" | "expiring" | "expired"

const contractStatusColors: Record<ContractStatus, string> = {
  active: "bg-green-100 text-green-800",
  expiring: "bg-yellow-100 text-yellow-800",
  expired: "bg-gray-100 text-gray-800",
}

type TenantWithContract = {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
    phoneNumber: string;
  };
  tin_number: string | null;
  contracts: {
    id: number;
    start_date: string;
    end_date: string;
    monthly_rent: number;
    contract_status: ContractStatus;
    room?: {
      id: number;
      room_number: string;
    };
  }[];
}

export function TenantsList() {
  const { activeBuilding } = useBuildingStore();
  const [contractFilter, setContractFilter] = useState<'all' | 'active' | 'terminated' | 'no-contract'>('all');
  const { data: tenants, isLoading, isError } = useGetTenantUsersByContractStatus(activeBuilding?.id.toString() || "", contractFilter);

  if (isLoading) return <GlobalLoading title="Tenants" />;
  if (isError) return <div>Error loading tenants</div>;

  const typedTenants = tenants;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Tenants</h2>
        <div className="flex gap-4 items-center">
          <Select value={contractFilter} onValueChange={value => setContractFilter(value as 'all' | 'active' | 'terminated' | 'no-contract')}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by Contract" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Has Active Contract</SelectItem>
              <SelectItem value="terminated">Terminated Contract</SelectItem>
              <SelectItem value="no-contract">No Contract</SelectItem>
            </SelectContent>
          </Select>
          <AddTenantUserDialog />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {typedTenants?.map((tenant) => {
          const activeContract = tenant.contracts.find(c => c.contract_status === "active");
          return (
            <Card key={tenant.id} className={`${tenant.contracts.length === 0 ? "border-red-500" : ""}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback>{tenant.user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">{tenant.user.name}</CardTitle>
                      <CardDescription>{tenant.user.email}</CardDescription>
                      <CardDescription className="mt-1">
                        TIN: {tenant.tin_number  || "No TIN number"}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {activeContract?.room?.room_number && (
                      <Badge variant="outline">Room {activeContract.room.room_number.charAt(0).toUpperCase() + activeContract.room.room_number.slice(1)}</Badge>
                    )}
                    {tenant.contracts.length === 0 && <Badge variant="destructive">No Contract</Badge>}
                  </div>
                </div>
              </CardHeader>
              {tenant.contracts.length > 0 && (
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText className="h-4 w-4" />
                        Contracts
                      </span>
                      <Badge variant="outline">{tenant.contracts.length} Contract{tenant.contracts.length > 1 ? 's' : ''}</Badge>
                    </div>
                    
                    <div className="space-y-3">
                      {tenant.contracts.map((contract) => (
                        <div 
                          key={contract.id}
                          className="rounded-lg border p-3 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm font-medium">
                                Room {contract.room?.room_number}
                              </span>
                            </div>
                            <Badge 
                              variant="outline" 
                              className={contractStatusColors[contract.contract_status as ContractStatus] || "bg-gray-100 text-gray-800"}
                            >
                              {contract.contract_status.charAt(0).toUpperCase() + contract.contract_status.slice(1)}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {new Date(contract.start_date).toLocaleDateString()} -{" "}
                              {new Date(contract.end_date).toLocaleDateString()}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Monthly Rent</span>
                            <span className="font-medium">{contract.monthly_rent} ETB</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  )
}

