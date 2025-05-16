// "use client";

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Building2, Users, ClipboardList, Wrench } from "lucide-react"
// import { useGetBuildings } from "@/store/server/buildings";
// import { Skeleton } from "@/components/ui/skeleton";

// export default function Page() {
  
//   const { data: buildings, isLoading, error, isRefetching } = useGetBuildings();

//   // IMPORTANT: Move the useEffect before any conditional returns
//   // This effect listens for building creation events
//   // useEffect(() => {
//   //   const handleBuildingCreated = () => {
//   //     console.log("Detected building creation, refetching...");
//   //     refetch();
//   //   };
    
//   //   window.addEventListener('building-created', handleBuildingCreated);
//   //   return () => window.removeEventListener('building-created', handleBuildingCreated);
//   // }, [refetch]);

//   // Now it's safe to have conditional returns
//   if (isLoading || isRefetching) {
//     return (
//       <div className="space-y-6">
//         <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
//         <div className="flex items-center justify-center h-64">
//           <div className="space-y-4 w-full max-w-md">
//             <h3 className="text-lg font-medium text-center">Loading your dashboard...</h3>
//             <p className="text-sm text-muted-foreground text-center">Your building has been created. Setting up your dashboard.</p>
//             <div className="grid gap-4 md:grid-cols-2">
//               <Skeleton className="h-24 w-full" />
//               <Skeleton className="h-24 w-full" />
//               <Skeleton className="h-24 w-full" />
//               <Skeleton className="h-24 w-full" />
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error||!buildings) {
//     return <div className="text-red-500 p-4">Error loading buildings: {error instanceof Error ? error.message : String(error)}</div>;
//   }

//   // const hasBuildings = buildings && Array.isArray(buildings) && buildings.length > 0;
  
//   // if (!hasBuildings) {
//   //   console.log("Rendering empty state UI");
//   //   return (
//   //     <div className="flex flex-col items-center justify-center h-64">
//   //       <p className="text-xl mb-4">You need to create a building to view your dashboard</p>
//   //       <button 
//   //         className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//   //         onClick={() => {
//   //           useModalStore.setState({
//   //             modal: {
//   //               name: 'create-building',
//   //               isOpen: true,
//   //               forceOpen: true
//   //             }
//   //           });
//   //         }}
//   //       >
//   //         Create Building
//   //       </button>
//   //       <CustomModal />
//   //     </div>
//   //   );
//   // }

//   // console.log("Rendering dashboard UI");

//   return (  
//     <div className="space-y-6">
//       <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>

//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Total Buildings</CardTitle>
//             <Building2 className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{buildings.length}</div>
//             <p className="text-xs text-muted-foreground">Current total</p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Active Tenants</CardTitle>
//             <Users className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">145</div>
//             <p className="text-xs text-muted-foreground">+4 from last month</p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Active Contracts</CardTitle>
//             <ClipboardList className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">132</div>
//             <p className="text-xs text-muted-foreground">+12 from last month</p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Pending Maintenance</CardTitle>
//             <Wrench className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">9</div>
//             <p className="text-xs text-muted-foreground">+2 from yesterday</p>
//           </CardContent>
//         </Card>
//       </div>

//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
//         <Card className="col-span-4">
//           <CardHeader>
//             <CardTitle>Recent Activities</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               <div className="grid gap-1">
//                 <p className="text-sm font-medium">New tenant registered</p>
//                 <p className="text-sm text-muted-foreground">2 minutes ago</p>
//               </div>
//               <div className="grid gap-1">
//                 <p className="text-sm font-medium">Maintenance request completed</p>
//                 <p className="text-sm text-muted-foreground">1 hour ago</p>
//               </div>
//               <div className="grid gap-1">
//                 <p className="text-sm font-medium">New contract signed</p>
//                 <p className="text-sm text-muted-foreground">3 hours ago</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//         <Card className="col-span-3">
//           <CardHeader>
//             <CardTitle>Quick Stats</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <p className="text-sm font-medium">Occupancy Rate</p>
//                 <p className="text-sm font-medium">87&#37;</p>
//               </div>
//               <div className="flex items-center justify-between">
//                 <p className="text-sm font-medium">Revenue This Month</p>
//                 <p className="text-sm font-medium">&#36;52,000</p>
//               </div>
//               <div className="flex items-center justify-between">
//                 <p className="text-sm font-medium">Pending Payments</p>
//                 <p className="text-sm font-medium">&#36;3,200</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }


'use client'
import GlobalLoading from "../../../components/global-loading";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { useBuildingStore } from "../../../store/buildings";
import { useGetFloorsForBuilding } from "../../../store/server/floor";
import { getReportForBuilding } from "../../../store/server/report";
import { Building2, Users, Home, AlertCircle } from "lucide-react"

export default function Page() {
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
          <p className="text-xs text-muted-foreground">Total Tenant</p>
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


