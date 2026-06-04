// views/admin/change-management/ChangeManagementView.jsx
import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, RefreshCw } from 'lucide-react'
import ChangeTable from '@/components/admin/change-management/ChangeTable'
import { getChanges, deleteChange } from '@/services/admin/change-management/api'
import { useToast } from '@/hooks/use-toast'
import ChangeDetailModal from './ChangeDetailModal'
import ChangeReviewModal from './ChangeReviewModal'
import ChangeFormModal from './ChangeFormModal'
import ConfirmationDialog from '@/components/custom/confirmation-dialog'

const ChangeHistory = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10
    })
    const [totalPages, setTotalPages] = useState(0)
    const [search, setSearch] = useState('')
    const [searchFields, setSearchFields] = useState([])

    // Modals state
    const [selectedChange, setSelectedChange] = useState(null)
    const [detailModalOpen, setDetailModalOpen] = useState(false)
    const [reviewModalOpen, setReviewModalOpen] = useState(false)
    const [formModalOpen, setFormModalOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

    const { toast } = useToast()

    const fetchData = useCallback(async () => {
        setLoading(true)
        try {
            const response = await getChanges({
                page: pagination.pageIndex + 1,
                limit: pagination.pageSize,
                search: search || undefined,
                searchFields: searchFields.length > 0 ? searchFields : undefined
            })

            setData(response.data || [])
            setTotalPages(response.totalPages || 0)
        } catch (error) {
            console.error('Error fetching changes:', error)
            toast({
                title: 'Error',
                description: 'No se pudieron cargar los cambios',
                variant: 'destructive'
            })
        } finally {
            setLoading(false)
        }
    }, [pagination.pageIndex, pagination.pageSize, search, searchFields, toast])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const handleView = (change) => {
        setSelectedChange(change)
        setDetailModalOpen(true)
    }

    const handleReview = (change) => {
        setSelectedChange(change)
        setReviewModalOpen(true)
    }

    const handleDelete = (change) => {
        setSelectedChange(change)
        setDeleteDialogOpen(true)
    }

    const confirmDelete = async () => {
        try {
            await deleteChange(selectedChange.id)
            toast({
                title: 'Éxito',
                description: 'Cambio eliminado correctamente'
            })
            fetchData() // Refresh table
        } catch (error) {
            console.error('Error deleting change:', error)
            toast({
                title: 'Error',
                description: 'No se pudo eliminar el cambio',
                variant: 'destructive'
            })
        } finally {
            setDeleteDialogOpen(false)
            setSelectedChange(null)
        }
    }

    const handleCreateSuccess = () => {
        setFormModalOpen(false)
        fetchData()
        toast({
            title: 'Éxito',
            description: 'Cambio creado correctamente'
        })
    }

    const handleReviewSuccess = () => {
        setReviewModalOpen(false)
        fetchData()
        toast({
            title: 'Éxito',
            description: 'Revisión guardada correctamente'
        })
    }

    return (
        <div className="container mx-auto py-6 px-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl font-bold">Gestión de Cambios</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                            Administra y da seguimiento a los cambios del sistema
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={fetchData}
                            disabled={loading}
                        >
                            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                            Actualizar
                        </Button>
                        <Button onClick={() => setFormModalOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Nuevo Cambio
                        </Button>
                    </div>
                </CardHeader>

                <CardContent>
                    <ChangeTable
                        data={data}
                        fetchData={fetchData}
                        pagination={pagination}
                        setPagination={setPagination}
                        totalPages={totalPages}
                        search={search}
                        setSearch={setSearch}
                        searchFields={searchFields}
                        setSearchFields={setSearchFields}
                        onView={handleView}
                        onReview={handleReview}
                        onDelete={handleDelete}
                    />
                </CardContent>
            </Card>

            {/* Detail Modal */}
            <ChangeDetailModal
                open={detailModalOpen}
                onOpenChange={setDetailModalOpen}
                change={selectedChange}
            />

            {/* Review Modal */}
            <ChangeReviewModal
                open={reviewModalOpen}
                onOpenChange={setReviewModalOpen}
                change={selectedChange}
                onSuccess={handleReviewSuccess}
            />

            {/* Create/Edit Modal */}
            <ChangeFormModal
                open={formModalOpen}
                onOpenChange={setFormModalOpen}
                onSuccess={handleCreateSuccess}
                changeToEdit={null}
            />

            {/* Delete Confirmation */}
            <ConfirmationDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                title="Eliminar Cambio"
                description={`¿Estás seguro de que deseas eliminar el cambio "${selectedChange?.title}"? Esta acción no se puede deshacer.`}
                onConfirm={confirmDelete}
                confirmText="Eliminar"
                cancelText="Cancelar"
                variant="destructive"
            />
        </div>
    )
}

export default ChangeHistory