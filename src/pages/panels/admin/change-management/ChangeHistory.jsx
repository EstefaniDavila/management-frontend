import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, RefreshCw } from 'lucide-react'
import ChangeTable from '@/composables/admin/change-management/table/ChangeTable'
import useCrud from '@/hooks/useCrud'
import { useAuth } from '@/providers/UserContext'
import ReviewChangeModal from '@/composables/admin/change-management/modals/ReviewChangeModal'
import BugReportModal from '@/components/bug-report-modal'
import RenderProfiler from '@/components/RenderProfiler'

const ChangeHistory = () => {
    const { getModel, deleteModel, patchModel } = useCrud('/api/v1/admin/error_reports')
    const { user } = useAuth()

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
    const [reviewModalOpen, setReviewModalOpen] = useState(false)
    const [reviewLoading, setReviewLoading] = useState(false)

    const currentUserId = user?.id

    console.log('Current user ID:', currentUserId)

    const fetchData = useCallback(async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            params.append('page', pagination.pageIndex + 1)
            params.append('pageSize', pagination.pageSize)

            if (search) {
                params.append('search_params', search)
                params.append('search_fields', ['title', 'description'].join(','))
            }

            const response = await getModel(`?${params.toString()}`)
            console.log('Error reports API response:', response)

            const dataArray = response.error_reports || response.data || response || []
            const total = response.total_pages || response.totalPages || 1

            if (Array.isArray(dataArray)) {
                setData(dataArray)
                setTotalPages(total)
            } else if (response && Array.isArray(response)) {
                setData(response)
                setTotalPages(1)
            } else {
                setData([])
                setTotalPages(0)
            }
        } catch (error) {
            console.error('Error fetching changes:', error)
        } finally {
            setLoading(false)
        }
    }, [pagination.pageIndex, pagination.pageSize, search])


    useEffect(() => {
        const handler = () => fetchData()
        window.addEventListener('refetch-changes', handler)
        return () => window.removeEventListener('refetch-changes', handler)
    }, [fetchData])

    const handleView = (change) => {
        console.log('Ver detalle:', change)
    }

    const handleReview = (change) => {
        setSelectedChange(change)
        setReviewModalOpen(true)
    }

    const handleAccept = async (changeType, adminNotes) => {
        setReviewLoading(true)
        try {
            await patchModel(
                {
                    reviewed_by_id: currentUserId,
                    change_type: changeType,
                    admin_notes: adminNotes
                },
                `/api/v1/admin/error_reports/${selectedChange.id}/accept`
            )
            setReviewModalOpen(false)
            fetchData()
        } catch (error) {
            console.error('Error al aceptar:', error)
        } finally {
            setReviewLoading(false)
        }
    }

    const handleReject = async (adminNotes) => {
        setReviewLoading(true)
        try {
            await patchModel(
                {
                    reviewed_by_id: currentUserId,
                    admin_notes: adminNotes
                },
                `/api/v1/admin/error_reports/${selectedChange.id}/reject`
            )
            setReviewModalOpen(false)
            fetchData()
        } catch (error) {
            console.error('Error al rechazar:', error)
        } finally {
            setReviewLoading(false)
        }
    }

    const handleDelete = async (change) => {
        try {
            await deleteModel(`/api/v1/admin/error_reports/${change.id}`)
            fetchData()
        } catch (error) {
            console.error('Error al eliminar:', error)
        }
    }

    return (
        <RenderProfiler id="Admin-ChangeHistory-Dashboard">
            <div className="container mx-auto py-6 px-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl font-bold">Gestión de Cambios</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                Administra y da seguimiento a los cambios del sistema
                            </p>
                        </div>
                        {/*no por ahora
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={fetchData} disabled={loading}>
                                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                                Actualizar
                            </Button>
                            <Button onClick={() => console.log('Abrir modal crear')}>
                                <Plus className="h-4 w-4 mr-2" />
                                Nuevo Cambio
                            </Button>
                        </div>*/}
                    </CardHeader>

                    <CardContent>
                        <RenderProfiler id="Admin-ChangeHistory-TanStack-Table">
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
                        </RenderProfiler>
                    </CardContent>
                </Card>

                <RenderProfiler id="Admin-ReviewChange-Modal">
                    <ReviewChangeModal
                        open={reviewModalOpen}
                        setOpen={setReviewModalOpen}
                        change={selectedChange}
                        onAccept={handleAccept}
                        onReject={handleReject}
                        loading={reviewLoading}
                    />
                </RenderProfiler>
            </div>
        </RenderProfiler>
    )
}

export default ChangeHistory