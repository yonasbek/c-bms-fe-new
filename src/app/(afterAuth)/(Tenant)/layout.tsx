'use client'
import React, { useEffect } from 'react'
import { TenantSidebar } from "../../../components/tenant-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../../components/ui/breadcrumb"
import { Separator } from "../../../components/ui/separator"
import { SidebarProvider, SidebarTrigger } from "../../../components/ui/sidebar"
import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { NotificationIcon } from "../../../components/notification-icon"
import { redirect } from "next/navigation"

const Layout = ({children}:{children:React.ReactNode}) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If not authenticated, redirect to login
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }
    
    // If authenticated as admin, redirect to admin dashboard
    if (status === 'authenticated' && session?.user?.role === 'admin') {
      router.push('/');
      return;
    }

    // If authenticated as tenant and on the root tenant path, redirect to contract page
    if (status === 'authenticated' && 
        session?.user?.role === 'tenant' && 
        (pathname === '/tenant' || pathname === '/tenant/')) {
      router.push('/tenant/contract');
    }
  }, [status, session, router, pathname]);

  // Show loading state while checking authentication
  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="mt-4 text-muted-foreground">
            {status === 'loading' ? 'Loading your session...' : 'Redirecting...'}
          </p>
        </div>
      </div>
    );
  }

  // Get the current page title for breadcrumb
  const getPageTitle = () => {
    if (pathname.includes('/contract')) return 'My Contract';
    if (pathname.includes('/maintenance')) return 'Maintenance';
    if (pathname.includes('/notifications')) return 'Notifications';
    return 'Tenant Portal';
  };

  if (!session) {
    redirect("/auth/login");
  }

  if (session.user?.role !== "tenant") {
    redirect("/");
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col">
        {/* Global Header */}
        <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-14 px-4 border-b bg-background">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/tenant/contract">
                    Tenant Portal
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{getPageTitle()}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <NotificationIcon />
        </header>

        {/* Main Layout */}
        <div className="pt-14 flex h-[calc(100vh-3.5rem)]">
          {/* Sidebar */}
          <aside className="hidden w-[280px] border-r bg-background md:block flex-shrink-0">
            <TenantSidebar />
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <div className="w-full h-full p-4">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

export default Layout 