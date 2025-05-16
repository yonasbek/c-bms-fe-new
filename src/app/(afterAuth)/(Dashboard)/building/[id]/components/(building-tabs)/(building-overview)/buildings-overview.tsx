import GlobalLoading from "../../../../../../../../components/global-loading";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../../../../components/ui/card"
import { useBuildingStore } from "../../../../../../../../store/buildings";
import { useGetFloorsForBuilding } from "../../../../../../../../store/server/floor";
import { getReportForBuilding } from "../../../../../../../../store/server/report";
import { Building2, Users, Home, AlertCircle } from "lucide-react"

export function BuildingOverview() {
  const {activeBuilding} = useBuildingStore();
  const {data,isLoading} = getReportForBuilding(activeBuilding?.id as string);
  const report = data;

  const totalFloors = report?.length ||0;

  if(isLoading){
return <GlobalLoading title="Floors"/>
  }
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Floors</CardTitle>
          <Building2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{report.total_floors}</div>
          {/* <p className="text-xs text-muted-foreground"> Total Floors</p> */}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{report.occupancy_rate}%</div>
          <p className="text-xs text-muted-foreground">{report?.total_rooms - report?.vacant_rooms} Occupied Units</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Vacant Units</CardTitle>
          <Home className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{report?.vacant_rooms}</div>
          <p className="text-xs text-muted-foreground">Available for rent</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Issues</CardTitle>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{report?.pending_maintenance}</div>
          <p className="text-xs text-muted-foreground">Pending maintenance</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{report?.total_users}</div>
          <p className="text-xs text-muted-foreground">Total Tenants</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Sub Contractors</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{report?.total_sub_contracts}</div>
          <p className="text-xs text-muted-foreground">Total Sub Contractors</p>
        </CardContent>
      </Card>
    </div>
  )
}

