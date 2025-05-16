"use client"

import {type LucideIcon } from "lucide-react"


import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,

} from "../components/ui/sidebar"
import Link from "next/link"
import { Button } from "./ui/button"
import { usePathname } from "next/navigation"

export function NavMain({
  items,
}: {
  items: {
    title: string
    href: string
    icon: LucideIcon
    isActive?: boolean
   
  }[]
}) {
  const pathname = usePathname();
  return (
    <SidebarGroup>
      <SidebarMenu>
        <SidebarMenuItem>
            <nav className="grid items-start gap-2">
      {items.map((item) => {
        const Icon = item.icon
        return (
          <Link key={item.href} href={item.href}>
            <Button variant={pathname.startsWith(item.href) ? "secondary" : "ghost"} className="w-full justify-start">
              <Icon className="mr-2 h-4 w-4" />
              {item.title}
            </Button>
          </Link>
        )
      })}
    </nav>
            </SidebarMenuItem>
            
      </SidebarMenu>
    </SidebarGroup>
  )
}
