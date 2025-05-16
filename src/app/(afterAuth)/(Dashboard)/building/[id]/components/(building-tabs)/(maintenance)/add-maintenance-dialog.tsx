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
import { useCreateMaintenance } from "../../../../../../../../store/server/maintaince"; // Assuming you have a hook for creating maintenance requests
import { toast } from "sonner";
import { useGetRoomsForBuilding } from "../../../../../../../../store/server/maintaince"; // Assuming you have a hook to fetch rooms
import { useBuildingStore } from "../../../../../../../../store/buildings";

const formSchema = z.object({
  description: z.string().min(1, "Description is required"),
  special_note: z.string().min(1, "Special Note is required"),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  roomId: z.string().min(1, "Room is required"),
  request_status: z.enum(["pending", "in_progress", "completed", "cancelled"]),
});

type AddMaintenanceDialogProps = {
  trigger?: React.ReactNode;
};

export function AddMaintenanceDialog({ trigger }: AddMaintenanceDialogProps) {
  const [open, setOpen] = useState(false);
  const mutation = useCreateMaintenance();
  const {activeBuilding} = useBuildingStore();

  // Fetch rooms
  const { data: rooms, isLoading: loadingRooms } = useGetRoomsForBuilding(activeBuilding?.id as string); // Fetch rooms using a custom hook

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      special_note: "",
      priority: "low",
      roomId: "",
      request_status: "pending",
    },
  });
console.log('Roomss',rooms)
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await mutation.mutateAsync(data);
      toast.success("Maintenance request created successfully");
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
        {trigger || (
          <Button variant="outline" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Maintenance Request
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add New Maintenance Request</DialogTitle>
          <DialogDescription>
            Submit a new maintenance request. Provide the necessary details.
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Describe the issue" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            

            <FormField
              control={form.control}
              name="roomId" // New field for room selection
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room</FormLabel>
                  <FormControl>
                    <select {...field} className="input" disabled={loadingRooms}>
                      <option value="">Select a room</option>
                      {rooms?.data?.map((room) => (
                        <option key={room.id} value={room.id}>
                          {room.floor?.name ?? 'No Floor'} - {room.name}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="special_note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Special Note (Optional)</FormLabel>
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

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <FormControl>
                    <select {...field} className="input">
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
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
                {mutation.isPending ? "Creating..." : "Create Request"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 