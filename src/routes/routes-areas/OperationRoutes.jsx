import GeneralError from '../../pages/general/errors/general-error'
import PrivateRoute from '../../utils/PrivateRoutes'

const operationRoutes = [
  {
    path: "/",
    element: <PrivateRoute />,
    children: [
      {
        path: "/",
        lazy: async () => {
          const AppShell = await import('../../components/app-shell')
          return { Component: AppShell.default }
        },
        children: [
          {
            index: true,
            lazy: async () => ({
              Component: (await import('../../pages/panels/operation/OperationDashboard')).default,
            }),
          },
          {
            path: "work-orders",
            lazy: async () => ({
              Component: (await import('../../pages/panels/technician/operations/work-order/WorkOrder')).default,
            }),
          },
          {
            path: "maintenance-management",
            lazy: async () => ({
              Component: (await import('../../pages/panels/operation/operations/maintenanceManagement/MaintenanceManagement')).default,
            }),
          },
          {
            path: "maintenances/:id",
            lazy: async () => ({
              Component: (await import('../../pages/panels/operation/operations/maintenanceManagement/MaintenanceDetail')).default,
            }),
          },
          {
            path: "equipment-rental",
            lazy: async () => ({
              Component: (await import('../../pages/panels/operation/operations/equipmentRental/EquipmentRental')).default,
            }),
          },
          {
            path: "area-requests",
            lazy: async () => ({
              Component: (await import('../../pages/panels/shared/AreaRequestsPage')).default,
            }),
          },
          {
            path: "settings",
            lazy: async () => ({
              Component: (await import('../../pages/general/settings/index')).default,
            }),
          },
          {
            // Cualquier ruta no listada → unauthorized
            path: "*",
            lazy: async () => ({
              Component: (await import('../../pages/general/errors/not-found-error')).default,
            }),
          },
        ],
      },
    ],
  },
]

export default operationRoutes