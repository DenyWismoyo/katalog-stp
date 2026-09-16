import { useQuery } from '@tanstack/react-query'
import { FacilityItem } from '@/types'
import { getFacilitiesAction, getFacilityBySlugAction, FacilityFilterParams } from '@/actions/facility'

export function useFacilityList(filters?: FacilityFilterParams) {
  return useQuery<FacilityItem[]>({
    queryKey: ['facilities', 'list', filters],
    queryFn: async () => {
      const res = await getFacilitiesAction(filters)
      if (!res.success || !res.data) {
        throw new Error(res.error || 'Gagal memuat fasilitas laboratorium.')
      }
      return res.data
    },
    staleTime: 1000 * 60 * 5, // 5 menit
  })
}

export function useFacilityDetail(slug?: string) {
  return useQuery<FacilityItem | null>({
    queryKey: ['facilities', 'detail', slug],
    queryFn: async () => {
      if (!slug) return null
      const res = await getFacilityBySlugAction(slug)
      if (!res.success || !res.data) {
        throw new Error(res.error || 'Fasilitas tidak ditemukan.')
      }
      return res.data
    },
    enabled: Boolean(slug),
    staleTime: 1000 * 60 * 5,
  })
}
