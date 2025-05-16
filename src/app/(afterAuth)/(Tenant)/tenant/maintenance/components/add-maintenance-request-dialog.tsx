"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useCreateMaintenanceRequest } from "../../../../../../hooks/use-tenant-queries"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../../../../../components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../../../../../../components/ui/form"
import { Input } from "../../../../../../components/ui/input"
import { Textarea } from "../../../../../../components/ui/textarea"
import { Button } from "../../../../../../components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../../components/ui/select"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { useEffect } from "react"
import { TenantContract } from "../../../../../../types/tenant"

// Form schema
const formSchema = z.object({
  description: z.string().min(10, "Description must be at least 10 characters"),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  special_note: z.string().optional(),
  roomId: z.string().min(1, "Room ID is required")
})

type FormValues = z.infer<typeof formSchema>

interface AddMaintenanceRequestDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contracts: TenantContract[]
}

export function AddMaintenanceRequestDialog({ open, onOpenChange, contracts }: AddMaintenanceRequestDialogProps) {
  const createMutation = useCreateMaintenanceRequest();
  
  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      priority: "medium",
      special_note: "",
      roomId: ""
    }
  });
  
  // Set the roomId when contracts change
  useEffect(() => {
    if (contracts && contracts.length > 0 && contracts[0].room && contracts[0].room.id) {
      form.setValue('roomId', contracts[0].room.id.toString());
    }
  }, [contracts, form]);
  
  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    if (contracts.length === 0) {
      toast.error("No active contract found. Please contact support.");
      return;
    }
    
    try {
      console.log("[Tenant UI] Creating maintenance request:", values);
      await createMutation.mutateAsync({
        ...values,
        roomId: parseInt(values.roomId)
      });
      toast.success("Maintenance request created successfully");
      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to create maintenance request");
      console.error(error);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>New Maintenance Request</DialogTitle>
          <DialogDescription>
            Submit a request for maintenance or repairs in your room.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Please provide details about the issue..." 
                      className="min-h-[120px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Describe the issue in detail to help our maintenance team
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the priority level for this maintenance request
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {contracts && contracts.length > 1 && (
              <FormField
                control={form.control}
                name="roomId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select the room" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {contracts.map((contract) => (
                          <SelectItem 
                            key={contract.room.id} 
                            value={contract.room.id.toString()}
                          >
                            Room {contract.room.room_number}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the room where the issue is located
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="special_note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Special Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Any additional information or special instructions..." 
                      className="min-h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Add any special notes or instructions for the maintenance team
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createMutation.isPending}
              >
                {createMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Submit Request
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 