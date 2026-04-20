import React from 'react'
import { useParams } from 'react-router-dom'

const WorkOrderDetail = () => {
  const { id } = useParams()

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Orden de Trabajo #{id}</h1>

      {/* Aquí luego metes tabs */}
      <div className="mt-4">
        <p>Aquí el técnico registra diagnóstico, mantenimiento y evidencias</p>
      </div>
    </div>
  )
}

export default WorkOrderDetail