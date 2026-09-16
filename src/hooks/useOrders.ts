import { useQuery } from '@tanstack/react-query'
import { OrderInquiryItem, OrderLogItem, OrderStatus } from '@/types'
import { getOrdersListAction, getOrderByTrackingCodeAction } from '@/actions/order'

export function useOrdersList(statusFilter?: OrderStatus | 'all') {
  return useQuery<OrderInquiryItem[]>({
    queryKey: ['orders', 'list', statusFilter],
    queryFn: async () => {
      const res = await getOrdersListAction(statusFilter)
      if (!res.success || !res.data) {
        throw new Error(res.error || 'Gagal memuat daftar pesanan/inquiry.')
      }
      return res.data
    },
    staleTime: 1000 * 30, // 30 detik untuk dashboard operator
    refetchInterval: 1000 * 45, // Auto-refresh 45 detik
  })
}

export function useOrderTracking(trackingCode?: string) {
  return useQuery<{ order: OrderInquiryItem; logs: OrderLogItem[] } | null>({
    queryKey: ['order', 'tracking', trackingCode?.trim().toUpperCase()],
    queryFn: async () => {
      const clean = trackingCode?.trim().toUpperCase()
      if (!clean) return null

      const res = await getOrderByTrackingCodeAction(clean)
      if (!res.success || !res.data) {
        throw new Error(res.error || 'Nomor resi permohonan tidak ditemukan.')
      }
      return res.data
    },
    enabled: Boolean(trackingCode && trackingCode.trim().length >= 6),
    staleTime: 1000 * 30,
  })
}
