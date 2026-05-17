import { useQuery } from '@tanstack/react-query'
import useCrud from '@/hooks/useCrud'

const useFetchWorkOrderActionsByWorkOrder = (pagination, searchParams, workOrderId) => {
  const { getModel: getWorkOrderActions } = useCrud(`/api/v1/manager/work_order_actions/work_order/${workOrderId}`)

  const fetchWorkOrderActions = async ({ queryKey }) => {
    const [_key, { pageIndex, pageSize, search, fields }] = queryKey
    const searchQuery = search ? `&search_params=${search}&search_fields=${fields}` : ''
    const response = await getWorkOrderActions(`/api/v1/manager/work_order_actions/work_order/${workOrderId}?page=${pageIndex + 1}&per_page=${pageSize}${searchQuery}`)
    return {
      rows: response.work_order_actions,
      rowCount: response.total_work_order_actions,
    }
  }

  return useQuery({
    queryKey: ['work_order_actions', { ...pagination, search: searchParams.search, fields: searchParams.fields }],
    queryFn: fetchWorkOrderActions,
    keepPreviousData: true,
  })
}

export default useFetchWorkOrderActionsByWorkOrder