import { useQuery } from '@tanstack/react-query'
import useCrud from '@/hooks/useCrud'

const useFetchMaintenances = (pagination, searchParams) => {
  const { getModel: getMaintenances } = useCrud('/api/v1/manager/maintenances')

  const fetchMaintenances = async ({ queryKey }) => {
    const [_key, { pageIndex, pageSize, search, fields }] = queryKey
    const searchQuery = search ? `&search_params=${search}&search_fields=${fields}` : ''
    const response = await getMaintenances(`/api/v1/manager/maintenances?page=${pageIndex + 1}&per_page=${pageSize}${searchQuery}`)
    return {
      rows: response.maintenances,
      rowCount: response.total_maintenances,
    }
  }

  return useQuery({
    queryKey: ['maintenances', { ...pagination, search: searchParams.search, fields: searchParams.fields }],
    queryFn: fetchMaintenances,
    keepPreviousData: true,
  })
}

export default useFetchMaintenances