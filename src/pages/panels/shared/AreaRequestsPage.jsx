import React, { useEffect, useState } from 'react'
import AreaRequestsTable from '@/composables/shared/AreaRequestsTable'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import AccessRequestsTable from '@/composables/shared/AccessRequestsTable'
import InformationRequestsTable from '@/composables/shared/InformationRequestsTable'

export default function AreaRequestsPage() {
  const [role, setRole] = useState('')
  const [currentArea, setCurrentArea] = useState('')

  useEffect(() => {
    // Simulando obtención del rol y área desde el usuario logueado en localStorage
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        setRole(user.roleable_type || '')
        
        // Asignación de áreas basada en roles típicos
        switch(user.roleable_type) {
          case 'Advisor': setCurrentArea('Comercial'); break;
          case 'Operation': setCurrentArea('Operaciones'); break;
          case 'Manager': setCurrentArea('Operaciones'); break; // Manager suele ser de Operaciones
          case 'Warehouseman': 
          case 'LogisticsUser': setCurrentArea('Logística'); break;
          case 'Technician': setCurrentArea('Técnico'); break;
          default: setCurrentArea('General'); break;
        }
      } catch (e) {
        console.error('Error parsing user data:', e)
      }
    } else {
      // Valores por defecto para visualización si no hay usuario logueado
      setRole('Admin')
      setCurrentArea('General')
    }
  }, [])

  return (
    <div className="flex flex-col gap-4 w-full">
      <Tabs defaultValue="service" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="service">Solicitudes de Servicio</TabsTrigger>
          {(role === 'Manager' || role === 'Admin') && (
            <TabsTrigger value="access">Solicitudes de Accesos</TabsTrigger>
          )}
          {(role === 'Advisor' || role === 'Admin') && (
            <TabsTrigger value="information">Mesa de Ayuda (Info)</TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="service">
          <AreaRequestsTable role={role} currentArea={currentArea} />
        </TabsContent>
        <TabsContent value="access">
          <AccessRequestsTable role={role} />
        </TabsContent>
        <TabsContent value="information">
          <InformationRequestsTable role={role} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
