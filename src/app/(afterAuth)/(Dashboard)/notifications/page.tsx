"use client"

import { useState, useRef } from "react"
import { Plus, Search, User, Bell, Users } from "lucide-react"
import { Button } from "../../../../components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../components/ui/dialog"
import { Input } from "../../../../components/ui/input"
import { Label } from "../../../../components/ui/label"
import { Textarea } from "../../../../components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select"
import { Checkbox } from "../../../../components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Badge } from "../../../../components/ui/badge"
import { ScrollArea } from "../../../../components/ui/scroll-area"
import { useGetNotifications, useCreateNotification } from "../../../../store/server/notification"
import { useGetAllTenantUsersForABuilding } from "../../../../store/server/tenant-user"
import { useBuildingStore } from "../../../../store/buildings"
import { format } from "date-fns"
import { Notification } from "../../../../types/notification"

export default function NotificationsPage() {
  const [open, setOpen] = useState(false)
  const [isIndividual, setIsIndividual] = useState(false)
  const [selectedUser, setSelectedUser] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")
  const formRef = useRef<HTMLFormElement>(null)
  const { activeBuilding } = useBuildingStore()
  const { data: notifications, isLoading } = useGetNotifications()
  const { data: tenants } = useGetAllTenantUsersForABuilding(activeBuilding?.id as string)
  const createNotification = useCreateNotification()

  // Debug logs
  console.log('Notifications:', notifications)
  console.log('Tenants:', tenants)

  const resetForm = () => {
    if (formRef.current) {
      formRef.current.reset()
    }
    setIsIndividual(false)
    setSelectedUser("")
    setSearchQuery("")
  }

  const handleDialogChange = (open: boolean) => {
    setOpen(open)
    if (!open) {
      resetForm()
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    try {
      const result = await createNotification.mutateAsync({
        name: formData.get("name") as string,
        message: formData.get("message") as string,
        type: formData.get("type") as "other" | "payment" | "maintenance" | "contract",
        userId: isIndividual ? Number(selectedUser) : undefined,
      })
      console.log('Created notification:', result)
      resetForm()
      setOpen(false)
    } catch (error) {
      console.error('Error creating notification:', error)
    }
  }

  const filteredTenants = tenants?.filter(tenant => 
    tenant.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">
            Manage and create notifications for your building
          </p>
        </div>
        <Dialog open={open} onOpenChange={handleDialogChange}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Notification
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Notification</DialogTitle>
              <DialogDescription>
                Create a notification to send to tenants
              </DialogDescription>
            </DialogHeader>
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" name="message" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select name="type" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="payment">Payment</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="individual" 
                  checked={isIndividual}
                  onCheckedChange={(checked) => setIsIndividual(checked as boolean)}
                />
                <Label htmlFor="individual">Send to individual tenant</Label>
              </div>
              {isIndividual && (
                <div className="space-y-2">
                  <Label>Search Tenant</Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search tenant..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <ScrollArea className="h-[200px] rounded-md border p-2">
                    {filteredTenants?.map((tenant) => (
                      <div
                        key={tenant.userId}
                        className="flex items-center space-x-2 p-2 hover:bg-accent rounded-md cursor-pointer"
                        onClick={() => setSelectedUser(tenant.userId.toString())}
                      >
                        <User className="h-4 w-4" />
                        <span className={selectedUser === tenant.userId.toString() ? "font-semibold" : ""}>
                          {tenant.user.name}
                        </span>
                      </div>
                    ))}
                  </ScrollArea>
                </div>
              )}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setOpen(false)}
                  type="button"
                  disabled={createNotification.isPending}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={createNotification.isPending || (isIndividual && !selectedUser)}
                >
                  {createNotification.isPending ? (
                    <>
                      <span className="loading loading-spinner loading-sm mr-2"></span>
                      Creating...
                    </>
                  ) : (
                    "Create Notification"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-[400px]">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : notifications && notifications.length > 0 ? (
        <div className="grid gap-6">
          {notifications.map((notification: Notification) => (
            <Card 
              key={notification.id} 
              className={`relative overflow-hidden transition-all duration-200 hover:shadow-lg border-border`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className={`rounded-full p-2 ${
                        notification.type === 'payment' ? 'bg-blue-100 text-blue-600' :
                        notification.type === 'maintenance' ? 'bg-orange-100 text-orange-600' :
                        notification.type === 'contract' ? 'bg-green-100 text-green-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        <Bell className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-semibold">
                          {notification.name}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge 
                            variant="outline" 
                            className={`capitalize ${
                              notification.type === 'payment' ? 'border-blue-200 text-blue-700' :
                              notification.type === 'maintenance' ? 'border-orange-200 text-orange-700' :
                              notification.type === 'contract' ? 'border-green-200 text-green-700' :
                              'border-gray-200 text-gray-700'
                            }`}
                          >
                            {notification.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Created {format(new Date(notification.created_at), "MMM d, yyyy 'at' h:mm a")}</span>
                      <span>•</span>
                      <span>{notification.userId ? 'Individual Notification' : 'Group Notification'}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {notification.message}
                  </p>
                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Recipients:</span>
                    </div>
                    {notification.userId ? (
                      <div className="flex flex-wrap gap-2">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-full text-sm">
                          <User className="h-3.5 w-3.5" />
                          <span>{notification.user?.name}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-full text-sm w-fit">
                        <Users className="h-3.5 w-3.5" />
                        <span>All Tenants in {notification.building.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[400px] text-center space-y-6">
          <div className="rounded-full bg-primary/10 p-6">
            <Bell className="h-12 w-12 text-primary" />
          </div>
          <div className="space-y-3">
            <h3 className="text-2xl font-semibold">No Notifications Yet</h3>
            <p className="text-muted-foreground max-w-sm">
              Get started by creating your first notification. You can send notifications to all tenants or target specific individuals.
            </p>
          </div>
          <Button 
            onClick={() => setOpen(true)}
            className="mt-4"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create First Notification
          </Button>
        </div>
      )}
    </div>
  )
}
