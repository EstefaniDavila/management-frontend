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

const AREAS = [
  "General Management",
  "Marketing & Sales",
  "Logistics & Warehouse",
  "Production & Operations",
]

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    { name: "Acme Inc", logo: <GalleryVerticalEndIcon />, plan: "Enterprise" },
  ],
}

export function AppSidebar({ ...props }) {
  const sidelinks = getSidelinks()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        {AREAS.map((area) => {
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
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}