"use client";

import { useState } from "react";
import { Button } from "../../../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/ui/card";
import { useGetAllInventoryForBuilding } from "../../../../../store/server/inventory"; // Assuming you have a hook to fetch inventory
import GlobalLoading from "../../../../../components/global-loading";
import { AddItemDialog } from "./../../building/[id]/components/(building-tabs)/(inventory)/add-item"; // Import the AddItemDialog
import { AddInventoryDialog } from "./../../building/[id]/components/(building-tabs)/(inventory)/add-inventory"
import { useBuildingStore } from "../../../../../store/buildings"

export function InventoryList() {
  const {activeBuilding} = useBuildingStore();
  const { data: inventory, isLoading } = useGetAllInventoryForBuilding(activeBuilding?.id as string); // Fetch inventory using a custom hook

  if (isLoading) {
    return <GlobalLoading title="Loading Inventory" />;
  }

  if (inventory?.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <AddInventoryDialog trigger={<Button>Add Inventory</Button>} />
        <AddItemDialog trigger={<Button>Add New Item</Button>} />
        <div className="text-center text-muted-foreground">No inventory items found</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">Inventory Items</h2>
        <AddInventoryDialog trigger={<Button>Add Inventory</Button>} />
        <AddItemDialog trigger={<Button>Add New Item</Button>} />
      </div>

      <div className="grid gap-4">
        {inventory.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.item?.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Quantity: {item.quantity}</p>
              <p>Description: {item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
