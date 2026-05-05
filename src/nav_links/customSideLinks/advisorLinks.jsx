import {
  FileTextIcon,
  UsersIcon,
  ClockIcon,
  LayoutDashboardIcon,
  SettingsIcon,
  MessageSquareIcon,
} from "lucide-react"

export const advisorLinks = [

  {
    title: "Solicitudes",
    href: "/area-requests",
    icon: MessageSquareIcon,
    area: "Marketing & Sales",
  },
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