import { useQuery } from '@tanstack/react-query'
import useCrud from '@/hooks/useCrud'

const useFetchWorkOrdersByTechnician = (pagination, searchParams, technicianId) => {
  const { getModel: getWorkOrders } = useCrud(`/api/v1/manager/work_orders/technician/${technicianId}`)

  const fetchWorkOrders = async ({ queryKey }) => {
    const [_key, { pageIndex, pageSize, search, fields }] = queryKey
    const searchQuery = search ? `&search_params=${search}&search_fields=${fields}` : ''
    const response = await getWorkOrders(`/api/v1/manager/work_orders/technician/${technicianId}?page=${pageIndex + 1}&per_page=${pageSize}${searchQuery}`)
    return {
      rows: response.work_orders,
      rowCount: response.total_work_orders,
    }
  }

  return useQuery({
    queryKey: ['work_orders', { ...pagination, search: searchParams.search, fields: searchParams.fields }],
    queryFn: fetchWorkOrders,
    keepPreviousData: true,
  })
}

export default useFetchWorkOrdersByTechnician