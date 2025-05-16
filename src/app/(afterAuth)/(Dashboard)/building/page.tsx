"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { BuildingsTable } from "./buildings-table";
import { CreateBuildingButton } from "./create-building-button";
import { useBuildingStore } from "../../../../store/buildings";

export default function BuildingsPage() {
  const router = useRouter();
  const { activeBuilding } = useBuildingStore();

  useEffect(() => {
    if (activeBuilding) {
      router.push(`/building/${activeBuilding.id}`);
    }
  }, [activeBuilding, router]);

  if (!activeBuilding) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        No active building
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Buildings</h2>
          <CreateBuildingButton />
        </div>
        <BuildingsTable /> */}
    </div>
  );
}