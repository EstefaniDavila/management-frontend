import { adminLinks } from "./customSideLinks/admin"
import { areaManagerLinks } from "./customSideLinks/areaManagerLinks"
import { advisorLinks } from "./customSideLinks/advisorLinks"
import { techLinks } from "./customSideLinks/techLinks"
import { warehouseLinks } from "./customSideLinks/warehouseLinks"
import { customerLinks } from "./customSideLinks/customer"
import { operationLinks } from "./customSideLinks/operationLinks"
import { logisticCoordinatorLinks } from "./customSideLinks/logisticsCoordinator"

const roleLinks = {
  Admin:            adminLinks,
  Advisor:          advisorLinks,   // Asesor comercial
  Technician:       techLinks,
  Warehouseman:     warehouseLinks, // Almacenero
  Customer:         customerLinks,
  LogisticsUser:    logisticCoordinatorLinks, // Coordinador logistico
}

const managerLinks = {
  operations:   operationLinks,
  sales:        areaManagerLinks,
  comercial:    areaManagerLinks,
  Comercial:    areaManagerLinks,
  operaciones:  operationLinks,
  Operaciones:  operationLinks,
}

export const getSidelinks = () => {
  const user = JSON.parse(localStorage.getItem("user"))

  if (!user) return []

  if (user.roleable_type === "Manager") {
    const area = (user.roleable?.area || '').toLowerCase()
    return managerLinks[area] || areaManagerLinks
  }

  return roleLinks[user.roleable_type] || []
}
export const sidelinks = getSidelinks()
export default sidelinks