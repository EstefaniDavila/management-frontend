import { PackageIcon, TruckIcon, SettingsIcon,PackageCheck } from "lucide-react"

export const warehouseLinks = [
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