import { LayoutDashboardIcon, UsersIcon, FileTextIcon, MessageSquareIcon } from 'lucide-react'

export const areaManagerLinks = [
  { title: 'Solicitudes',        href: '/area-requests',            icon: MessageSquareIcon,   area: null },
  { title: 'Dashboard Equipo',   href: '/manager',                  icon: LayoutDashboardIcon, area: null },
  { title: 'Gestión de Leads',   href: '/manager/team-leads',       icon: UsersIcon,           area: null },
  { title: 'Cotizaciones',       href: '/manager/team-quotations',  icon: FileTextIcon,        area: null },
]