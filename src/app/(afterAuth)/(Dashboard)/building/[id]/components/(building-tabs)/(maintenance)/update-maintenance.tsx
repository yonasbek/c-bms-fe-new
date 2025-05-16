"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "../../../../../../../../components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../../../../../../../components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../../../../components/ui/select"
import { Textarea } from "../../../../../../../../components/ui/textarea"
import { Label } from "../../../../../../../../components/ui/label"
import { useUpdateMaintenance } from "../../../../../../../../store/server/maintaince"
interface UpdateMaintenanceStatusProps {
  requestId: string
  currentStatus: string
  trigger: React.ReactNode
}

export function UpdateMaintenanceStatus({ requestId, currentStatus, trigger }: UpdateMaintenanceStatusProps) {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState(currentStatus)
  const [note, setNote] = useState("")
  const { mutate: updateMaintenance, isPending } = useUpdateMaintenance();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle status update here
    console.log({ requestId, status, note })
    updateMaintenance({id: requestId, request_status: status})
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div onClick={() => setOpen(true)}>{trigger}</div>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Maintenance Status</DialogTitle>
          <DialogDescription>Change the status of this maintenance request </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="status">New Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
         
          <div className="flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Update Status</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

