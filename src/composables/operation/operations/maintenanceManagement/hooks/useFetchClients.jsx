import { useQuery } from '@tanstack/react-query'
import useCrud from '@/hooks/useCrud'

const useFetchClients = (pagination, searchParams) => {
  const { getModel: getClients } = useCrud('/api/v1/manager/clients')

  const fetchClients = async ({ queryKey }) => {
    const [_key, { pageIndex, pageSize, search, fields }] = queryKey
    const searchQuery = search ? `&search_params=${search}&search_fields=${fields}` : ''
    const response = await getClients(`/api/v1/manager/clients?page=${pageIndex + 1}&per_page=${pageSize}${searchQuery}`)
    return {
      rows: response.clients,
      rowCount: response.total_clients,
    }
  }

  return useQuery({
    queryKey: ['clients', { ...pagination, search: searchParams.search, fields: searchParams.fields }],
    queryFn: fetchClients,
    keepPreviousData: true,
  })
}

export default useFetchClients