import React, {useState} from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TbPlus } from 'react-icons/tb';
import TableWorkOrders from '@/composables/technician/operations/work-order/tables/GeneralWorkOrder';

const fakeWorkOrders = {
  rows: [
    {
      id: 1,
      code: "WO-000001",
      assigned_to: "Juan Perez",
      customer: "Constructora Lima SAC",
      equipment: "Excavadora CAT 320",
      type: "Correctivo",
      status: "En proceso",
      date: "2026-04-15",
      scheduled_date: "2026-04-16"
    },
    {
      id: 2,
      code: "WO-000002",
      assigned_to: "Juan Perez",
      customer: "Minera Andina",
      equipment: "Cargador Frontal Komatsu WA380",
      type: "Correctivo",
      status: "Pendiente",
      date: "2026-04-16",
      scheduled_date: "2026-04-16"
    },
    {
      id: 3,
      code: "WO-000003",
      assigned_to: "Juan Perez",
      customer: "Obras del Sur",
      equipment: "Retroexcavadora JCB 3CX",
      type: "Preventivo",
      status: "Reprogramado",
      date: "2026-04-10",
      scheduled_date: "2026-04-20"
    },
    {
      id: 4,
      code: "WO-000004",
      assigned_to: "Juan Perez",
      customer: "Constructora Norte",
      equipment: "Volquete Volvo FMX",
      type: "Correctivo",
      status: "Completado",
      date: "2026-04-18",
      scheduled_date: "2026-04-19"
    },
    {
      id: 5,
      code: "WO-000005",
      assigned_to: "Juan Perez",
      customer: "Servicios Industriales SAC",
      equipment: "Grúa Liebherr LTM 1050",
      type: "Preventivo",
      status: "Completado",
      date: "2026-04-17",
      scheduled_date: "2026-04-21"
    },
    {
      id: 6,
      code: "WO-000006",
      assigned_to: "Juan Perez",
      customer: "Constructora Andina",
      equipment: "Bulldozer CAT D6",
      type: "Correctivo",
      status: "En proceso",
      date: "2026-04-14",
      scheduled_date: "2026-04-16"
    },
    {
      id: 7,
      code: "WO-000007",
      assigned_to: "Juan Perez",
      customer: "Minera Sur",
      equipment: "Perforadora Atlas Copco",
      type: "Correctivo",
      status: "Pendiente",
      date: "2026-04-13",
      scheduled_date: "2026-04-17"
    },
    {
      id: 8,
      code: "WO-000008",
      assigned_to: "Juan Perez",
      customer: "Obras Nacionales",
      equipment: "Rodillo Compactador Bomag",
      type: "Preventivo",
      status: "En proceso",
      date: "2026-04-12",
      scheduled_date: "2026-04-18"
    },
    {
      id: 9,
      code: "WO-000009",
      assigned_to: "Juan Perez",
      customer: "Ingeniería del Norte",
      equipment: "Camión Mixer Scania",
      type: "Correctivo",
      status: "Reprogramado",
      date: "2026-04-11",
      scheduled_date: "2026-04-19"
    },
    {
      id: 10,
      code: "WO-000010",
      assigned_to: "Juan Perez",
      customer: "Servicios Pesados SAC",
      equipment: "Grúa Torre Potain",
      type: "Preventivo",
      status: "Pendiente",
      date: "2026-04-10",
      scheduled_date: "2026-04-22"
    },
    {
      id: 11,
      code: "WO-000011",
      assigned_to: "Juan Perez",
      customer: "Constructora Central",
      equipment: "Excavadora Komatsu PC200",
      type: "Correctivo",
      status: "En proceso",
      date: "2026-04-09",
      scheduled_date: "2026-04-15"
    },
    {
      id: 12,
      code: "WO-000012",
      assigned_to: "Juan Perez",
      customer: "Minera Horizonte",
      equipment: "Cargador CAT 950",
      type: "Correctivo",
      status: "Completado",
      date: "2026-04-08",
      scheduled_date: "2026-04-14"
    },
    {
      id: 13,
      code: "WO-000013",
      assigned_to: "Juan Perez",
      customer: "Obras del Pacífico",
      equipment: "Retroexcavadora CASE 580",
      type: "Preventivo",
      status: "Pendiente",
      date: "2026-04-07",
      scheduled_date: "2026-04-23"
    },
    {
      id: 14,
      code: "WO-000014",
      assigned_to: "Juan Perez",
      customer: "Infraestructura Perú",
      equipment: "Volquete Mercedes Actros",
      type: "Correctivo",
      status: "En proceso",
      date: "2026-04-06",
      scheduled_date: "2026-04-16"
    },
    {
      id: 15,
      code: "WO-000015",
      assigned_to: "Juan Perez",
      customer: "Servicios Generales SAC",
      equipment: "Grúa Grove GMK",
      type: "Preventivo",
      status: "Reprogramado",
      date: "2026-04-05",
      scheduled_date: "2026-04-24"
    }
  ],
  rowCount: 15
}


const WorkOrder = () => {
  const [typeModal, setTypeModal] = useState("")
  const [workOrder, setWorkOrder] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  })
  const [search, setSearch] = useState("")
  const [searchFields, setSearchFields] = useState(["code,name"])

  const searchParams = {search, fields: searchFields.join(',') }
  // const { data: categoriesData, refetch: refetchCategories } = useFetchCategories(pagination, searchParams)
  const workOrdersData = fakeWorkOrders
  const refetchCategories = () => console.log("refetch fake")
  const totalPages = Math.ceil((workOrdersData?.rowCount || 0 )/ pagination.pageSize) || 0

  const handleOpenModal = (type, data = null) => {
    setIsModalOpen(true)
    setTypeModal(type)
    setWorkOrder(data)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setTypeModal('')
    setWorkOrder(null)
  }

  return (
    <>
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-1'>
        <Card className='col-span-1 lg:col-span-1'>
          <CardHeader>
            <CardTitle>Mis Ordenes de Trabajo</CardTitle>
          </CardHeader>
          <CardContent>
            <TableWorkOrders
              handleOpenModal={handleOpenModal}
              fetchData={refetchCategories}
              data={workOrdersData?.rows || []}
              pagination={pagination}
              setWorkOrder={setWorkOrder}
              setTypeModal={setTypeModal}
              totalPages={totalPages}
              search={search}
              setSearch={setSearch}
              searchFields={searchFields}
              setSearchFields={setSearchFields}
            />
          </CardContent>
        </Card>
      </div>
      {/* {typeModal === 'show' && (
        <ModalNewMaintenance
          isOpen={isModalOpen}
          handleClose={handleCloseModal}
          typeModal={typeModal}
          fetchData={refetchCategories}
        />
      )} */}
    </>
  )
}

export default WorkOrder