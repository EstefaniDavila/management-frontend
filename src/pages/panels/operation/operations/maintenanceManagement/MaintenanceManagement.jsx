import React, {useState} from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TbPlus } from 'react-icons/tb';
import TableMaintenanceManagement from '@/composables/operation/operations/maintenanceManagement/tables/GeneralMaintenanceManagement';
import ModalNewMaintenance from '@/composables/admin/operations/maintenance/modals/ModalNewMaintenance';
import useFetchMaintenances from '@/composables/operation/operations/maintenanceManagement/hooks/useFetchMaintenances';


const Maintenance = () => {
  const [typeModal, setTypeModal] = useState("")
  const [maintenance, setMaintenance] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  })
  const [search, setSearch] = useState("")
  const [searchFields, setSearchFields] = useState(["code,name"])

  const searchParams = {search, fields: searchFields.join(',') }
  const { data: maintenancesData, refetch: refetchMaintenances } = useFetchMaintenances(pagination, searchParams)
  const totalPages = Math.ceil((maintenancesData?.rowCount || 0 )/ pagination.pageSize) || 0
  console.log("Maintenances Data:", maintenancesData)

  const handleOpenModal = (type, data = null) => {
    setIsModalOpen(true)
    setTypeModal(type)
    setMaintenance(data)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setTypeModal('')
    setMaintenance(null)
  }

  return (
    <>
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-1'>
        <Card className='col-span-1 lg:col-span-1'>
          <CardHeader>
            <CardTitle>Procesar solicitudes de Mantenimiento</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => handleOpenModal("new")}
              className="bg-green-300 text-black hover:bg-green-600 justify-start"
            >
              <TbPlus /> Crear Mantenimiento
            </Button>
            <TableMaintenanceManagement
              handleOpenModal={handleOpenModal}
              fetchData={refetchMaintenances}
              data={maintenancesData?.rows || []}
              pagination={pagination}
              setCategory={setMaintenance}
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
          fetchData={refetchMaintenances}
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