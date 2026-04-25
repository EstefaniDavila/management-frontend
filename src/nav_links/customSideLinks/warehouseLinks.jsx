import { PackageIcon, TruckIcon, SettingsIcon, MessageSquareIcon } from "lucide-react"

export const warehouseLinks = [
  {
    title: "Solicitudes",
    href: "/area-requests",
    icon: MessageSquareIcon,
    area: "Logistics & Warehouse",
  },
  {
    title: "Inventory",
    href: "/inventory",
    icon: PackageIcon,
    area: "Logistics & Warehouse",
  },
  {
    title: "Suppliers",
    href: "/suppliers",
    icon: TruckIcon,
    area: "Logistics & Warehouse",
  },
  {
    title: "Settings",
    href: "/settings",
    icon: SettingsIcon,
    area: null,
  },
]