"use client"

import { Building2, ClipboardList, Wrench } from "lucide-react"
import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "./ui/sidebar"
import { useSession } from "next-auth/react"

const items = [
  {
    title: "Contract",
    href: "/tenant/contract",
    icon: ClipboardList,
  },
  {
    title: "Maintenance",
    href: "/tenant/maintenance",
    icon: Wrench,
  },
]

export function TenantSidebar() {
  const { data: session } = useSession();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <Building2 className="h-6 w-6" />
          <span className="font-semibold">Building+</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={items} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{ 
          name: session?.user?.name || "", 
          email: session?.user?.email || "", 
          avatar: session?.user?.image || "" 
        }} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
} 