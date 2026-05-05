import { PackageIcon, SettingsIcon, MessageSquareIcon, PackageCheck } from "lucide-react"

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
    title: "Orders Review",
    href: "/ordersReview",
    icon: PackageCheck,
    area: "Logistics & Warehouse",
  },
  {
    title: "Settings",
    href: "/settings",
    icon: SettingsIcon,
    area: null,
  },
]