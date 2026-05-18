import { useQuery } from '@tanstack/react-query'
import useCrud from '@/hooks/useCrud'

const useFetchVehicles = (pagination, searchParams) => {
  const { getModel: getVehicles } = useCrud('/api/v1/admin/vehicles')

  const fetchVehicles = async ({ queryKey }) => {
    const [_key, { pageIndex, pageSize, search, fields }] = queryKey
    const searchQuery = search ? `&search_params=${search}&search_fields=${fields}` : ''
    const response = await getVehicles(`/api/v1/admin/vehicles?page=${pageIndex + 1}&per_page=${pageSize}${searchQuery}`)
    return {
      rows: response.data,
    }
  }

  return useQuery({
    queryKey: ['vehicles', { ...pagination, search: searchParams.search, fields: searchParams.fields }],
    queryFn: fetchVehicles,
    keepPreviousData: true,
  })
}

export default useFetchVehicles