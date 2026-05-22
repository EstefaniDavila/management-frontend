"use client"

import * as React from "react"
import { NavSection } from "@/components/nav-section"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { GalleryVerticalEndIcon } from "lucide-react"
import { getSidelinks } from "../nav_links/sidelinks"



const data = {
  teams: [
    { name: "Administrador CAT", logo: <GalleryVerticalEndIcon />, plan: "Admin", roleable_type: "Admin", mockName: "Administrador Global", mockEmail: "admin@cat.com" },
    { name: "Jefe de Ventas", logo: <GalleryVerticalEndIcon />, plan: "Gerencia", roleable_type: "Manager", area: "comercial", mockName: "Roberto Gerente", mockEmail: "roberto.ventas@cat.com" },
    { name: "Jefe de Operaciones", logo: <GalleryVerticalEndIcon />, plan: "Gerencia", roleable_type: "Manager", area: "operaciones", mockName: "Elena Operaciones", mockEmail: "elena.ops@cat.com" },
    { name: "Asesor Comercial", logo: <GalleryVerticalEndIcon />, plan: "Advisor", roleable_type: "Advisor", mockName: "Luis Asesor", mockEmail: "luis.asesor@cat.com" },
    { name: "Técnico de Taller", logo: <GalleryVerticalEndIcon />, plan: "Technician", roleable_type: "Technician", mockName: "Carlos Técnico", mockEmail: "carlos.tecnico@cat.com" },
    { name: "Logística y Despacho", logo: <GalleryVerticalEndIcon />, plan: "Logistics", roleable_type: "Warehouseman", mockName: "Ana Logística", mockEmail: "ana.logistica@cat.com" },
  ],
}

export function AppSidebar({ ...props }) {
  const sidelinks = getSidelinks()

  const dynamicAreas = React.useMemo(() => {
    const areas = []
    sidelinks.forEach((link) => {
      if (link.area && !areas.includes(link.area)) {
        areas.push(link.area)
      }
    })
    return areas
  }, [sidelinks])

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        {dynamicAreas.map((area) => {
          const items = sidelinks.filter((l) => l.area === area)
          if (!items.length) return null
          return <NavSection key={area} label={area} items={items} />
        })}

        <NavSection
          label="General"
          items={sidelinks.filter((l) => !l.area)}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}