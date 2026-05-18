import { PackageIcon, TruckIcon, SettingsIcon, PackageCheck } from "lucide-react"

export const logisticCoordinatorLinks = [

  {
    title: "Pedido a Proveedores",
    href: "/suppliers",
    icon: PackageCheck,
    area: "Logistics & Warehouse",
  },
  //{
  //title: "Dispatch",
  //href: "/dispatch",
  //icon: PackageCheck,
  //area: "Logistics & Warehouse",
  //}, 
  {
    title: "Lista de Órdenes",
    href: "/orderSuppliers",
    icon: PackageIcon,
    area: "Logistics & Warehouse",
  },
  {
    title: "Settings",
    href: "/settings",
    icon: SettingsIcon,
    area: null,
  },

]