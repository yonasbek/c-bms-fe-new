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
  FormMessage 
} from "../../../../../../../../components/ui/form"
import { Input } from "../../../../../../../../components/ui/input"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../../../../components/ui/select"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useCreatePayment } from "../../../../../../../../store/server/payment"
import { useBuildingStore } from "../../../../../../../../store/buildings"
import { useGetAllTenantUsersForABuilding } from "../../../../../../../../store/server/tenant-user"
import { userRequest } from "../../../../../../../../lib/requests"

const formSchema = z.object({
  contractId: z.string().min(1, "Please select a contract"),
  reference_number: z.string().min(1, "Reference number is required"),
  payment_status: z.string().min(1, "Payment status is required"),
  payment_from: z.string().min(1, "Payment from date is required"),
  payment_to: z.string().min(1, "Payment to date is required"),
  payment_date: z.string().min(1, "Payment date is required"),
}).refine(
  (data) => {
    const fromDate = new Date(data.payment_from);
    const toDate = new Date(data.payment_to);
    return toDate > fromDate;
  },
  {
    message: "Payment to date must be after payment from date",
    path: ["payment_to"], // This shows the error on the payment_to field
  }
);

type PaymentFormValues = z.infer<typeof formSchema>;

export function AddPaymentDialog() {
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const { activeBuilding } = useBuildingStore()
  const { data: tenants, isLoading: isLoadingTenants } = useGetAllTenantUsersForABuilding(activeBuilding?.id as string)
  const { mutate: createPayment, isPending } = useCreatePayment()

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contractId: "",
      reference_number: "",
      payment_status: "paid",
      payment_from: "",
      payment_to: "",
      payment_date: new Date().toISOString().split('T')[0],
    },
  })

  const paymentFromDate = form.watch("payment_from")

  async function onSubmit(data: PaymentFormValues) {
    try {

      console.log('data', data)
      // First create payment
      const contractIdNumber = parseInt(data.contractId);
      
      if (isNaN(contractIdNumber)) {
        console.error("Invalid contract ID");
        return;
      }
      
      createPayment({
        ...data
      }, {
        onSuccess: async (response) => {
          // If file exists, upload it
          if (file && response.data && response.data.id) {
            const formData = new FormData();
            formData.append('file', file);
            await userRequest.post(`/payment/upload/${response.data.id}`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
          }
          
          setOpen(false)
          form.reset()
          setFile(null)
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Payment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Payment</DialogTitle>
          <DialogDescription>
            Record a new payment for a tenant&apos;s contract.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="contractId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contract</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                    disabled={isLoadingTenants}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a contract" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tenants?.map(tenant => 
                        tenant.contracts.map(contract => (
                          <SelectItem 
                            key={contract.id} 
                            value={contract.id.toString()}
                          >
                            {tenant.user.name} - Room {contract.room?.room_number || "N/A"} (${contract.monthly_rent}/month)
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
              name="reference_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reference Number</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., PAY-12345" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="payment_status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                      <SelectItem value="partial">Partial</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="payment_from"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment From</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => {
                          field.onChange(e.target.value)
                          // Reset payment_to if it's before the new payment_from
                          const paymentTo = form.getValues("payment_to")
                          if (paymentTo && paymentTo <= e.target.value) {
                            form.setValue("payment_to", "")
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="payment_to"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment To</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field}
                        disabled={!paymentFromDate}
                        min={paymentFromDate ? new Date(new Date(paymentFromDate).getTime() + 86400000).toISOString().split('T')[0] : undefined}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="payment_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Receipt Document</FormLabel>
              <Input 
                type="file" 
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setFile(file);
                }}
              />
              {file && (
                <p className="text-sm text-muted-foreground">
                  Selected file: {file.name}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Adding..." : "Add Payment"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 