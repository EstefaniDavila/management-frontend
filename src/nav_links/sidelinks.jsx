import { adminLinks } from "./customSideLinks/admin"
import { areaManagerLinks } from "./customSideLinks/areaManagerLinks"
import { advisorLinks } from "./customSideLinks/advisorLinks"
import { techLinks } from "./customSideLinks/techLinks"
import { warehouseLinks } from "./customSideLinks/warehouseLinks"
import { customerLinks } from "./customSideLinks/customer"
import { operationLinks } from "./customSideLinks/operationLinks"
import { logisticCoordinatorLinks } from "./customSideLinks/logisticsCoordinator"

const roleLinks = {
  Admin: adminLinks,
  // Manager:          areaManagerLinks,   // Jefe de área
  SalesAdvisor: advisorLinks,   // Asesor comercial
  Technician: techLinks,
  Warehouseman: warehouseLinks, // Almacenero
  Customer: customerLinks,
  LogisticsUser: logisticCoordinatorLinks,
  // Operation:        operationLinks,       // Jefe de Operaciones
}

const managerLinks = {
  operations: operationLinks,
  sales: areaManagerLinks
}

export const getSidelinks = () => {
  const user = JSON.parse(localStorage.getItem("user"))

  if (!user) return []

  if (user.roleable_type === "Manager") {
    return managerLinks[user.roleable.area]
  }

  return roleLinks[user.roleable_type] || []
}
export const sidelinks = getSidelinks()
export default sidelinks