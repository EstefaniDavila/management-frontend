import { useQuery } from '@tanstack/react-query'
import useCrud from '@/hooks/useCrud'

const useFetchAvailableVehicles = (pagination, searchParams) => {
  const { getModel: getVehicles } = useCrud('/api/v1/admin/vehicles?status=available')

  const fetchAvailableVehicles = async ({ queryKey }) => {
    const [_key, { pageIndex, pageSize, search, fields }] = queryKey
    const searchQuery = search ? `&search_params=${search}&search_fields=${fields}` : ''
    const response = await getVehicles(`/api/v1/admin/vehicles?status=available&page=${pageIndex + 1}&per_page=${pageSize}${searchQuery}`)
    return {
      rows: response.data,
    }
  }

  return useQuery({
    queryKey: ['available-vehicles', { ...pagination, search: searchParams.search, fields: searchParams.fields }],
    queryFn: fetchAvailableVehicles,
    keepPreviousData: true,
  })
}

export default useFetchAvailableVehicles