import { LayoutDashboardIcon, UsersIcon, FileTextIcon, MessageSquareIcon } from 'lucide-react'

export const areaManagerLinks = [
  { title: 'Solicitudes', href: '/area-requests', icon: MessageSquareIcon, area: "Solicitudes" },
  { title: 'Dashboard Equipo', href: '/manager', icon: LayoutDashboardIcon, area: "Dashboard" },
  { title: 'Gestión de Leads', href: '/manager/team-leads', icon: UsersIcon, area: "Leads" },
  { title: 'Cotizaciones', href: '/manager/team-quotations', icon: FileTextIcon, area: "Cotizaciones" },
]