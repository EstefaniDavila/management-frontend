import { useQuery } from '@tanstack/react-query'
import useCrud from '@/hooks/useCrud'

const useFetchSalesOrders = (pagination, searchParams) => {
  const { getModel: getSalesOrders } = useCrud('/api/v1/admin/sales_orders')

  const fetchSalesOrders = async ({ queryKey }) => {
    const [_key, { pageIndex, pageSize, search, fields }] = queryKey
    const searchQuery = search ? `&search_params=${search}&search_fields=${fields}` : ''
    const response = await getSalesOrders(`/api/v1/admin/sales_orders?page=${pageIndex + 1}&per_page=${pageSize}${searchQuery}`)
    return {
      rows: response.sales_orders,
      rowCount: response.total_sales_orders,
    }
  }

  return useQuery({
    queryKey: ['sales_orders', { ...pagination, search: searchParams.search, fields: searchParams.fields }],
    queryFn: fetchSalesOrders,
    keepPreviousData: true,
  })
}

export default useFetchSalesOrders