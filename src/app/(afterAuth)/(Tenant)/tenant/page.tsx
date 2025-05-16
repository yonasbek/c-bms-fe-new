"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Skeleton } from "../../../../components/ui/skeleton"

export default function TenantRedirectPage() {
  const router = useRouter()
  
  useEffect(() => {
    // Redirect to contract page
    router.push("/tenant/contract")
  }, [router])
  
  // Show loading state while redirecting
  return (
    <div className="container mx-auto py-6 space-y-6">
      <Skeleton className="h-8 w-1/4" />
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  )
} 