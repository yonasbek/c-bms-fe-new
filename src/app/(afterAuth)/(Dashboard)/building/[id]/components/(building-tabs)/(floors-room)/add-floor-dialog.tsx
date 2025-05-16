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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../../../../../../../components/ui/form"
import { Input } from "../../../../../../../../components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useCreateFloor } from "../../../../../../../../store/server/floor"
import { toast } from 'sonner';
import { useBuildingStore } from "../../../../../../../../store/buildings"


const formSchema = z.object({
  name: z.string().min(1, "Floor name is required"),
  buildingId: z.string().min(1, "Building ID is required"),
})


export function AddFloorDialog() {
const {activeBuilding} = useBuildingStore();

  const [open, setOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      buildingId: activeBuilding?.id as string,
    },
  })

  const createFloor = useCreateFloor();

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      console.log('dataInside onSubmit', data)
      await createFloor.mutateAsync({
        name: data.name,
        buildingId: data.buildingId
      })
      
      form.reset()
      setOpen(false)
    } catch (error) {
      toast.error('Failed to add floor');
      console.log(error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Add New Floor
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add New Floor</DialogTitle>
          <DialogDescription>
            Add a new floor to the building. You can specify the number of rooms to create automatically.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={(e)=>{e.preventDefault();onSubmit(form.getValues())}} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Floor Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Ground Floor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setOpen(false)} type="button">
                Cancel
              </Button>
              <Button type="submit">Create Floor</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

