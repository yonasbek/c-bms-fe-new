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
  FormDescription
} from "../../../../../../../../components/ui/form"
import { Input } from "../../../../../../../../components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useCreateTenantUser } from "../../../../../../../../store/server/tenant-user"
import { CreateTenantUserData } from "../../../../../../../../services/tenant"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be 10 digits")
    .max(10, "Phone number must be 10 digits")
    .regex(/^09\d{8}$/, "Phone number must be a valid Ethiopian number starting with '09'"),
  tin_number: z.string().optional(),
  room_id: z.string(),
  start_date: z.date(),
  end_date: z.date(),
  monthly_rent: z.number(),
  contract_status: z.enum(["active", "inactive"]),
});

type TenantFormValues = z.infer<typeof formSchema>;

export function AddTenantUserDialog() {
  const [open, setOpen] = useState(false);
  const createTenantUser = useCreateTenantUser();

  const form = useForm<TenantFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      tin_number: "",
      room_id: "",
      start_date: new Date(),
      end_date: new Date(),
      monthly_rent: 0,
      contract_status: "active",
    },
  });

  async function onSubmit(data: TenantFormValues) {
    try {
      const formData: CreateTenantUserData = {
        ...data,
        start_date: data.start_date.toISOString(),
        end_date: data.end_date.toISOString(),
        tin_number: data.tin_number || undefined,
      };
      await createTenantUser.mutateAsync(formData);
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Tenant User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Tenant User</DialogTitle>
          <DialogDescription>
            Add a new tenant user to your building. They will receive an email invitation.
          </DialogDescription>
        </DialogHeader>
        {createTenantUser.error && (
          <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
            {createTenantUser.error instanceof Error 
              ? createTenantUser.error.message 
              : "An error occurred while creating the tenant user"}
          </div>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="0912345678" 
                      type="tel" 
                      {...field}
                      onChange={(e) => {
                        // Only allow numeric input and ensure it starts with '09'
                        let value = e.target.value.replace(/\D/g, '');
                        
                        // If the user is typing and hasn't entered '09' yet, help them by adding it
                        if (value.length > 0 && !value.startsWith('09')) {
                          if (value.startsWith('9')) {
                            value = '0' + value;
                          } else if (!value.startsWith('0')) {
                            value = '09';
                          }
                        }
                        
                        // Ensure we don't exceed 10 digits
                        value = value.slice(0, 10);
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormDescription>Enter Ethiopian mobile number (e.g., 0912345678)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tin_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>TIN Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter TIN number (optional)" {...field} />
                  </FormControl>
                  <FormDescription>Tax Identification Number (optional)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                type="button"
                disabled={createTenantUser.isPending}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={createTenantUser.isPending}
              >
                {createTenantUser.isPending ? (
                  <>
                    <span className="loading loading-spinner loading-sm mr-2"></span>
                    Creating...
                  </>
                ) : (
                  "Create Tenant"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
