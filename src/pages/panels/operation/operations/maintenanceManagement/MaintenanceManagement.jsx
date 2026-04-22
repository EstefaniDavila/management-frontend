import React, {useState} from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TbPlus } from 'react-icons/tb';
import TableMaintenanceManagement from '@/composables/operation/operations/maintenanceManagement/tables/GeneralMaintenanceManagement';
import ModalNewMaintenance from '@/composables/admin/operations/maintenance/modals/ModalNewMaintenance';

import { custom } from 'zod';

const fakeMaintenances = {
  rows: [
    {
      id: 1,
      code: "MT-001",
      customer: "Constructora Lima SAC",
      equipment: "Excavadora CAT 320",
      maintenance_type: "Preventivo",
      technician: "Juan Pérez",
      status: "Pendiente",
      date: "2026-04-15",
      client: "Constructora Lima SAC"
    },
    {
      id: 2,
      code: "MT-002",
      customer: "Minera Andina",
      equipment: "Cargador Frontal Komatsu WA380",
      maintenance_type: "Correctivo",
      technician: "Carlos Ramírez",
      status: "En proceso",
      date: "2026-04-16",
      client: "Minera Andina"
    },
    {
      id: 3,
      code: "MT-003",
      customer: "Obras del Sur",
      equipment: "Retroexcavadora JCB 3CX",
      maintenance_type: "Preventivo",
      technician: "Luis Torres",
      status: "Completado",
      date: "2026-04-10",
      client: "Obras del Sur"
    },
    {
      id: 4,
      code: "MT-004",
      customer: "Constructora Norte",
      equipment: "Volquete Volvo FMX",
      maintenance_type: "Correctivo",
      technician: "Miguel Sánchez",
      status: "Pendiente",
      date: "2026-04-18",
      client: "Constructora Norte"
    },
    {
      id: 5,
      code: "MT-005",
      customer: "Servicios Industriales SAC",
      equipment: "Grúa Liebherr LTM 1050",
      maintenance_type: "Preventivo",
      technician: "Pedro Gómez",
      status: "En proceso",
      date: "2026-04-17",
      client: "Servicios Industriales SAC"
    }
  ],
  rowCount: 5
}


const Maintenance = () => {
  const [typeModal, setTypeModal] = useState("")
  const [category, setCategory] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  })
  const [search, setSearch] = useState("")
  const [searchFields, setSearchFields] = useState(["code,name"])

  const searchParams = {search, fields: searchFields.join(',') }
  // const { data: categoriesData, refetch: refetchCategories } = useFetchCategories(pagination, searchParams)
  const categoriesData = fakeMaintenances
  const refetchCategories = () => console.log("refetch fake")
  const totalPages = Math.ceil((categoriesData?.rowCount || 0 )/ pagination.pageSize) || 0

  const handleOpenModal = (type, data = null) => {
    setIsModalOpen(true)
    setTypeModal(type)
    setCategory(data)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setTypeModal('')
    setCategory(null)
  }

  return (
    <>
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-1'>
        <Card className='col-span-1 lg:col-span-1'>
          <CardHeader>
            <CardTitle>Procesar solicitudes de Mantenimiento</CardTitle>
          </CardHeader>
          <CardContent>
            <TableMaintenanceManagement
              handleOpenModal={handleOpenModal}
              fetchData={refetchCategories}
              data={categoriesData?.rows || []}
              pagination={pagination}
              setCategory={setCategory}
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
      {typeModal === 'new' && (
        <ModalNewMaintenance
          isOpen={isModalOpen}
          handleClose={handleCloseModal}
          typeModal={typeModal}
          fetchData={refetchCategories}
        />
      )}
      {/* {typeModal === 'edit' && (
        <ModalUpdateCategory
          isOpen={isModalOpen}
          handleClose={handleCloseModal}
          category={category}
          fetchData={refetchCategories}
        />
      )} */}
    </>
  )
}

export default Maintenance