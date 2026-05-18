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
    area: "Solicitudess",
  },

  {
    title: "Mis Leads",
    href: "/advisor/leads",
    icon: ClockIcon,
    area: "Marketing",
  },

  {
    title: "Mis Cotizaciones",
    href: "/advisor/quotations",
    icon: FileTextIcon,
    area: "Marketing",
  },

  // {
  //   title: "Mis Clientes",
  //   href: "/advisor/clients",
  //   icon: UsersIcon,
  //   area: "Marketing & Sales",
  // },

  {
    title: "Settings",
    href: "/settings",
    icon: SettingsIcon,
    area: "Configuración",
  },
]