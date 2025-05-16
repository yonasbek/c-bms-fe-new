"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../../../../../../../components/ui/collapsible";
import { Badge } from "../../../../../../../../components/ui/badge";
import { AddContractDialog } from "./add-contract-dialog";
import { GetContractsForTenant } from "../../../../../../../../store/server/contract";
import { ContractWithDetails } from "../../../../../../../../types/contract";
import { format } from "date-fns";

interface ContractListProps {
  tenantId: number;
  roomId: number;
  roomSize: number;
}

export  function ContractList({ tenantId, roomId, roomSize }: ContractListProps) {
  const [open, setIsOpen] = useState(false);
  const { data: contracts, isLoading } =  GetContractsForTenant(tenantId);

  if (isLoading) {
    return <div>Loading contracts...</div>;
  }

  return (
    <div className="space-y-4">
      <Collapsible open={open} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50">
            <div className="flex items-center gap-2">
              {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              <h3 className="font-semibold">Contracts</h3>
              <Badge variant="outline">{contracts?.length || 0} Contracts</Badge>
            </div>
            <AddContractDialog 
              tenantId={tenantId} 
              roomId={roomId} 
              roomSize={roomSize}
              onSuccess={() => setIsOpen(true)}
            />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="p-4 pt-0 grid gap-2">
            {contracts?.map((contract: ContractWithDetails) => (
              <div key={contract.id} className="flex flex-col gap-2 p-4 rounded-md border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        contract.status === "active" 
                          ? "default" 
                          : contract.status === "expired" 
                            ? "secondary" 
                            : "destructive"
                      }
                    >
                      {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Room {contract.room.room_number}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium">Rate per m²</div>
                    <div>${contract.rate_per_sqm.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="font-medium">Monthly Rent</div>
                    <div>${contract.monthly_rent.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="font-medium">Start Date</div>
                    <div>{format(new Date(contract.start_date), "MMM d, yyyy")}</div>
                  </div>
                  <div>
                    <div className="font-medium">End Date</div>
                    <div>{format(new Date(contract.end_date), "MMM d, yyyy")}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
} 