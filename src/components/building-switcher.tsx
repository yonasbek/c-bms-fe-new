"use client"

import * as React from "react"
import { Building2, ChevronsUpDown, Plus } from "lucide-react"
import type { Building as BuildingType } from "../types/building"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../components/ui/sidebar"
import { useBuildingStore } from "../store/buildings"
import { useModalStore } from "../store/modal"

interface BuildingSwitcherProps {
  buildings: BuildingType[];
}

export function BuildingSwitcher({ buildings }: BuildingSwitcherProps) {
  const router = useRouter();
  const { isMobile } = useSidebar();
  const { activeBuilding, setActiveBuilding } = useBuildingStore();
  const { setModal } = useModalStore();

  // Move the initialization logic to useEffect
  useEffect(() => {
    if (!activeBuilding && buildings.length > 0) {
      handleBuildingSwitch(buildings[0]?.id as string);
    }
  }, [activeBuilding, buildings]);

  const handleBuildingSwitch = (buildingId: string) => {
    setActiveBuilding(buildingId);
    router.push(`/building/${buildingId}`);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {activeBuilding && (
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Building2 className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeBuilding.name}
                </span>
                <span className="truncate text-xs">{activeBuilding.address}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Buildings
            </DropdownMenuLabel>
            {buildings.map((building, index) => (
              <DropdownMenuItem
                key={building.name + index}
                onClick={() => handleBuildingSwitch(building?.id as string)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <Building2 className="size-4 shrink-0" />
                </div>
                {building.name}

              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            {/* <DropdownMenuItem className="gap-2 p-2 cursor-pointer" onClick={()=>setModal({name:'create-building',isOpen:true})}>
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4"  />
              </div>
              <div className="font-medium text-muted-foreground">Add Building</div>
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
