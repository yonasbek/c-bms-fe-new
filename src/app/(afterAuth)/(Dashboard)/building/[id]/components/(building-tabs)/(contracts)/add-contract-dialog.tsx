"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "../../../../../../../../components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../../../../../components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../../../../../components/ui/form"
import { Input } from "../../../../../../../../components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Calendar } from "../../../../../../../../components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "../../../../../../../../components/ui/popover"
import { cn } from "../../../../../../../../lib/utils"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../../../../components/ui/select"
import { useGetAllFloorsRoomsForBuilding } from "../../../../../../../../store/server/floor"
import { useGetAllTenantUsersForABuilding } from "../../../../../../../../store/server/tenant-user"
import { useBuildingStore } from "../../../../../../../../store/buildings"
import { useCreateContract } from "../../../../../../../../store/server/contract"

const formSchema = z.object({
  tenant_id: z.number(),
  room_id: z.number(),
  start_date: z.string(),
  end_date: z.string(),
  rate_per_sqm: z.number().min(0, "Rate must be positive"),
  room_size: z.number().min(1, "Room size must be at least 1m²"),
  monthly_rent: z.number().optional(), // This will be calculated
}).refine(
  (data) => {
    const startDate = new Date(data.start_date);
    const endDate = new Date(data.end_date);
    return endDate > startDate;
  },
  {
    message: "End date must be after start date",
    path: ["end_date"], // This shows the error on the end_date field
  }
);

type ContractFormValues = z.infer<typeof formSchema>

export function AddContractDialog() {
  const [open, setOpen] = useState(false)
  const { activeBuilding } = useBuildingStore()
  const { data: floors } = useGetAllFloorsRoomsForBuilding(activeBuilding?.id?.toString() || "")
  const { data: tenants } = useGetAllTenantUsersForABuilding(activeBuilding?.id?.toString() || "")
  const { mutate: createContract, isPending: isCreating } = useCreateContract()

  // Get all available rooms (not occupied) and organize them by floor
  const availableRooms = floors?.reduce((acc, floor) => {
    const vacantRooms = floor.rooms.filter(room => room.room_status === "vacant");
    if (vacantRooms.length > 0) {
      acc.push({
        floorName: floor.name,
        rooms: vacantRooms.map(room => ({
          ...room,
          displayName: `Floor ${floor.name} - Room ${room.room_number}`
        }))
      });
    }
    return acc;
  }, [] as { floorName: string; rooms: Array<any> }[]) || [];

  // Sort rooms by floor name and room number
  const sortedAvailableRooms = availableRooms
    .sort((a, b) => a.floorName.localeCompare(b.floorName))
    .flatMap(floor => floor.rooms.sort((a, b) => a.room_number - b.room_number));

  const form = useForm<ContractFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tenant_id: 0,
      room_id: 0,
      start_date: "",
      end_date: "",
      rate_per_sqm: 0,
      room_size: 0,
      monthly_rent: 0,
    },
  })

  // Calculate monthly rent whenever rate_per_sqm or room_size changes
  const ratePerSqm = form.watch("rate_per_sqm")
  const roomSize = form.watch("room_size")
  const monthlyRent = ratePerSqm * roomSize

  // Update room size when a room is selected
  const handleRoomSelect = (roomId: string) => {
    const selectedRoom = sortedAvailableRooms.find(room => room.id.toString() === roomId)
    if (selectedRoom) {
      form.setValue("room_id", Number(roomId))
      form.setValue("room_size", selectedRoom.room_size)
    }
  }

  // Add this after form initialization
  const startDate = form.watch("start_date")

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Contract
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Contract</DialogTitle>
          <DialogDescription>
            Create a new contract for this tenant and room.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form 
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="tenant_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Tenant</FormLabel>
                  <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a tenant" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tenants?.map((tenant) => (
                        <SelectItem key={tenant.userId} value={tenant.userId.toString()}>
                          {tenant.user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="room_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Room</FormLabel>
                  <Select onValueChange={handleRoomSelect} value={field.value?.toString()}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a vacant room" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sortedAvailableRooms.length === 0 ? (
                        <SelectItem disabled value="no-rooms">
                          No vacant rooms available
                        </SelectItem>
                      ) : (
                        sortedAvailableRooms.map((room) => (
                          <SelectItem 
                            key={room.id} 
                            value={room.id.toString()}
                            className="flex items-center justify-between"
                          >
                            <span>{room.displayName}</span>
                            <span className="text-sm text-muted-foreground ml-2">
                              ({room.room_size}m²)
                            </span>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(new Date(field.value), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date: Date | undefined) => {
                          if (date) {
                            field.onChange(date.toISOString())
                            // Reset end date if it's before the new start date
                            const endDate = form.getValues("end_date")
                            if (endDate && new Date(endDate) <= date) {
                              form.setValue("end_date", "")
                            }
                          }
                        }}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="end_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>End Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild disabled={!startDate}>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            (!field.value || !startDate) && "text-muted-foreground"
                          )}
                          disabled={!startDate}
                        >
                          {field.value ? (
                            format(new Date(field.value), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date: Date | undefined) => {
                          if (date) {
                            field.onChange(date.toISOString())
                          }
                        }}
                        disabled={(date) => 
                          !startDate || // Disable all dates if no start date
                          date <= new Date(startDate) // Disable dates before or equal to start date
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rate_per_sqm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rate per Square Meter</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter rate per square meter"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Remove leading zeros and convert to number
                        const numericValue = value === "" ? 0 : Number(value.replace(/^0+/, ''));
                        field.onChange(numericValue);
                      }}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="p-4 bg-muted rounded-md">
              <div className="text-sm font-medium">Room Size: {roomSize}m²</div>
              <div className="text-sm font-medium">Monthly Rent: ${monthlyRent.toFixed(2)}</div>
              <div className="text-xs text-muted-foreground">
                (Calculated from rate per m² × room size)
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                type="button"
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button 
                onClick={(e) => {
                  e.preventDefault();
                  const formData = form.getValues();
                  console.log('Submit clicked, form data:', formData);
                  
                  const contractData = {
                    userId: formData.tenant_id,
                    roomId: formData.room_id,
                    start_date: formData.start_date,
                    end_date: formData.end_date,
                    rate_per_sqm: formData.rate_per_sqm,
                    monthly_rent: monthlyRent,
                    is_active: true,
                    contract_status: "active"
                  };

                  console.log('Sending contract data:', contractData);
                  createContract(contractData, {
                    onSuccess: () => {
                      setOpen(false);
                      form.reset();
                    }
                  });
                }}
                disabled={isCreating}
              >
                {isCreating ? (
                  <>
                    <span className="loading loading-spinner loading-sm mr-2"></span>
                    Creating...
                  </>
                ) : (
                  "Create Contract"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 