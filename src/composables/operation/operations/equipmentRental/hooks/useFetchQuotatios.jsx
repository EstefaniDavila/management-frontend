import { useQuery } from '@tanstack/react-query'
import useCrud from '@/hooks/useCrud'

const useFetchQuotations = (pagination, searchParams) => {
  const { getModel: getQuotations } = useCrud('/api/v1/manager/quotations')

  const fetchQuotations = async ({ queryKey }) => {
    const [_key, { pageIndex, pageSize, search, fields }] = queryKey
    const searchQuery = search ? `&search_params=${search}&search_fields=${fields}` : ''
    const response = await getQuotations(`/api/v1/manager/quotations?page=${pageIndex + 1}&per_page=${pageSize}${searchQuery}`)
    return {
      rows: response.quotations,
      rowCount: response.total_quotations,
    }
  }

  return useQuery({
    queryKey: ['quotations', { ...pagination, search: searchParams.search, fields: searchParams.fields }],
    queryFn: fetchQuotations,
    keepPreviousData: true,
  })
}

export default useFetchQuotations