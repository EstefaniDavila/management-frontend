import { LayoutDashboardIcon, UsersIcon, FileTextIcon, MessageSquareIcon } from 'lucide-react'

export const areaManagerLinks = [
  { title: 'Dashboard Equipo', href: '/manager', icon: LayoutDashboardIcon, area: "Dashboard" },
  { title: 'Gestión de Leads', href: '/manager/team-leads', icon: UsersIcon, area: "Marketing" },
  { title: 'Cotizaciones', href: '/manager/team-quotations', icon: FileTextIcon, area: "Marketing" },
  { title: 'Solicitudes', href: '/area-requests', icon: MessageSquareIcon, area: "Solicitudes" },

]