// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client"

// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Calendar, PenToolIcon as Tool } from "lucide-react"

// interface ViewInventoryDialogProps {
//   item: any // Replace with proper type
//   open: boolean
//   onOpenChange: (open: boolean) => void
// }

// export function ViewInventoryDialog({ item, open, onOpenChange }: ViewInventoryDialogProps) {
//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-[800px]">
//         <DialogHeader>
//           <DialogTitle className="flex items-center justify-between">
//             <span>{item.name}</span>
//             <Badge
//               className={`ml-2 ${
//                 item.status === "operational"
//                   ? "bg-green-100 text-green-800"
//                   : item.status === "maintenance"
//                     ? "bg-yellow-100 text-yellow-800"
//                     : item.status === "repair"
//                       ? "bg-red-100 text-red-800"
//                       : "bg-gray-100 text-gray-800"
//               }`}
//             >
//               {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
//             </Badge>
//           </DialogTitle>
//           <DialogDescription>Equipment details and maintenance history</DialogDescription>
//         </DialogHeader>

//         <Tabs defaultValue="details" className="w-full">
//           <TabsList className="grid w-full grid-cols-3">
//             <TabsTrigger value="details">Details</TabsTrigger>
//             <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
//             <TabsTrigger value="documents">Documents</TabsTrigger>
//           </TabsList>
//           <TabsContent value="details" className="space-y-4">
//             <div className="grid grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <p className="text-sm font-medium">Model</p>
//                 <p className="text-sm text-muted-foreground">{item.model}</p>
//               </div>
//               <div className="space-y-2">
//                 <p className="text-sm font-medium">Serial Number</p>
//                 <p className="text-sm text-muted-foreground">{item.serialNumber}</p>
//               </div>
//               <div className="space-y-2">
//                 <p className="text-sm font-medium">Location</p>
//                 <p className="text-sm text-muted-foreground">{item.location}</p>
//               </div>
//               <div className="space-y-2">
//                 <p className="text-sm font-medium">Type</p>
//                 <p className="text-sm text-muted-foreground capitalize">{item.type}</p>
//               </div>
//               <div className="space-y-2">
//                 <p className="text-sm font-medium">Purchase Date</p>
//                 <p className="text-sm text-muted-foreground">{new Date(item.purchaseDate).toLocaleDateString()}</p>
//               </div>
//               <div className="space-y-2">
//                 <p className="text-sm font-medium">Warranty Expiry</p>
//                 <p className="text-sm text-muted-foreground">{new Date(item.warrantyExpiry).toLocaleDateString()}</p>
//               </div>
//             </div>
//           </TabsContent>
//           <TabsContent value="maintenance" className="space-y-4">
//             <div className="grid gap-4">
//               <Card>
//                 <CardHeader className="pb-2">
//                   <CardTitle className="text-sm font-medium">Next Scheduled Maintenance</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="flex items-center space-x-2">
//                     <Calendar className="h-4 w-4 text-muted-foreground" />
//                     <span>
//                       {item.nextMaintenance ? new Date(item.nextMaintenance).toLocaleDateString() : "Not scheduled"}
//                     </span>
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardHeader className="pb-2">
//                   <CardTitle className="text-sm font-medium">Maintenance History</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-2">
//                   <div className="flex items-start space-x-2">
//                     <Tool className="h-4 w-4 mt-0.5 text-muted-foreground" />
//                     <div>
//                       <p className="text-sm font-medium">Regular Maintenance</p>
//                       <p className="text-sm text-muted-foreground">
//                         {item.lastMaintenance ? new Date(item.lastMaintenance).toLocaleDateString() : "No record"}
//                       </p>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </TabsContent>
//           <TabsContent value="documents" className="space-y-4">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-sm font-medium">Documentation</CardTitle>
//                 <CardDescription>Equipment manuals and related documents</CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-2">
//                 <Button variant="outline" className="w-full justify-start">
//                   User Manual.pdf
//                 </Button>
//                 <Button variant="outline" className="w-full justify-start">
//                   Warranty Certificate.pdf
//                 </Button>
//                 <Button variant="outline" className="w-full justify-start">
//                   Maintenance Guide.pdf
//                 </Button>
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>

//         <div className="flex justify-end gap-2">
//           <Button variant="outline" onClick={() => onOpenChange(false)}>
//             Close
//           </Button>
//           <Button>Schedule Maintenance</Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// }

