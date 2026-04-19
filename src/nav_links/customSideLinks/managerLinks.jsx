import {
  BarChart3Icon, ShoppingCartIcon, UsersIcon,
  PackageIcon, TruckIcon, WrenchIcon, SettingsIcon
} from "lucide-react"

// El manager ve su área según su 'department'
export const getManagerLinks = (department) => {
  const dashboard = {
    title: "Area Dashboard",
    href: "/area-dashboard",
    icon: BarChart3Icon,
    area: "Management",
  }

  const byDept = {
    "marketing": [
      { title: "Sales Management",    href: "/sales-management",    icon: ShoppingCartIcon, area: "Marketing & Sales" },
      { title: "Customer Management", href: "/customer-management", icon: UsersIcon,        area: "Marketing & Sales" },
    ],
    "logistics": [
      { title: "Inventory",  href: "/inventory",  icon: PackageIcon, area: "Logistics & Warehouse" },
      { title: "Suppliers",  href: "/suppliers",  icon: TruckIcon,   area: "Logistics & Warehouse" },
    ],
    "operations": [
      { title: "Maintenance Management", href: "/maintenance", icon: WrenchIcon,   area: "Production & Operations" },
      { title: "Equipment Rental",       href: "/rentals",     icon: PackageIcon,  area: "Production & Operations" },
    ],
  }

  return [
    dashboard,
    ...(byDept[department] || []),
    { title: "Settings", href: "/settings", icon: SettingsIcon, area: null },
  ]
}

export const managerLinks = getManagerLinks(
  JSON.parse(localStorage.getItem("user"))?.department
)