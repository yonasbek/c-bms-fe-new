"use client"

import * as React from "react"
import { cn } from "../../lib/utils"

interface ShellProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  sidebar?: React.ReactNode
  header?: React.ReactNode
}

export function Shell({
  children,
  sidebar,
  header,
  className,
  ...props
}: ShellProps) {
  return (
    <div className={cn("grid h-screen grid-cols-1 md:grid-cols-[280px_1fr]", className)}>
      {sidebar && (
        <aside className="hidden border-r bg-background md:block">
          {sidebar}
        </aside>
      )}
      <div className="flex flex-col min-h-screen">
        {header}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  )
} 