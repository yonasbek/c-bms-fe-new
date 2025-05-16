"use client"

import { useState } from "react"
import { Badge } from "../../../../../components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../../components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../components/ui/select"
import { Input } from "../../../../../components/ui/input"
import { Search, Building2, Calendar, DollarSign, Users } from "lucide-react"
import { AddSubContractDialog } from "./add-sub-contract-dialog"
import { ViewSubContractDialog } from "./view-sub-contract"
import { ServiceType, SubContractType } from "../../../../../types/subContract"
import { ContractStatus } from "../../../../../types/subContract"
import { useGetAllSubContractForBuilding } from "../../../../../store/server/subContract"
import { useBuildingStore } from "../../../../../store/buildings"
import GlobalLoading from "../../../../../components/global-loading"




const statusColors: Record<ContractStatus, string> = {
  active: "bg-green-100 text-green-800",
  expired: "bg-red-100 text-red-800",
  terminated: "bg-gray-100 text-gray-800",
}

const serviceIcons = {
  security: Users,
  cleaning: Building2,
  maintenance: Building2,
  landscaping: Building2,
  other: Building2,
}

export function SubContractList() {
  const [search, setSearch] = useState("")
  const [serviceFilter, setServiceFilter] = useState<ServiceType | "all">("all")
  const [statusFilter, setStatusFilter] = useState<ContractStatus | "all">("all")
  const [selectedContract, setSelectedContract] = useState<SubContractType | null>(null)
  const {activeBuilding} = useBuildingStore();
  const {data:subContracts,isLoading} = useGetAllSubContractForBuilding(activeBuilding?.id as string);

  const filteredContracts = subContracts?.filter((contract) => {
    const matchesSearch = contract.company_name.toLowerCase().includes(search.toLowerCase())
    const matchesService = serviceFilter === "all" || contract.service_type === serviceFilter
    const matchesStatus = statusFilter === "all" || contract.status === statusFilter
    return matchesSearch && matchesService && matchesStatus
  })
  if(isLoading){
    return <GlobalLoading title="Sub-Contracts"/>
  }
  if(subContracts?.length === 0){
    return <div className="flex items-center justify-center h-full">
      <AddSubContractDialog />
      <div className="text-center text-muted-foreground">No sub-contracts found</div>
    </div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search companies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={serviceFilter} onValueChange={(value: ServiceType | "all") => setServiceFilter(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Service type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Services</SelectItem>
              <SelectItem value="security">Security</SelectItem>
              <SelectItem value="cleaning">Cleaning</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="landscaping">Landscaping</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(value: ContractStatus | "all") => setStatusFilter(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Contract status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="terminated">Terminated</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <AddSubContractDialog />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredContracts.map((contract) => {
          const ServiceIcon = serviceIcons[contract.service_type]
          return (
            <Card
              key={contract.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => setSelectedContract(contract)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">{contract.company_name}</CardTitle>
                    <CardDescription>
                      <div className="flex items-center gap-2">
                        <ServiceIcon className="h-4 w-4" />
                        <span className="capitalize">{contract.service_type}</span>
                      </div>
                    </CardDescription>
                  </div>
                  <Badge className={statusColors[contract.status]}>
                    {contract.status?.charAt(0)?.toUpperCase() + contract?.status?.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Contract End:</span>
                    </div>
                    <span>{new Date(contract.start_date)?.toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Contract End:</span>
                    </div>
                    <span>{new Date(contract.end_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span>Monthly Fee:</span>
                    </div>
                    <span>${contract.amount}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>Staff Count:</span>
                    </div>
                    <span>{contract.number_of_employees}</span>
                  </div>
                  </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {selectedContract && (
        <ViewSubContractDialog
          contract={selectedContract}
          open={!!selectedContract}
          onOpenChange={() => setSelectedContract(null)}
        />
      )}
    </div>
  )
}

