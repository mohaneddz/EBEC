"use client"

import { AppSidebar } from "@/components/layout/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"

export default function Page({ children }: React.PropsWithChildren) {
  const pathname = usePathname()

  const segments = pathname?.split("/").filter(Boolean) || []
  const subpage = segments[segments.length - 1] || "Dashboard"

  const title = subpage.charAt(0).toUpperCase() + subpage.slice(1)

  return (
    <div className="screen max-h-screen max-w-screen overflow-hidden">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="bg-gradient-to-br from-primary-light to-primary-light p-4 flex items-center gap-4">
            <SidebarTrigger />
            <h1 className="text-2xl font-bold text-white">{title}</h1>
          </div>
          <main className="p-4 overflow-hidden full">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
