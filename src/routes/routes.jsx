import React, { useContext } from 'react'
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import GeneralError from '../pages/general/errors/general-error'
import NotFoundError from '../pages/general/errors/not-found-error'
import MaintenanceError from '../pages/general/errors/maintenance-error'

import adminRoutes from './routes-areas/AdminRoutes'      // Administrador - ve todo el sistema
import customerRoutes from './routes-areas/CustomerRoutes'         // Cliente - solo sus mantenimientos
import advisorRoutes from './routes-areas/AdvisorRoutes'          // Asesor Comercial - ventas y clientes
import techRoutes from './routes-areas/TechRoutes'             // Técnico - mantenimientos y alquileres
import warehouseRoutes from './routes-areas/WarehouseRoutes'        // Almacenero - inventario y proveedores
// import managerRoutes   from './routes-areas/ManagerRoutes'          // Jefe de Área - su área + dashboard
import operationRoutes from './routes-areas/OperationRoutes'        // Operación - Jefe de area
import areaManagerRoutes from './routes-areas/areaManagerRoutes'          // Jefe de Área - su área + dashboard
import logisticCoordinatorRoutes from './routes-areas/LogisticsCoordinatorRoutes' //Coordinador logistico-Asigna conductor/vehiculo para los despachos

import Login from '../app/login/Log-in'
import ForgotPassword from '../app/login/ForgotPassword'
import ResetPassword from '../app/login/ResetPassword'
import { useAuth } from '../providers/UserContext'
const Routes = () => {
  const { user, authTokens } = useAuth('')
  console.log("User in Routes.jsx:", user)

  const roleRouter = {
    Admin: adminRoutes,       // Administrador - acceso total
    Customer: customerRoutes,    // Cliente externo - acceso limitado
    Advisor: advisorRoutes,     // Asesor Comercial - Marketing & Sales
    Technician: techRoutes,        // Técnico - Production & Operations
    Warehouseman: warehouseRoutes,   // Operador de Almacén - Logistics & Warehouse
    LogisticsUser: logisticCoordinatorRoutes, // Coordinador logístico
  }

  const managerRouter = {
    operations: operationRoutes,
    sales: areaManagerRoutes,
    comercial: areaManagerRoutes,
    Comercial: areaManagerRoutes,
    operaciones: operationRoutes,
    Operaciones: operationRoutes,
  }

  const routesForPublic = [
    { path: "/500", Component: GeneralError },
    { path: "/404", Component: NotFoundError },
    { path: "/503", Component: MaintenanceError },
    { path: "*", Component: NotFoundError },
  ]

  let routesForAuthenticatedOnly = []

  if (!user) {
    routesForAuthenticatedOnly = []
  } else if (user.roleable_type === "Manager") {
    const area = (user.roleable?.area || user.area || '').toLowerCase()
    console.log('[Routes] Manager area:', area, '| roleable:', user.roleable)
    routesForAuthenticatedOnly = managerRouter[area] || areaManagerRoutes
  } else {
    routesForAuthenticatedOnly = roleRouter[user.roleable_type] || []
  }

  const routesForNotAuthenticatedOnly = [
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPassword />,
    },
    {
      path: "/reset-password/:operation_code/:expires_at",
      element: <ResetPassword />,
    },
    {
      path: "/service",
      element: <div>Service Page</div>,
    },
    {
      path: "/about-us",
      element: <div>About Us</div>,
    },
    {
      path: "/sign-in",
      element: <Login />,
    },
  ]

  const router = createBrowserRouter([
    ...routesForPublic,
    ...(!authTokens ? routesForNotAuthenticatedOnly : []),
    ...routesForAuthenticatedOnly,
  ]
  )

  return <RouterProvider router={router} />
}
export default Routes