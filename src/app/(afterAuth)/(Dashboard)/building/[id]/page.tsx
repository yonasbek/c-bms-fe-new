'use client'

import { use } from 'react';
import { Button } from "../../../../../components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../../components/ui/tabs"
import { FloorsList } from "./components/(building-tabs)/(floors-room)/floors-list"
import { BuildingOverview } from "./components/(building-tabs)/(building-overview)/buildings-overview"
import { useGetBuildingInfo } from "../../../../../store/server/buildings"
import { MaintenanceList } from "./components/(building-tabs)/(maintenance)/maintenance-list"
import { TenantsList } from "./components/(building-tabs)/(tenant-user)/tenant-list"
import GlobalLoading from "../../../../../components/global-loading"
import { AddFloorDialog } from "./components/(building-tabs)/(floors-room)/add-floor-dialog"
import { ContractsList } from "./components/(building-tabs)/(contracts)/contracts-list"
import {InventoryList} from "./components/(building-tabs)/(inventory)/inventory-list"
import { PaymentsTab } from "./components/(building-tabs)/(payments)/payments-tab"
import { SubContractList } from "./components/(building-tabs)/(sub-contract)/sub-contract-list"
interface PageProps {
  params: Promise<{ id: string }>
}

export default function BuildingDetailsPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const {data:building, isError, isLoading} = useGetBuildingInfo(resolvedParams.id);

  if(isLoading){
    return <GlobalLoading title="Building " />
  }
  if(isError){
    return <div>Error loading building</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">{building?.name}</h2>
          <p className="text-muted-foreground">{building?.address}</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline">Edit Building</Button>
          <AddFloorDialog />
        </div>
      </div>

      <Tabs defaultValue="floors" className="space-y-4">
        <TabsList>
          {/* <TabsTrigger value="overview">Overview</TabsTrigger> */}
          <TabsTrigger value="floors">Floors & Rooms</TabsTrigger>
          <TabsTrigger value="tenants">Tenant-Users</TabsTrigger>
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="sub-contracts">Sub-Contracts</TabsTrigger>
        </TabsList>
        {/* <TabsContent value="overview" className="space-y-4">
          <BuildingOverview />
        </TabsContent> */}
        <TabsContent value="floors" className="space-y-4">
          <FloorsList />
        </TabsContent>
        <TabsContent value="maintenance">
          <MaintenanceList />
        </TabsContent>
        <TabsContent value="tenants">
          <TenantsList />
        </TabsContent>
        <TabsContent value="contracts">
          <ContractsList />
        </TabsContent>
        <TabsContent value="inventory">
          <InventoryList />
        </TabsContent>
        <TabsContent value="payments">
          <PaymentsTab />
        </TabsContent>
        <TabsContent value="sub-contracts">
          <SubContractList />
        </TabsContent>
      </Tabs>
    </div>
  )
}

