'use client'
import React, { useEffect } from 'react'
import { AppSidebar } from "../../../components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../../components/ui/breadcrumb"
import { Separator } from "../../../components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../../../components/ui/sidebar"
import { signOut } from 'next-auth/react'
import { useGetBuildings } from '../../../store/server/buildings'
import { useModalStore } from '../../../store/modal'
import { AxiosError } from 'axios'

// Create a client outside the component to avoid recreating on each render

const Layout = ({children}:{children:React.ReactNode}) => {
  const { data: buildings,isSuccess, isLoading, error } = useGetBuildings();
  useEffect(() => {
    if(isSuccess){
    if(!buildings.length ){
      useModalStore.setState({
        modal: {
          name: 'create-building',
          isOpen: true,
          forceOpen: true
        }
      });
    }
  }
  },[buildings, isSuccess])
  
  
  if(isLoading){
    return <div>Loading...</div>
  }
  if(error){
    if(error instanceof AxiosError){
      if(error.status === 401){
        signOut();
      }
    }
  }
  
 
  

  return (
      
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="#">
                        Building Your Application
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
            <div className='p-4'>
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
   
  )
}

export default Layout