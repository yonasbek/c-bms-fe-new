"use client"

import { AlertTriangle } from "lucide-react"
import { Button } from "../../../../../../../../components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../../../../../components/ui/dialog"
import { useState } from "react"
import { useTerminateContract } from "../../../../../../../../store/server/contract"
import { DropdownMenuItem } from "../../../../../../../../components/ui/dropdown-menu"

interface TerminateContractDialogProps {
  contractId: number;
  contractName: string;
}

export function TerminateContractDialog({ contractId, contractName }: TerminateContractDialogProps) {
  const [open, setOpen] = useState(false)
  const { mutate: updateStatus, isPending } = useTerminateContract()

  const handleTerminate = () => {
    updateStatus(
      { 
        contractId: contractId.toString(), 
        isActive: false 
      },
      {
        onSuccess: () => {
          setOpen(false)
        }
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem className="text-red-600" onSelect={(e) => e.preventDefault()}>
          Terminate Contract
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            <DialogTitle>Terminate Contract</DialogTitle>
          </div>
          <DialogDescription className="space-y-3 pt-4">
            
              Are you sure you want to terminate the contract for <span className="font-medium">{contractName}</span>?
            
            <span className="text-red-600">
              This action cannot be undone. The contract will be marked as terminated and the room will become available.
            </span>
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button 
            variant="destructive"
            onClick={handleTerminate}
            disabled={isPending}
          >
            {isPending ? "Terminating..." : "Yes, terminate contract"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 