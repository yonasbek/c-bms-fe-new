/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"


import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../../../../../../../components/ui/dialog"
import { Badge } from "../../../../../../../../components/ui/badge"
import { Button } from "../../../../../../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../../../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../../../../../components/ui/tabs"
import { Calendar, DollarSign, Mail, Phone, Clock, Users } from "lucide-react"

interface ViewSubContractDialogProps {
  contract: any // Replace with proper type
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewSubContractDialog({ contract, open, onOpenChange }: ViewSubContractDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{contract.companyName}</span>
            <Badge
              className={`ml-2 ${
                contract.status === "active"
                  ? "bg-green-100 text-green-800"
                  : contract.status === "expiring"
                    ? "bg-yellow-100 text-yellow-800"
                    : contract.status === "expired"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
              }`}
            >
              {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
            </Badge>
          </DialogTitle>
          <DialogDescription>Contract and service provider details</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Contract Information</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Contract Period</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(contract.start_date).toLocaleDateString()} -{" "}
                      {new Date(contract.end_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Monthly Fee</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />${contract.amount.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">Contact Person</p>
                  <div className="grid gap-2">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {contract.contact_name}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {contract.contact_phone}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {contract.contact_email}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Service Schedule</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Service Days</p>
                  <div className="flex gap-2">
                    {contract.service_days?.split(",")?.map((day: string) => (
                      <Badge key={day} variant="outline">
                        {day}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Service Hours</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {contract.service_hours}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Staff Count</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {contract.number_of_employees} staff members
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Last Payment</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {contract.last_payment ? new Date(contract.last_payment).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Next Payment</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {contract.next_payment ? new Date(contract.next_payment).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                </div>
                <Button className="w-full">View Payment History</Button>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button variant="outline">Edit Contract</Button>
          <Button>Renew Contract</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

