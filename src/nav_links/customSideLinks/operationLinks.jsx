import { WrenchIcon, SettingsIcon, CalendarDays, House, MessageSquareIcon } from "lucide-react"

export const operationLinks = [
  {
    title: "Home",
    href: "/",
    icon: House ,
    area: "Production & Operations",
  },
  {
    title: "Solicitudes",
    href: "/area-requests",
    icon: MessageSquareIcon,
    area: "Production & Operations",
  },
  {
    title: "Mantenimientos",
    href: "/maintenance-management",
    icon: CalendarDays,
    area: "Production & Operations",
  },
  {
    title: "Renta de Equipos",
    href: "/equipment-rental",
    icon: WrenchIcon,
    area: "Production & Operations",
  },
  // {
  //   title: "Ordenes de Trabajo",
  //   href: "/work-orders",
  //   icon: WrenchIcon,
  //   area: "Production & Operations",
  // },
  // {
  //   title: "Diagnosticos",
  //   href: "/diagnosis",
  //   icon: WrenchIcon,
  //   area: "Production & Operations",
  // },
  {
    title: "Settings",
    href: "/settings",
    icon: SettingsIcon,
    area: null,
  },
]