import {
  WrenchIcon,
  PackageIcon,
  TruckIcon,
  ShoppingCartIcon,
  UsersIcon,
  BarChart3Icon,
  BuildingIcon,
  SettingsIcon,
  FileTextIcon,
  PackageCheck,
  ClockIcon,
  MessageSquareIcon,
  ShoppingBagIcon,
} from "lucide-react"

export const adminLinks = [

  // ── General Management ──
  {
    title: "General Dashboard",
    href: "/",
    icon: BarChart3Icon,
    area: "General Management",
  },
  {
    title: "Area Control",
    href: "/area-control",
    icon: BuildingIcon,
    area: "General Management",
  },
  {
    title: "Solicitudes",
    href: "/area-requests",
    icon: MessageSquareIcon,
    area: "General Management",
  },

  // ── Marketing & Sales ──
  {
    title: "Clientes",
    href: "/customers",
    icon: UsersIcon,
    area: "Marketing & Sales",
  },
  {
    title: "Historial de Clientes",
    href: "/customer-history",
    icon: ClockIcon,
    area: "Marketing & Sales",
  },
  {
    title: "Cotizaciones",
    href: "/quotations",
    icon: FileTextIcon,
    area: "Marketing & Sales",
  },
  {
    title: "Órdenes de Venta",
    href: "/sales-orders",
    icon: ShoppingCartIcon,
    area: "Marketing & Sales",
  },

  // ── Logistics & Warehouse ──
  {
    title: "Inventario",
    href: "/inventory",
    icon: PackageIcon,
    area: "Logistics & Warehouse",
  },
  {
    title: "Proveedores",
    href: "/suppliers",
    icon: TruckIcon,
    area: "Logistics & Warehouse",
  },

  {
    title: "Despacho",
    href: "/dispatch",
    icon: PackageCheck,
    area: "Logistics & Warehouse",
  },

  {
    title: "Pedido a Proveedores",
    href: "/ordersSuppliers",
    icon: ShoppingBagIcon,
    area: "Logistics & Warehouse",
  },


  // ── Production & Operations ──
  {
    title: "Mantenimiento",
    href: "/maintenance",
    icon: WrenchIcon,
    area: "Production & Operations",
  },
  {
    title: "Renta de Equipos",
    href: "/rentals",
    icon: PackageIcon,
    area: "Production & Operations",
  },

  // ── Settings ──
  {
    title: "Settings",
    href: "/settings",
    icon: SettingsIcon,
    area: null,
  },
]