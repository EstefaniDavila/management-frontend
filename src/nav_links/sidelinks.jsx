import { adminLinks }    from "./customSideLinks/admin"
import { managerLinks } from "./customSideLinks/managerLinks"
import { advisorLinks } from "./customSideLinks/advisorLinks"
import { techLinks } from "./customSideLinks/techLinks"
import { warehouseLinks } from "./customSideLinks/warehouseLinks"
import { customerLinks } from "./customSideLinks/customer"
import { operationLinks } from "./customSideLinks/operationLinks"

const roleLinks = {
  Admin:            adminLinks,
  Manager:          managerLinks,   // Jefe de área
  SalesAdvisor:     advisorLinks,   // Asesor comercial
  Technician:       techLinks,
  WarehouseOp:      warehouseLinks, // Almacenero
  Customer:         customerLinks,
  Operation:        operationLinks,       // Jefe de Operaciones
}

export const getSidelinks = () => {
  const user = JSON.parse(localStorage.getItem("user"))
  return roleLinks[user?.role] || []
}
export const sidelinks = getSidelinks()
export default sidelinks