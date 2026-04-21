import {
  FileTextIcon,
  UsersIcon,
  ClockIcon,
  LayoutDashboardIcon,
  SettingsIcon,
} from "lucide-react"

export const advisorLinks = [

  {
    title: "Dashboard",
    href: "/advisor",
    icon: LayoutDashboardIcon,
    area: "Marketing & Sales",
  },

  {
    title: "Mis Leads",
    href: "/advisor/leads",
    icon: ClockIcon,
    area: "Marketing & Sales",
  },

  {
    title: "Mis Cotizaciones",
    href: "/advisor/quotations",
    icon: FileTextIcon,
    area: "Marketing & Sales",
  },

  {
    title: "Mis Clientes",
    href: "/advisor/clients",
    icon: UsersIcon,
    area: "Marketing & Sales",
  },

  {
    title: "Settings",
    href: "/settings",
    icon: SettingsIcon,
    area: null,
  },
]