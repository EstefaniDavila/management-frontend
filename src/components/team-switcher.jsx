"use client"

import * as React from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { ChevronsUpDownIcon, PlusIcon } from "lucide-react"
import { useAuth } from "@/providers/UserContext"

export function TeamSwitcher({
  teams
}) {
  const { isMobile } = useSidebar()
  const { user, setUser } = useAuth()

  // Match the active team based on current user role, or default to first
  const currentTeam = teams.find(t => t.roleable_type === user?.roleable_type) || teams[0]
  const [activeTeam, setActiveTeam] = React.useState(currentTeam)

  const handleSwitchRole = (team) => {
    setActiveTeam(team)
    if (user) {
      // Create a simulated user object with the new role and mock profile
      const updatedUser = { 
        ...user, 
        roleable_type: team.roleable_type, 
        roleable: null,
        full_name: team.mockName || user.full_name,
        name: team.mockName || user.name,
        email: team.mockEmail || user.email
      }
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
      // Redirect to root to trigger router refresh based on new role
      window.location.href = '/'
    }
  }

  if (!activeTeam) {
    return null
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <div
                className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                {activeTeam.logo}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{activeTeam.name}</span>
                <span className="truncate text-xs">{activeTeam.plan}</span>
              </div>
              <ChevronsUpDownIcon className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}>
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Teams
            </DropdownMenuLabel>
            {teams.map((team, index) => (
              <DropdownMenuItem key={team.name} onClick={() => handleSwitchRole(team)} className="gap-2 p-2">
                <div className="flex size-6 items-center justify-center rounded-md border">
                  {team.logo}
                </div>
                {team.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div
                className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <PlusIcon className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">Add team</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
