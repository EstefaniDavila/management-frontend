import React, { useEffect, useState } from 'react'
import AreaRequestsTable from '@/composables/shared/AreaRequestsTable'

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
          case 'Manager': setCurrentArea('Jefatura'); break;
          case 'Warehouseman': setCurrentArea('Logística'); break;
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
      <AreaRequestsTable role={role} currentArea={currentArea} />
    </div>
  )
}
