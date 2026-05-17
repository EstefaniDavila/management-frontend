import { useQuery } from '@tanstack/react-query'
import useCrud from '@/hooks/useCrud'

const useFetchWorkOrdersDates = (pagination, searchParams, technicianId) => {
  const { getModel: getWorkOrderActions } = useCrud(`/api/v1/manager/work_order_actions/technician/${technicianId}`)

  const fetchWorkOrderActions = async ({ queryKey }) => {
    const [_key, { pageIndex, pageSize, search, fields }] = queryKey
    const searchQuery = search ? `&search_params=${search}&search_fields=${fields}` : ''
    const response = await getWorkOrderActions(`/api/v1/manager/work_orders/calendar/${technicianId}?page=${pageIndex + 1}&per_page=${pageSize}${searchQuery}`)
    return {
      rows: response,
    }
  }

  return useQuery({
    queryKey: ['work_order_actions', { ...pagination, search: searchParams.search, fields: searchParams.fields }],
    queryFn: fetchWorkOrderActions,
    keepPreviousData: true,
  })
}

export default useFetchWorkOrdersDates