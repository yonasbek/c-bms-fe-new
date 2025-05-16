"use client"

import * as React from "react"
import { Building2, ClipboardList, Home, Users, Wrench, Box, Shield, Bell, UserCircle } from "lucide-react"

import { NavMain } from "../components/nav-main"
import { NavUser } from "../components/nav-user"
import { BuildingSwitcher} from "../components/building-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "../components/ui/sidebar"
import { useGetBuildings } from "../store/server/buildings"
import { useBuildingStore } from "../store/buildings"
import { useSession } from "next-auth/react"

// This is sample data.
const items = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    title: "Building",
    href: "/building",
    icon: Building2,
  },
  {
    title: "Tenants",
    href: "/tenants",
    icon: Users,
  },
  {
    title: "Contracts",
    href: "/contracts",
    icon: ClipboardList,
  },
  {
    title: "Maintenance",
    href: "/maintenance",
    icon: Wrench,
  },
  {
    title: "Inventory",
    href: "/inventory",
    icon: Box,
  },
  {
    title: "Sub-Contracts",
    href: "/sub-contracts",
    icon: Shield,
  },
  {
    title: "Notifications",
    href: "/notifications",
    icon: Bell,
  },
  {
    title: "Users",
    href: "/users",
    icon: UserCircle,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: BD, isLoading, error,  } = useGetBuildings();
  const {setBuildings,buildings} = useBuildingStore();
  const {data:user} = useSession();
  React.useEffect(() => {
    if (BD) {
      setBuildings(BD);
    }
  }, [BD, setBuildings]);
  if(error){
    return <div>Error fetching buildings</div>
  }
  if(isLoading){
    return <div>Loading...</div>
  }

 

  
return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <BuildingSwitcher buildings={buildings} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={items} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{ name: user?.user?.name || "", email: user?.user?.email || "", avatar: user?.user?.image || "" }} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
