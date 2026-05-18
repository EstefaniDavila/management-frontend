import { useQuery } from '@tanstack/react-query'
import useCrud from '@/hooks/useCrud'

const useFetchTechnicians = (pagination, searchParams) => {
  const { getModel: getTechnicians } = useCrud('/api/v1/manager/technicians/list')

  const fetchTechnicians = async ({ queryKey }) => {
    const [_key, { pageIndex, pageSize, search, fields }] = queryKey
    const searchQuery = search ? `&search_params=${search}&search_fields=${fields}` : ''
    const response = await getTechnicians(`/api/v1/manager/technicians/list?page=${pageIndex + 1}&per_page=${pageSize}${searchQuery}`)
    return {
      rows: response.technicians,
    }
  }

  return useQuery({
    queryKey: ['technicians', { ...pagination, search: searchParams.search, fields: searchParams.fields }],
    queryFn: fetchTechnicians,
    keepPreviousData: true,
  })
}

export default useFetchTechnicians