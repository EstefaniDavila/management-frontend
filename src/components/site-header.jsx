import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import ThemeSwitch from "@/components/theme-switch"
import { Button } from "@/components/custom/button"
import { TbBell } from "react-icons/tb"
import { useNavigate } from "react-router-dom"
import React, { useState, useEffect } from 'react'
import BugReportModal from "@/components/bug-report-modal"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

export function SiteHeader() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    const fetchNotifications = () => {
      const stored = localStorage.getItem('area_requests_data')
      const userArea = localStorage.getItem('userArea') || 'General'
      const role = localStorage.getItem('role') || 'Admin'

      if (stored) {
        const reqs = JSON.parse(stored)
        // Filtrar notificaciones (ej. destinadas a mi área, o si soy Admin ver todas las recientes)
        const relevant = reqs.filter(r => role === 'Admin' || r.to === userArea)
        setNotifications(relevant.slice(0, 5)) // Mostrar últimas 5
      }
    }

    fetchNotifications()
    window.addEventListener('requests_updated', fetchNotifications)
    return () => window.removeEventListener('requests_updated', fetchNotifications)
  }, [])

  return (
    <header
      className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) justify-between pr-4">
      <div className="flex items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
      </div>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost" className="relative rounded-full">
              <TbBell size={20} />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] text-white font-bold">
                  {notifications.length}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[300px]">
            <DropdownMenuLabel>Notificaciones Recientes</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length > 0 ? (
              notifications.map((n, i) => (
                <DropdownMenuItem key={i} className="flex flex-col items-start gap-1 p-3 cursor-pointer" onClick={() => navigate('/area-requests')}>
                  <div className="flex w-full justify-between items-center">
                    <span className="font-semibold text-sm">{n.from}</span>
                    <Badge variant="outline" className="text-[10px]">{n.date}</Badge>
                  </div>
                  <span className="text-xs text-muted-foreground line-clamp-2">{n.type}: {n.detail}</span>
                </DropdownMenuItem>
              ))
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No hay notificaciones nuevas
              </div>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-primary font-medium cursor-pointer" onClick={() => navigate('/area-requests')}>
              Ver todas las solicitudes
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <BugReportModal onSuccess={() =>
          window.dispatchEvent(new Event('refetch-changes'))
        } />
        <ThemeSwitch />
      </div>
    </header>
  );
}
