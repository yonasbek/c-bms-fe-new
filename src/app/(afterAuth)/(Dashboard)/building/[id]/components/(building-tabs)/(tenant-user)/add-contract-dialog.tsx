"use client";

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
import { contractService } from "../../../../../../../../services/contract";
import { toast } from "sonner";

const formSchema = z.object({
  tenant_id: z.number(),
  room_id: z.number(),
  start_date: z.string(),
  end_date: z.string(),
  rate_per_sqm: z.number().min(0, "Rate must be positive"),
  room_size: z.number().min(1, "Room size must be at least 1m²"),
});

type ContractFormValues = z.infer<typeof formSchema>;

interface AddContractDialogProps {
  tenantId: number;
  roomId: number;
  roomSize: number;
  onSuccess?: () => void;
}

export function AddContractDialog({ tenantId, roomId, roomSize, onSuccess }: AddContractDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ContractFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tenant_id: tenantId,
      room_id: roomId,
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
      rate_per_sqm: 0,
      room_size: roomSize,
    },
  });

  async function onSubmit(data: ContractFormValues) {
    try {
      setIsLoading(true);
      await contractService.createContract(
        {
          ...data,
          monthly_rent: monthlyRent,
        }
      );
      toast.success("Contract created successfully");
      setOpen(false);
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create contract");
    } finally {
      setIsLoading(false);
    }
  }

  const monthlyRent = form.watch("rate_per_sqm") * roomSize;

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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
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
              name="end_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
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
              name="rate_per_sqm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rate per Square Meter</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter rate per square meter"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="p-4 bg-muted rounded-md">
              <div className="text-sm font-medium">Room Size: {roomSize}m²</div>
              <div className="text-sm font-medium">Monthly Rent: ${monthlyRent.toFixed(2)}</div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                type="button"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
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
  );
} 