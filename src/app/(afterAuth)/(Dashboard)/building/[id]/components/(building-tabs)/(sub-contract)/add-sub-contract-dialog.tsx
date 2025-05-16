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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../../../../../../../../components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../../../../components/ui/select"
import { Input } from "../../../../../../../../components/ui/input"
import { Checkbox } from "../../../../../../../../components/ui/checkbox"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useCreateSubContract } from "../../../../../../../../store/server/subContract"
import { toast } from "sonner"
import { useBuildingStore } from "../../../../../../../../store/buildings"
import { ServiceType } from "../../../../../../../../types/subContract"
const days = [
  { id: "monday", label: "Monday" },
  { id: "tuesday", label: "Tuesday" },
  { id: "wednesday", label: "Wednesday" },
  { id: "thursday", label: "Thursday" },
  { id: "friday", label: "Friday" },
  { id: "saturday", label: "Saturday" },
  { id: "sunday", label: "Sunday" },
]

const formSchema = z.object({
  company_name: z.string().min(2, "Company name is required"),
  service_type: z.string().min(1, "Service type is required"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  amount: z.string().min(1, "Amount is required"),
  number_of_employees: z.string().min(1, "Number of employees is required"),
  contact_name: z.string().min(1, "Contact name is required"),
  contact_phone: z.string().min(1, "Contact phone is required"),
  contact_email: z.string().email("Invalid email address"),
  service_days_array: z.array(z.string()).min(1, "Select at least one day"),
  service_hours: z.string().min(1, "Service hours are required"),
})

export function AddSubContractDialog() {
  const [open, setOpen] = useState(false)
  const mutation = useCreateSubContract();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company_name: "",
      service_type: "",
      start_date: "",
      end_date: "",
      amount: "",
      number_of_employees: "",
      contact_name: "",
      contact_phone: "",
      contact_email: "",
      service_days_array: [],
      service_hours: "",
    },
  })
  const {activeBuilding} = useBuildingStore();
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const mappedData = {
        company_name: data.company_name,
        service_type: data.service_type as ServiceType,
        start_date: data.start_date,
        end_date: data.end_date,
        amount: data.amount,
        number_of_employees: data.number_of_employees,
        contact_name: data.contact_name,
        contact_phone: data.contact_phone,
        contact_email: data.contact_email,
        service_days: data.service_days_array.join(","),
        buildingId: activeBuilding?.id as string,
        status: "active",
        service_hours: data.service_hours,
      }
      await mutation.mutateAsync(mappedData);
      toast.success("Sub-Contract created successfully");
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error('Mutation error:', error);
      toast.error("Failed to create maintenance request");
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Sub-Contract
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Sub-Contract</DialogTitle>
          <DialogDescription>Add a new service provider contract to the system.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="company_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Service provider name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="service_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select service type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="security">Security</SelectItem>
                        <SelectItem value="cleaning">Cleaning</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="landscaping">Landscaping</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contract Start</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contract End</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Fee</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="number_of_employees"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Staff Count</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="contact_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Person Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="contact_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="Phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contact_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Email address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="service_days_array"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Service Days</FormLabel>
                    <FormDescription>Select the days when service is provided</FormDescription>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {days.map((day) => (
                      <FormField
                        key={day.id}
                        control={form.control}
                        name="service_days_array"
                        render={({ field }) => {
                          return (
                            <FormItem key={day.id} className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(day.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, day.id])
                                      : field.onChange(field.value?.filter((value) => value !== day.id))
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">{day.label}</FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="service_hours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Hours</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 9:00 AM - 5:00 PM or 24/7" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setOpen(false)} type="button">
                Cancel
              </Button>
              <Button type="submit">Add Contract</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

