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
    { name: "Acme Inc", logo: <GalleryVerticalEndIcon />, plan: "Enterprise" },
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