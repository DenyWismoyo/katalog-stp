'use server'

import { adminDb } from '@/lib/firebase/admin'
import { SEED_KATALOG, SEED_TENANTS, SEED_FACILITIES } from '@/data/seedData'
import {
  KatalogItem,
  TenantItem,
  FacilityItem,
  OrderInquiryItem,
  ServerActionResult,
} from '@/types'

export interface DashboardMetrics {
  katalog: {
    total: number
    published: number
    draft: number
    featured: number
    trlDistribution: {
      research: number // TRL 1-3
      prototype: number // TRL 4-6
      marketReady: number // TRL 7-9
    }
  }
  tenant: {
    total: number
    inkubasi: number
    alumni: number
    mitraIndustri: number
    praInkubasi: number
  }
  facility: {
    total: number
    available: number
    maintenance: number
    booked: number
  }
  orders: {
    total: number
    pending: number
    activeFollowUp: number // reviewed + contacted + survey
    deal: number // deal + completed
    urgent: number
  }
  recentInquiries: OrderInquiryItem[]
}

/**
 * Mengambil ringkasan metrik analitik eksekutif untuk Dashboard Admin STP
 */
export async function getDashboardMetricsAction(): Promise<ServerActionResult<DashboardMetrics>> {
  try {
    // 1. Ambil Katalog
    let katalogItems: KatalogItem[] = []
    const katalogSnap = await adminDb.collection('katalog_items').get()
    if (!katalogSnap.empty) {
      katalogItems = katalogSnap.docs.map((d) => ({ id: d.id, ...d.data() } as KatalogItem))
    } else {
      katalogItems = [...SEED_KATALOG]
    }

    // 2. Ambil Tenant
    let tenantItems: TenantItem[] = []
    const tenantSnap = await adminDb.collection('tenant').get()
    if (!tenantSnap.empty) {
      tenantItems = tenantSnap.docs.map((d) => ({ id: d.id, ...d.data() } as TenantItem))
    } else {
      tenantItems = [...SEED_TENANTS]
    }

    // 3. Ambil Fasilitas
    let facilityItems: FacilityItem[] = []
    const facilitySnap = await adminDb.collection('facilities').get()
    if (!facilitySnap.empty) {
      facilityItems = facilitySnap.docs.map((d) => ({ id: d.id, ...d.data() } as FacilityItem))
    } else {
      facilityItems = [...SEED_FACILITIES]
    }

    // 4. Ambil Permohonan / Orders
    let orderItems: OrderInquiryItem[] = []
    const orderSnap = await adminDb.collection('orders_inquiries').get()
    if (!orderSnap.empty) {
      orderItems = orderSnap.docs.map((d) => ({ id: d.id, ...d.data() } as OrderInquiryItem))
    }

    // Kalkulasi Metrik Katalog
    const katalogPublished = katalogItems.filter((k) => k.status === 'published').length
    const katalogDraft = katalogItems.filter((k) => k.status !== 'published').length
    const katalogFeatured = katalogItems.filter((k) => k.isFeatured).length

    const trlResearch = katalogItems.filter((k) => k.trl >= 1 && k.trl <= 3).length
    const trlPrototype = katalogItems.filter((k) => k.trl >= 4 && k.trl <= 6).length
    const trlMarketReady = katalogItems.filter((k) => k.trl >= 7 && k.trl <= 9).length

    // Kalkulasi Metrik Tenant
    const tenantInkubasi = tenantItems.filter((t) => t.incubationStatus === 'inkubasi').length
    const tenantAlumni = tenantItems.filter((t) => t.incubationStatus === 'alumni').length
    const tenantMitra = tenantItems.filter((t) => t.incubationStatus === 'mitra-industri').length
    const tenantPra = tenantItems.filter((t) => t.incubationStatus === 'pra-inkubasi').length

    // Kalkulasi Metrik Fasilitas
    const facAvailable = facilityItems.filter((f) => f.status === 'available').length
    const facMaintenance = facilityItems.filter((f) => f.status === 'maintenance').length
    const facBooked = facilityItems.filter((f) => f.status === 'booked').length

    // Kalkulasi Metrik Orders
    const ordPending = orderItems.filter((o) => o.status === 'pending').length
    const ordActive = orderItems.filter((o) =>
      ['reviewed', 'contacted', 'survey'].includes(o.status)
    ).length
    const ordDeal = orderItems.filter((o) => ['deal', 'completed'].includes(o.status)).length
    const ordUrgent = orderItems.filter((o) => o.priority === 'urgent').length

    // Ambil 5 Permohonan terbaru
    const sortedOrders = [...orderItems].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    const recentInquiries = sortedOrders.slice(0, 5)

    return {
      success: true,
      data: {
        katalog: {
          total: katalogItems.length,
          published: katalogPublished,
          draft: katalogDraft,
          featured: katalogFeatured,
          trlDistribution: {
            research: trlResearch,
            prototype: trlPrototype,
            marketReady: trlMarketReady,
          },
        },
        tenant: {
          total: tenantItems.length,
          inkubasi: tenantInkubasi,
          alumni: tenantAlumni,
          mitraIndustri: tenantMitra,
          praInkubasi: tenantPra,
        },
        facility: {
          total: facilityItems.length,
          available: facAvailable,
          maintenance: facMaintenance,
          booked: facBooked,
        },
        orders: {
          total: orderItems.length,
          pending: ordPending,
          activeFollowUp: ordActive,
          deal: ordDeal,
          urgent: ordUrgent,
        },
        recentInquiries,
      },
    }
  } catch (error) {
    console.error('[getDashboardMetricsAction Error]:', error)
    return {
      success: false,
      error: 'Gagal mengompilasi metrik analitik dashboard.',
    }
  }
}
