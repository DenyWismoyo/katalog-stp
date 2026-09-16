import { useQuery } from '@tanstack/react-query'
import { KatalogFilterParams, KatalogItem } from '@/types'
import { getKatalogItemsAction, getKatalogItemBySlugAction } from '@/actions/katalog'

export function useKatalogItems(filters?: KatalogFilterParams) {
  return useQuery<KatalogItem[]>({
    queryKey: ['katalog', 'list', filters],
    queryFn: async () => {
      const res = await getKatalogItemsAction(filters)
      if (!res.success || !res.data) {
        throw new Error(res.error || 'Gagal memuat katalog produk inovasi.')
      }
      return res.data
    },
    staleTime: 1000 * 60 * 2, // 2 menit
  })
}

export function useKatalogDetail(slug?: string) {
  return useQuery<KatalogItem | null>({
    queryKey: ['katalog', 'detail', slug],
    queryFn: async () => {
      if (!slug) return null
      const res = await getKatalogItemBySlugAction(slug)
      if (!res.success || !res.data) {
        throw new Error(res.error || 'Produk katalog tidak ditemukan.')
      }
      return res.data
    },
    enabled: Boolean(slug),
    staleTime: 1000 * 60 * 5, // 5 menit
  })
}
