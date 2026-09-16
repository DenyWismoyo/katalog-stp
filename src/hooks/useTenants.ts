import { useQuery } from '@tanstack/react-query'
import { TenantItem, KatalogItem } from '@/types'
import { getTenantsAction, getTenantByIdAction, TenantFilterParams } from '@/actions/tenant'

export function useTenantList(filters?: TenantFilterParams) {
  return useQuery<TenantItem[]>({
    queryKey: ['tenants', 'list', filters],
    queryFn: async () => {
      const res = await getTenantsAction(filters)
      if (!res.success || !res.data) {
        throw new Error(res.error || 'Gagal memuat daftar tenant.')
      }
      return res.data
    },
    staleTime: 1000 * 60 * 5,
  })
}

export function useTenantDetail(id?: string) {
  return useQuery<{ tenant: TenantItem; products: KatalogItem[] } | null>({
    queryKey: ['tenants', 'detail', id],
    queryFn: async () => {
      if (!id) return null
      const res = await getTenantByIdAction(id)
      if (!res.success || !res.data) {
        throw new Error(res.error || 'Profil tenant tidak ditemukan.')
      }
      return res.data
    },
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
  })
}
