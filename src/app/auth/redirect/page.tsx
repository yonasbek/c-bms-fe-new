"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

export default function RoleRedirectPage() {
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === "loading") return

    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    // Check user role and redirect accordingly
    if (session?.user?.role === "admin") {
      router.push("/")
    } else {
      router.push("/tenant/dashboard")
    }
  }, [router, session, status])

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="loading loading-spinner loading-lg"></div>
        <p className="mt-4 text-muted-foreground">Redirecting you to the right place...</p>
      </div>
    </div>
  )
} 