'use client'

import React, { useEffect } from 'react'
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../../../components/ui/dialog'
import { Label } from '../../../../components/ui/label'
import { Input } from '../../../../components/ui/input'
import { Button } from '../../../../components/ui/button'
import { useModalStore } from '../../../../store/modal'
import { useForm } from 'react-hook-form'
import { userRequest } from '../../../../lib/requests'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

// Define proper types
interface BuildingFormData {
  name: string;
  address: string;
  // Add other fields as needed
}

const CreateBuildingModal = () => {
  const { modal, setIsOpen } = useModalStore();
  const forceOpen = modal.forceOpen;
  const queryClient = useQueryClient();
  
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<BuildingFormData>({
    defaultValues: {
      name: '',
      address: '',
    }
  });
  
  const mutation = useMutation({
    mutationFn: (data: BuildingFormData) => {
      return userRequest.post('/building', data);
    },
    onSuccess: async (data) => {
      console.log('Mutation completed with data:', data);
      
      // Force a direct cache update in addition to invalidation
      const existingBuildings = queryClient.getQueryData(['buildings']) || [];
      console.log('Existing buildings before update:', existingBuildings);
      
      // First invalidate to mark as stale
      await queryClient.invalidateQueries({ queryKey: ['buildings'] });
      
      // Then explicitly update the cache with the new data
      if (Array.isArray(existingBuildings)) {
        queryClient.setQueryData(['buildings'], (oldData: any) => {
          const newData = Array.isArray(oldData) ? [...oldData, data.data] : [data.data];
          console.log('Updated buildings cache:', newData);
          return newData;
        });
      }
      
      // Force an immediate refetch to ensure latest data
      await queryClient.refetchQueries({ 
        queryKey: ['buildings'],
        exact: true,
        type: 'active' 
      });
      
      // Broadcast a custom event to notify other components
      window.dispatchEvent(new CustomEvent('building-created', { detail: data.data }));
      
      toast.success('Building created successfully');
      useModalStore.setState({
        modal: {
          name: '',
          isOpen: false,
          forceOpen: false
        }
      });
      
      reset();
    },
  });
  
  // Fix onSubmit type
  const onSubmit = (data: BuildingFormData) => {
    mutation.mutate(data);
  };
  
  useEffect(() => {
    if (forceOpen) {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = '';
      };
      
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, [forceOpen]);

  return (
    <DialogContent 
      className="sm:max-w-[425px]" 
      onInteractOutside={(e) => {
        if (forceOpen) {
          e.preventDefault();
        }
      }}
      onEscapeKeyDown={(e) => {
        if (forceOpen) {
          e.preventDefault();
        }
      }}
    >
      <DialogHeader>
        <DialogTitle>
          {forceOpen ? "Create Your First BuildingGGGGGGGG" : "Add New Building"}
        </DialogTitle>
        <DialogDescription>
          {forceOpen 
            ? "Please create your first building to get started with Building Plus."
            : "Enter the details of the new building. You can add floors and rooms after creating the building."}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Building Name*</Label>
            <Input 
              id="name" 
              placeholder="Enter building name"
              {...register("name", { required: "Building name is required" })}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="address">Address*</Label>
            <Input 
              id="address" 
              placeholder="Enter building address"
              {...register("address", { required: "Address is required" })}
              className={errors.address ? "border-red-500" : ""}
            />
            {errors.address && (
              <p className="text-sm text-red-500">{errors.address.message}</p>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-3">
          {!forceOpen && (
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Building"}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}

export default CreateBuildingModal; 