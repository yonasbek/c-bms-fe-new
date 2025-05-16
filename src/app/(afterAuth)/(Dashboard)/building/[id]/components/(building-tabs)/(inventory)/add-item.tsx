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
import { Input } from "../../../../../../../../components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useCreateItem } from "../../../../../../../../store/server/inventory"; // Assuming you have a hook for creating inventory items
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  description: z.string().optional(),
});

type AddItemDialogProps = {
  trigger?: React.ReactNode;
};

export function AddItemDialog({ trigger }: AddItemDialogProps) {
  const [open, setOpen] = useState(false);
  const mutation = useCreateItem();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      console.log(data, 'data')
      await mutation.mutateAsync(data);
      toast.success("Item added successfully");
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error('Mutation error:', error);
      toast.error("Failed to add item");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add New Item</DialogTitle>
          <DialogDescription>
            Submit a new item to the inventory. Provide the necessary details.
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter item name" 
                      {...field} 
                    />
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
                {mutation.isPending ? "Adding..." : "Add Item"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
