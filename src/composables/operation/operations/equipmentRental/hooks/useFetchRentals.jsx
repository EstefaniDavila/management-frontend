import { useQuery } from '@tanstack/react-query'
import useCrud from '@/hooks/useCrud'

const useFetchRentals = (pagination, searchParams) => {
  const { getModel: getRentals } = useCrud('/api/v1/manager/rentals')

  const fetchRentals = async ({ queryKey }) => {
    const [_key, { pageIndex, pageSize, search, fields }] = queryKey
    const searchQuery = search ? `&search_params=${search}&search_fields=${fields}` : ''
    const response = await getRentals(`/api/v1/manager/rentals?page=${pageIndex + 1}&per_page=${pageSize}${searchQuery}`)
    return {
      rows: response.rentals,
      rowCount: response.total_rentals,
    }
  }

  return useQuery({
    queryKey: ['rentals', { ...pagination, search: searchParams.search, fields: searchParams.fields }],
    queryFn: fetchRentals,
    keepPreviousData: true,
  })
}

export default useFetchRentals