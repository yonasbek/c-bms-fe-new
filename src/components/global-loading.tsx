import React from 'react'
import { Skeleton } from './ui/skeleton'

const GlobalLoading = ({title}:{title:string}) => {
  return (
    <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
        <div className="flex items-center justify-center h-64">
          <div className="space-y-4 w-full max-w-md">
            <h3 className="text-lg font-medium text-center">{`Loading your ${title}...`}</h3>
            <p className="text-sm text-muted-foreground text-center">{`Setting up your ${title} .`}</p>
            <div className="grid gap-4 md:grid-cols-2">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </div>
      </div>
  )
}

export default GlobalLoading