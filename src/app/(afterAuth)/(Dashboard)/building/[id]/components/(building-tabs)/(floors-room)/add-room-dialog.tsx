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
import { useCreateRoom } from "../../../../../../../../store/server/room";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../../../../components/ui/select";

const formSchema = z.object({
  room_number: z.string().min(1, "Room number is required"),
  room_status: z.enum(["occupied", "vacant", "maintenance"]),
  room_size: z.string().min(1, "Room size must be at least 1m²"),
});

type RoomFormValues = z.infer<typeof formSchema>;

export function AddRoomDialog({ floorId }: { floorId: string }) {
  const [open, setOpen] = useState(false);
  const createRoom = useCreateRoom();

  const form = useForm<RoomFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      room_number: "",
      room_status: "vacant",
      room_size: "",
    },
  });

  async function onSubmit(data: RoomFormValues) {
    try {
      await createRoom.mutateAsync({
        floorId,
        name: data.room_number,
        room_number: data.room_number,
        room_status: 'vacant',
        room_size: data.room_size as string,
        description: "",
      });
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
          Add Room
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Room</DialogTitle>
          <DialogDescription>
            Add a new room to this floor.
          </DialogDescription>
        </DialogHeader>
        {createRoom.error && (
          <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
            {createRoom.error instanceof Error 
              ? createRoom.error.message 
              : "An error occurred while creating the room"}
          </div>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="room_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter room number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="room_size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Size (m²)</FormLabel>
                  <FormControl>
                    <Input 
                      type="text" 
                      placeholder="Enter room size in square meters" 
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="room_status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select room status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="vacant">Vacant</SelectItem>
                      <SelectItem value="occupied">Occupied</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                type="button"
                disabled={createRoom.isPending}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={createRoom.isPending}
              >
                {createRoom.isPending ? (
                  <>
                    <span className="loading loading-spinner loading-sm mr-2"></span>
                    Creating...
                  </>
                ) : (
                  "Create Room"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
