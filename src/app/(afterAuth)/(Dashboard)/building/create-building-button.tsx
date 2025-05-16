"use client"

import { Plus } from "lucide-react"
import { Button } from "../../../../components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../components/ui/dialog"
import { Input } from "../../../../components/ui/input"
import { Label } from "../../../../components/ui/label"
import { useState } from "react"

export function CreateBuildingButton() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Building
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Building</DialogTitle>
          <DialogDescription>
            Enter the details of the new building. You can add floors and rooms after creating the building.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Building Name</Label>
            <Input id="name" placeholder="Enter building name" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" placeholder="Enter building address" />
          </div>
          
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button>Create Building</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

