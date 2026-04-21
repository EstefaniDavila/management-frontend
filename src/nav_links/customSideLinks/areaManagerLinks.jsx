import { LayoutDashboardIcon, UsersIcon, FileTextIcon } from 'lucide-react'

export const areaManagerLinks = [
  { title: 'Dashboard Equipo',   href: '/manager',                  icon: LayoutDashboardIcon, area: null },
  { title: 'Gestión de Leads',   href: '/manager/team-leads',       icon: UsersIcon,           area: null },
  { title: 'Cotizaciones',       href: '/manager/team-quotations',  icon: FileTextIcon,        area: null },
]