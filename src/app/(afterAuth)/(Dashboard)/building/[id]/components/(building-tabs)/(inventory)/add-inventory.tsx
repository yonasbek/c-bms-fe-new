"use client";

import type React from "react";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "../../../../../../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../../../../../components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../../../../../components/ui/form";
import { Input } from "../../../../../../../../components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useCreateInventory, useGetAllItems } from "../../../../../../../../store/server/inventory"; // Assuming you have a hook for creating inventory and additional hooks for fetching items and statuses
import { toast } from "sonner";
import { useBuildingStore } from "../../../../../../../../store/buildings";

const formSchema = z.object({
  itemId: z.string().min(1, "Item ID is required"),
  quantity: z.string().min(1, "Quantity must be at least 1"),
  procured_date: z.string().min(1, "Quantity must be at least 1"),
  status: z.string().min(1, "Status is required"),
  description: z.string().optional(),
});

type AddInventoryDialogProps = {
  trigger?: React.ReactNode;
};

export function AddInventoryDialog({ trigger }: AddInventoryDialogProps) {
  const [open, setOpen] = useState(false);
  const mutation = useCreateInventory();
  const {activeBuilding} = useBuildingStore();

  // Fetch items and statuses from the inventory store
  const { data: items, isLoading: itemsLoading } = useGetAllItems(); // Hook to get items

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      itemId: "",
      quantity: "",
      procured_date:"",
      status: "",
      description: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log(data, 'data')
    try {
      await mutation.mutateAsync({ 
        buildingId: activeBuilding?.id as string,
        itemId: data.itemId,
        quantity: data.quantity,
        procured_date: new Date(data.procured_date),
        status: data.status,
        description: data.description,
      });
      toast.success("Inventory item added successfully");
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error('Mutation error:', error);
      toast.error("Failed to add inventory item");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Inventory
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add New Inventory</DialogTitle>
          <DialogDescription>
            Submit a new inventory item. Provide the necessary details.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit(onSubmit)(e);
            }} 
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="itemId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item ID</FormLabel>
                  <FormControl>
                    <select {...field} className="input" disabled={itemsLoading}>
                      <option value={0}>Select Item ID</option>
                      {items.map(item => (
                        <option key={item.id} value={item.id}>{item.name}</option> // Assuming item has id and name
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Enter quantity" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="procured_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Procured Date</FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <select {...field} className="input">
                      <option value="">Select Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Any additional notes" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                type="button"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Adding..." : "Add Inventory"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
