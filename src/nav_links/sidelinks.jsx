import { adminLinks }    from "./customSideLinks/admin"
import { areaManagerLinks } from "./customSideLinks/areaManagerLinks"
import { advisorLinks } from "./customSideLinks/advisorLinks"
import { techLinks } from "./customSideLinks/techLinks"
import { warehouseLinks } from "./customSideLinks/warehouseLinks"
import { customerLinks } from "./customSideLinks/customer"
import { operationLinks } from "./customSideLinks/operationLinks"
import { logisticCoordinatorLinks } from "./customSideLinks/logisticsCoordinator"

const roleLinks = {
  Admin:            adminLinks,
  Manager:          areaManagerLinks,   // Jefe de área
  SalesAdvisor:     advisorLinks,   // Asesor comercial
  Technician:       techLinks,
  WarehouseOp:      warehouseLinks, // Almacenero
  Customer:         customerLinks,
  Operation:        operationLinks,       // Jefe de Operaciones
  CoordinatorLogistic: logisticCoordinatorLinks,
}

export const getSidelinks = () => {
  const user = JSON.parse(localStorage.getItem("user"))
  return roleLinks[user?.role] || []
}
export const sidelinks = getSidelinks()
export default sidelinks